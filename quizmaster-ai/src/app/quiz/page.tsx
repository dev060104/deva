'use client';

import React, { useState } from 'react';
import QuizEngine from '@/components/QuizEngine';
import { BUILTIN_QUESTIONS } from '@/lib/questionBank';
import { CATEGORIES } from '@/lib/categories';

export default function QuizPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredQuestions = selectedCategory === 'all'
    ? BUILTIN_QUESTIONS
    : BUILTIN_QUESTIONS.filter(q => q.category === selectedCategory);

  const selectedMeta = CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div className="space-y-6">
      
      {/* Category selector bar */}
      <div className="flex overflow-x-auto pb-2 gap-2 border-b border-slate-800/80">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          All Topics ({BUILTIN_QUESTIONS.length})
        </button>

        {CATEGORIES.filter(c => c.type !== 'wikipedia' && c.type !== 'custom').map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <QuizEngine
        questions={filteredQuestions}
        title={selectedCategory === 'all' ? 'Universal Knowledge Challenge' : selectedMeta?.name || 'Quiz'}
        category={selectedCategory}
      />
    </div>
  );
}
