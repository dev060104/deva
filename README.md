# 🧠 QuizMaster AI: Universal Knowledge & Mock Interview Simulator

**QuizMaster AI** is a state-of-the-art, full-featured AI Quiz, Knowledge Explorer, and Interview Prep platform. It covers all domains of human knowledge, real-time Wikipedia article parsing, technical and behavioral interview simulations, official facts vs urban myths, flashcard study modes, and custom AI question generation.

Built with **Next.js 14/15 App Router**, **TypeScript**, and **Tailwind CSS**, fully optimized for **1-click deployment on Vercel** and structured for **GitHub repository push**.

---

## ✨ Features

- 🎯 **Multi-Domain Knowledge Spheres**:
  - **System Design & Architecture**: High-availability systems, scalability, load balancing, CAP theorem, consistent hashing, messaging queues (Kafka/RabbitMQ).
  - **Software Engineering & Coding**: Data structures, React, Node.js, Python, clean code, design patterns.
  - **HR & Behavioral Practice**: STAR method scenarios, conflict resolution, leadership principles.
  - **Product & Business Case**: Product strategy metrics, framework prioritization, consulting case studies.
  - **Official Facts vs Urban Myths**: Test knowledge against popular urban legends, tech lore, and historical inaccuracies.
  - **Science & Quantum Physics**: Astrophysics, genetics (CRISPR), quantum entanglement.
  - **World History & Pop Culture**: Ancient battles, industrial revolution, gaming lore, cinema.

- 🌐 **Live Wikipedia Knowledge Engine**:
  - Search any article live via Wikipedia REST API.
  - Generates factual summary cards and auto-synthesizes multiple-choice questions on-the-fly.

- 🤖 **AI Mock Interview Simulator**:
  - Interactive scenario questions with evaluation focus criteria.
  - Real-time AI candidate evaluation scoring (0-100%), key points covered vs missing, strengths, and sample model answers.

- ⚡ **Custom AI Quiz Builder**:
  - Paste any study text, notes, job description, or custom prompt to generate instant quiz decks.

- 💡 **AI Tutor Assistant**:
  - Interactive slide-over drawer allowing users to ask follow-up questions about any answer choice ("Explain B", "Give a real-world example").

- 🎮 **Multiple Game Modes**:
  - **Standard Mode**: Timed questions with explanations.
  - **Survival / Sudden Death**: How far can you go with 3 hearts?
  - **Flashcard Study**: Flip cards for quick concept review.

- 📊 **Performance Analytics & Bookmarks**:
  - Accuracy graphs, category mastery breakdown, active streak counter, bookmarked questions, and JSON stats Export/Import.

- 🔑 **Hybrid AI & Privacy-First**:
  - Works **100% out-of-the-box** with built-in algorithmic engine and rich curated fallback databases.
  - Optional custom **OpenAI / Gemini API Key** settings panel stored locally in client session.

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install Dependencies

```bash
git clone <your-repo-url>
cd deva-1
npm install
```

### 2. Run Local Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build & Production Test

```bash
npm run build
npm start
```

---

## 🐙 Step-by-Step GitHub Push Guide

To push this repository to your GitHub account:

### Step 1: Initialize Git & Stage Files (Already initialized locally)

```bash
git add .
git commit -m "feat: complete QuizMaster AI deployment release with Next.js, Wikipedia engine & Interview simulator"
```

### Step 2: Create a New GitHub Repository

1. Go to [GitHub New Repository](https://github.com/new).
2. Set Repository Name to `quizmaster-ai` (or your preferred name).
3. Choose **Public** or **Private**.
4. Leave "Initialize this repository with a README" **unchecked** (since we already have one).
5. Click **Create repository**.

### Step 3: Link Local Repository & Push to Main

Run the following commands in your terminal:

```bash
# Rename default branch to main if needed
git branch -M main

# Add your GitHub repository remote URL
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/quizmaster-ai.git

# Push code to GitHub
git push -u origin main
```

---

## 📐 Step-by-Step Vercel Deployment Guide

QuizMaster AI is pre-configured with `vercel.json` for zero-configuration Vercel deployment.

### Option A: Deployment via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and log in.
2. Click **"Add New..."** -> **"Project"**.
3. Select your GitHub repository (`quizmaster-ai`).
4. **Framework Preset**: Next.js (Auto-detected).
5. **Root Directory**: `./` (Default).
6. *(Optional)* Add Environment Variables if using a global server API key:
   - Name: `OPENAI_API_KEY`
   - Value: `your-sk-key`
7. Click **Deploy**. Vercel will build and deploy your application in under 60 seconds with a free HTTPS URL!

### Option B: Deployment via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## 🛠️ Project Structure

```
deva-1/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai/route.ts        # Serverless AI engine endpoint
│   │   │   └── wiki/route.ts      # Serverless Wikipedia REST API proxy
│   │   ├── custom/page.tsx        # Custom AI quiz page
│   │   ├── interview/page.tsx     # Mock interview simulator page
│   │   ├── quiz/page.tsx          # Quiz player page
│   │   ├── stats/page.tsx         # User analytics dashboard
│   │   ├── wikipedia/page.tsx     # Wikipedia engine page
│   │   ├── globals.css            # Dark theme styles & Tailwind v4
│   │   ├── layout.tsx             # Root layout with metadata
│   │   └── page.tsx               # Main Dashboard & Category Explorer
│   ├── components/
│   │   ├── AITutorDrawer.tsx      # Slide-over AI Q&A tutor
│   │   ├── CustomQuizBuilder.tsx  # Custom text prompt quiz generator
│   │   ├── Footer.tsx             # Global footer with platform links
│   │   ├── InterviewSimulator.tsx # Mock interview practice UI
│   │   ├── Navbar.tsx             # Sticky header with navigation & streaks
│   │   ├── QuizEngine.tsx         # Core interactive player (Timed, Survival, Flashcards)
│   │   ├── SettingsModal.tsx      # API key & audio settings modal
│   │   ├── StatsDashboard.tsx     # Analytics graphs & bookmark review
│   │   └── WikipediaExplorer.tsx  # Wikipedia search & auto quiz generator
│   └── lib/
│       ├── aiEngine.ts            # Built-in & API AI synthesis engine
│       ├── categories.ts          # Knowledge taxonomy definitions
│       ├── questionBank.ts        # Built-in question database
│       ├── storage.ts             # LocalStorage stats & settings helper
│       ├── types.ts               # TypeScript data models
│       └── wikipedia.ts           # Wikipedia REST API search & parser
├── vercel.json                    # Vercel deployment configuration
├── package.json                   # Dependencies & scripts
└── README.md                      # Comprehensive documentation
```

---

## 📜 License

MIT License. Designed and engineered for high-performance knowledge exploration and interview preparation.
