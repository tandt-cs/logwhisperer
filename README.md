# 🖥️ LogWhisperer

> A zero-fluff, terminal-inspired debugging utility that translates cryptic error logs and stack traces into structured, actionable fixes.

[![Hackathon](https://img.shields.io/badge/Hackathon-Build_With_AI:_Basics-blue.svg)](https://learn-ai-basics.devpost.com/)
[![Tech Stack](https://img.shields.io/badge/Stack-React_|_Node.js_|_Gemini-success.svg)]()

## 💡 The Problem & Solution

Developers waste too much mental energy deciphering messy stack traces. When using general AI chatbots for help, they are forced to write custom prompts and wade through conversational fluff ("Sure! I can help you with that error..."). 

**LogWhisperer** abstracts all of this away. 
You paste a raw log, hit analyze, and immediately get a clean, 3-part structured diagnosis in a native IDE-like interface. No prompt engineering, no chit-chat. Just answers.

## ✨ Key Features

* **Zero-Prompt UX:** Paste the error and go. The heavy lifting is handled via a highly optimized system prompt backend.
* **Strict 3-Tier Output:** Leverages Google Gemini's **JSON Schema** to guarantee output is strictly separated into:
  1. *The Translation* (Plain English)
  2. *The Root Cause* (Technical mechanism)
  3. *The Fix* (Actionable steps + Code snippet)
* **Secure Architecture:** A lightweight Node.js/Express proxy handles the AI requests, ensuring the `GEMINI_API_KEY` is never exposed to the client browser.
* **Terminal-Native Aesthetic:** A dark-mode, split-pane UI built with Tailwind CSS that feels like a natural extension of a developer's workspace.
* **1-Click Copy:** Instant clipboard interaction for provided code fixes.

## 🛠️ Tech Stack

* **Frontend:** React 19, Vite, Tailwind CSS, Lucide Icons.
* **Backend:** Node.js, Express, dotenv, cors.
* **AI Provider:** Google Gemini API (`gemini-4-argon`) via `@google/genai`.

## 🚀 Getting Started

To run LogWhisperer locally, follow these steps:

### Prerequisites
* Node.js (v18+)
* A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/logwhisperer.git
   cd logwhisperer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the Application:**
   Run the backend proxy and the frontend Vite server:
   ```bash
   # Terminal 1 (Start Backend API on port 3000)
   node server.js
   
   # Terminal 2 (Start Frontend on port 5173)
   npm run dev
   ```
   *(Note: Check your `package.json` if a combined `npm run dev` script is configured to start both).*

5. Open your browser and navigate to `http://localhost:5173`.

## 🧠 Devpost Hackathon Context: "Plan-First" Methodology

This project was built for the **Build With AI: Basics** Hackathon, focusing heavily on a Spec-Driven / Plan-First AI workflow.

Before a single line of code was written, the entire architecture, UX, and AI prompting strategy were explicitly documented via an AI Agent interview process. You can review the planning progression in the repository:

1. [`scope.md`](./scope.md) - Defining the core loop and hard boundaries.
2. [`prd.md`](./prd.md) - Product Requirements (UI/UX, edge cases, error handling).
3. [`spec.md`](./spec.md) - Technical architecture and schema enforcement strategy.

## 📄 License

This project is licensed under the MIT License.
