# CodeView — AI-Native Technical Interview & Engineering Platform

[![Next.js](https://img.shields.io/badge/Next.js-14_App_Router-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Convex](https://img.shields.io/badge/Convex-Realtime_Backend-orange?style=flat)](https://www.convex.dev/)
[![Clerk](https://img.shields.io/badge/Clerk-Authentication-6C47FF?style=flat&logo=clerk)](https://clerk.com/)
[![GetStream](https://img.shields.io/badge/Stream-WebRTC_Video-005FFF?style=flat&logo=stream)](https://getstream.io/)

> **CodeView** is a modern, AI-powered collaborative technical interviewing platform merging WebRTC video conferencing, multi-language sandbox execution, interactive system design canvas simulation, voice-driven AI mock interviews, and automated executive scorecards.

---

## 📖 Complete Project Flow & Architecture Guide

For an in-depth breakdown of system architecture, sequence diagrams, database schemas, AI fallbacks, and user journey flowcharts, please refer to:

👉 **[PROJECT_FLOW_AND_DESCRIPTION.md](./PROJECT_FLOW_AND_DESCRIPTION.md)**

---

## 🚀 Key Features

- **Collaborative Coding Room (`/meeting/[id]`)**: Monaco Editor with real-time remote sync, test execution (JavaScript, Python, Java) via Piston API, and live interviewer hint dispatching.
- **Aura AI Voice Mock Interview (`/mock-interview`)**: Conversational AI interviewer with real-time Speech Recognition (STT) and Voice Synthesis (TTS) powered by OpenRouter / Gemini.
- **Interactive System Design Studio (`/system-design`)**: Freeform architecture canvas with 10+ cloud infrastructure components, 100k QPS live animated packet flow, protocol auto-inference, and AI architectural critiques.
- **Interviewer Copilot & Executive Scorecards**: Real-time interviewer hints, scrutiny notes, radar skill charts, and automated hiring memos.
- **AI Question Studio (`/dashboard/questions`)**: AI-assisted coding challenge generator producing test cases, constraints, and multi-language starter code.
- **Dual-Persona Experience**: Seamless switching between **Candidate** and **Interviewer** roles.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Framer Motion, Radix UI, Monaco Editor
- **Backend & Database**: Convex (reactive serverless database with real-time subscriptions)
- **Identity & Auth**: Clerk (OAuth, session management, user roles)
- **Video & Audio**: GetStream Video React SDK & Node SDK
- **Code Runner**: Piston Remote Execution API
- **AI Intelligence**: OpenRouter (specialized free models) + Google Gemini API direct fallback

---

## 🏃 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/codeview.git
cd codeview
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and provide your API keys:
```bash
cp .env.example .env
```

Ensure the following variables are defined:
- `NEXT_PUBLIC_APP_URL`
- `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_STREAM_API_KEY` and `STREAM_SECRET_KEY`
- `OPENROUTER_API_KEY`
- `GEMINI_API_KEY`

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Documentation Reference

- **[PROJECT_FLOW_AND_DESCRIPTION.md](./PROJECT_FLOW_AND_DESCRIPTION.md)**: Deep-dive architecture, sequence diagrams, ER diagrams, permission matrices, and security specifications.
