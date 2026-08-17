import CustomQuizBuilder from '@/components/CustomQuizBuilder';

export const metadata = {
  title: 'Custom AI Study Generator | QuizMaster AI',
  description: 'Paste any text, notes, or prompt to generate a custom multiple-choice quiz using AI.',
};

export default function CustomPage() {
  return <CustomQuizBuilder />;
}
