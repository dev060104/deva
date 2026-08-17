import React, { useState } from 'react';
import { SAMPLE_EARTHQUAKES, FEATURE_SCALERS } from '../model/earthquakeModel';
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import { MapPin, Globe, Database, Info, Layers, BarChart2, Radio } from 'lucide-react';

export default function EdaDashboard() {
  const [selectedEq, setSelectedEq] = useState(SAMPLE_EARTHQUAKES[0]);

  // Scatter plot data for depth vs distance
  const scatterData = SAMPLE_EARTHQUAKES.map(eq => ({
    x: eq.distance,
    y: eq.depth,
    z: eq.magnitude,
    name: eq.name,
    category: eq.category
  }));

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* EDA Header */}
      <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-mono text-cyan-400">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>STEAD SEISMIC DATASET EDA</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white font-heading">
            Exploratory Data Analysis & Spatial GIS Visualization
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-3xl">
            Analysis of 1,058,954 earthquake local waveform events recorded across high-resolution broadband seismic receiver networks.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-slate-800">
          <Radio className="w-4 h-4 text-rose-500 animate-ping" />
          <div className="text-xs">
            <p className="text-slate-400 font-mono">Active Stations</p>
            <p className="text-sm font-bold text-white">1,09C TA / BH Network</p>
          </div>
        </div>
      </div>

      {/* Grid: Interactive Seismic Map Simulation & Event Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Map Simulation Box (7 Cols) */}
        <div className="lg:col-span-7 glass-card p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">California Fault Line & Station Map</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Coordinates: ~32°N to 38°N</span>
            </div>

            {/* Canvas Map Graphics */}
            <div className="relative w-full h-80 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden p-4 flex flex-col justify-between">
              
              {/* Grid background pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

              {/* Simulated Fault Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                <path d="M 50 300 Q 150 200 280 120 T 450 20" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" fill="none" />
                <path d="M 100 320 Q 220 220 340 180 T 520 80" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
              </svg>

              {/* Plotted Seismic Pins */}
              <div className="relative w-full h-full z-10">
                {SAMPLE_EARTHQUAKES.map((eq) => {
                  // Normalize lat/lon to percentage coordinates
                  const topPct = 100 - ((eq.recLat - 32) / 6) * 100;
                  const leftPct = ((eq.recLon + 123) / 8) * 100;
                  const isSelected = selectedEq.id === eq.id;

                  return (
                    <button
                      key={eq.id}
                      onClick={() => setSelectedEq(eq)}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all group ${
                        isSelected ? 'z-30 scale-125' : 'z-20 hover:scale-110'
                      }`}
                      style={{ top: `${Math.min(Math.max(topPct, 10), 90)}%`, left: `${Math.min(Math.max(leftPct, 10), 90)}%` }}
                    >
                      <div className="relative flex items-center justify-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            eq.class === 2 
                              ? 'bg-rose-500/30 text-rose-400 border border-rose-500' 
                              : eq.class === 1 
                              ? 'bg-amber-500/30 text-amber-400 border border-amber-500' 
                              : 'bg-emerald-500/30 text-emerald-400 border border-emerald-500'
                          }`}
                        >
                          <MapPin className="w-3.5 h-3.5 fill-current" />
                        </div>
                        {isSelected && (
                          <span className="absolute -top-7 whitespace-nowrap bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded border border-slate-700 font-mono shadow-md">
                            {eq.name} ({eq.magnitude}M)
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Map Legend */}
              <div className="relative z-10 flex items-center justify-between text-xs font-mono bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-slate-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Low (&lt;2.5M)</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Mod (2.5-4.5M)</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> High (&gt;4.5M)</span>
                </div>
                <span className="text-[10px] text-slate-500">Click marker to inspect event</span>
              </div>

            </div>
          </div>
        </div>

        {/* Selected Event Inspector (5 Cols) */}
        <div className="lg:col-span-5 glass-card p-6 md:p-8 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white font-heading">Event Details Inspector</h3>
              <span className="text-xs text-cyan-400 font-mono">{selectedEq.id}</span>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-bold text-white">{selectedEq.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    selectedEq.class === 2 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                    selectedEq.class === 1 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {selectedEq.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Magnitude: {selectedEq.magnitude} Richter</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-2">
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Receiver Station</span>
                  <span className="text-slate-200 font-semibold mt-1 block">
                    {selectedEq.recLat}°N, {selectedEq.recLon}°W
                  </span>
                </div>

                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Hypocenter Location</span>
                  <span className="text-slate-200 font-semibold mt-1 block">
                    {selectedEq.srcLat}°N, {selectedEq.srcLon}°W
                  </span>
                </div>

                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Focal Depth</span>
                  <span className="text-cyan-400 font-semibold mt-1 block">
                    {selectedEq.depth} km
                  </span>
                </div>

                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Epicentral Dist.</span>
                  <span className="text-amber-400 font-semibold mt-1 block">
                    {selectedEq.distance} km
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400 leading-relaxed">
            <span className="text-slate-200 font-semibold block mb-1">Seismic Data Preprocessing Note:</span>
            Features are standardized using Z-score formula: <code className="text-cyan-400 font-mono">z = (x - μ) / σ</code> before feeding into Neural Net.
          </div>
        </div>

      </div>

      {/* Feature Scaling Specifications Table */}
      <div className="glass-card p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">STEAD Feature Normalization Parameters</h3>
            <p className="text-xs text-slate-400 font-mono">Z-Score Mean (μ) and Standard Deviation (σ) used during training</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(FEATURE_SCALERS).map(([key, scaler]) => (
            <div key={key} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 block font-mono">{scaler.label}</span>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-xs text-slate-400 font-mono">Mean (μ): <strong className="text-white">{scaler.mean}</strong></span>
                <span className="text-xs text-slate-400 font-mono">Std (σ): <strong className="text-cyan-400">{scaler.std}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
