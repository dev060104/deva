'use client';

import React, { useState, useMemo } from 'react';
import { 
  Sparkles, Copy, Check, Heart, Share2, Send, 
  Flame, Laptop, Crown, Smile, Compass, Music2, RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { birthdayAudio } from '@/lib/birthdayAudio';

export interface WishItem {
  id: string;
  category: 'genz' | 'poetic' | 'tech' | 'royal' | 'roast' | 'soulmate' | 'lofi';
  template: string;
  tags: string[];
  likes: number;
}

const DEFAULT_WISHES: WishItem[] = [
  // Gen Z & Internet Culture
  {
    id: 'gz-1',
    category: 'genz',
    template: 'No cap, another year of serving immaculate main character energy. Slay today and forever, {name}! 💅✨',
    tags: ['Aesthetic', 'Slay', 'Main Character'],
    likes: 4280,
  },
  {
    id: 'gz-2',
    category: 'genz',
    template: 'Level {age} unlocked! Still undisputed, still high key iconic. Happy birthday to the realest! 👑🔥',
    tags: ['Iconic', 'Level Up', 'Realest'],
    likes: 3910,
  },
  {
    id: 'gz-3',
    category: 'genz',
    template: 'Ate and left zero crumbs for {age} years straight. Wishing you an elite vibe check and endless wins today! 🎂💖',
    tags: ['Elite Vibes', 'Zero Crumbs'],
    likes: 3420,
  },
  {
    id: 'gz-4',
    category: 'genz',
    template: 'Living rent-free in everyone\'s hearts since day one. Happy birthday {name}, you absolute trendsetter! 🚀✨',
    tags: ['Trendsetter', 'Viral'],
    likes: 2890,
  },

  // Cinematic & Poetic
  {
    id: 'pt-1',
    category: 'poetic',
    template: 'To a soul woven of constellations and quiet courage: may the universe align in your favor on this golden chapter. 🌌✨',
    tags: ['Constellations', 'Stardust', 'Golden'],
    likes: 5120,
  },
  {
    id: 'pt-2',
    category: 'poetic',
    template: 'In the grand screenplay of time, today is your spotlight scene. Shine without apology, dear {name}. 🎬🕯️',
    tags: ['Screenplay', 'Spotlight', 'Cinematic'],
    likes: 4670,
  },
  {
    id: 'pt-3',
    category: 'poetic',
    template: 'May your days ahead be painted in the gentle warmth of twilight and the infinite promise of morning dew. 🌅🌸',
    tags: ['Twilight', 'Serene', 'Eternal'],
    likes: 3880,
  },
  {
    id: 'pt-4',
    category: 'poetic',
    template: 'A rare celestial phenomenon in a world of ordinary lights. Happy birthday, glowing beacon of joy! 💫🕊️',
    tags: ['Celestial', 'Beacon'],
    likes: 3310,
  },

  // Tech & Cyberpunk
  {
    id: 'tc-1',
    category: 'tech',
    template: 'git commit -m "Leveled up {name} to version {age}.0". Zero breaking changes, infinite feature upgrades! 🚀💻',
    tags: ['Git', 'Dev Life', 'Version Up'],
    likes: 6420,
  },
  {
    id: 'tc-2',
    category: 'tech',
    template: 'while (birthday) { eatCake(); enjoyLife(); ignoreBugs(); } May your runtime be optimal and your coffee infinite! ⚡☕',
    tags: ['Algorithm', 'Infinite Coffee'],
    likes: 5290,
  },
  {
    id: 'tc-3',
    category: 'tech',
    template: 'System diagnostic: {name} operational at 100% bandwidth. High throughput of happiness confirmed! 🤖💾',
    tags: ['Cyber', 'Diagnostics', '100%'],
    likes: 4120,
  },
  {
    id: 'tc-4',
    category: 'tech',
    template: 'Wishing you 0 latency, 99.999% uptime of joy, and all the cloud storage in the universe for your memories! ☁️🔋',
    tags: ['Cloud', 'Zero Latency'],
    likes: 3750,
  },

  // Royal & Luxury VIP
  {
    id: 'ry-1',
    category: 'royal',
    template: 'Excellence isn\'t accidental, it\'s hereditary. Toasting to your billionaire mindset and timeless grace, {name}. 🥂💎',
    tags: ['VIP', 'Luxury', 'Champagne'],
    likes: 4890,
  },
  {
    id: 'ry-2',
    category: 'royal',
    template: 'Pop the Dom Pérignon! Celebrating the finest vintage the world has ever witnessed on your {age}th milestone! 🍾👑',
    tags: ['Dom Pérignon', 'Crown', 'Milestone'],
    likes: 4210,
  },
  {
    id: 'ry-3',
    category: 'royal',
    template: 'To another year of effortless majesty, world-class destinations, and unshakeable empire building! 🏰✨',
    tags: ['Empire', 'World Class'],
    likes: 3640,
  },

  // Savage & Hilarious Roast
  {
    id: 'rs-1',
    category: 'roast',
    template: 'Happy birthday to someone who is smart, funny, gorgeous, and reminds me a lot of myself! 😉🎂',
    tags: ['Humor', 'Sarcasm', 'Mirror'],
    likes: 7100,
  },
  {
    id: 'rs-2',
    category: 'roast',
    template: 'You\'re not old, {name}, you\'re just vintage and increasingly expensive to maintain! 🍷👴',
    tags: ['Vintage', 'Roast', 'Ageless'],
    likes: 5930,
  },
  {
    id: 'rs-3',
    category: 'roast',
    template: 'Scientists confirm: having more birthdays actually makes you live longer! Keep breaking the records! 🧠🎉',
    tags: ['Science Fact', 'Longevity'],
    likes: 4820,
  },
  {
    id: 'rs-4',
    category: 'roast',
    template: 'Another year older, but definitely none the wiser. Stay chaotic, {name}! 🤪💥',
    tags: ['Chaotic', 'Fun'],
    likes: 4410,
  },

  // Soulmate & Deep Connection
  {
    id: 'sm-1',
    category: 'soulmate',
    template: 'Every year with you is my favorite chapter yet. Thank you for making ordinary moments feel like absolute magic. 🌸💌',
    tags: ['Soulmate', 'Magic', 'Deep Love'],
    likes: 6250,
  },
  {
    id: 'sm-2',
    category: 'soulmate',
    template: 'Some souls make the whole world brighter simply by being in it. You are that miracle for me, {name}. 💖💫',
    tags: ['Miracle', 'Cherished'],
    likes: 5670,
  },
  {
    id: 'sm-3',
    category: 'soulmate',
    template: 'Through every high and low, knowing I have your laughter in my world is my greatest gift. Happy birthday! 🥂✨',
    tags: ['Laughter', 'Unconditional'],
    likes: 4980,
  },

  // Lofi & Melodic Beats
  {
    id: 'lf-1',
    category: 'lofi',
    template: 'Warm coffee, soft lofi chords, and another golden spin around the sun. Keep the beautiful harmony playing, {name}. 🎧☕',
    tags: ['Lofi Beats', 'Warmth', 'Chill'],
    likes: 3840,
  },
  {
    id: 'lf-2',
    category: 'lofi',
    template: 'Your life is an incredible vinyl record that never skips. May this year be your smoothest track yet! 🎶📻',
    tags: ['Vinyl', 'Aesthetic', 'Melody'],
    likes: 3410,
  },
];

interface TrendingWishesSectionProps {
  recipientName: string;
  age: string | number;
  onSelectWishFor3D: (wishText: string) => void;
  onOpenShareModal: () => void;
}

export default function TrendingWishesSection({
  recipientName,
  age,
  onSelectWishFor3D,
  onOpenShareModal,
}: TrendingWishesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [remixCount, setRemixCount] = useState(0);

  const categories = [
    { id: 'all', label: 'All Trending', icon: Sparkles },
    { id: 'genz', label: '🔥 Gen Z & Vibes', icon: Flame },
    { id: 'poetic', label: '✨ Constellation Poetry', icon: Compass },
    { id: 'tech', label: '🚀 Tech & Dev', icon: Laptop },
    { id: 'royal', label: '👑 Royal VIP', icon: Crown },
    { id: 'roast', label: '🎭 Savage & Comedy', icon: Smile },
    { id: 'soulmate', label: '💖 Deep Soulmate', icon: Heart },
    { id: 'lofi', label: '🎵 Chill & Lofi', icon: Music2 },
  ];

  const formatWish = (template: string) => {
    const formattedName = recipientName.trim() || 'My Favorite Person';
    const formattedAge = age ? `${age}` : 'Forever Young';
    let text = template.replace(/{name}/g, formattedName).replace(/{age}/g, formattedAge);

    if (remixCount > 0) {
      const sparkles = [' ✨', ' 🌟', ' 🥂', ' 💫', ' 🎂', ' 🎉'];
      text = text + sparkles[remixCount % sparkles.length];
    }
    return text;
  };

  const filteredWishes = useMemo(() => {
    return DEFAULT_WISHES.filter((w) => {
      const matchCat = selectedCategory === 'all' || w.category === selectedCategory;
      const matchSearch =
        w.template.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopyWish = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    birthdayAudio.playChime(950, 0.2);

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#FFD700', '#FF69B4', '#00FFFF'],
    });

    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
    birthdayAudio.playChime(1100, 0.15);
  };

  const handleRemixAll = () => {
    setRemixCount((prev) => prev + 1);
    birthdayAudio.playChime(800, 0.3);
  };

  return (
    <section className="space-y-6 pt-6">
      
      {/* Header & Remix Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
            <span>Curated Viral & Trending Vault</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Trending Birthday Wishes & Captions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Handcrafted for Gen Z aesthetics, cinematic poetry, dev humor, and VIP luxury.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRemixAll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-xs font-semibold text-slate-200 transition-all hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
            title="Inject celebratory sparkles into all wishes"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Sparkle Remix</span>
          </button>

          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-xs font-bold text-white transition-all shadow-lg shadow-pink-500/20 hover:scale-105 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share 3D Gift</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSel = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  birthdayAudio.playChime(650, 0.2);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSel
                    ? 'bg-gradient-to-r from-amber-500 to-pink-600 text-white shadow-lg shadow-pink-500/25 scale-105'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search wishes by keyword, mood, or hashtag (e.g. 'slay', 'git', 'constellation', 'vintage')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-900/70 border border-slate-800 focus:border-pink-500/60 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Wishes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWishes.map((item) => {
          const finalWish = formatWish(item.template);
          const isCopied = copiedId === item.id;
          const isLiked = !!likedMap[item.id];

          return (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/80 hover:border-pink-500/40 transition-all duration-300 flex flex-col justify-between space-y-4 group relative overflow-hidden shadow-xl"
            >
              <div className="space-y-3">
                
                {/* Tags & Category Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleLike(item.id)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-pink-400 transition-colors cursor-pointer"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isLiked ? 'fill-pink-500 text-pink-500 scale-110' : 'text-slate-500'
                      } transition-transform`}
                    />
                    <span>{item.likes + (isLiked ? 1 : 0)}</span>
                  </button>
                </div>

                {/* Wish Content */}
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  {finalWish}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2">
                
                {/* Send into 3D Scene */}
                <button
                  onClick={() => {
                    onSelectWishFor3D(finalWish);
                    birthdayAudio.playChime(850, 0.3);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all hover:scale-105 cursor-pointer"
                  title="Display this message inside the 3D Gift Box"
                >
                  <Send className="w-3 h-3" />
                  <span>Put in 3D Box</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopyWish(item.id, finalWish)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
                    }`}
                    title="Copy to clipboard"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {filteredWishes.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-slate-900/30 border border-slate-800/60 space-y-2">
          <Smile className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No wishes matched your search</h3>
          <p className="text-xs text-slate-500">Try changing keywords or resetting the category filter.</p>
        </div>
      )}

    </section>
  );
}
