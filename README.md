# SeismoAI - Earthquake Classification & Seismic Risk Analytics Platform

![SeismoAI Banner](https://img.shields.io/badge/Model-Artificial%20Neural%20Network-blue?style=for-the-badge&logo=tensorflow)
![Accuracy](https://img.shields.io/badge/Accuracy-91.6%25-emerald?style=for-the-badge)
![Deployment](https://img.shields.io/badge/Deployment-Vercel%20Ready-black?style=for-the-badge&logo=vercel)

**SeismoAI** is a web application and seismic risk classification system built upon machine learning analysis of the **STEAD (STanford Earthquake Dataset)** containing 1,058,954 earthquake events.

---

## 📊 Classification Report Summary

The model classifies earthquakes based on Richter magnitude into 3 seismic risk levels:
- **Class 0 (Low Risk)**: Magnitude < 2.5 M (Micro-earthquakes / minor vibrations)
- **Class 1 (Moderate Risk)**: 2.5 M ≤ Magnitude ≤ 4.5 M (Noticeable shaking)
- **Class 2 (High Risk)**: Magnitude > 4.5 M (Potentially destructive events)

### Performance Matrix
| Class ID | Risk Category | Precision | Recall | F1-Score | Support |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Class 0** | Low Risk (< 2.5 M) | **0.93** | **0.94** | **0.93** | 37,063 |
| **Class 1** | Moderate Risk (2.5 - 4.5 M) | **0.91** | **0.90** | **0.90** | 55,065 |
| **Class 2** | High Risk (> 4.5 M) | **0.89** | **0.87** | **0.88** | 13,767 |
| **Overall** | **Test Accuracy** | **91.6%** | **91.6%** | **91.6%** | **105,895** |

- **Test Loss**: 0.3601 (Squared Hinge / Categorical Loss)
- **Magnitude Regression RMSE**: 0.582

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Lucide Icons, Glassmorphism UI
- **Data Visualization**: Recharts (Interactive charts & Confusion Matrix)
- **Inference Engine**: TensorFlow.js / Custom ANN Matrix Engine with Z-Score Standardization
- **Deployment**: Vercel (`vercel.json` zero-config setup)

---

## 🚀 Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build production bundle
npm run build

# 4. Preview production build
npm run preview
```

---

## 🐙 Push to GitHub Instructions

To push this project to your GitHub account:

```bash
# 1. Initialize git repository inside earthquake-classification-app
git init
git add .
git commit -m "feat: Initial commit of SeismoAI Earthquake Classification App"

# 2. Create a new repository on GitHub (e.g., 'earthquake-classification-app')
# 3. Add your remote URL and push:
git remote add origin https://github.com/YOUR_USERNAME/earthquake-classification-app.git
git branch -M main
git push -u origin main
```

---

## ☁️ Deploy to Vercel

### Option 1: Vercel CLI (Recommended)
```bash
# Deploy to preview
npx vercel

# Deploy to production
npx vercel --prod
```

### Option 2: Vercel Web Dashboard
1. Push your repository to GitHub (following the steps above).
2. Open [vercel.com/new](https://vercel.com/new).
3. Import the `earthquake-classification-app` repository.
4. Click **Deploy**. Vercel will automatically detect `vercel.json` and deploy your app instantly!
