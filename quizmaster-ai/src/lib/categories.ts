export interface CategoryMeta {
  id: string;
  name: string;
  description: string;
  iconName: string; // Lucide icon identifier
  color: string; // Tailwind gradient/color class
  badge: string;
  type: 'interview' | 'trivia' | 'wikipedia' | 'custom' | 'mythbusters';
  questionCount: number;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'system-design',
    name: 'System Design & Architecture',
    description: 'High-availability systems, scalability, load balancing, caching, databases & microservices.',
    iconName: 'Server',
    color: 'from-blue-600 to-indigo-600',
    badge: 'Tech Interview',
    type: 'interview',
    questionCount: 25,
  },
  {
    id: 'software-eng',
    name: 'Software Engineering & Coding',
    description: 'Data Structures, Algorithms, React, Node.js, Python, Clean Code & Design Patterns.',
    iconName: 'Code',
    color: 'from-violet-600 to-purple-600',
    badge: 'Tech Interview',
    type: 'interview',
    questionCount: 30,
  },
  {
    id: 'hr-behavioral',
    name: 'HR & Behavioral Interview',
    description: 'STAR method questions, leadership scenarios, teamwork, conflict resolution & compensation.',
    iconName: 'Users',
    color: 'from-emerald-600 to-teal-600',
    badge: 'Career Prep',
    type: 'interview',
    questionCount: 20,
  },
  {
    id: 'pm-case',
    name: 'Product & Business Case',
    description: 'Product strategy, metrics, user growth, prioritization frameworks & consulting case studies.',
    iconName: 'Briefcase',
    color: 'from-amber-600 to-orange-600',
    badge: 'Business Interview',
    type: 'interview',
    questionCount: 18,
  },
  {
    id: 'wikipedia-live',
    name: 'Wikipedia Knowledge Engine',
    description: 'Type any article on Wikipedia to fetch real-time facts & auto-generate custom quizzes.',
    iconName: 'Globe',
    color: 'from-cyan-600 to-blue-600',
    badge: 'Live Wiki Engine',
    type: 'wikipedia',
    questionCount: 1000,
  },
  {
    id: 'myth-vs-fact',
    name: 'Official Facts vs Urban Myths',
    description: 'Distinguish official facts from widespread rumors, tech lore, science myths & historical inaccuracies.',
    iconName: 'ShieldAlert',
    color: 'from-pink-600 to-rose-600',
    badge: 'Official vs Unofficial',
    type: 'mythbusters',
    questionCount: 22,
  },
  {
    id: 'general-science',
    name: 'Science & Quantum Physics',
    description: 'Astrophysics, biology, quantum mechanics, medical concepts & technological breakthroughs.',
    iconName: 'Atom',
    color: 'from-emerald-500 to-cyan-600',
    badge: 'General Knowledge',
    type: 'trivia',
    questionCount: 25,
  },
  {
    id: 'world-history',
    name: 'World History & Civilizations',
    description: 'Ancient empires, major wars, technological revolutions, treaties & global milestones.',
    iconName: 'Landmark',
    color: 'from-yellow-600 to-amber-700',
    badge: 'General Knowledge',
    type: 'trivia',
    questionCount: 20,
  },
  {
    id: 'pop-culture',
    name: 'Pop Culture, Cinema & Gaming',
    description: 'Movies, video game lore, music history, internet culture & iconic media franchises.',
    iconName: 'Gamepad2',
    color: 'from-purple-500 to-pink-600',
    badge: 'Pop Trivia',
    type: 'trivia',
    questionCount: 20,
  },
  {
    id: 'custom-ai',
    name: 'Custom AI Prompt & Doc Generator',
    description: 'Paste any job description, text notes, or topic to instantly create a personalized quiz.',
    iconName: 'Sparkles',
    color: 'from-fuchsia-600 to-purple-600',
    badge: 'Custom AI',
    type: 'custom',
    questionCount: 500,
  },
];
