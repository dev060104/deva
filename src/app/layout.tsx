import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { Gift, Sparkles, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Birthday Magic 3D | Trending Wishes & 3D Gift Vision Experience',
  description: 'Immersive WebGL 3D Vision Birthday Celebration. Interactive 3D gift box unboxing, tiered cakes with blowable candles and smoke physics, 3D fireworks, synthesized music-box melodies, and 40+ trending viral wishes.',
  keywords: ['Birthday Wishes', '3D Birthday Gift', 'Three.js 3D Vision', 'Interactive Unboxing', 'Candle Blowing', 'Web Audio Synthesizer', 'Vercel App'],
  authors: [{ name: 'Birthday Magic 3D' }],
  openGraph: {
    title: 'Birthday Magic 3D - Next-Gen 3D Celebration',
    description: 'Unbox 3D gifts, blow candles, trigger 3D fireworks, and send personalized birthday experiences to loved ones.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#070913] text-slate-100 min-h-screen flex flex-col font-sans antialiased selection:bg-pink-500 selection:text-white">
        
        {/* Dedicated Birthday App Header */}
        <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#070913]/85 border-b border-slate-800/80 transition-all">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-0.5 shadow-lg shadow-pink-500/20 group-hover:shadow-pink-500/40 transition-all">
                <div className="w-full h-full bg-[#070913] rounded-[14px] flex items-center justify-center">
                  <Gift className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div>
                <span className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-pink-300 to-purple-300 tracking-tight">
                  BirthdayMagic<span className="text-pink-400">.3D</span>
                </span>
                <span className="block text-[10px] text-slate-400 -mt-1 font-mono tracking-wider uppercase font-semibold">
                  3D Vision & Trending Wishes
                </span>
              </div>
            </Link>

            {/* Quick Action Badges */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
                <span>WebGL 3D Interactive Stage</span>
              </div>

              <a
                href="https://github.com/dev060104/birthday-3d-magic"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="View on GitHub"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
            </div>

          </div>
        </header>

        {/* Main App Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Dedicated Footer */}
        <footer className="w-full border-t border-slate-800/80 bg-[#060810] py-6 text-center text-xs text-slate-500 space-y-1">
          <p className="flex items-center justify-center gap-1.5 text-slate-400">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> using Three.js, Web Audio API & Next.js
          </p>
          <p className="text-[11px] text-slate-600 font-mono">
            Birthday Magic 3D Vision • Ready for Vercel 1-Click Deployment
          </p>
        </footer>

      </body>
    </html>
  );
}
