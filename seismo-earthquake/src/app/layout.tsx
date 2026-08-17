import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SeismoAI | Earthquake Classification & Seismic Hazard Predictor',
  description: 'Neural network classification & regression engine for earthquake magnitude estimation, shaking risk, and P/S seismic wave analysis.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#0B0F19] text-slate-100 min-h-screen flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-white">
        <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0B0F19]/80 border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center font-bold text-white shadow-lg shadow-amber-500/20">
                🌋
              </div>
              <div>
                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-amber-200">
                  Seismo<span className="text-amber-400">AI</span>
                </span>
                <span className="block text-[10px] text-slate-400 -mt-1 font-medium tracking-wider uppercase">
                  Earthquake Hazard Predictor
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              Live Neural Network
            </span>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        <footer className="w-full bg-[#0B0F19] border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} SeismoAI Earthquake Hazard Classifier.
        </footer>
      </body>
    </html>
  );
}
