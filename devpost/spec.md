---
doc: spec
status: approved
---

# LogWhisperer — Technical Spec

## How This Works, In Plain Language
LogWhisperer is a single-page web app built with a React frontend and a lightweight local Node.js backend.
- The **frontend** renders a sleek, split-pane dark IDE interface styled with Tailwind CSS. It gives the developer a monospaced input area to paste raw terminal error logs (or load an instant sample log), buttons to analyze or clear, and an output pane that displays terminal loading states and three cleanly structured diagnosis cards.
- The **backend** is a minimal Express server with a single endpoint (`POST /api/analyze`). It holds the Google Gemini API key securely in a local `.env` file so the key is never exposed to the browser.
- When the developer clicks "Analyze", the frontend sends the raw log to the backend. The backend prompts Gemini (`gemini-2.5-flash`) using a strict **JSON Schema**. This forces the model to respond *only* in structured JSON containing `translation`, `rootCause`, and `fix`, completely eliminating conversational chit-chat. The frontend then unpacks this JSON and displays it directly into the three terminal cards, complete with a one-click copy button for code snippets.

## The Core Journey Through the System
1. **User loads the app:** Browser requests `http://localhost:5173`. React mounts `App.jsx`, which initializes state (`status: 'empty'`, `rawLog: ''`). `OutputPane.jsx` displays the green blinking terminal prompt `> Waiting for raw log input..._`.
   - *PRD ref:* `prd.md > The Core Journey` (Step 1), `prd.md > States and Boundaries`.
2. **User enters or loads an error:** User clicks "Load Sample Error" (fetching a pre-configured multi-line stack trace from `sampleLogs.js`) or types into `InputPane.jsx`.
   - *PRD ref:* `prd.md > The Core Journey` (Step 2), `prd.md > 1. Raw Log Input & Sample Pre-loader`.
3. **User clicks Analyze:** `InputPane` checks input length. If under 10 chars, it sets an inline warning state (`[WARN] Please provide a valid error log...`). If valid, `App.jsx` sets state to `'analyzing'` and sends a `POST` request to `http://localhost:3000/api/analyze` with `{ log: rawLog }`.
   - *PRD ref:* `prd.md > 2. Input Validation`, `prd.md > 3. AI Analysis & Loading Feedback`.
4. **Backend processes with Gemini:** `server.js` calls Gemini API (`gemini-2.5-flash`) with structured schema configuration (`responseMimeType: "application/json"`, schema with `translation`, `rootCause`, and `fix`).
   - *PRD ref:* `prd.md > 3. AI Analysis & Loading Feedback`.
5. **Displaying the Diagnosis:** Server returns the JSON object. Frontend receives it, transitions state to `'success'`, and passes the structured data to `OutputPane.jsx`, which renders the three distinct cards.
   - *PRD ref:* `prd.md > 4. Three-Tier Diagnosis Rendering`.
6. **Copying the Fix:** User clicks the "Copy" button in The Fix card. The code snippet is written to `navigator.clipboard`, and the button label toggles to `✓ Copied!` for 2 seconds.
   - *PRD ref:* `prd.md > The Core Journey` (Step 6), `prd.md > 4. Three-Tier Diagnosis Rendering`.

## Stack
- **Frontend Framework:** React 19 + Vite 6
  - *Rationale:* Instant hot-module replacement, zero boilerplate, and fast builds.
  - *Documentation:* [Vite Docs](https://vitejs.dev/), [React Docs](https://react.dev/)
- **Styling:** Tailwind CSS 3
  - *Rationale:* Utility classes provide rapid, consistent dark terminal styling, borders, and monospaced layout without custom CSS files.
  - *Documentation:* [Tailwind CSS Docs](https://tailwindcss.com/)
- **Icons & Visuals:** `lucide-react`
  - *Rationale:* Clean, lightweight SVGs for terminal buttons, clipboard copy icons, and status badges.
  - *Documentation:* [Lucide React Docs](https://lucide.dev/)
- **Backend / API Proxy:** Node.js (v22+) + Express (v4.21+) + `cors` + `dotenv`
  - *Rationale:* Minimalist 30-line server to guard the API key in `.env` and serve the structured AI endpoint.
  - *Documentation:* [Express Docs](https://expressjs.com/)
- **AI SDK:** `@google/genai` (Official Google Gen AI SDK)
  - *Rationale:* Official SDK for Google Gemini models, supporting `gemini-2.5-flash` with strict JSON schema outputs.
  - *Documentation:* [Google Gen AI SDK Docs](https://github.com/googleapis/nodejs-genai)

## Where It Runs and How Someone Tries It
- **Runtime:** Node.js v22+ on local development machine.
- **Environment Requirements:**
  - `GEMINI_API_KEY` set in `.env` in the project root.
- **Start Commands:**
  - Terminal 1 (Backend): `node server.js` (runs on `http://localhost:3000`)
  - Terminal 2 (Frontend): `npm run dev` (runs on `http://localhost:5173`)
  - *(Or combined via a root `npm run dev` script with `concurrently`)*
- **Demo Recording Target:**
  - Open `http://localhost:5173` in a browser window.
  - Click "Load Sample Error" $\rightarrow$ Click "Analyze" $\rightarrow$ Observe loading animation $\rightarrow$ Inspect the 3 cards $\rightarrow$ Click "Copy" on The Fix.

## Look and Feel
- **Base Background:** Deep terminal slate `#0d1117` with secondary container background `#161b22`.
- **Borders & Dividers:** High-contrast subtle borders `#30363d`.
- **Typography:** Monospaced font family (`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`).
- **Color Accents:**
  - Success / Waiting: Terminal Green `#3fb950` / `#22c55e`
  - Information / Root Cause: Terminal Cyan `#58a6ff`
  - Warning: Amber `#d29922`
  - Error: Terminal Red `#f85149`
- **Tone:** Concise, transactional, developer-grade CLI aesthetic with mock terminal window controls (`● ● ●`).

## Components

### `App.jsx`
- Main state manager and layout orchestrator. Holds `rawLog`, `analysisResult`, `appStatus` (`'empty' | 'analyzing' | 'success' | 'warning' | 'error'`), and `errorMessage`.
- Handles communication with the backend API (`/api/analyze`).
- *PRD ref:* `prd.md > Screens and Layout`, `prd.md > States and Boundaries`.

### `Header.jsx`
- Displays the application branding ("LogWhisperer"), the tagline ("Terminal Log Decryptor"), and a live status indicator pill (`● SYSTEM ONLINE`).
- *PRD ref:* `prd.md > Screens and Layout` (Left Pane Header).

### `InputPane.jsx`
- Contains:
  - Header bar with "Raw Log Input" label and the `"Load Sample Error"` action button.
  - Code/log `<textarea>` styled as a terminal input with custom scrollbars.
  - Inline validation warning banner (`[WARN] Please provide a valid error log...`).
  - Action footer containing the primary `"Analyze"` button (with loading spinner) and `"Clear"` button.
- *PRD ref:* `prd.md > 1. Raw Log Input & Sample Pre-loader`, `prd.md > 2. Input Validation`.

### `OutputPane.jsx`
- Styled as a dark terminal window with simulated macOS/Linux window controls (`● ● ●`) and title `logwhisperer-output.sh`.
- Renders different states based on `appStatus`:
  - **Empty:** Green prompt `> Waiting for raw log input..._` with blinking cursor.
  - **Analyzing:** Centered animated terminal indicator `[ANALYZING] Decrypting stack trace...`.
  - **Error:** Red terminal notification card with retry button.
  - **Success:** Stacks the three diagnosis sections (`TranslationCard`, `RootCauseCard`, `FixCard`).
- *PRD ref:* `prd.md > 3. AI Analysis & Loading Feedback`, `prd.md > 4. Three-Tier Diagnosis Rendering`, `prd.md > States and Boundaries`.

### `sampleLogs.js`
- Contains pre-packaged realistic stack traces (e.g. Node.js unhandled rejection with database connection timeout or React hydration mismatch error) for instantaneous loading during demo.
- *PRD ref:* `prd.md > 1. Raw Log Input & Sample Pre-loader`.

## Data Model

### Frontend UI State
```typescript
interface AppState {
  rawLog: string;
  status: 'empty' | 'analyzing' | 'success' | 'warning' | 'error';
  warningMessage: string | null;
  errorMessage: string | null;
  result: LogAnalysisResult | null;
}
```

### AI Analysis Response Schema (JSON)
```json
{
  "translation": "Plain-English explanation of what this error means...",
  "rootCause": "The underlying technical cause in the code or environment...",
  "fix": {
    "summary": "1-2 concrete actionable steps...",
    "codeSnippet": "// Actionable code fix snippet\nconst fix = true;"
  }
}
```

## File Structure

```
build-with-ai-hackathon/
├── .env.example            # Template for GEMINI_API_KEY
├── .gitignore              # Ignores .env, node_modules, devpost/learner-profile.md
├── package.json            # Scripts and dependencies
├── vite.config.js          # Vite config with proxy to backend port 3000
├── tailwind.config.js      # Tailwind color palette & font configuration
├── postcss.config.js       # PostCSS config for Tailwind
├── index.html              # HTML shell with monospace fonts and dark background
├── server.js               # Node/Express API proxy with @google/genai structured call
├── src/
│   ├── main.jsx            # React root mount
│   ├── index.css           # Tailwind directives & terminal scrollbars
│   ├── App.jsx             # Top-level state and split-pane layout
│   ├── sampleLogs.js       # Realistic sample errors for 1-click loading
│   └── components/
│       ├── Header.jsx      # Top brand bar
│       ├── InputPane.jsx   # Textarea, sample button, and validation
│       └── OutputPane.jsx  # Window chrome & diagnosis cards with copy button
└── devpost/
    ├── learner-profile.md
    ├── scope.md
    ├── prd.md
    └── spec.md
```

## External Services and Dependencies
- **Google Gemini API:**
  - Endpoint model: `gemini-2.5-flash` via `@google/genai`
  - Response configuration:
    - `responseMimeType: "application/json"`
    - Strict `responseSchema` enforcing `translation`, `rootCause`, and `fix` fields.
  - Secret: `GEMINI_API_KEY` stored in `.env`.
  - Rate Limits & Pricing: Free tier supports 15 requests per minute (more than ample for hackathon demo).

## Important Failure Modes
- **Invalid / Missing API Key:**
  - *Trigger:* `GEMINI_API_KEY` missing from `.env` or invalid.
  - *User sees:* Red terminal error card in OutputPane: `[ERROR] Analysis failed: Invalid or missing Gemini API key. Please check your .env configuration.`
- **Network / API Timeout:**
  - *Trigger:* Gemini API down or request takes longer than 15s.
  - *User sees:* Red terminal error card: `[ERROR] Connection timed out. Please try again.` with a `"Try Again"` button.
- **Short / Invalid Input:**
  - *Trigger:* User clicks Analyze with empty text or <10 characters.
  - *User sees:* Client-side amber warning banner: `[WARN] Please provide a valid error log or stack trace.` without triggering an API call.

## What Was Simplified and Why
- **Single Model (`gemini-2.5-flash`) instead of dynamic model switcher:** Eliminates UI clutter and settings complexity; `gemini-2.5-flash` is fast, modern, and handles JSON schemas natively.
- **Pre-packaged Sample Logs instead of file upload dialog:** Eliminates file-parsing edge cases while delivering an even faster demo experience.
- **Stateless in-memory React state instead of local storage or database:** Prevents stale cache issues and keeps the tool lightweight and transactional.

## Decisions and Open Issues
- **Backend Proxy (`server.js`):** Chose Express backend proxy over direct client-side SDK call to ensure `GEMINI_API_KEY` is never exposed to browser devtools or leaked into git.
- **Vite Proxy:** Configured Vite dev server to proxy `/api` requests directly to `http://localhost:3000`, allowing seamless local development without CORS friction.
- **Learner Uncertainty Clarified:** Demonstrated how passing `responseSchema` and `responseMimeType: "application/json"` in `@google/genai` guarantees structured 3-part output without conversational filler.
- **Open Questions Resolved:**
  - AI Provider: Resolved to Google Gemini (`gemini-2.5-flash`).
  - Architecture: Resolved to React + Vite + Tailwind frontend with lightweight Express backend.
