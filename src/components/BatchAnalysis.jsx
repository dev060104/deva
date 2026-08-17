'use client';

import React, { useState } from 'react';
import { predictEarthquakeRisk, SAMPLE_EARTHQUAKES } from '../model/earthquakeModel';
import { Download, FileSpreadsheet, Play, CheckCircle, RefreshCw, Upload, AlertCircle } from 'lucide-react';

export default function BatchAnalysis() {
  const [batchResults, setBatchResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const generateSampleBatch = () => {
    setIsProcessing(true);

    setTimeout(() => {
      // Create 10 synthetic seismic events
      const syntheticEvents = Array.from({ length: 10 }).map((_, i) => {
        const recLat = (32.5 + Math.random() * 5).toFixed(4);
        const recLon = (-120.0 + Math.random() * 5).toFixed(4);
        const srcLat = (parseFloat(recLat) + (Math.random() - 0.5) * 0.5).toFixed(4);
        const srcLon = (parseFloat(recLon) + (Math.random() - 0.5) * 0.5).toFixed(4);
        const depth = (4 + Math.random() * 25).toFixed(1);
        const distance = (2 + Math.random() * 80).toFixed(1);
        const elevation = Math.round(50 + Math.random() * 900);

        const prediction = predictEarthquakeRisk({
          receiver_latitude: recLat,
          receiver_longitude: recLon,
          receiver_elevation_m: elevation,
          source_latitude: srcLat,
          source_longitude: srcLon,
          source_depth_km: depth,
          source_distance_km: distance
        });

        return {
          id: `BATCH-EVT-${100 + i}`,
          recLat,
          recLon,
          srcLat,
          srcLon,
          depth,
          distance,
          prediction
        };
      });

      setBatchResults(syntheticEvents);
      setIsProcessing(false);
    }, 400);
  };

  const exportCSV = () => {
    if (!batchResults) return;
    const headers = ['Event_ID,Rec_Lat,Rec_Lon,Src_Lat,Src_Lon,Depth_km,Dist_km,Predicted_Magnitude,Predicted_Class,Risk_Level\n'];
    const rows = batchResults.map(item => 
      `${item.id},${item.recLat},${item.recLon},${item.srcLat},${item.srcLon},${item.depth},${item.distance},${item.prediction.predictedMagnitude},${item.prediction.predictedClass},"${item.prediction.riskLevel}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + headers.concat(rows).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `seismic_batch_classification_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Batch Banner */}
      <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs font-mono text-cyan-400">
            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
            <span>AUTOMATED SEISMIC BATCH PROCESSOR</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white font-heading">
            Batch Seismic Classification & Audit Reporting
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Process multiple earthquake events simultaneously. Upload CSV feature files or generate sample seismic event streams for automated risk auditing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={generateSampleBatch}
            disabled={isProcessing}
            className="btn-primary"
          >
            {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isProcessing ? 'Simulating Batch...' : 'Run Sample 10-Event Stream'}</span>
          </button>
        </div>
      </div>

      {/* Upload Zone / Results Table */}
      {!batchResults ? (
        <div className="glass-card p-12 text-center border-2 border-dashed border-slate-800 hover:border-cyan-500/50 transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white font-heading">Upload Seismic Waveform Feature CSV</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mt-1 mb-6">
            CSV must contain receiver lat/lon/elevation, source lat/lon, focal depth, and epicentral distance columns.
          </p>
          <button
            onClick={generateSampleBatch}
            className="btn-secondary"
          >
            Generate & Inspect Sample Data Stream
          </button>
        </div>
      ) : (
        <div className="glass-card p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Batch Classification Complete ({batchResults.length} Events)</h3>
            </div>

            <button
              onClick={exportCSV}
              className="btn-secondary text-xs"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export Batch CSV Audit Report</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase bg-slate-900/90 text-slate-400 font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Event ID</th>
                  <th className="py-3.5 px-4">Hypocenter (Lat/Lon)</th>
                  <th className="py-3.5 px-4">Depth</th>
                  <th className="py-3.5 px-4">Distance</th>
                  <th className="py-3.5 px-4 text-center">Richter M</th>
                  <th className="py-3.5 px-4 text-center">Risk Class</th>
                  <th className="py-3.5 px-4 text-right">High Risk Prob</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {batchResults.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 text-white font-semibold">{item.id}</td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {item.srcLat}°, {item.srcLon}°
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{item.depth} km</td>
                    <td className="py-3.5 px-4 text-slate-300">{item.distance} km</td>
                    <td className="py-3.5 px-4 text-center font-bold text-white text-sm">
                      {item.prediction.predictedMagnitude}
                    </td>
                    <td className="py-3.5 px-4 text-center font-sans">
                      <span className={item.prediction.badgeClass}>
                        {item.prediction.riskLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-rose-400">
                      {item.prediction.probabilities.high}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
