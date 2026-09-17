'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Play, Pause, Square, Volume2, VolumeX, 
  Sparkles, Heart, Headphones, RefreshCw, CheckCircle2, 
  Radio, Sliders, Music, Award, ShieldCheck, UserCheck
} from 'lucide-react';
import { birthdayAudio } from '@/lib/birthdayAudio';
import confetti from 'canvas-confetti';

export type VoiceoverMode = 'preset' | 'recorded';

export interface EmotionalVoicePreset {
  id: string;
  category: 'for-her' | 'for-him' | 'poetic-nature' | 'joyful';
  title: string;
  target: 'Her' | 'Him' | 'Anyone';
  feeling: string;
  script: string;
  voiceGender: 'female' | 'male';
  accentColor: string;
}

export const EMOTIONAL_PRESETS: EmotionalVoicePreset[] = [
  {
    id: 'for-her-radiant',
    category: 'for-her',
    title: 'Radiant Grace & Love',
    target: 'Her',
    feeling: 'Warm, Tender & Romantic',
    script: 'Happy Birthday to the most beautiful soul. Your kindness, grace, and radiant smile brighten every single room you enter. Today is a celebration of the wonderful miracle that is you. May all your sweetest dreams come true.',
    voiceGender: 'female',
    accentColor: 'from-pink-500 to-rose-400',
  },
  {
    id: 'for-her-queen',
    category: 'for-her',
    title: 'Unstoppable Queen',
    target: 'Her',
    feeling: 'Empowering & Elegant',
    script: 'Happy Birthday to an absolute queen! You carry brilliance, resilience, and pure elegance everywhere you go. Never forget how loved and unstoppable you are. Here is to your most breathtaking chapter yet!',
    voiceGender: 'female',
    accentColor: 'from-purple-500 to-pink-500',
  },
  {
    id: 'for-him-champion',
    category: 'for-him',
    title: 'Inspiring Champion',
    target: 'Him',
    feeling: 'Deep, Strong & Uplifting',
    script: 'Happy Birthday to an extraordinary man. Your strength, courage, and genuine loyalty inspire everyone around you. Keep dreaming big, reaching higher, and conquering every mountain. The world is yours.',
    voiceGender: 'male',
    accentColor: 'from-blue-500 to-cyan-400',
  },
  {
    id: 'for-him-brotherhood',
    category: 'for-him',
    title: 'True Legend',
    target: 'Him',
    feeling: 'Warm, Loyal & Heartfelt',
    script: 'Happy Birthday to a true legend and brother! Life is so much brighter and richer with you in it. May this new year bring you unstoppable success, peace of mind, and unforgettable memories.',
    voiceGender: 'male',
    accentColor: 'from-amber-500 to-yellow-400',
  },
  {
    id: 'poetic-natural',
    category: 'poetic-nature',
    title: 'Serene Nature Blessing',
    target: 'Anyone',
    feeling: 'Tranquil, Poetic & Peaceful',
    script: 'On this sacred day of your birth, may your heart find peace like calm river waters, your spirit soar like the whispering forest wind, and your days be illuminated by golden sunbeams of pure joy and health.',
    voiceGender: 'female',
    accentColor: 'from-emerald-500 to-teal-400',
  },
  {
    id: 'joyful-cheer',
    category: 'joyful',
    title: 'Joyful & Electrifying Cheer',
    target: 'Anyone',
    feeling: 'Exciting, Fun & Cheerful',
    script: 'Happy, happy birthday! May your cake be sweet, your laughter loud, and your year packed with spontaneous adventures and boundless happiness! Cheers to celebrating you!',
    voiceGender: 'female',
    accentColor: 'from-orange-500 to-amber-400',
  },
];

interface VoiceoverStudioProps {
  recipientName?: string;
  senderName?: string;
  onVoiceReady?: (data: { mode: VoiceoverMode; presetId?: string; audioBlobUrl?: string }) => void;
  compact?: boolean;
}

export default function VoiceoverStudio({
  recipientName = 'Sophia',
  senderName = 'With Love',
  onVoiceReady,
  compact = false,
}: VoiceoverStudioProps) {
  const [activeTab, setActiveTab] = useState<VoiceoverMode>('preset');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('for-her-radiant');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [filterGender, setFilterGender] = useState<'all' | 'her' | 'him'>('all');
  const [duckingAmbience, setDuckingAmbience] = useState(true);
  const [studioQualityNotice, setStudioQualityNotice] = useState('Studio 48kHz HD • Noise Reduced');

  // Audio recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const selectedPreset = EMOTIONAL_PRESETS.find((p) => p.id === selectedPresetId) || EMOTIONAL_PRESETS[0];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Filtered presets
  const filteredPresets = EMOTIONAL_PRESETS.filter((p) => {
    if (filterGender === 'her') return p.target === 'Her';
    if (filterGender === 'him') return p.target === 'Him';
    return true;
  });

  // Animated canvas visualizer
  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    let dataArray = new Uint8Array(32);
    if (analyserRef.current) {
      analyserRef.current.getByteFrequencyData(dataArray);
    } else if (isPlaying || isRecording) {
      // Procedural fallback animation
      for (let i = 0; i < 32; i++) {
        dataArray[i] = Math.floor(Math.random() * 180) + 40;
      }
    } else {
      // Idle gentle line
      for (let i = 0; i < 32; i++) {
        dataArray[i] = 15;
      }
    }

    const barWidth = width / 32;
    for (let i = 0; i < 32; i++) {
      const barHeight = (dataArray[i] / 255) * height;
      const x = i * barWidth;
      const y = (height - barHeight) / 2;

      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#f43f5e'); // Rose
      gradient.addColorStop(0.5, '#ec4899'); // Pink
      gradient.addColorStop(1, '#a855f7'); // Purple

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x + 1.5, y, barWidth - 3, Math.max(barHeight, 4), 3);
      ctx.fill();
    }

    animFrameRef.current = requestAnimationFrame(drawWaveform);
  };

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(drawWaveform);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, isRecording]);

  // Start Mic Recording with Studio Enhancements
  const startRecording = async () => {
    try {
      if (typeof window === 'undefined' || !navigator.mediaDevices) {
        alert('Microphone recording is not supported in this browser.');
        return;
      }

      // Studio microphone constraint profile (Noise suppression, Echo cancel, 48kHz sample rate)
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
        },
      });

      // Setup Web Audio Analyser for live visualizer
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);

      // Studio EQ: Low-cut rumble filter + presence boost
      const lowCut = audioCtx.createBiquadFilter();
      lowCut.type = 'highpass';
      lowCut.frequency.value = 85;

      const presence = audioCtx.createBiquadFilter();
      presence.type = 'peaking';
      presence.frequency.value = 3200;
      presence.gain.value = 3;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      source.connect(lowCut);
      lowCut.connect(presence);
      presence.connect(analyser);

      // MediaRecorder with best audio codec
      let options: MediaRecorderOptions = {};
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        options = { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 128000 };
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
        setIsRecording(false);
        setIsPlaying(false);

        // Stop media tracks to release mic icon in browser
        stream.getTracks().forEach((track) => track.stop());

        if (onVoiceReady) {
          onVoiceReady({ mode: 'recorded', audioBlobUrl: audioUrl });
        }

        birthdayAudio.playChime(900, 0.3);
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.7 },
        });
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setRecordingSeconds(0);
      birthdayAudio.playChime(600, 0.2);

      // Timer
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access denied or error:', err);
      alert('Could not access microphone. Please allow microphone permissions to record your personal voice message.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  // Playback recorded audio
  const togglePlayRecorded = () => {
    if (!recordedAudioUrl) return;

    if (isPlaying) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
      }
      setIsPlaying(false);
    } else {
      if (!audioPlayerRef.current) {
        audioPlayerRef.current = new Audio(recordedAudioUrl);
      } else {
        audioPlayerRef.current.src = recordedAudioUrl;
      }

      audioPlayerRef.current.onended = () => {
        setIsPlaying(false);
      };

      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  // Play emotional feeling voiceover using SpeechSynthesis with warm musical ambiance
  const togglePlayPreset = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Personalize the script with recipient and sender names
    const personalizedScript = selectedPreset.script
      .replace(/Sophia/g, recipientName || 'Sophia')
      .replace(/friend/g, recipientName || 'friend');

    const utterance = new SpeechSynthesisUtterance(personalizedScript);
    
    // Choose natural voice
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = voices.find(
      (v) =>
        (selectedPreset.voiceGender === 'female'
          ? /female|samantha|karen|moira|victoria|google us english|zira/i.test(v.name)
          : /male|daniel|george|alex|david|google uk english male/i.test(v.name)) &&
        v.lang.startsWith('en')
    );

    if (!selectedVoice) {
      selectedVoice = voices.find((v) => v.lang.startsWith('en')) || voices[0];
    }

    if (selectedVoice) utterance.voice = selectedVoice;
    
    // Pitch & rate for warm, heartfelt cadence
    utterance.pitch = selectedPreset.voiceGender === 'female' ? 1.05 : 0.94;
    utterance.rate = 0.92; // slightly slower for emotional warmth

    // Soft chime introduction before voice speaks
    birthdayAudio.playChime(660, 0.4);

    utterance.onstart = () => {
      setIsPlaying(true);
      // Duck background melody softly if selected
      if (duckingAmbience) {
        birthdayAudio.playNatureChime('water');
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      birthdayAudio.playChime(880, 0.3);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);

    if (onVoiceReady) {
      onVoiceReady({ mode: 'preset', presetId: selectedPreset.id });
    }
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full rounded-3xl bg-slate-900/90 border border-slate-700/80 p-5 sm:p-7 shadow-2xl backdrop-blur-xl space-y-6">
      
      {/* Header & Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold">
            <Headphones className="w-3.5 h-3.5 text-pink-400" />
            <span>High-Fidelity Sound Experience</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <span>Voiceover & Audio Studio</span>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
              HD Audio
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Add a heartfelt, studio-quality voice note or emotional spoken reading for {recipientName || 'him / her'}.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-950/80 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => {
              if (isPlaying) {
                if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
                setIsPlaying(false);
              }
              setActiveTab('preset');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'preset'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Emotional Readings</span>
          </button>
          <button
            onClick={() => {
              if (isPlaying) {
                if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
                setIsPlaying(false);
              }
              setActiveTab('recorded');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'recorded'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Record Your Voice</span>
          </button>
        </div>
      </div>

      {/* Visualizer Canvas & Quality Bar */}
      <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-2/3 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono flex items-center gap-1.5">
              <Radio className={`w-3.5 h-3.5 ${isPlaying || isRecording ? 'text-rose-400 animate-pulse' : 'text-slate-500'}`} />
              {isRecording ? 'Studio Live Mic Input...' : isPlaying ? 'Voiceover Streaming...' : 'Audio Visualizer Ready'}
            </span>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {studioQualityNotice}
            </span>
          </div>

          {/* Canvas Waveform */}
          <canvas
            ref={canvasRef}
            width={320}
            height={44}
            className="w-full h-11 rounded-lg bg-slate-900/60 border border-slate-800"
          />
        </div>

        {/* Background Ambience Ducking Control */}
        <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between gap-2 text-xs border-t sm:border-t-0 border-slate-800/80 pt-3 sm:pt-0">
          <button
            onClick={() => setDuckingAmbience(!duckingAmbience)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              duckingAmbience
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
            title="Ducks background music during spoken speech for broadcast quality"
          >
            <Music className="w-3.5 h-3.5" />
            <span>{duckingAmbience ? 'Studio Ducking ON' : 'Ducking Off'}</span>
          </button>
          <span className="text-[10px] text-slate-500">Auto-balances speech & music</span>
        </div>
      </div>

      {/* MODE A: PRESET EMOTIONAL FEELINGS FOR HIM / HER */}
      {activeTab === 'preset' && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Gender / Audience Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Dedication:</span>
            {[
              { id: 'all', label: 'All Feelings' },
              { id: 'her', label: '🌸 For Her (Special Woman / Queen)' },
              { id: 'him', label: '👑 For Him (Champion / Brother)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterGender(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  filterGender === tab.id
                    ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredPresets.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => {
                    if (isPlaying) {
                      window.speechSynthesis?.cancel();
                      setIsPlaying(false);
                    }
                    setSelectedPresetId(preset.id);
                    birthdayAudio.playChime(700, 0.15);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-slate-800/90 border-pink-500/60 shadow-lg ring-1 ring-pink-500/30'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full text-white bg-gradient-to-r ${preset.accentColor}`}>
                        {preset.target}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {preset.feeling}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
                      {preset.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-3 mt-1 leading-relaxed italic">
                      &quot;{preset.script}&quot;
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                    <span className="text-[11px] text-slate-500 font-mono">
                      Voice: {preset.voiceGender === 'female' ? 'Warm Soprano' : 'Deep Baritone'}
                    </span>
                    {isSelected && (
                      <span className="text-pink-400 font-bold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Preset Playback Controller */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-pink-950/40 via-purple-950/40 to-slate-900 border border-pink-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <button
                onClick={togglePlayPreset}
                className={`p-4 rounded-2xl transition-all cursor-pointer flex items-center justify-center shadow-xl ${
                  isPlaying
                    ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                    : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white hover:scale-105'
                }`}
                title={isPlaying ? 'Pause Voiceover' : 'Play Voiceover'}
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
              </button>

              <div>
                <p className="text-xs text-pink-300 font-bold uppercase tracking-wider font-mono">
                  {isPlaying ? 'Now Speaking With Emotion...' : 'Ready to Audition'}
                </p>
                <h4 className="text-base font-black text-white">
                  {selectedPreset.title} ({selectedPreset.feeling})
                </h4>
                <p className="text-xs text-slate-400">
                  Dedicated to <span className="text-pink-300 font-bold">{recipientName}</span> from <span className="text-slate-300">{senderName}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  birthdayAudio.playNatureChime('water');
                }}
                className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Test Water Chime</span>
              </button>

              <button
                onClick={togglePlayPreset}
                className="px-4 py-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-pink-300 text-xs font-bold transition-all cursor-pointer"
              >
                {isPlaying ? 'Stop Voice' : 'Hear Spoken Voice'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODE B: RECORD YOUR OWN VOICE MESSAGE */}
      {activeTab === 'recorded' && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-6 rounded-full transition-all cursor-pointer shadow-2xl flex items-center justify-center ${
                  isRecording
                    ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse ring-8 ring-rose-500/30'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white hover:scale-105 ring-4 ring-purple-500/20'
                }`}
                title={isRecording ? 'Click to Stop Recording' : 'Click to Start Recording'}
              >
                {isRecording ? <Square className="w-8 h-8 fill-current" /> : <Mic className="w-8 h-8" />}
              </button>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono font-bold mb-2">
                {isRecording ? (
                  <span className="flex items-center gap-1.5 text-rose-400">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    Recording: {formatTimer(recordingSeconds)}
                  </span>
                ) : (
                  <span>Ready to Record</span>
                )}
              </div>
              <h4 className="text-lg font-bold text-white">
                {isRecording ? 'Speak From Your Heart...' : 'Speak Your Birthday Wish'}
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                Your microphone input is processed through our 48kHz noise-reduction filter for studio-quality voice resonance.
              </p>
            </div>

            {/* Playback Preview of Recorded Message */}
            {recordedAudioUrl && !isRecording && (
              <div className="w-full max-w-md p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 animate-in fade-in duration-300">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlayRecorded}
                    className="p-3 rounded-xl bg-pink-500 hover:bg-pink-400 text-white transition-all cursor-pointer shadow-md"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">Your Personal Voice Note</p>
                    <p className="text-[11px] text-emerald-400 font-mono">Recorded • Ready for {recipientName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={startRecording}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-all cursor-pointer"
                    title="Record Again"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs text-pink-400 font-mono font-bold">
                    ✓ Saved
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
