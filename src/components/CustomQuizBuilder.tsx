'use client';

import React, { useState } from 'react';
import { Sparkles, FileText, Loader2, BookOpen, Layers } from 'lucide-react';
import { Question } from '@/lib/types';
import { generateCustomAIQuiz } from '@/lib/aiEngine';
import { getUserSettings } from '@/lib/storage';
import QuizEngine from './QuizEngine';

export default function CustomQuizBuilder() {
  const [promptText, setPromptText] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[] | null>(null);

  const presetTopics = [
    'Docker & Kubernetes Architecture',
    'Machine Learning & Neural Networks',
    'Financial Modeling & Valuation',
    'US Constitutional Law Principles',
    'Cybersecurity & Ethical Hacking',
    'Organic Chemistry Functional Groups'
  ];

  const handleGenerate = async () => {
    if (!promptText.trim() || loading) return;

    setLoading(true);
    setQuestions(null);
    const settings = getUserSettings();

    try {
      const generated = await generateCustomAIQuiz(promptText, settings.apiKey, 5);
      setQuestions(generated);
    } catch (err) {
      console.error('Custom quiz generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {!questions ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-fuchsia-950 via-[#111625] to-purple-950 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-fuchsia-600/30 border border-fuchsia-500/30 text-fuchsia-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Custom AI Quiz & Study Builder</h2>
              <p className="text-xs text-slate-400">Paste study notes, job specs, or any topic prompt to synthesize custom questions</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Topic Prompt or Raw Text</span>
              <span className="text-[10px] text-slate-500">{promptText.length} characters</span>
            </label>

            <textarea
              rows={5}
              placeholder="Paste your study notes, textbook excerpt, job description, or enter a prompt like 'DevOps CI/CD pipelines & Terraform'..."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 text-xs text-white placeholder-slate-600 outline-none leading-relaxed resize-none"
            />
          </div>

          {/* Quick Presets */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Try Popular Custom Prompts</span>
            <div className="flex flex-wrap gap-2">
              {presetTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setPromptText(topic)}
                  className="px-3 py-1 rounded-full bg-slate-900/80 hover:bg-fuchsia-600/20 border border-slate-800 hover:border-fuchsia-500/40 text-slate-300 hover:text-fuchsia-200 text-xs transition-all"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleGenerate}
              disabled={loading || !promptText.trim()}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-fuchsia-600/30 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing AI Questions...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Custom Quiz</span>
                </>
              )}
            </button>
          </div>

        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#111625] border border-slate-800 text-xs">
            <span className="text-slate-300 font-medium">Custom Topic: <strong className="text-white">{promptText.slice(0, 40)}</strong></span>
            <button
              onClick={() => setQuestions(null)}
              className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white"
            >
              Create Another Quiz
            </button>
          </div>

          <QuizEngine
            questions={questions}
            title={`Custom AI Quiz: ${promptText.slice(0, 30)}`}
            category="custom-ai"
            onReset={() => setQuestions(null)}
          />
        </div>
      )}

    </div>
  );
}
