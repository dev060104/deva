import React, { useState, useEffect } from 'react';
import { predictEarthquakeRisk, FEATURE_SCALERS } from '../model/earthquakeModel';
import { Activity, AlertTriangle, CheckCircle2, ChevronRight, Compass, HelpCircle, Info, MapPin, RefreshCw, ShieldAlert, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Predictor() {
  const [formInputs, setFormInputs] = useState({
    receiver_latitude: '32.8889',
    receiver_longitude: '-117.1051',
    receiver_elevation_m: '150.0',
    source_latitude: '33.1240',
    source_longitude: '-116.4520',
    source_depth_km: '12.5',
    source_distance_km: '45.2',
    source_magnitude: ''
  });

  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handlePredict = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const res = predictEarthquakeRisk(formInputs);
      setResult(res);
      setIsCalculating(false);

      if (res.predictedClass === 2) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#ef4444', '#f59e0b', '#dc2626']
        });
      }
    }, 200);
  };

  useEffect(() => {
    handlePredict();
  }, []);

  const handleInputChange = (field, val) => {
    setFormInputs(prev => ({ ...prev, [field]: val }));
  };

  const applyPreset = (preset) => {
    let newInputs = {};
    if (preset === 'low') {
      newInputs = {
        receiver_latitude: '35.40',
        receiver_longitude: '-117.80',
        receiver_elevation_m: '850',
        source_latitude: '35.42',
        source_longitude: '-117.82',
        source_depth_km: '9.6',
        source_distance_km: '3.5',
        source_magnitude: '1.8'
      };
    } else if (preset === 'moderate') {
      newInputs = {
        receiver_latitude: '33.55',
        receiver_longitude: '-116.67',
        receiver_elevation_m: '1100',
        source_latitude: '33.58',
        source_longitude: '-116.63',
        source_depth_km: '14.1',
        source_distance_km: '7.2',
        source_magnitude: '3.6'
      };
    } else {
      newInputs = {
        receiver_latitude: '35.89',
        receiver_longitude: '-120.43',
        receiver_elevation_m: '320',
        source_latitude: '35.90',
        source_longitude: '-120.45',
        source_depth_km: '8.2',
        source_distance_km: '4.8',
        source_magnitude: '5.4'
      };
    }
    setFormInputs(newInputs);
    setTimeout(() => {
      const res = predictEarthquakeRisk(newInputs);
      setResult(res);
    }, 100);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Page Title & Presets */}
      <div className="glass-card p-6 md:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-mono text-cyan-400">
            <Activity className="w-4 h-4 animate-spin text-cyan-400" />
            <span>REAL-TIME INFERENCE ENGINE</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white font-heading">
            Live Seismic Event Predictor & Risk Classification
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Input receiver station and earthquake hypocenter parameters to calculate risk classification probabilities and magnitude estimates.
          </p>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-mono mr-1">Quick Presets:</span>
          <button
            onClick={() => applyPreset('low')}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/20 transition-all"
          >
            Minor (M &lt; 2.5)
          </button>
          <button
            onClick={() => applyPreset('moderate')}
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/20 transition-all"
          >
            Moderate (2.5 - 4.5M)
          </button>
          <button
            onClick={() => applyPreset('high')}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-semibold hover:bg-rose-500/20 transition-all"
          >
            Major (M &gt; 4.5)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Inputs (7 Cols) */}
        <div className="lg:col-span-7 glass-card p-6 md:p-8 space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
              <Compass className="w-5 h-5 text-cyan-400" />
              Seismic Station & Hypocenter Inputs
            </h3>
            <button
              onClick={() => {
                setFormInputs({
                  receiver_latitude: '32.8889',
                  receiver_longitude: '-117.1051',
                  receiver_elevation_m: '150.0',
                  source_latitude: '33.1240',
                  source_longitude: '-116.4520',
                  source_depth_km: '12.5',
                  source_distance_km: '45.2',
                  source_magnitude: ''
                });
              }}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-mono"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <div className="space-y-5">
            
            {/* Receiver Station Coordinates */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                1. Receiver Station Location
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Latitude (°)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formInputs.receiver_latitude}
                    onChange={(e) => handleInputChange('receiver_latitude', e.target.value)}
                    className="input-field"
                    placeholder="32.8889"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Longitude (°)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formInputs.receiver_longitude}
                    onChange={(e) => handleInputChange('receiver_longitude', e.target.value)}
                    className="input-field"
                    placeholder="-117.1051"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Elevation (m)</label>
                  <input
                    type="number"
                    step="1"
                    value={formInputs.receiver_elevation_m}
                    onChange={(e) => handleInputChange('receiver_elevation_m', e.target.value)}
                    className="input-field"
                    placeholder="150"
                  />
                </div>
              </div>
            </div>

            {/* Hypocenter Location */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                2. Earthquake Source / Hypocenter
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Source Latitude (°)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formInputs.source_latitude}
                    onChange={(e) => handleInputChange('source_latitude', e.target.value)}
                    className="input-field"
                    placeholder="33.1240"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Source Longitude (°)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formInputs.source_longitude}
                    onChange={(e) => handleInputChange('source_longitude', e.target.value)}
                    className="input-field"
                    placeholder="-116.4520"
                  />
                </div>
              </div>
            </div>

            {/* Depth & Epicentral Distance */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                3. Depth & Epicentral Distance
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Focal Depth (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formInputs.source_depth_km}
                    onChange={(e) => handleInputChange('source_depth_km', e.target.value)}
                    className="input-field"
                    placeholder="12.5"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Epicentral Distance (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formInputs.source_distance_km}
                    onChange={(e) => handleInputChange('source_distance_km', e.target.value)}
                    className="input-field"
                    placeholder="45.2"
                  />
                </div>
              </div>
            </div>

            {/* Optional Magnitude Input */}
            <div className="pt-2">
              <label className="text-xs text-slate-400 block mb-1 font-mono">
                Optional Known Magnitude (Richter Scale M):
              </label>
              <input
                type="number"
                step="0.1"
                value={formInputs.source_magnitude}
                onChange={(e) => handleInputChange('source_magnitude', e.target.value)}
                className="input-field"
                placeholder="Leave blank to let Neural Net estimate magnitude automatically"
              />
            </div>

          </div>

          <button
            onClick={handlePredict}
            disabled={isCalculating}
            className="w-full btn-primary justify-center text-base py-3.5 mt-4"
          >
            {isCalculating ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Zap className="w-5 h-5 fill-current" />
            )}
            <span>{isCalculating ? 'Processing Neural Network...' : 'Run Seismic AI Classification'}</span>
          </button>

        </div>

        {/* Prediction Results Display (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {result && (
            <div className="glass-card p-6 md:p-8 space-y-6 border-l-4" style={{ borderColor: result.colorTheme }}>
              
              {/* Risk Level Badge & Magnitude */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={result.badgeClass}>
                    {result.riskLevel}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Class ID: {result.predictedClass}</span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-extrabold font-heading text-white tracking-tight">
                    {result.predictedMagnitude}
                  </span>
                  <span className="text-xl text-slate-300 font-semibold font-heading">
                    Richter M
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {result.description}
                </p>
              </div>

              {/* Probabilities Breakdown */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                  Neural Net Class Probabilities
                </h4>

                {/* Low Risk Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-emerald-400 font-medium">Class 0: Low (&lt;2.5M)</span>
                    <span className="text-slate-300 font-bold">{result.probabilities.low}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-500"
                      style={{ width: `${result.probabilities.low}%` }}
                    ></div>
                  </div>
                </div>

                {/* Moderate Risk Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-amber-400 font-medium">Class 1: Moderate (2.5-4.5M)</span>
                    <span className="text-slate-300 font-bold">{result.probabilities.moderate}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="bg-amber-500 h-full transition-all duration-500"
                      style={{ width: `${result.probabilities.moderate}%` }}
                    ></div>
                  </div>
                </div>

                {/* High Risk Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-rose-400 font-medium">Class 2: High (&gt;4.5M)</span>
                    <span className="text-slate-300 font-bold">{result.probabilities.high}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="bg-rose-500 h-full transition-all duration-500"
                      style={{ width: `${result.probabilities.high}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Physical Metrics */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block font-mono">Seismic Energy</span>
                  <span className="text-sm font-bold text-cyan-300 font-mono mt-0.5 block">
                    {result.metrics.energyTNTKg}
                  </span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block font-mono">Peak Accel (PGA)</span>
                  <span className="text-sm font-bold text-amber-300 font-mono mt-0.5 block">
                    {result.metrics.pgaG} g
                  </span>
                </div>
              </div>

              {/* Emergency Guidance */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-cyan-400" />
                  Recommended Protocols
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {result.safetyGuidance.map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
