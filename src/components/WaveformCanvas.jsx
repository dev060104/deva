import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Activity, Radio } from 'lucide-react';

export default function WaveformCanvas({ magnitude, depth, distance }) {
  const canvasRef = useRef(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);

  // 1. Draw Real-time Seismic Waveform Traces on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let offset = 0;
    const mag = parseFloat(magnitude || 3.0);
    const dist = parseFloat(distance || 50);

    // Calculate P-wave arrival sample and S-wave arrival sample
    const pArrival = Math.max(30, Math.min(180, Math.round(dist * 1.5)));
    const sArrival = Math.max(pArrival + 40, Math.min(360, Math.round(dist * 3.2)));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark seismic grid lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw P-arrival & S-arrival vertical marker lines
      ctx.setLineDash([4, 4]);
      
      // P-wave line (Cyan)
      ctx.strokeStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(pArrival, 0);
      ctx.lineTo(pArrival, canvas.height);
      ctx.stroke();

      // S-wave line (Rose)
      ctx.strokeStyle = '#f43f5e';
      ctx.beginPath();
      ctx.moveTo(sArrival, 0);
      ctx.lineTo(sArrival, canvas.height);
      ctx.stroke();

      ctx.setLineDash([]); // Reset dash

      // Marker text
      ctx.font = '10px "JetBrains Mono"';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('P-Arrival', pArrival + 4, 14);

      ctx.fillStyle = '#f43f5e';
      ctx.fillText('S-Arrival', sArrival + 4, 14);

      // Draw Vertical Channel Waveform Z (Cyan glow)
      const centerY = canvas.height / 2;
      const amplitude = Math.min(canvas.height / 2.5, Math.pow(mag, 1.8) * 3.5);

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = mag > 4.5 ? '#f43f5e' : mag >= 2.5 ? '#f59e0b' : '#38bdf8';

      for (let x = 0; x < canvas.width; x++) {
        let noise = 0;
        
        // P-wave tremor section
        if (x >= pArrival && x < sArrival) {
          const decay = Math.exp(-(x - pArrival) / 60);
          noise = (Math.sin((x + offset) * 0.3) * 0.4 + (Math.random() - 0.5) * 0.6) * (amplitude * 0.35) * decay;
        } 
        // S-wave main tremor shock section
        else if (x >= sArrival) {
          const decay = Math.exp(-(x - sArrival) / 120);
          noise = (Math.sin((x + offset) * 0.45) * 0.7 + (Math.random() - 0.5) * 0.8) * amplitude * decay;
        } 
        // Background noise floor
        else {
          noise = (Math.random() - 0.5) * 2;
        }

        const y = centerY + noise;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      offset += 1.5;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [magnitude, depth, distance]);

  // 2. Synthesize Earthquake Tremor Audio using Web Audio API
  const toggleSeismicAudio = () => {
    if (isPlayingAudio) {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
      }
      setIsPlayingAudio(false);
    } else {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        // Sub-bass oscillator for low-frequency seismic rumble
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const mag = parseFloat(magnitude || 3.0);
        // Base pitch: lower frequency (30Hz - 70Hz) for larger magnitude earthquakes
        const freq = Math.max(30, 80 - mag * 7);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Lowpass filter to simulate ground attenuation
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(120, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0);

        osc.start();
        osc.stop(ctx.currentTime + 3.0);
        oscRef.current = osc;

        setIsPlayingAudio(true);
        setTimeout(() => setIsPlayingAudio(false), 3000);
      } catch (err) {
        console.error('Audio Synthesis Error:', err);
      }
    }
  };

  return (
    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
            Real-Time Waveform Seismogram (Channel BHZ)
          </span>
        </div>

        <button
          onClick={toggleSeismicAudio}
          className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg border font-mono transition-all ${
            isPlayingAudio 
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
              : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white hover:border-slate-500'
          }`}
        >
          {isPlayingAudio ? <Volume2 className="w-3.5 h-3.5 text-rose-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span>{isPlayingAudio ? 'Rumbling...' : 'Listen Tremor Audio'}</span>
        </button>
      </div>

      {/* HTML5 Canvas */}
      <div className="relative overflow-hidden rounded-lg border border-slate-800">
        <canvas
          ref={canvasRef}
          width={500}
          height={120}
          className="w-full h-32 block bg-slate-950"
        />
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span>Time Scale: 100 Samples/sec</span>
        <span>Sampling Rate: 50 Hz</span>
      </div>
    </div>
  );
}
