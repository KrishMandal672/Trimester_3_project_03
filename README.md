# 🚀 LearnWise: AI-Powered Cognitive System

**LearnWise** is a premium, intelligence-driven learning platform designed to eliminate knowledge decay. Inspired by **Linear** and **Stripe**, it combines a sophisticated memory simulation engine with a strategic planning matrix to ensure you never forget what you've learned.

![Dashboard Preview](https://via.placeholder.com/1200x600/09090b/ffffff?text=LearnWise+Neural+Interface)

## 💎 Core Capabilities

- **🧠 Neural Intelligence Engine**: Simulates memory decay using the Ebbinghaus Curve. Your "Real Strength" score drops over time without review.
- **🗺️ Strategic Matrix Planner**: Automatically generates a 7-day study roadmap, load-balancing your weakest topics into manageable daily sessions.
- **📅 Operational Timeline**: A visual monthly calendar to track your learning lifecycle and maintain consistency.
- **📈 Health Quotient (LQ)**: A proprietary 0–100 mastery metric that factors in topic confidence, record freshness, and study consistency.
- **⚡ High-Performance UI**: A custom-built SaaS design system using **Tailwind CSS v4** and the **Outfit** typeface.

## 🛠️ Technology Stack

- **Frontend Core**: React 18+ (Functional Architecture)
- **Styling Layer**: Tailwind CSS v4 (Glassmorphism & High-Contrast Design)
- **Intelligence Layer**: Custom JavaScript Analytics Engine (idempotent scheduling)
- **Data & Auth**: Firebase / Google Cloud Firestore
- **State Management**: Optimized React Hooks (Memoization-first approach)

## 🚀 Deployment & Installation

### 1. Initialize Repository
```bash
git clone <repository_url>
cd learnwise
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
```

### 3. Execution
```bash
npm install
npm run dev
```

## 🧠 System Logic: The Decay Factor
LearnWise implements a **-0.15 decay factor** per day of inactivity. If you rate a module at **Level 5 (Mastery)** but don't review it for 10 days, your **Effective Level** drops to **3.5**, triggering a "High Priority" alert in your Strategic Roadmap.

## 🗺️ Roadmap
- [x] **V1**: Basic CRUD & Auth
- [x] **V2**: Premium UI Redesign (SaaS Grade)
- [x] **V3**: Memory Decay & Weekly Matrix Planner
- [x] **V4**: Timeline Management & Sync Logic
- [ ] **V5**: AI-Generated Knowledge Quizzes (Coming Soon)

## 📄 Documentation
For the full technical specification and architectural breakdown, refer to the [Product Requirements Document (PRD)](./PRD.md).

---
*Powered by AI. Optimized for Mastery. Built for the Future of Learning.*
# Trimester_3_project_03
