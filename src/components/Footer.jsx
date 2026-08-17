import React from 'react';
import { Activity, Github, Globe, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/60 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white font-heading">
                SeismoAI - Earthquake Classification System
              </p>
              <p className="text-xs text-slate-400">
                Powered by STEAD Seismic Neural Network Architecture & Decision Tree Models
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Accuracy: 91.6%
            </span>
            <span>•</span>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
              <Github className="w-3.5 h-3.5" /> GitHub
            </a>
            <span>•</span>
            <a href="https://vercel.com" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-cyan-400" /> Vercel Deploy
            </a>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 SeismoAI Inc. Designed for Seismic Safety & Machine Learning Analysis.</p>
          <p className="flex items-center gap-1">
            Built with React 18, Vite & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
