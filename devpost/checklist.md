---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. End-to-end scaffold with working Gemini API proxy and live analysis**
  Becomes usable: A running web app where pasting a raw stack trace sends it to the local Express backend, prompts Gemini 2.5 Flash using strict JSON schema, and receives the structured 3-part diagnosis data.
  Why now: Risk first and kernel early. Bootstraps the project (Vite + React + Tailwind + Express + `@google/genai`), proves the Gemini structured schema integration works, and verifies that real error logs get decrypted without conversational fluff on step 1.
  PRD ref: `prd.md > The Core Journey` (steps 1–5), `prd.md > 3. AI Analysis & Loading Feedback`
  Spec ref: `spec.md > Stack`, `spec.md > External Services and Dependencies`, `spec.md > Components > server.js`
  Build: Initialize `package.json`, install dependencies (React, Vite, Tailwind CSS, Express, cors, dotenv, `@google/genai`, `lucide-react`). Configure `server.js` with structured Gemini prompt (`translation`, `rootCause`, `fix`), `vite.config.js` with API proxy, `.env.example`, and initial React layout that submits text and receives structured data.
  Verify (mechanical): Start backend and Vite dev server, send an analysis request, and verify that the backend returns HTTP 200 with valid JSON matching the schema keys.
  Learner check: Open `http://localhost:5173`, paste an error log, click Analyze, and verify that real analysis data is returned.
  Commit: `feat: bootstrap project and implement Gemini structured log analysis end-to-end`

- [x] **2. Polished dark terminal IDE layout with sample error loader and loading states**
  Becomes usable: The split-pane IDE interface is fully rendered with dark mode theme, header branding with live online status, the "Load Sample Error" 1-click helper, custom scrollbars, and the animated `[ANALYZING] Decrypting stack trace...` terminal loading state.
  Why now: Delivers the distinct visual and interactive experience defined in the PRD, and makes the 60-second video demo seamless with the sample loader.
  PRD ref: `prd.md > Screens and Layout`, `prd.md > Look and Feel`, `prd.md > 1. Raw Log Input & Sample Pre-loader`, `prd.md > 3. AI Analysis & Loading Feedback`
  Spec ref: `spec.md > Look and Feel`, `spec.md > Components > InputPane.jsx`, `spec.md > Components > sampleLogs.js`
  Build: Implement `Header.jsx`, `InputPane.jsx`, `sampleLogs.js`, Tailwind terminal color scheme and typography, mock window controls (`● ● ●`), and animated loading cursor.
  Verify (mechanical): Verify Vite build and check that clicking "Load Sample Error" populates the textarea and transitions the UI to the analyzing state upon submit.
  Learner check: Click "Load Sample Error", observe the multi-line error fill the textarea, and click "Analyze" to see the terminal loading animation.
  Commit: `feat: add split-pane terminal UI, sample log loader, and animated loading states`

- [ ] **3. Three-tier diagnosis terminal cards with 1-click snippet copy and full error/edge handling**
  Becomes usable: The right pane renders three distinct terminal cards (The Translation, The Root Cause, The Fix). Code snippets in The Fix card have a working 1-click "Copy" button that toggles to `✓ Copied!`. Empty/short inputs show amber validation warnings, and API failures render the red terminal error card with a retry option.
  Why now: Closes the core loop and polishes the user experience to the exact acceptance criteria in the PRD.
  PRD ref: `prd.md > 4. Three-Tier Diagnosis Rendering`, `prd.md > 2. Input Validation`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Components > OutputPane.jsx`, `spec.md > Important Failure Modes`
  Build: Implement `OutputPane.jsx` with `TranslationCard`, `RootCauseCard`, `FixCard`, clipboard copy interaction with 2-second visual feedback, input validation banner, and red API error fallback card with retry.
  Verify (mechanical): Test clipboard API logic, verify amber warning when submitting <10 chars, test error handling card with mock failure, and test successful card rendering.
  Learner check: Run a full analysis, copy the code snippet from The Fix, confirm `✓ Copied!` appears and paste it into your editor; also test clearing or submitting empty text to verify the validation warning.
  Commit: `feat: complete 3-tier diagnosis cards, clipboard copy interaction, and edge case handling`

## Hands-on Checkpoints

- [x] Early usable behavior explored — Slice 1: End-to-end Gemini analysis verified
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [what actually happened; real document/test/code references; unfinished work if interrupted]
Route and stops: [actual paths and symbols; guided stops completed, or reference-only route]
Edit outcome: [tried/kept/reverted/declined/not applicable; verification if changed]
Reflection: [offered/answered/declined/already covered — personal answer belongs only in the ignored profile]
Activity mode: [live app and editor, explicit static fallback, focused alternative, prior practice, or recap]

## Revisions
