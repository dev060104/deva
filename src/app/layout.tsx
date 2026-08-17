import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'QuizMaster AI | The Ultimate Knowledge & Interview Simulator',
  description: 'Master any field of knowledge, practice technical & behavioral interviews, explore live Wikipedia auto-quizzes, and test official vs unofficial myths.',
  keywords: ['AI Quiz', 'System Design Interview', 'Software Engineering Practice', 'Wikipedia Quiz', 'Behavioral Interview', 'Trivia', 'Vercel App'],
  authors: [{ name: 'QuizMaster AI Team' }],
  openGraph: {
    title: 'QuizMaster AI - Universal Knowledge Engine',
    description: 'Dynamic AI-powered quizzes, live Wikipedia parsing, mock interview evaluation, and mythbusters mode.',
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
      <body className="bg-[#0B0F19] text-slate-100 min-h-screen flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
        <Navbar />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
