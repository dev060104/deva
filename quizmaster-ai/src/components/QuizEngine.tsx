'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Clock, Heart, Bookmark, Sparkles, CheckCircle2, XCircle, 
  ArrowRight, RotateCcw, Award, ShieldAlert, BookOpen, Layers,
  ChevronRight, Brain, Lightbulb
} from 'lucide-react';
import { Question, GameMode } from '@/lib/types';
import { recordQuizCompletion, toggleBookmarkQuestion, getUserStats } from '@/lib/storage';
import AITutorDrawer from './AITutorDrawer';

interface QuizEngineProps {
  questions: Question[];
  title: string;
  category: string;
  initialMode?: GameMode;
  onReset?: () => void;
}

export default function QuizEngine({
  questions,
  title,
  category,
  initialMode = 'standard',
  onReset
}: QuizEngineProps) {
  const [mode, setMode] = useState<GameMode>(initialMode);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false); // Flashcard mode

  const currentQuestion = questions[currentIndex];

  // Timer Effect for Timed Mode or Standard Mode
  useEffect(() => {
    if (isCompleted || isAnswerSubmitted || mode === 'flashcard') return;

    setTimerSeconds(30);
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, isAnswerSubmitted, isCompleted, mode]);

  // Check bookmark status
  useEffect(() => {
    if (currentQuestion) {
      const stats = getUserStats();
      setIsBookmarked(stats.bookmarkedQuestionIds.includes(currentQuestion.id));
    }
  }, [currentIndex, currentQuestion]);

  const handleTimeOut = () => {
    if (isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    setUserAnswers((prev) => [...prev, null]);
    if (mode === 'survival') {
      setLives((l) => {
        const next = l - 1;
        if (next <= 0) setTimeout(() => finishQuiz(score, questions.length), 800);
        return next;
      });
    }
  };

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
    setIsAnswerSubmitted(true);

    const isCorrect = index === currentQuestion.correctAnswer;
    setUserAnswers((prev) => [...prev, index]);

    if (isCorrect) {
      setScore((s) => s + 1);
    } else if (mode === 'survival') {
      setLives((l) => {
        const next = l - 1;
        if (next <= 0) setTimeout(() => finishQuiz(score, questions.length), 800);
        return next;
      });
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length && (mode !== 'survival' || lives > 0)) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setIsFlipped(false);
    } else {
      finishQuiz(score + (selectedOption === currentQuestion.correctAnswer ? 1 : 0), questions.length);
    }
  };

  const finishQuiz = (finalScore: number, total: number) => {
    setIsCompleted(true);
    recordQuizCompletion(title, category, finalScore, total);
    
    // Trigger confetti if high score
    if (finalScore / total >= 0.7) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleToggleBookmark = () => {
    if (currentQuestion) {
      const newState = toggleBookmarkQuestion(currentQuestion.id);
      setIsBookmarked(newState);
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-4 max-w-lg mx-auto">
        <Brain className="w-12 h-12 text-slate-500 mx-auto animate-bounce" />
        <h3 className="text-lg font-bold text-white">No questions available in this session</h3>
        <button
          onClick={onReset}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-all"
        >
          Return to Categories
        </button>
      </div>
    );
  }

  // QUIZ COMPLETED SUMMARY VIEW
  if (isCompleted) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-300">
        <div className="bg-[#111625] border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl" />

          {/* Trophy Badge */}
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-xl shadow-indigo-500/30">
            <div className="w-full h-full bg-[#0B0F19] rounded-[22px] flex items-center justify-center">
              <Award className="w-10 h-10 text-amber-400" />
            </div>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Quiz Completed</span>
            <h2 className="text-2xl font-black text-white mt-1">{title}</h2>
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium block">Total Score</span>
              <span className="text-2xl font-extrabold text-white">{score} / {questions.length}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium block">Accuracy</span>
              <span className={`text-2xl font-extrabold ${percentage >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {percentage}%
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium block">Performance</span>
              <span className="text-sm font-bold text-indigo-300 mt-1 block">
                {percentage >= 90 ? 'Mastery 🔥' : percentage >= 70 ? 'Proficient 👏' : 'Keep Practicing 💪'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setIsCompleted(false);
                setCurrentIndex(0);
                setScore(0);
                setLives(3);
                setIsAnswerSubmitted(false);
                setSelectedOption(null);
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>
            {onReset && (
              <button
                onClick={onReset}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all"
              >
                <span>Explore Other Topics</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Top Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#111625] border border-slate-800/80">
        
        {/* Game Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
          {(['standard', 'survival', 'flashcard'] as GameMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-all ${
                mode === m
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          {/* Survival Lives */}
          {mode === 'survival' && (
            <div className="flex items-center gap-1 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-4 h-4 ${i < lives ? 'fill-rose-500 text-rose-500' : 'text-slate-700'}`}
                />
              ))}
            </div>
          )}

          {/* Timer Countdown */}
          {mode !== 'flashcard' && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono ${
              timerSeconds <= 5 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse' 
                : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{timerSeconds}s</span>
            </div>
          )}

          {/* Question Index Counter */}
          <span className="text-slate-400">
            {currentIndex + 1} <span className="text-slate-600">/</span> {questions.length}
          </span>
        </div>
      </div>

      {/* FLASHCARD MODE VIEW */}
      {mode === 'flashcard' ? (
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="min-h-[320px] p-8 rounded-3xl bg-[#111625] border border-slate-800 hover:border-indigo-500/50 cursor-pointer shadow-xl flex flex-col justify-between transition-all duration-300 group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-indigo-400 font-semibold">
              <Layers className="w-4 h-4" /> Flashcard (Click to flip)
            </span>
            <span>{isFlipped ? 'Answer Side' : 'Question Side'}</span>
          </div>

          <div className="my-auto py-6 text-center space-y-4">
            {!isFlipped ? (
              <h3 className="text-xl font-bold text-white leading-relaxed">{currentQuestion.question}</h3>
            ) : (
              <div className="space-y-3 animate-in fade-in">
                <div className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold">
                  Correct Answer: {currentQuestion.options[currentQuestion.correctAnswer]}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}
          </div>

          <div className="text-center text-xs text-slate-500 font-medium">
            Tap anywhere to flip card 🔄
          </div>
        </div>
      ) : (
        /* STANDARD / SURVIVAL QUIZ VIEW */
        <div className="bg-[#111625] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative">
          
          {/* Question Meta Header */}
          <div className="flex items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-semibold">
                {currentQuestion.topic || currentQuestion.category}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 text-[11px] font-medium">
                {currentQuestion.difficulty}
              </span>
              {currentQuestion.isOfficial === false && (
                <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> Mythbusters
                </span>
              )}
            </div>

            {/* Bookmark button */}
            <button
              onClick={handleToggleBookmark}
              className={`p-2 rounded-xl border transition-all ${
                isBookmarked
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Bookmark Question"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
            </button>
          </div>

          {/* Question Text */}
          <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
            {currentQuestion.question}
          </h3>

          {/* Answer Options Grid */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQuestion.correctAnswer;
              
              let btnStyle = "bg-slate-900/80 border-slate-800 text-slate-200 hover:border-indigo-500/50 hover:bg-slate-800/60";

              if (isAnswerSubmitted) {
                if (isCorrect) {
                  btnStyle = "bg-emerald-500/15 border-emerald-500/50 text-emerald-200 font-semibold shadow-md shadow-emerald-500/10";
                } else if (isSelected) {
                  btnStyle = "bg-rose-500/15 border-rose-500/50 text-rose-200 font-semibold";
                } else {
                  btnStyle = "bg-slate-900/40 border-slate-800/50 text-slate-500 opacity-60";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-start justify-between gap-3 ${btnStyle}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center text-xs font-mono shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {isAnswerSubmitted && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-in zoom-in" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-in zoom-in" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Callout & AI Tutor Drawer Trigger */}
          {isAnswerSubmitted && (
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-400" /> Explanation
                </span>

                <button
                  onClick={() => setIsTutorOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-semibold transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Ask AI Tutor</span>
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Bottom Action bar */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span className="text-xs text-slate-400 font-medium">
              Score: <strong className="text-white">{score}</strong>
            </span>

            <button
              onClick={handleNext}
              disabled={!isAnswerSubmitted}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>{currentIndex + 1 === questions.length ? 'Finish Session' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* AI Tutor Drawer */}
      <AITutorDrawer
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
        question={currentQuestion}
      />
    </div>
  );
}
