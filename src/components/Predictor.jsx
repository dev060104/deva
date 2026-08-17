import React, { useState, useEffect } from 'react';
import { predictEarthquakeRisk } from '../model/earthquakeModel';
import RichterGauge from './RichterGauge';
import WaveformCanvas from './WaveformCanvas';
import { 
  Activity, AlertTriangle, CheckCircle2, ChevronRight, Compass, 
  HelpCircle, Info, MapPin, RefreshCw, ShieldAlert, Sliders, Zap 
} from 'lucide-react';
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
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#f43f5e', '#f59e0b', '#dc2626']
        });
      }
    }, 150);
  };

  useEffect(() => {
    handlePredict();
  }, [
    formInputs.source_depth_km, 
    formInputs.source_distance_km, 
    formInputs.receiver_elevation_m,
    formInputs.source_magnitude
  ]);

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
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Sci-Fi Hero Header */}
      <div className="glass-card p-6 md:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="scanline"></div>
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-mono text-cyan-400">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>NEURAL COMMAND CENTER • STEAD ANN v2.4</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white font-heading tracking-tight">
            Real-Time Seismic Risk Predictor & Synthesizer
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
            Interactively adjust hypocenter depth, distance, and coordinates to observe real-time neural network class probability outputs and synthetic seismic waveform traces.
          </p>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <span className="text-xs text-slate-400 font-mono mr-1">Seismic Scenarios:</span>
          <button
            onClick={() => applyPreset('low')}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/20 transition-all font-mono"
          >
            Minor (&lt;2.5M)
          </button>
          <button
            onClick={() => applyPreset('moderate')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/20 transition-all font-mono"
          >
            Moderate (2.5-4.5M)
          </button>
          <button
            onClick={() => applyPreset('high')}
            className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-semibold hover:bg-rose-500/20 transition-all font-mono"
          >
            Major (&gt;4.5M)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Interactive Controls Column (7 Cols) */}
        <div className="lg:col-span-7 glass-card p-6 md:p-8 space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
              <Sliders className="w-5 h-5 text-cyan-400" />
              Dynamic Parameter Sliders & Station Inputs
            </h3>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live Calculated
            </span>
          </div>

          <div className="space-y-6">
            
            {/* Sliders for Depth & Distance */}
            <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              
              {/* Focal Depth Slider */}
              <div>
                <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                  <span className="text-slate-300 font-semibold">Focal Depth (km):</span>
                  <span className="text-cyan-400 font-bold text-sm">{formInputs.source_depth_km} km</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="150"
                  step="0.5"
                  value={formInputs.source_depth_km}
                  onChange={(e) => handleInputChange('source_depth_km', e.target.value)}
                  className="slider-thumb"
                />
              </div>

              {/* Distance Slider */}
              <div>
                <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                  <span className="text-slate-300 font-semibold">Epicentral Distance (km):</span>
                  <span className="text-amber-400 font-bold text-sm">{formInputs.source_distance_km} km</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="500"
                  step="0.5"
                  value={formInputs.source_distance_km}
                  onChange={(e) => handleInputChange('source_distance_km', e.target.value)}
                  className="slider-thumb"
                />
              </div>

              {/* Elevation Slider */}
              <div>
                <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                  <span className="text-slate-300 font-semibold">Receiver Elevation (m):</span>
                  <span className="text-emerald-400 font-bold text-sm">{formInputs.receiver_elevation_m} m</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="4000"
                  step="10"
                  value={formInputs.receiver_elevation_m}
                  onChange={(e) => handleInputChange('receiver_elevation_m', e.target.value)}
                  className="slider-thumb"
                />
              </div>

            </div>

            {/* Coordinates Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                  Receiver Station Coordinates
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Lat (°)</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={formInputs.receiver_latitude}
                      onChange={(e) => handleInputChange('receiver_latitude', e.target.value)}
                      className="input-field py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Lon (°)</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={formInputs.receiver_longitude}
                      onChange={(e) => handleInputChange('receiver_longitude', e.target.value)}
                      className="input-field py-2 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                  Source Hypocenter Coordinates
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Src Lat (°)</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={formInputs.source_latitude}
                      onChange={(e) => handleInputChange('source_latitude', e.target.value)}
                      className="input-field py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Src Lon (°)</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={formInputs.source_longitude}
                      onChange={(e) => handleInputChange('source_longitude', e.target.value)}
                      className="input-field py-2 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Magnitude Input */}
            <div className="pt-1">
              <label className="text-xs text-slate-400 block mb-1 font-mono">
                Optional Override Richter Magnitude (M):
              </label>
              <input
                type="number"
                step="0.1"
                value={formInputs.source_magnitude}
                onChange={(e) => handleInputChange('source_magnitude', e.target.value)}
                className="input-field"
                placeholder="Leave blank to use Neural Net estimated magnitude"
              />
            </div>

            {/* Real-time Waveform Canvas Synthesizer */}
            {result && (
              <WaveformCanvas
                magnitude={result.predictedMagnitude}
                depth={formInputs.source_depth_km}
                distance={formInputs.source_distance_km}
              />
            )}

          </div>

        </div>

        {/* Prediction Results Display & Gauge (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {result && (
            <div className={`glass-card p-6 md:p-8 space-y-6 border-l-4 ${
              result.predictedClass === 2 ? 'neon-border-rose border-rose-500' :
              result.predictedClass === 1 ? 'neon-border-amber border-amber-500' :
              'neon-border-emerald border-emerald-500'
            }`}>
              
              {/* Richter Arc Gauge Component */}
              <RichterGauge
                magnitude={result.predictedMagnitude}
                riskClass={result.predictedClass}
              />

              <div className="text-center pt-2 border-t border-slate-800">
                <span className={result.badgeClass}>
                  {result.riskLevel}
                </span>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {result.description}
                </p>
              </div>

              {/* Class Probability Gauges */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                  Neural Net Class Probabilities
                </h4>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-emerald-400 font-semibold">Low Risk (&lt;2.5M)</span>
                    <span className="text-white font-bold">{result.probabilities.low}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${result.probabilities.low}%` }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-amber-400 font-semibold">Moderate Risk (2.5-4.5M)</span>
                    <span className="text-white font-bold">{result.probabilities.moderate}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${result.probabilities.moderate}%` }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-rose-400 font-semibold">High Risk (&gt;4.5M)</span>
                    <span className="text-white font-bold">{result.probabilities.high}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div className="bg-rose-500 h-full transition-all duration-300" style={{ width: `${result.probabilities.high}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Physical Energy & Acceleration */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block font-mono">Seismic Energy</span>
                  <span className="text-xs font-bold text-cyan-300 font-mono mt-0.5 block truncate">
                    {result.metrics.energyTNTKg}
                  </span>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block font-mono">Peak Accel (PGA)</span>
                  <span className="text-xs font-bold text-amber-300 font-mono mt-0.5 block">
                    {result.metrics.pgaG} g
                  </span>
                </div>
              </div>

              {/* Emergency Guidance */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
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
