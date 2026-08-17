import React from 'react';

export default function RichterGauge({ magnitude, riskClass }) {
  const mag = parseFloat(magnitude || 3.0);
  const clampedMag = Math.min(Math.max(mag, 0), 9);
  
  // Calculate angle for gauge needle (-90 deg for 0, 90 deg for 9)
  const angle = -90 + (clampedMag / 9) * 180;

  const color = riskClass === 2 ? '#f43f5e' : riskClass === 1 ? '#f59e0b' : '#10b981';

  return (
    <div className="flex flex-col items-center justify-center relative p-2">
      <svg className="w-56 h-32 overflow-visible" viewBox="0 0 200 110">
        
        {/* Arc Background Tracks */}
        {/* Class 0 Arc: Green */}
        <path
          d="M 20 100 A 80 80 0 0 1 65 30"
          fill="none"
          stroke="#10b981"
          strokeWidth="12"
          strokeLinecap="round"
          className="opacity-30"
        />

        {/* Class 1 Arc: Amber */}
        <path
          d="M 69 27 A 80 80 0 0 1 131 27"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="12"
          className="opacity-30"
        />

        {/* Class 2 Arc: Red */}
        <path
          d="M 135 30 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#f43f5e"
          strokeWidth="12"
          strokeLinecap="round"
          className="opacity-30"
        />

        {/* Active Filled Glow Track */}
        <circle cx="100" cy="100" r="80" fill="none" stroke="transparent" />

        {/* Needle Line */}
        <g transform={`rotate(${angle}, 100, 100)`} className="transition-transform duration-700 ease-out">
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="30"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            filter="drop-shadow(0px 0px 6px currentColor)"
          />
          <circle cx="100" cy="100" r="7" fill={color} />
        </g>

        {/* Scale Numbers */}
        <text x="15" y="108" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">0</text>
        <text x="50" y="24" fill="#10b981" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">2.5M</text>
        <text x="135" y="24" fill="#f59e0b" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">4.5M</text>
        <text x="180" y="108" fill="#f43f5e" fontSize="10" fontFamily="JetBrains Mono">9M</text>

      </svg>

      {/* Digital Richter Readout */}
      <div className="text-center -mt-4">
        <span className="text-xs font-mono text-slate-400 block">RICHTER SEISMIC MAGNITUDE</span>
        <span className="text-4xl font-extrabold font-heading text-white tracking-tight" style={{ color }}>
          {mag.toFixed(1)} <span className="text-base font-medium">M</span>
        </span>
      </div>
    </div>
  );
}
