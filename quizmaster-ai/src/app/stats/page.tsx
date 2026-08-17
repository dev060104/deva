import StatsDashboard from '@/components/StatsDashboard';

export const metadata = {
  title: 'Performance & Analytics Dashboard | QuizMaster AI',
  description: 'View accuracy rates, category breakdown, active streaks, and bookmarked questions.',
};

export default function StatsPage() {
  return <StatsDashboard />;
}
