'use client';

import React, { useState } from 'react';
import { Search, Globe, Sparkles, BookOpen, ExternalLink, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { WikipediaArticle, Question } from '@/lib/types';
import QuizEngine from './QuizEngine';

export default function WikipediaExplorer() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ title: string; description: string }>>([]);
  const [activeArticle, setActiveArticle] = useState<WikipediaArticle | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[] | null>(null);

  const trendingTopics = [
    'Quantum Computing',
    'Artificial Intelligence',
    'French Revolution',
    'Photosynthesis',
    'Apollo 11',
    'Cryptography',
    'James Webb Space Telescope',
    'Neuron'
  ];

  const handleSearch = async (searchTerm?: string) => {
    const target = searchTerm || query;
    if (!target.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/wiki?q=${encodeURIComponent(target)}&action=search`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error('Wiki search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectArticle = async (title: string) => {
    setLoading(true);
    setQuizQuestions(null);
    try {
      const res = await fetch(`/api/wiki?q=${encodeURIComponent(title)}&action=quiz`);
      const data = await res.json();
      if (data.summary) {
        setActiveArticle(data.summary);
      }
      if (data.questions && data.questions.length > 0) {
        setQuizQuestions(data.questions);
      }
    } catch (err) {
      console.error('Wiki quiz fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Search Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950 via-[#111625] to-blue-950 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-600/30 border border-cyan-500/30 text-cyan-400">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Live Wikipedia Knowledge Engine</h2>
            <p className="text-xs text-slate-400">Search any Wikipedia article to extract factual summaries & instant multi-choice quizzes</p>
          </div>
        </div>

        {/* Search Input Box */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search any Wikipedia topic (e.g. Quantum Physics, Roman Empire, DNA)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs text-white placeholder-slate-500 outline-none"
            />
          </div>

          <button
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-cyan-600/30 transition-all shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Search</span>
          </button>
        </div>

        {/* Trending Suggestions */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Trending Wikipedia Topics</span>
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => {
                  setQuery(topic);
                  handleSelectArticle(topic);
                }}
                className="px-3 py-1 rounded-full bg-slate-900/80 hover:bg-cyan-600/20 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-200 text-xs transition-all"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results List */}
      {searchResults.length > 0 && !activeArticle && (
        <div className="p-6 rounded-2xl bg-[#111625] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Matching Wikipedia Articles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {searchResults.map((res, i) => (
              <button
                key={i}
                onClick={() => handleSelectArticle(res.title)}
                className="p-4 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 text-left transition-all space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">{res.title}</h4>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{res.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Article Summary Header & Auto-Quiz Player */}
      {activeArticle && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#111625] border border-cyan-500/30 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Wikipedia Summary</span>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{activeArticle.title}</span>
                  <a
                    href={activeArticle.contentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </h3>
              </div>

              <button
                onClick={() => {
                  setActiveArticle(null);
                  setQuizQuestions(null);
                }}
                className="text-xs text-slate-400 hover:text-white px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg"
              >
                Search Another
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              {activeArticle.extract}
            </p>
          </div>

          {/* Active Quiz for this Wikipedia article */}
          {quizQuestions && quizQuestions.length > 0 && (
            <QuizEngine
              questions={quizQuestions}
              title={`Wikipedia Quiz: ${activeArticle.title}`}
              category="wikipedia-live"
              onReset={() => {
                setActiveArticle(null);
                setQuizQuestions(null);
              }}
            />
          )}
        </div>
      )}

    </div>
  );
}
