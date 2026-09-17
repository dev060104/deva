'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Brain, Sparkles, Globe, Briefcase, Activity, Zap, BarChart2, 
  Layers, ArrowRight, ShieldAlert, Award, Gift, Flame, Music
} from 'lucide-react';

export default function LaunchpadPortalPage() {
  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      
      {/* Hero Header */}
      <section className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
          <span>Integrated Multi-App Platform Hub</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          Explore Intelligent <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-amber-300 to-indigo-400">Apps & 3D Magic</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          From interactive 3D vision birthday celebrations and gift unboxing to neural seismic earthquake analysis and universal AI interview prep.
        </p>
      </section>

      {/* FEATURED SHOWCASE: 3D BIRTHDAY WISHES & GIFT VISION */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-pink-950/40 via-[#161226] to-amber-950/40 border-2 border-pink-500/40 shadow-2xl hover:border-pink-500/70 transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-mono font-bold uppercase">
              <Gift className="w-3.5 h-3.5 animate-bounce" />
              <span>New Trending Release</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              3D Vision Birthday Wishes & Interactive Gift Unboxing
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Step into an immersive WebGL 3D world: unbox a velvet gift box, blow out burning candles on a 3-tier cake, launch 3D fireworks, listen to a synthesized music-box melody, and explore 40+ trending wishes across Gen Z, Constellation Poetry, Cyberpunk, and VIP Royalty!
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-amber-400" /> Three.js 3D Vision</span>
              <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-pink-400" /> Blowable Candles</span>
              <span className="flex items-center gap-1"><Music className="w-3.5 h-3.5 text-indigo-400" /> Synthesized Melodies</span>
              <span className="flex items-center gap-1"><Gift className="w-3.5 h-3.5 text-emerald-400" /> Viral Shareable Links</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
            <Link
              href="/birthday"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-white font-bold text-sm shadow-xl shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Launch 3D Birthday Experience</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Dual Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* PLATFORM 1: EARTHQUAKE PREDICTION (SEISMOAI) */}
        <div className="p-8 rounded-3xl bg-gradient-to-b from-amber-950/40 via-[#111625] to-[#0B0F19] border border-amber-500/30 shadow-2xl hover:border-amber-500/60 transition-all group flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 group-hover:scale-110 transition-transform">
                <Activity className="w-8 h-8 animate-pulse" />
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold font-mono uppercase">
                Seismic AI Engine
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-white group-hover:text-amber-300 transition-colors">
                SeismoAI: Earthquake Predictor
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Dedicated Neural Network classification & regression engine for earthquake hazard analysis based on receiver & epicenter spatial parameters.
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-300 pt-2">
              <li className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Richter Magnitude & Shaking Risk Calculator</span>
              </li>
              <li className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Real-time Waveform Canvas & Audio Synthesizer</span>
              </li>
              <li className="flex items-center gap-2">
                <BarChart2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Dataset EDA Analytics & Model Confusion Matrix</span>
              </li>
              <li className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Batch CSV Seismic File Analyzer</span>
              </li>
            </ul>

          </div>

          <Link
            href="/earthquake"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-xs shadow-xl shadow-amber-600/20 transition-all group-hover:scale-[1.02]"
          >
            <span>Launch Earthquake Predictor</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* PLATFORM 2: AI QUIZ MASTER & INTERVIEW SIMULATOR */}
        <div className="p-8 rounded-3xl bg-gradient-to-b from-indigo-950/40 via-[#111625] to-[#0B0F19] border border-indigo-500/30 shadow-2xl hover:border-indigo-500/60 transition-all group flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="p-3.5 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 group-hover:scale-110 transition-transform">
                <Brain className="w-8 h-8" />
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold font-mono uppercase">
                Knowledge Engine
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-white group-hover:text-indigo-300 transition-colors">
                QuizMaster AI: Knowledge & Interview
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Universal knowledge testing, live Wikipedia article quizzer, System Design & STAR interview simulations, official facts vs myths, and AI tutor.
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-300 pt-2">
              <li className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Live Wikipedia Search & Instant Quiz Synthesizer</span>
              </li>
              <li className="flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>AI Mock Interview Candidate Evaluator (0-100%)</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Mythbusters Mode (Official Fact vs Urban Rumor)</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Custom Text / Study Note AI Question Deck Builder</span>
              </li>
            </ul>

          </div>

          <Link
            href="/quiz"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/20 transition-all group-hover:scale-[1.02]"
          >
            <span>Launch Quiz Master AI</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

    </div>
  );
}
