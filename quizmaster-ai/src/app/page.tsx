'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Brain, Sparkles, Globe, Briefcase, Server, Code, Users, 
  ShieldAlert, Atom, Landmark, Gamepad2, ArrowRight, Play, Award, Zap
} from 'lucide-react';
import { CATEGORIES, CategoryMeta } from '../lib/categories';
import { BUILTIN_QUESTIONS } from '../lib/questionBank';
import QuizEngine from '../components/QuizEngine';

const iconMap: Record<string, any> = {
  Server,
  Code,
  Users,
  Briefcase,
  Globe,
  ShieldAlert,
  Atom,
  Landmark,
  Gamepad2,
  Sparkles
};

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  if (activeCategory) {
    const questions = BUILTIN_QUESTIONS.filter(q => q.category === activeCategory);
    const meta = CATEGORIES.find(c => c.id === activeCategory);

    return (
      <div className="space-y-6">
        <button
          onClick={() => setActiveCategory(null)}
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl"
        >
          ← Back to Category Explorer
        </button>

        <QuizEngine
          questions={questions.length > 0 ? questions : BUILTIN_QUESTIONS.slice(0, 5)}
          title={meta ? meta.name : 'Category Quiz'}
          category={activeCategory}
          onReset={() => setActiveCategory(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      
      {/* Hero Banner Section */}
      <section className="relative rounded-3xl bg-gradient-to-b from-[#141B2D] via-[#0F1423] to-[#0B0F19] border border-slate-800/80 p-8 sm:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>AI-Powered Universal Knowledge & Interview Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
            Master Any Topic. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Ace Every Interview.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Test your expertise across System Design, Coding, STAR Behavioral interviews, live Wikipedia parsing, official facts vs urban myths, and custom study notes.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActiveCategory('system-design')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Quick System Design Quiz</span>
            </button>

            <Link
              href="/wikipedia"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs transition-all"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Explore Wikipedia Engine</span>
            </Link>
          </div>

        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/wikipedia" className="p-6 rounded-2xl bg-[#111625] border border-slate-800 hover:border-cyan-500/40 transition-all group space-y-3">
          <div className="p-3 w-fit rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">Wikipedia Live Quizzer</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Type any topic to fetch real-time facts and synthesize instant multi-choice tests.</p>
        </Link>

        <Link href="/interview" className="p-6 rounded-2xl bg-[#111625] border border-slate-800 hover:border-purple-500/40 transition-all group space-y-3">
          <div className="p-3 w-fit rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
            <Briefcase className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-white group-hover:text-purple-300 transition-colors">AI Interview Practice</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Simulate System Design, Coding, and STAR Behavioral questions with AI candidate evaluation.</p>
        </Link>

        <Link href="/custom" className="p-6 rounded-2xl bg-[#111625] border border-slate-800 hover:border-fuchsia-500/40 transition-all group space-y-3">
          <div className="p-3 w-fit rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-white group-hover:text-fuchsia-300 transition-colors">Custom AI Study Builder</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Paste job specs or study notes to generate personalized question decks instantly.</p>
        </Link>
      </section>

      {/* Main Categories Selector Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Knowledge Spheres & Quizzes</h2>
            <p className="text-xs text-slate-400">Select a topic category to start playing</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = iconMap[cat.iconName] || Brain;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  if (cat.type === 'wikipedia') {
                    window.location.href = '/wikipedia';
                  } else if (cat.type === 'custom') {
                    window.location.href = '/custom';
                  } else if (cat.type === 'interview') {
                    window.location.href = '/interview';
                  } else {
                    setActiveCategory(cat.id);
                  }
                }}
                className="p-6 rounded-2xl bg-[#111625] border border-slate-800/80 hover:border-indigo-500/50 cursor-pointer shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${cat.color} text-white shadow-md group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-bold">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs font-semibold text-slate-400 group-hover:text-indigo-400 transition-colors">
                  <span>{cat.questionCount}+ Questions</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
