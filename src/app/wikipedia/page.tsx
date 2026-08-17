import WikipediaExplorer from '@/components/WikipediaExplorer';

export const metadata = {
  title: 'Wikipedia Live Quiz Engine | QuizMaster AI',
  description: 'Search any Wikipedia article to extract facts and build instant quizzes live.',
};

export default function WikipediaPage() {
  return <WikipediaExplorer />;
}
