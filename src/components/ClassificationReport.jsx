import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend, Cell 
} from 'recharts';
import { 
  CLASSIFICATION_REPORT_DATA, CONFUSION_MATRIX, OPTIMIZER_COMPARISON, 
  NEURON_TUNING_DATA, FEATURE_CORRELATIONS 
} from '../model/earthquakeModel';
import { Award, CheckCircle2, Cpu, FileText, Layers, LineChart as LineChartIcon, ShieldCheck, Zap } from 'lucide-react';

export default function ClassificationReport() {
  const [activeMetricTab, setActiveMetricTab] = useState('performance');

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Banner Summary */}
      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Model Validated
              </span>
              <span className="text-xs text-slate-400 font-mono">Dataset: STEAD (1,058,954 Events)</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white font-heading">
              Seismic Classification Report & Model Evaluation
            </h2>
            <p className="text-slate-300 text-sm max-w-3xl mt-2 leading-relaxed">
              Evaluation metrics for 3-class earthquake magnitude risk predictor (Class 0: &lt;2.5M, Class 1: 2.5-4.5M, Class 2: &gt;4.5M) trained using 3-layer Dense Artificial Neural Network with Dropout Regularization.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/90 p-4 rounded-xl border border-slate-800 shrink-0">
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
          <span className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg font-mono">
            Test Ratio: 70% Train / 20% Val / 10% Test
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

              {/* Summary Rows */}
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

      {/* Hyperparameter Optimization Curves */}
      <div className="glass-card p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Hyperparameter & Optimizer Tuning History</h3>
              <p className="text-xs text-slate-400">SGD vs Adam vs Adagrad across training epochs & hidden neurons</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveMetricTab('performance')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMetricTab === 'performance' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Optimizer Curves
            </button>
            <button
              onClick={() => setActiveMetricTab('neurons')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMetricTab === 'neurons' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Neuron Scaling (8-128)
            </button>
          </div>
        </div>

        {activeMetricTab === 'performance' ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={OPTIMIZER_COMPARISON} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="epoch" stroke="#64748b" tick={{ fontSize: 12 }} label={{ value: 'Epoch', position: 'insideBottom', offset: -5, fill: '#64748b' }} />
                <YAxis stroke="#64748b" domain={[80, 93]} tick={{ fontSize: 12 }} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }} />
                <Legend verticalAlign="top" height={36} />
                <Line type="monotone" dataKey="adamAcc" name="Adam Optimizer (Best)" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="sgdAcc" name="SGD (lr=0.01, momentum=0.9)" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="adagradAcc" name="Adagrad" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={NEURON_TUNING_DATA} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="neurons" stroke="#64748b" tick={{ fontSize: 12 }} label={{ value: 'Hidden Layer Neurons', position: 'insideBottom', offset: -5, fill: '#64748b' }} />
                <YAxis stroke="#64748b" domain={[80, 95]} tick={{ fontSize: 12 }} unit="%" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem' }} />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="testAcc" name="Test Accuracy (%)" fill="#818cf8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="valAcc" name="Validation Accuracy (%)" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

    </div>
  );
}
