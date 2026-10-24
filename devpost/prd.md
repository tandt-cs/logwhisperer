---
doc: prd
status: approved
---

# LogWhisperer — Product Requirements

A single-page, terminal-inspired debugging utility that translates raw, cryptic error logs and stack traces into structured, actionable fixes for developers.
Source: `scope.md > # LogWhisperer`, `scope.md > ## The Unique Kernel`, `scope.md > ## The POC Boundary`

## The Core Journey
1. **Arrival:** The developer opens the web application. The interface presents a dark, split-pane IDE-style layout. The right pane displays a waiting prompt: `> Waiting for raw log input..._` with a subtle blinking cursor.
2. **Log Entry:** The developer pastes a messy stack trace (e.g., React runtime error or Node.js crash log) into the left pane's text area, or clicks the `"Load Sample Error"` link for quick demo testing.
3. **Execution:** The developer clicks the `"Analyze"` button.
4. **Processing Feedback:** The "Analyze" button becomes disabled with a loading spinner, and the right pane displays an animated terminal indicator: `[ANALYZING] Decrypting stack trace...`.
5. **Diagnosis Presentation:** The right pane renders three distinct, stacked terminal cards:
   - **The Translation:** A plain-English explanation of the error.
   - **The Root Cause:** The specific underlying mechanism causing the issue.
   - **The Fix:** 1–2 concrete, actionable code snippets or steps, equipped with a 1-click `"Copy"` button.
6. **Action:** The developer clicks `"Copy"` on the fix (which briefly flashes `✓ Copied!`) and returns to their terminal/editor to resolve the bug.

## Screens and Layout
- **Single-Page Application (SPA):** Desktop split-pane layout (~40% left pane, ~60% right pane), stacking vertically on narrow viewports if accessed on smaller screens.
  - **Left Pane (Input Surface):**
    - Header: App title (`LogWhisperer`) and a concise tagline (`Terminal Log Decryptor`).
    - Input toolbar: Helper action `"Load Sample Error"` and character/line status.
    - Input area: Monospaced `<textarea>` designed for code/log pasting.
    - Action bar: Primary `"Analyze"` button with loading spinner state and a subtle `"Clear"` button.
    - Inline warning slot for input validation.
  - **Right Pane (Diagnosis Terminal):**
    - Terminal title bar with mock window controls (`● ● ●`).
    - Dynamic content container: shows Empty State, Loading State, Error State, or the 3-Section Results Cards.

## Look and Feel
- **Theme:** Strictly Dark Mode (no light theme toggle).
- **Aesthetic:** Modern developer IDE / terminal vibe (`#0d1117` or deep slate background, subtle high-contrast borders `#30363d`).
- **Typography:** Monospaced coding fonts (`JetBrains Mono`, `Fira Code`, or native monospace stack).
- **Color Accents:**
  - Terminal Green (`#3fb950` / `#22c55e`): Waiting cursor, success states, copy confirmation (`✓ Copied!`).
  - Terminal Cyan/Blue (`#58a6ff`): Translation & Root Cause highlights.
  - Warning Amber (`#d29922`): Input validation warnings.
  - Terminal Red (`#f85149`): Error states and stack trace highlights.

## Features and Behavior

### 1. Raw Log Input & Sample Pre-loader
- **Source:** `scope.md > ## The Core Loop`
- User can paste arbitrary text into the input field.
- Clicking `"Load Sample Error"` immediately populates the textarea with a realistic, multi-line error log (e.g., unhandled promise rejection or React TypeError) and clears any existing validation warnings.
- Clicking `"Clear"` resets the input area and resets the right pane to the default empty state.

### 2. Input Validation
- Submitting empty text or strings under 10 characters displays an inline warning banner below the textarea: `[WARN] Please provide a valid error log or stack trace.`
- Submitting does not trigger an external API call if the validation fails.

### 3. AI Analysis & Loading Feedback
- **Source:** `scope.md > ## What "Working" Looks Like`
- When `"Analyze"` is clicked with valid input:
  - Analyze button is disabled and shows `Analyzing...`.
  - Right pane switches to a centered terminal animation: `[ANALYZING] Decrypting stack trace...` with blinking cursor.
- The raw log is sent to the backend/AI API with a structured system prompt that enforces a consistent 3-part JSON output.

### 4. Three-Tier Diagnosis Rendering
- **Source:** `scope.md > ## The Unique Kernel`
- **Section 1 — The Translation:** Plain language explanation of what broke.
  - *Acceptance Criterion:* Clear summary without technical jargon or conversational filler.
- **Section 2 — The Root Cause:** Direct explanation of why this specific error occurred in the codebase.
  - *Acceptance Criterion:* Focuses on common pitfalls, misconfigurations, or logic flaws matching the trace.
- **Section 3 — The Fix:** 1–2 concrete steps, including formatted code snippet(s).
  - *Acceptance Criterion:* Contains a distinct `"Copy"` button that copies the snippet to clipboard and flashes `✓ Copied!` for 2 seconds before reverting.

## States and Boundaries

- **Empty / Initial State:** Right pane shows an empty terminal canvas with `> Waiting for raw log input..._` (blinking green cursor).
- **Loading State:** Right pane displays `[ANALYZING] Decrypting stack trace...`; left controls are locked against double-submission.
- **Success State:** Right pane displays the 3 formatted cards.
- **Warning State:** Inline amber notice on the left pane if user attempts to submit empty/spam input.
- **API Error State:** If the AI call fails or times out, the right pane displays a red terminal card:
  `[ERROR] Analysis failed: <reason>. Please verify your API key or network connection.` with a `"Try Again"` button.
- **Persistence Boundary:** Completely stateless. No database, no local storage persistence across sessions. A page reload resets to the empty state.

## Product Decisions
- **Split-Pane Layout:** Selected over a vertical single-column to mirror IDE side-by-side terminal workflows.
- **Load Sample Error Button:** Included to guarantee a frictionless 60-second video demo.
- **Zero-Fluff Tone:** System prompt forbids conversational greetings or sign-offs; output must strictly populate the 3 sections.
- **Strict Dark Theme:** Cut light mode to preserve cohesive developer aesthetic.

## What We're Building (POC)
- Responsive split-pane web UI with dark terminal styling.
- Raw text input with sample loader, clear button, and input validation.
- AI prompt orchestration returning the 3-section structured response.
- Diagnosis display cards with 1-click clipboard copy for code snippets.
- Comprehensive state handling (empty, loading, success, warning, API error).

## Deferred From the POC
- Multi-language log syntax highlighting in the input box.
- History drawer of previous diagnoses.
- Export to Markdown / PDF or shareable link generation.

## Possible Later Enhancements
- CLI tool (`logwhisperer < app.log`) piping terminal errors directly to the same backend.
- VS Code extension integration.

## Non-Goals
- User registration, login, and cloud persistence.
- Multi-file or upload support (.log file parsing).
- Support for general conversational chat (LogWhisperer is strictly transactional).

## Open Questions
- Target AI Provider: Gemini API vs. OpenAI API (to be selected in `4-spec`).
- Deployment & Execution: Direct client-side SDK call vs. lightweight local API proxy to handle environment variables securely (to be finalized in `4-spec`).
