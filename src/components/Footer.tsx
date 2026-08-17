'use client';

import React from 'react';
import Link from 'next/link';
import { Brain, GitBranch, Globe, ShieldCheck, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0B0F19] border-t border-slate-800/80 mt-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Brand */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-400" />
              <span className="text-base font-bold text-white">QuizMaster.AI</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-mono">v1.0.0 Ready</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              The ultimate AI knowledge & interview simulation engine. Powered by Wikipedia REST API, smart generative AI, and real-time candidate evaluation.
            </p>
          </div>

          {/* Platform Quick Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
            <Link href="/" className="hover:text-white transition-colors">Explorer</Link>
            <Link href="/quiz" className="hover:text-white transition-colors">Quiz Player</Link>
            <Link href="/wikipedia" className="hover:text-white transition-colors">Wikipedia Engine</Link>
            <Link href="/interview" className="hover:text-white transition-colors">Interview Prep</Link>
            <Link href="/custom" className="hover:text-white transition-colors">Custom AI</Link>
            <Link href="/stats" className="hover:text-white transition-colors">Analytics</Link>
          </div>
        </div>

        <hr className="border-slate-800/80" />

        {/* Deployment Readiness Info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Vercel & GitHub Deployment Ready</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> All Systems Operational
            </span>
            <span>© {new Date().getFullYear()} QuizMaster AI Engine.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
