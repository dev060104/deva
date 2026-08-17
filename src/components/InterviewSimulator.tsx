'use client';

import React, { useState } from 'react';
import { 
  Briefcase, CheckCircle2, AlertCircle, Sparkles, Loader2, 
  Award, ArrowRight, BookOpen, Layers, Target, HelpCircle
} from 'lucide-react';
import { BUILTIN_INTERVIEWS } from '@/lib/questionBank';
import { InterviewScenario, InterviewEvaluation } from '@/lib/types';
import { evaluateInterviewAnswer } from '@/lib/aiEngine';
import { getUserSettings } from '@/lib/storage';

export default function InterviewSimulator() {
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);

  const filteredScenarios = selectedRole === 'All'
    ? BUILTIN_INTERVIEWS
    : BUILTIN_INTERVIEWS.filter(s => s.role.toLowerCase().includes(selectedRole.toLowerCase()));

  const currentScenario: InterviewScenario = filteredScenarios[activeScenarioIndex] || BUILTIN_INTERVIEWS[0];

  const handleEvaluate = async () => {
    if (!userAnswer.trim() || evaluating) return;

    setEvaluating(true);
    const settings = getUserSettings();
    try {
      const result = await evaluateInterviewAnswer(currentScenario, userAnswer, settings.apiKey);
      setEvaluation(result);
    } catch (err) {
      console.error('Interview evaluation error:', err);
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextScenario = () => {
    setUserAnswer('');
    setEvaluation(null);
    setActiveScenarioIndex((prev) => (prev + 1) % filteredScenarios.length);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-[#111625] to-purple-950 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-600/30 border border-indigo-500/30 text-indigo-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Mock Interview Simulator</h2>
            <p className="text-xs text-slate-400">Master System Design, Coding, STAR Behavioral & Business Case interviews</p>
          </div>
        </div>

        {/* Role Filters */}
        <div className="flex flex-wrap gap-2 pt-2">
          {['All', 'System Design', 'Behavioral', 'Product'].map((role) => (
            <button
              key={role}
              onClick={() => {
                setSelectedRole(role);
                setActiveScenarioIndex(0);
                setUserAnswer('');
                setEvaluation(null);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedRole === role
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Main Scenario Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Sidebar: Criteria & Scenario Info */}
        <div className="space-y-4 md:col-span-1">
          <div className="p-5 rounded-2xl bg-[#111625] border border-slate-800 space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">Interview Role</span>
              <h4 className="text-sm font-bold text-white mt-0.5">{currentScenario.role}</h4>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Topic Domain</span>
              <span className="text-xs font-medium text-slate-300">{currentScenario.topic}</span>
            </div>

            <hr className="border-slate-800" />

            {/* Target Evaluation Criteria */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-400" /> Evaluation Focus Points
              </span>
              <ul className="space-y-1.5 text-xs text-slate-400">
                {currentScenario.evaluationCriteria.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Main Area: Scenario Question & Answer Input */}
        <div className="space-y-6 md:col-span-2">
          
          <div className="p-6 rounded-2xl bg-[#111625] border border-slate-800 space-y-4">
            
            {/* Scenario Question */}
            <div className="space-y-2">
              <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                Question {activeScenarioIndex + 1} of {filteredScenarios.length}
              </span>
              <h3 className="text-base font-bold text-white leading-relaxed">
                {currentScenario.question}
              </h3>
            </div>

            {/* Answer Input */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="font-semibold text-slate-300">Your Structured Answer</label>
                <span>{userAnswer.length} characters</span>
              </div>

              <textarea
                rows={6}
                placeholder="Type your response here... (For System Design: detail architecture, storage, caching & QPS. For HR: use STAR method - Situation, Task, Action, Result)."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs text-white placeholder-slate-600 outline-none leading-relaxed resize-none"
              />
            </div>

            {/* Evaluation Trigger Button */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleNextScenario}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-colors"
              >
                Skip / Next Question
              </button>

              <button
                onClick={handleEvaluate}
                disabled={evaluating || userAnswer.trim().length < 10}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all"
              >
                {evaluating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AI Interviewer is Scoring...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Submit for AI Score</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* AI EVALUATION RESULTS PANEL */}
          {evaluation && (
            <div className="p-6 rounded-2xl bg-[#0F1423] border border-indigo-500/30 space-y-6 animate-in fade-in slide-in-from-top-4 shadow-xl">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-xl">
                    {evaluation.score}%
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">AI Evaluation Summary</h4>
                    <p className="text-xs text-slate-400">{evaluation.feedback}</p>
                  </div>
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                {/* Points Covered */}
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Key Points Addressed
                  </span>
                  <ul className="space-y-1 text-slate-300">
                    {evaluation.keyPointsCovered.map((kp, i) => (
                      <li key={i}>✓ {kp}</li>
                    ))}
                  </ul>
                </div>

                {/* Missing Points */}
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                  <span className="font-bold text-rose-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Missing / Unaddressed Points
                  </span>
                  <ul className="space-y-1 text-slate-300">
                    {evaluation.missingPoints.map((mp, i) => (
                      <li key={i}>⚠ {mp}</li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Model Answer Sample */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-400" /> Model Answer Benchmark
                </span>
                <p className="text-slate-300 leading-relaxed font-mono text-[11px] whitespace-pre-wrap">
                  {evaluation.suggestedAnswer}
                </p>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
