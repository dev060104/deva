# 🎂 Aetheria 3D: Trending Birthday Wishes & 3D Gift Vision Experience

An immersive, cinematic **3D Vision Birthday Celebration Platform** with interactive 3D gift unboxing, tiered birthday cakes with blowable candles, procedural 3D fireworks, synthesized Web Audio music-box melodies, 40+ trending curated wishes (Gen Z, Constellation Poetry, Cyberpunk, Royal VIP, Savage Roast), and instant viral shareable gift URLs.

Integrated into the **Next.js 16 + React 19 + Three.js + Tailwind CSS** platform, pre-configured for **1-click Vercel deployment** and **GitHub repository synchronization**.

---

## 🌟 3D Vision & Celebration Features

### 🎁 1. Interactive 3D Gift Box Unboxing
- **Realistic 3D Meshes**: Royal velvet box base, 24K gold foil trim, satin ribbons, and a 3D dual-loop bow knot.
- **Physics & Motion**: Smooth mouse/touch parallax tilt and 360° orbit camera.
- **Unwrapping Sequence**: Click the box to watch ribbons dissolve into golden sparkle particles, the lid pop and spin in mid-air, and the surprise emerge with celebratory sound effects and full-screen confetti showers.

### 🎂 2. Tiered 3D Birthday Cake & Blowable Candles
- **Detailed 3D Cake**: Vanilla cream and strawberry frosted tiers with decorative pearls and piping.
- **Procedural Candle Flames**: Real-time flickering golden point lights and animated flame meshes.
- **Interactive "Blow Candles" Action**: Click or blow to extinguish the flames with realistic drifting smoke puff particles, trigger a triumphant celebratory fanfare, and ignite 3D fireworks!

### 🎆 3. 3D Particle Fireworks & Floating Balloons
- **Radial 3D Fireworks**: Fireworks that launch into the sky and explode into hundred-particle spherical bursts with gravity deceleration and stardust trails.
- **Floating Metallic Balloons**: Tear-shaped 3D balloons bobbing with simulated wind turbulence and realistic strings.

### 🎶 4. Zero-Latency Synthesized Web Audio Engine
- **100% Self-Contained**: Powered entirely by the Web Audio API with zero external audio assets or broken CDNs.
- **Sound Designer Features**:
  - ✨ Crystal chime harmonic arpeggios on interactions and wish copying.
  - 🎁 Unboxing pop and sparkling fanfare crescendo.
  - 💨 White-noise bandpass filter candle breath puff and extinguish sizzle.
  - 🎺 Triumphant brass party cheer.
  - 🎵 Harmonized 8-bar music-box chime melody playing "Happy Birthday to You".

### 🎨 5. 4 Dynamic 3D Aesthetics & Themes
1. **👑 Royal Gold**: Midnight navy with 24K gold foil, champagne reflections, and royal ruby velvet.
2. **🌌 Cosmic Nebula**: Deep space violet with electric cyan neon accents and stardust halos.
3. **🌸 Sakura Pastel**: Soft blush pinks, rose gold trims, and pearlescent floral highlights.
4. **⚡ Cyberpunk 2077**: Electric matrix emerald, neon magenta ribbons, and cyberpunk yellow glows.

---

## 🔥 Trending Curated Wishes Vault (40+ Unique Wishes)

- **🔥 Gen Z & Internet Culture**: *"No cap, another year of serving immaculate main character energy... 💅✨"*, *"Level [Age] unlocked! Still undisputed, still high key iconic 👑"*, *"Ate and left zero crumbs for [Age] years straight 🎂🔥"*.
- **✨ Constellation & Cinematic Poetry**: *"To a soul woven of constellations and quiet courage: may the universe align in your favor... 🌌"*, *"In the grand screenplay of time, today is your spotlight scene 🎬"*.
- **🚀 Tech & Cyberpunk / Dev Life**: *"git commit -m 'Leveled up to version [Age].0'. Zero breaking changes, infinite upgrades! 🚀💻"*, *"while (birthday) { eatCake(); enjoyLife(); ignoreBugs(); } ⚡"*.
- **👑 Royal & Luxury VIP**: *"Excellence isn't accidental, it's hereditary. Toasting to your billionaire mindset and timeless grace 🥂💎"*.
- **🎭 Savage & Hilarious Roast**: *"Happy birthday to someone who is smart, funny, gorgeous, and reminds me a lot of myself! 😉🎂"*, *"You're not old, you're just vintage and expensive to maintain 🍷"*.
- **💖 Deep Soulmate**: *"Every year with you is my favorite chapter yet... 🌸💌"*.
- **🎵 Chill & Lofi**: *"Warm coffee, soft lofi chords, and another golden spin around the sun 🎧☕"*.

### Interactive Wish Utilities:
- **Live Search**: Instant keyword and tag filtering across all wishes.
- **AI Sparkle Remix**: One-click dynamic injection of celebration sparkles and emojis.
- **Put in 3D Box**: Send any wish directly into the 3D gift box on the canvas above!
- **1-Click Copy**: Rich formatted wish text copied with clipboard confetti.

---

## 💌 Viral Shareable 3D Gift Link & Keepsake Card

### 🌐 Personalized Shareable URL Generator
Generate an instant, unique URL to share on **WhatsApp, X (Twitter), Telegram, iMessage, or Email**:
```
https://your-domain.vercel.app/birthday?to=Sophia&from=Alex&age=21&theme=royal-gold&gift=cake&msg=You+are+the+best!
```
- When the recipient opens the link, they receive a customized welcome banner and get to unbox their personalized 3D gift and blow out their candles!

### 📜 Golden Keepsake Greeting Card
- Ornate golden borders, royal wax seal, and personalized typography.
- Ready to print or copy formatted text for Instagram / WhatsApp stories.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js 18+ or 20+
- npm 9+

### 2. Run Development Server

```bash
# Clone the repository
git clone https://github.com/dev060104/deva.git
cd deva-1

# Install dependencies (including Three.js & Lucide)
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000/birthday](http://localhost:3000/birthday) to view the 3D Birthday Experience.

---

## 🐙 Step-by-Step GitHub Push Guide

To push all changes to your GitHub repository:

```bash
# 1. Check status
git status

# 2. Add all modified & new files
git add .

# 3. Commit with descriptive message
git commit -m "feat: Add 3D Vision Birthday Wishes & Gift experience with Three.js, blowable candles, audio engine and shareable links"

# 4. Push to main branch
git push origin main
```

---

## 📐 Step-by-Step Vercel Deployment Guide

This project is configured with `vercel.json` for automatic zero-config builds on Vercel.

### Option A: Automatic Git Deploy (Already Connected)
Whenever you run `git push origin main`, Vercel automatically detects the push, initiates `npm run build`, and deploys the live update to your production domain!

### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy preview
vercel

# Deploy to production
vercel --prod
```

### Option C: Import via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **"Add New Project"** and select repository `dev060104/deva`.
3. Framework Preset: **Next.js** (automatically detected).
4. Click **Deploy**. Your app will be live with full SSL and global CDN in under a minute!

---

## 🛠️ Project Architecture

```
deva-1/
├── src/
│   ├── app/
│   │   ├── birthday/
│   │   │   └── page.tsx               # 🎁 3D Birthday Experience Page (with URL query support)
│   │   ├── earthquake/page.tsx        # 🌋 SeismoAI Earthquake Hazard Predictor
│   │   ├── quiz/page.tsx              # 🧠 QuizMaster AI Engine
│   │   ├── wikipedia/page.tsx         # 🌐 Wikipedia Explorer & Auto Quizzer
│   │   ├── interview/page.tsx         # 💼 STAR Interview Prep Simulator
│   │   ├── custom/page.tsx            # ⚡ Custom AI Quiz Builder
│   │   ├── stats/page.tsx             # 📊 Analytics & Performance Dashboard
│   │   ├── layout.tsx                 # Root layout with dark mode
│   │   └── page.tsx                   # Main Multi-App Portal Launchpad
│   ├── components/
│   │   ├── birthday/
│   │   │   ├── Birthday3DScene.tsx    # 🌟 Three.js WebGL Canvas (Box, Cake, Candles, Fireworks)
│   │   │   ├── TrendingWishesSection.tsx # 🔥 40+ Categorized Wishes & AI Remix
│   │   │   ├── ShareGiftModal.tsx     # 💌 Viral Share URL Generator & Social Sharers
│   │   │   └── GreetingCardModal.tsx  # 📜 Ornate Golden Keepsake Card & Print View
│   │   └── Navbar.tsx                 # Header navigation with 3D Birthday glowing link
│   └── lib/
│       └── birthdayAudio.ts           # 🎶 Synthesized Web Audio API Engine
├── vercel.json                        # Vercel deployment configuration
├── package.json                       # Dependencies (three, canvas-confetti, lucide-react)
└── README.md                          # Comprehensive documentation
```

---

## 📜 License

MIT License. Designed & crafted with love for magical birthday celebrations and 3D visual experiences.
