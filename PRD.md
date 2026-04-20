# 🚀 LearnWise – Product Requirements Document (PRD)

---

## 🎯 1. Product Overview

LearnWise is a premium, AI-powered Cognitive Support System designed to transform unstructured learning into an optimized trajectory of mastery. Unlike traditional trackers, LearnWise implements **Spaced Repetition** and **Memory Decay Simulation** to proactively manage a learner's knowledge retention.

## 🧠 2. Problem Statement

Modern learners face "Cognitive Fragmentation"—the loss of high-value knowledge due to:
- ❌ **The Ebbinghaus Forgetting Curve**: Knowledge decays rapidly without calculated intervention.
- ❌ **Unstructured Scheduling**: Learners struggle to prioritize "weak" vs "fresh" topics.
- ❌ **Lack of Quantitative Feedback**: No single metric to define "Learning Health."

## 💡 3. The LearnWise Solution

A multi-layered cognitive engine that provides:
- ✅ **Dynamic Memory Decay**: Real-time simulation of knowledge loss based on inactivity.
- ✅ **Strategic Matrix Planner**: Automated 7-day roadmap prioritizing high-decay topics.
- ✅ **Operational Health Index**: A global 0–100 mastery score factoring in consistency.
- ✅ **Timeline Awareness**: A monthly grid for long-term study lifecycle management.

## 👥 4. Target Users

- **High-Stakes Learners**: Preparation for technical interviews and certifications.
- **Continuous Skill Builders**: Developers and engineers managing rapidly evolving tech stacks.
- **Academic Strategists**: Students moving beyond passive reading into active recall.

## 🧩 5. Core System Features

### 🔐 5.1 Identity & Access
- Secure Firebase Authentication (Email/Password).
- Persistent Session Management.

### 📊 5.2 Cognitive Command Center (Dashboard)
- **Health Quotient**: Global mastery score (Weighted by consistency).
- **Neural Insights**: AI-detected patterns in study behavior.
- **High-Priority Queue**: Automated detection of topics in "Critical Decay."

### 📚 5.3 Module Lifecycle (CRUD)
- Modular registration with Domain/Subject tagging.
- Evaluation of base confidence (1–5).
- Integrated knowledge parameter (Notes) repository.

### 🧠 5.4 Neural Intelligence Engine (aiEngine.js)
- **Simulated Decay Factor**: Linear degradation (0.15 pts/day).
- **Consistency Multiplier**: Rewards daily interaction with the platform.
- **Predictive Mapping**: Forecasts whether a topic is in "Terminal Storage" or "Active Buffer."

### 🗓️ 5.5 Strategic Matrix (Weekly Planner)
- Automated distribution of weak modules over a 7-day window.
- Intelligent load balancing (Max 3 modules/day to prevent burnout).
- One-click synchronization with the Timeline.

### 📅 5.6 Operational Timeline (Calendar)
- Monthly grid view of scheduled study sessions.
- Status tracking (Pending/Completed).
- Conflict checking to prevent redundant session generation.

---

## 🏗️ 6. Technical Architecture

### Frontend Layer
- **Framework**: React 18+
- **Styling**: Tailwind CSS v4 (SaaS Design System)
- **Interactivity**: Framer Motion / Native animate-in utilities.

### Backend & Persistence
- **Storage**: Firebase Firestore (NoSQL Architecture).
- **Auth**: Firebase Auth.

### State & Performance
- **Optimized Rendering**: `useMemo` for heavy AI calculations.
- **Memory Safety**: `useCallback` for debounced network signals.

---

## 🗂️ 7. Data Models

### Module (Topic)
```json
{
  "title": "String",
  "subject": "String",
  "confidence": "Number (1-5)",
  "notes": "String",
  "lastReviewed": "Timestamp",
  "userId": "Reference"
}
```

### Sync Cycle (Session)
```json
{
  "topicId": "Reference",
  "topicTitle": "String",
  "scheduledAt": "DateString",
  "status": "pending | completed",
  "userId": "Reference"
}
```

---

## 🎨 8. Design Philosophy (Premium SaaS)

- **Aesthetic**: Minimalist, Dark-mode optimized high-contrast elements.
- **Typography**: "Outfit" font family for sharp, technical legibility.
- **Interaction**: Micro-animations for state changes ("Syncing", "Saving").
- **Hierarchy**: Strong focus on quantitative data (Large percentages, bold weights).

---

## 🚀 9. Future V2 Vision

- **Gamified Mastery**: Streak-based rewards for maintaining >80% Health Quotient.
- **Collaborative Sync**: Domain sharing for study groups.
- **Cross-Platform Bridge**: Native mobile mobile Companion for quick "Active Recall" prompts.

---

## 🏁 10. Conclusion

LearnWise is more than a tracker; it is a **Neural Extension**. By offloading the "when" and "how much" of learning to a specialized engine, users can focus entirely on the "what," achieving deeper mastery in less time.
