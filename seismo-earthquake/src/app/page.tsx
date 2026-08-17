'use client';

import React, { useState } from 'react';
import { Activity, BarChart2, Database, Layers, Zap } from 'lucide-react';
import Predictor from '../components/Predictor';
import ClassificationReport from '../components/ClassificationReport';
import EdaDashboard from '../components/EdaDashboard';
import BatchAnalysis from '../components/BatchAnalysis';

export default function EarthquakeHomePage() {
  const [activeTab, setActiveTab] = useState<'predict' | 'report' | 'eda' | 'batch'>('predict');

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950 via-[#111625] to-rose-950 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-600/30 border border-amber-500/30 text-amber-400">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">SeismoAI: Neural Network Seismic Classification</h1>
            <p className="text-xs text-slate-400">Predict earthquake magnitude, shaking risk, P/S waveforms, and spatial hazard bounds</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('predict')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'predict'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Interactive Predictor</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'report'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Model Performance Report</span>
          </button>

          <button
            onClick={() => setActiveTab('eda')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'eda'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>EDA Dataset Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('batch')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'batch'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Batch Analysis</span>
          </button>
        </div>
      </div>

      {/* Active Tab View */}
      {activeTab === 'predict' && <Predictor />}
      {activeTab === 'report' && <ClassificationReport />}
      {activeTab === 'eda' && <EdaDashboard />}
      {activeTab === 'batch' && <BatchAnalysis />}

    </div>
  );
}
