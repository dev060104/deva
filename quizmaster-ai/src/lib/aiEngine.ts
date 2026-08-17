import { Question, InterviewEvaluation, InterviewScenario } from './types';

export async function generateCustomAIQuiz(prompt: string, apiKey?: string, count: number = 5): Promise<Question[]> {
  if (apiKey && apiKey.trim().length > 10) {
    try {
      // Call custom OpenAI endpoint if user provided API key
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert Quiz Master. Output ONLY a valid JSON array of question objects without markdown formatting.'
            },
            {
              role: 'user',
              content: `Generate ${count} multiple choice questions on the following topic or text: "${prompt}". Each item must have: question (string), options (array of 4 strings), correctAnswer (index 0-3), explanation (string), difficulty ("Easy"|"Medium"|"Hard").`
            }
          ],
          temperature: 0.7
        })
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content || '';
        const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        
        return parsed.map((item: any, idx: number) => ({
          id: `ai-custom-${Date.now()}-${idx}`,
          category: 'custom-ai',
          topic: prompt.slice(0, 30),
          question: item.question,
          options: item.options,
          correctAnswer: item.correctAnswer ?? 0,
          explanation: item.explanation,
          difficulty: item.difficulty || 'Medium',
          tags: ['AI Generated', prompt.slice(0, 15)]
        }));
      }
    } catch (e) {
      console.warn('Custom API Key call failed, falling back to smart built-in engine:', e);
    }
  }

  // Smart Built-in Engine Fallback:
  return generateSmartFallbackQuestions(prompt, count);
}

export async function evaluateInterviewAnswer(
  scenario: InterviewScenario,
  userAnswer: string,
  apiKey?: string
): Promise<InterviewEvaluation> {
  if (!userAnswer || userAnswer.trim().length < 10) {
    return {
      score: 15,
      feedback: 'The answer was too brief. Strong technical or behavioral interview responses require structured detail (STAR method or technical architecture components).',
      keyPointsCovered: [],
      missingPoints: scenario.keyPoints,
      strengths: ['Promptness'],
      improvements: ['Elaborate with concrete examples', 'Mention architecture metrics or trade-offs'],
      suggestedAnswer: scenario.sampleModelAnswer
    };
  }

  if (apiKey && apiKey.trim().length > 10) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a principal technical interviewer at Google/Meta. Evaluate the candidates answer strictly and constructively.'
            },
            {
              role: 'user',
              content: `Interview Question: "${scenario.question}"
Role: ${scenario.role}
Target Key Points: ${JSON.stringify(scenario.keyPoints)}
Candidate Answer: "${userAnswer}"

Return ONLY a raw JSON object with:
score (number 0-100), feedback (string), keyPointsCovered (array of strings), missingPoints (array of strings), strengths (array of strings), improvements (array of strings), suggestedAnswer (string).`
            }
          ],
          temperature: 0.5
        })
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content || '';
        const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
      }
    } catch (e) {
      console.warn('AI evaluation API failed, using built-in evaluator:', e);
    }
  }

  // Rule-based Evaluator for zero-setup environment
  const lowerAnswer = userAnswer.toLowerCase();
  const covered: string[] = [];
  const missing: string[] = [];

  scenario.keyPoints.forEach((point) => {
    const keywords = point.toLowerCase().split(' ').filter(w => w.length > 4);
    const matches = keywords.filter(k => lowerAnswer.includes(k));
    if (matches.length >= 1) {
      covered.push(point);
    } else {
      missing.push(point);
    }
  });

  const baseScore = Math.min(95, Math.max(30, Math.floor((covered.length / scenario.keyPoints.length) * 75) + (userAnswer.length > 200 ? 20 : 10)));

  return {
    score: baseScore,
    feedback: baseScore > 75 
      ? 'Impressive response! You addressed core technical/behavioral requirements clearly with solid structure.' 
      : 'Good foundational start. To achieve top-tier evaluation, incorporate more specific metric benchmarks, edge case handling, and architectural trade-offs.',
    keyPointsCovered: covered.length > 0 ? covered : ['General topic alignment'],
    missingPoints: missing.length > 0 ? missing : ['Deep dive edge cases'],
    strengths: [userAnswer.length > 150 ? 'Detailed explanations' : 'Clear communication', 'Addressed primary question context'],
    improvements: ['Include quantifiable metrics (latency, QPS, CAC)', 'Structure using STAR or component diagram approach'],
    suggestedAnswer: scenario.sampleModelAnswer
  };
}

export async function askAITutor(question: Question, userQuestionText: string, apiKey?: string): Promise<string> {
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are QuizMaster AI Tutor. Provide clear, engaging, and highly instructive answers to students.'
            },
            {
              role: 'user',
              content: `Original Quiz Question: "${question.question}"
Correct Answer Option: "${question.options[question.correctAnswer]}"
Explanation: "${question.explanation}"

Student asks: "${userQuestionText}"`
            }
          ]
        })
      });

      if (res.ok) {
        const data = await res.json();
        return data.choices?.[0]?.message?.content || 'I could not generate a response.';
      }
    } catch (e) {
      console.warn('AI Tutor call error:', e);
    }
  }

  // Smart Tutor Fallback
  return `💡 **AI Tutor Explanation**:
Regarding "${userQuestionText}":
- **Key Concept**: ${question.question}
- **Why ${question.options[question.correctAnswer]} is Correct**: ${question.explanation}
- **Pro Tip**: In real-world interviews and examinations, always look for the underlying principles. ${question.tags?.length ? `This falls under ${question.tags.join(', ')}.` : ''}`;
}

function generateSmartFallbackQuestions(prompt: string, count: number): Question[] {
  const cleanPrompt = prompt.trim();
  const topics = [
    `Fundamentals of ${cleanPrompt}`,
    `Advanced Applications & Best Practices in ${cleanPrompt}`,
    `Common Pitfalls & Misconceptions regarding ${cleanPrompt}`,
    `Real-World Case Study on ${cleanPrompt}`,
    `Expert Mastery & Edge Cases in ${cleanPrompt}`
  ];

  return topics.slice(0, count).map((t, idx) => ({
    id: `ai-gen-${Date.now()}-${idx}`,
    category: 'custom-ai',
    topic: cleanPrompt,
    question: `Which statement represents a critical principle of "${t}"?`,
    options: [
      `It requires systematically balancing trade-offs, validating assumptions, and optimizing for scalable performance.`,
      `It relies on deprecated 1980s protocols with zero fault tolerance.`,
      `It is purely a theoretical construct with no practical engineering implementation.`,
      `It guarantees instant linear scaling without CPU or network overhead.`
    ],
    correctAnswer: 0,
    explanation: `When analyzing ${t}, industry standards prioritize data verification, systematic trade-offs, and measurable outcomes.`,
    difficulty: idx === 0 ? 'Easy' : idx < 3 ? 'Medium' : 'Hard',
    tags: ['Custom Topic', cleanPrompt]
  }));
}
