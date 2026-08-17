import { NextRequest, NextResponse } from 'next/server';
import { generateCustomAIQuiz, evaluateInterviewAnswer, askAITutor } from '@/lib/aiEngine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, prompt, apiKey, scenario, userAnswer, question, userQuestionText } = body;

    if (action === 'generate-quiz') {
      const questions = await generateCustomAIQuiz(prompt || 'General Knowledge', apiKey);
      return NextResponse.json({ questions });
    }

    if (action === 'evaluate-interview') {
      if (!scenario || !userAnswer) {
        return NextResponse.json({ error: 'Missing scenario or userAnswer' }, { status: 400 });
      }
      const evaluation = await evaluateInterviewAnswer(scenario, userAnswer, apiKey);
      return NextResponse.json({ evaluation });
    }

    if (action === 'ask-tutor') {
      if (!question || !userQuestionText) {
        return NextResponse.json({ error: 'Missing question or userQuestionText' }, { status: 400 });
      }
      const answer = await askAITutor(question, userQuestionText, apiKey);
      return NextResponse.json({ answer });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('API /ai error:', error);
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
