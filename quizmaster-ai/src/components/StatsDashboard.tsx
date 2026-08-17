'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Flame, Award, BookOpen, Bookmark, History, 
  Download, Upload, CheckCircle2, Trophy, Percent, Clock
} from 'lucide-react';
import { getUserStats, saveUserStats } from '@/lib/storage';
import { UserStats } from '@/lib/types';
import { BUILTIN_QUESTIONS } from '@/lib/questionBank';

export default function StatsDashboard() {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    setStats(getUserStats());
  }, []);

  if (!stats) return null;

  const totalAnswered = stats.totalQuestionsAnswered || 0;
  const totalCorrect = stats.totalCorrect || 0;
  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const bookmarkedQuestions = BUILTIN_QUESTIONS.filter(q => stats.bookmarkedQuestionIds.includes(q.id));

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stats, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `quizmaster_stats_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          saveUserStats(parsed);
          setStats(parsed);
          alert('User statistics imported successfully!');
        } catch (err) {
          alert('Invalid JSON file format.');
        }
      };
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Top Banner Stats */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-[#111625] to-purple-950 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600/30 border border-indigo-500/30 text-indigo-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Performance Analytics & Mastery</h2>
              <p className="text-xs text-slate-400">Track accuracy, category progress, streaks & review bookmarks</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all"
              title="Export Stats JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer transition-all">
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Quizzes Taken
            </span>
            <span className="text-2xl font-extrabold text-white">{stats.totalQuizzesTaken}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-emerald-400" /> Accuracy Rate
            </span>
            <span className="text-2xl font-extrabold text-emerald-400">{overallAccuracy}%</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Active Streak
            </span>
            <span className="text-2xl font-extrabold text-amber-400">{stats.currentStreak} Days</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-purple-400" /> Total Correct
            </span>
            <span className="text-2xl font-extrabold text-purple-300">{totalCorrect} / {totalAnswered}</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Category Breakdown & Bookmarked Questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Category Scores */}
        <div className="p-6 rounded-2xl bg-[#111625] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-400" /> Category Breakdown
          </h3>

          {Object.keys(stats.categoryScores).length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No quizzes completed yet. Start a session to build your profile!</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(stats.categoryScores).map(([cat, data]) => {
                const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-300 font-medium">
                      <span className="capitalize">{cat.replace(/-/g, ' ')}</span>
                      <span className="text-indigo-400 font-bold">{acc}% ({data.correct}/{data.total})</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${acc}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* History Log */}
        <div className="p-6 rounded-2xl bg-[#111625] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-purple-400" /> Recent Quiz Activity
          </h3>

          {stats.history.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No history records found.</p>
          ) : (
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {stats.history.map((item) => (
                <div key={item.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-white line-clamp-1">{item.title}</h4>
                    <span className="text-[10px] text-slate-500">{item.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-indigo-400">{item.score} / {item.total}</span>
                    <span className="block text-[10px] text-slate-400">{Math.round((item.score / item.total) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Bookmarked Questions Section */}
      {bookmarkedQuestions.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#111625] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" /> Bookmarked Study Questions ({bookmarkedQuestions.length})
          </h3>

          <div className="space-y-3">
            {bookmarkedQuestions.map((q) => (
              <div key={q.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <span className="text-[10px] text-indigo-400 font-bold uppercase">{q.topic || q.category}</span>
                <p className="font-semibold text-white">{q.question}</p>
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                  <strong>Correct Answer:</strong> {q.options[q.correctAnswer]}
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">{q.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
