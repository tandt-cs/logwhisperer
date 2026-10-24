import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'),
    timestamp: new Date().toISOString()
  });
});

// JSON Schema definition for strict Gemini structured output
const logAnalysisSchema = {
  type: SchemaType.OBJECT,
  properties: {
    translation: {
      type: SchemaType.STRING,
      description: "Plain-English summary of what this error actually means, without technical jargon or conversational filler.",
      nullable: false,
    },
    rootCause: {
      type: SchemaType.STRING,
      description: "Specific explanation of what typically causes this error in the code or environment.",
      nullable: false,
    },
    fix: {
      type: SchemaType.OBJECT,
      properties: {
        summary: {
          type: SchemaType.STRING,
          description: "1-2 concrete, actionable steps to resolve the issue.",
          nullable: false,
        },
        codeSnippet: {
          type: SchemaType.STRING,
          description: "Clear code snippet demonstrating the fix or command to run.",
          nullable: false,
        }
      },
      required: ["summary", "codeSnippet"],
      nullable: false,
    }
  },
  required: ["translation", "rootCause", "fix"]
};

// Main analysis route
app.post('/api/analyze', async (req, res) => {
  const { log } = req.body;

  if (!log || typeof log !== 'string' || log.trim().length < 10) {
    return res.status(400).json({
      error: "Please provide a valid error log or stack trace (at least 10 characters)."
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    if (process.env.MOCK_GEMINI === 'true' || req.query.mock === 'true') {
      return res.json({
        success: true,
        data: {
          translation: "Your application failed to connect to a local service because the connection was actively refused at 127.0.0.1:27017.",
          rootCause: "The target database daemon or service is not running or listening on port 27017.",
          fix: {
            summary: "Verify that the service is running locally or check your connection string host and port.",
            codeSnippet: "# Start MongoDB service (Linux/systemd)\nsudo systemctl start mongod\n\n# Or start via Docker\ndocker run -d -p 27017:27017 --name mongo mongo:latest"
          }
        }
      });
    }
    return res.status(500).json({
      error: "Invalid or missing Gemini API key. Please add your GEMINI_API_KEY to .env."
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: logAnalysisSchema,
        temperature: 0.2,
      },
      systemInstruction: "You are LogWhisperer, an expert developer debugging utility. Analyze the provided error log or stack trace and return a strictly structured diagnosis. Do not include conversational greetings, chit-chat, or pleasantries. Be precise, concise, and developer-oriented."
    });

    const prompt = `Analyze this raw error log or stack trace:\n\n${log}`;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsedData = JSON.parse(responseText);

    return res.json({
      success: true,
      data: parsedData
    });
  } catch (err) {
    console.error("Gemini API Error:", err);
    return res.status(500).json({
      error: err.message || "Failed to analyze error log. Please verify your API key and network connection."
    });
  }
});

app.listen(PORT, () => {
  console.log(`[LogWhisperer Server] Running on http://localhost:${PORT}`);
});
