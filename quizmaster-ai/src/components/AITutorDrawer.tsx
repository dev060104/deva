'use client';

import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, Loader2, HelpCircle } from 'lucide-react';
import { Question } from '@/lib/types';
import { askAITutor } from '@/lib/aiEngine';
import { getUserSettings } from '@/lib/storage';

interface AITutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question | null;
}

export default function AITutorDrawer({ isOpen, onClose, question }: AITutorDrawerProps) {
  const [userQuery, setUserQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([]);

  if (!isOpen || !question) return null;

  const handleSend = async () => {
    if (!userQuery.trim() || loading) return;

    const queryText = userQuery.trim();
    setUserQuery('');
    setMessages((prev) => [...prev, { sender: 'user', text: queryText }]);
    setLoading(true);

    const settings = getUserSettings();
    try {
      const response = await askAITutor(question, queryText, settings.apiKey);
      setMessages((prev) => [...prev, { sender: 'ai', text: response }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Apologies, I encountered an error answering your prompt. Please try asking again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const presetQuestions = [
    'Explain why the correct option is right in simple terms.',
    'Give me a real-world software/engineering example of this.',
    'What are the common edge cases or trade-offs here?'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0F1423] border-l border-slate-800 h-full flex flex-col shadow-2xl text-slate-100">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-md shadow-indigo-600/30">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">AI Tutor Assistant</h3>
              <p className="text-[11px] text-slate-400">Ask anything about this question</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Question Context Summary */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800/80 space-y-1.5 text-xs">
          <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Context Question</span>
          <p className="font-medium text-slate-200 line-clamp-2">{question.question}</p>
        </div>

        {/* Message Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {messages.length === 0 && (
            <div className="space-y-4 pt-4">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-start gap-3">
                <Bot className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-slate-300 leading-relaxed">
                  Hi! I am your AI Master Tutor. Have a question about why an answer choice was wrong or want a deeper real-world breakdown? Ask me below!
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-slate-400" /> Suggested Prompts
                </span>
                <div className="space-y-1.5">
                  {presetQuestions.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setUserQuery(preset);
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-indigo-600/20 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-indigo-200 transition-all text-xs"
                    >
                      "{preset}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-purple-600/30 text-purple-300 border border-purple-500/30'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-indigo-400 text-xs py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>AI Tutor is thinking...</span>
            </div>
          )}
        </div>

        {/* Input Box */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask AI Tutor a question..."
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs text-white placeholder-slate-500 outline-none"
            />
            <button
              onClick={handleSend}
              disabled={loading || !userQuery.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white shadow-md transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
