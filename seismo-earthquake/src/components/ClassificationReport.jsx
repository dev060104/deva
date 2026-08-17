'use client';

import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend, Cell 
} from 'recharts';
import { 
  CLASSIFICATION_REPORT_DATA, CONFUSION_MATRIX, OPTIMIZER_COMPARISON, 
  NEURON_TUNING_DATA, FEATURE_CORRELATIONS 
} from '../model/earthquakeModel';
import { Award, CheckCircle2, Cpu, FileText, Layers, LineChart as LineChartIcon, ShieldCheck, Sliders, Zap } from 'lucide-react';

export default function ClassificationReport() {
  const [activeMetricTab, setActiveMetricTab] = useState('performance');

  // Neural Network Architecture Playground Interactive State
  const [layersCount, setLayersCount] = useState(3);
  const [activationFunc, setActivationFunc] = useState('relu');
  const [learningRate, setLearningRate] = useState(0.01);
  const [optimizer, setOptimizer] = useState('Adam');

  // Simulated playground curve data
  const playData = Array.from({ length: 6 }).map((_, i) => {
    const epoch = i + 1;
    const baseAcc = optimizer === 'Adam' ? 88.0 : optimizer === 'SGD' ? 85.0 : 83.0;
    const rateFactor = learningRate === 0.01 ? 1.0 : learningRate > 0.01 ? 0.92 : 0.95;
    const layerBonus = layersCount * 0.8;
    const acc = Math.min(96.5, (baseAcc + epoch * 1.5 + layerBonus) * rateFactor).toFixed(1);
    const loss = Math.max(0.2, (0.6 - epoch * 0.06 - layerBonus * 0.02) * rateFactor).toFixed(3);
    return { epoch, acc: parseFloat(acc), loss: parseFloat(loss) };
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner Summary */}
      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        <div className="scanline"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" /> Model Validated
              </span>
              <span className="text-xs text-slate-400 font-mono">Dataset: STEAD (1,058,954 Events)</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white font-heading">
              Seismic Classification Report & Neural Playground
            </h2>
            <p className="text-slate-300 text-sm max-w-3xl mt-2 leading-relaxed">
              Complete evaluation metrics for 3-class earthquake magnitude risk predictor (Class 0: &lt;2.5M, Class 1: 2.5-4.5M, Class 2: &gt;4.5M) trained using 3-layer Dense Neural Network with Dropout Regularization.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 shrink-0">
            <div className="text-center px-3">
              <p className="text-xs text-slate-400 uppercase font-mono tracking-wider">Test Accuracy</p>
              <p className="text-3xl font-extrabold text-cyan-400 font-heading">91.6%</p>
            </div>
            <div className="h-10 w-[1px] bg-slate-800"></div>
            <div className="text-center px-3">
              <p className="text-xs text-slate-400 uppercase font-mono tracking-wider">Test Loss</p>
              <p className="text-3xl font-extrabold text-indigo-400 font-heading">0.360</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Classification Report Table */}
      <div className="glass-card p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Classification Performance Matrix</h3>
              <p className="text-xs text-slate-400">Precision, Recall, F1-Score & Support breakdown by Risk Class</p>
            </div>
          </div>
          <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg font-mono border border-slate-800">
            Split Ratio: 70% Train / 20% Val / 10% Test
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-900/90 text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 rounded-l-lg">Risk Category / Class</th>
                <th className="py-3.5 px-4 text-center">Precision</th>
                <th className="py-3.5 px-4 text-center">Recall</th>
                <th className="py-3.5 px-4 text-center">F1-Score</th>
                <th className="py-3.5 px-4 text-right rounded-r-lg">Support (Events)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {CLASSIFICATION_REPORT_DATA.classes.map((cls) => (
                <tr key={cls.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-4 font-semibold text-white flex items-center gap-3">
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: cls.color }}
                    ></span>
                    {cls.name}
                  </td>
                  <td className="py-4 px-4 text-center font-mono text-cyan-300 font-medium">
                    {(cls.precision * 100).toFixed(1)}%
                  </td>
                  <td className="py-4 px-4 text-center font-mono text-emerald-300 font-medium">
                    {(cls.recall * 100).toFixed(1)}%
                  </td>
                  <td className="py-4 px-4 text-center font-mono text-amber-300 font-bold">
                    {(cls.f1Score * 100).toFixed(1)}%
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-slate-300">
                    {cls.support.toLocaleString()}
                  </td>
                </tr>
              ))}

              <tr className="bg-slate-900/40 font-semibold border-t-2 border-slate-800">
                <td className="py-3.5 px-4 text-slate-300 font-mono">Macro Average</td>
                <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                  {(CLASSIFICATION_REPORT_DATA.macroAvg.precision * 100).toFixed(1)}%
                </td>
                <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                  {(CLASSIFICATION_REPORT_DATA.macroAvg.recall * 100).toFixed(1)}%
                </td>
                <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                  {(CLASSIFICATION_REPORT_DATA.macroAvg.f1Score * 100).toFixed(1)}%
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-slate-400">
                  {CLASSIFICATION_REPORT_DATA.totalTestSamples.toLocaleString()}
                </td>
              </tr>

              <tr className="bg-slate-900/80 font-bold">
                <td className="py-4 px-4 text-cyan-400 font-mono">Weighted Average</td>
                <td className="py-4 px-4 text-center font-mono text-cyan-400">
                  {(CLASSIFICATION_REPORT_DATA.weightedAvg.precision * 100).toFixed(1)}%
                </td>
                <td className="py-4 px-4 text-center font-mono text-cyan-400">
                  {(CLASSIFICATION_REPORT_DATA.weightedAvg.recall * 100).toFixed(1)}%
                </td>
                <td className="py-4 px-4 text-center font-mono text-cyan-400">
                  {(CLASSIFICATION_REPORT_DATA.weightedAvg.f1Score * 100).toFixed(1)}%
                </td>
                <td className="py-4 px-4 text-right font-mono text-cyan-400">
                  {CLASSIFICATION_REPORT_DATA.totalTestSamples.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Neural Architecture Playground */}
      <div className="glass-card p-6 md:p-8 space-y-6 border border-cyan-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Interactive Neural Net Hyperparameter Tuning</h3>
              <p className="text-xs text-slate-400">Simulate neural layer depth, activation functions & learning rate</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-mono px-2">Interactive Mode</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 text-xs font-mono">
            <div>
              <label className="text-slate-300 block mb-1.5 font-semibold">Optimizer Function:</label>
              <div className="grid grid-cols-3 gap-2">
                {['Adam', 'SGD', 'Adagrad'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setOptimizer(opt)}
                    className={`py-2 rounded-lg font-bold transition-all ${
                      optimizer === opt ? 'bg-cyan-600 text-white shadow-sm' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-slate-300 block mb-1.5 font-semibold">Activation Function:</label>
              <div className="grid grid-cols-3 gap-2">
                {['relu', 'sigmoid', 'tanh'].map(act => (
                  <button
                    key={act}
                    onClick={() => setActivationFunc(act)}
                    className={`py-2 rounded-lg font-bold transition-all ${
                      activationFunc === act ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1 font-semibold">
                <span>Dense Layers Depth:</span>
                <span className="text-cyan-400 font-bold">{layersCount} Layers</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={layersCount}
                onChange={(e) => setLayersCount(parseInt(e.target.value))}
                className="slider-thumb"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1 font-semibold">
                <span>Learning Rate (α):</span>
                <span className="text-amber-400 font-bold">{learningRate}</span>
              </div>
              <input
                type="range"
                min="0.001"
                max="0.05"
                step="0.001"
                value={learningRate}
                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                className="slider-thumb"
              />
            </div>
          </div>

          {/* Interactive Chart (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <span className="text-xs font-mono text-slate-400 mb-2 block">
              Simulated Learning Curve ({optimizer}, {activationFunc}, {layersCount} Layers, α={learningRate})
            </span>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={playData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="epoch" stroke="#64748b" tick={{ fontSize: 11 }} label={{ value: 'Epoch', position: 'insideBottom', offset: -2, fill: '#64748b' }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[80, 100]} unit="%" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }} />
                  <Line type="monotone" dataKey="acc" name="Simulated Accuracy (%)" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>

      {/* Grid: Confusion Matrix & Feature Importance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Confusion Matrix */}
        <div className="glass-card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Confusion Matrix Heatmap</h3>
              <p className="text-xs text-slate-400">True vs Predicted Class distribution</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono text-slate-400 mb-2">
              <div></div>
              <div className="text-emerald-400 font-semibold">Pred Low</div>
              <div className="text-amber-400 font-semibold">Pred Mod</div>
              <div className="text-rose-400 font-semibold">Pred High</div>
            </div>

            {CONFUSION_MATRIX.map((row, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                <div className="flex items-center justify-start text-slate-300 font-sans text-xs font-medium pr-2">
                  {row.actual}
                </div>
                <div className={`p-4 rounded-xl flex flex-col justify-center ${idx === 0 ? 'cm-cell-diagonal' : 'cm-cell-off'}`}>
                  <span className="text-sm font-bold">{row.predLow.toLocaleString()}</span>
                  <span className="text-[10px] opacity-70">
                    {((row.predLow / (row.predLow + row.predMod + row.predHigh)) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className={`p-4 rounded-xl flex flex-col justify-center ${idx === 1 ? 'cm-cell-diagonal' : 'cm-cell-off'}`}>
                  <span className="text-sm font-bold">{row.predMod.toLocaleString()}</span>
                  <span className="text-[10px] opacity-70">
                    {((row.predMod / (row.predLow + row.predMod + row.predHigh)) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className={`p-4 rounded-xl flex flex-col justify-center ${idx === 2 ? 'cm-cell-diagonal' : 'cm-cell-off'}`}>
                  <span className="text-sm font-bold">{row.predHigh.toLocaleString()}</span>
                  <span className="text-[10px] opacity-70">
                    {((row.predHigh / (row.predLow + row.predMod + row.predHigh)) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Key Finding:</strong> Strong diagonal concentration confirms high predictive sensitivity. Class 0 (&lt;2.5M) achieved 94% recall with negligible false positives into High Risk.
            </span>
          </div>
        </div>

        {/* Feature Importance */}
        <div className="glass-card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Feature Importance Weights</h3>
              <p className="text-xs text-slate-400">Relative impact of seismic parameters on classification</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FEATURE_CORRELATIONS} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 12 }} unit="%" />
                <YAxis dataKey="feature" type="category" stroke="#94a3b8" tick={{ fontSize: 11 }} width={140} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#fff' }} 
                  formatter={(value) => [`${value}% Importance`, 'Impact Weight']}
                />
                <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
                  {FEATURE_CORRELATIONS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index < 2 ? '#38bdf8' : index < 4 ? '#818cf8' : '#64748b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
