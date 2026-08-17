import { Question, WikipediaArticle } from './types';

export async function searchWikipediaArticles(query: string): Promise<Array<{ title: string; description: string }>> {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=8&format=json&origin=*`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    
    // OpenSearch format: [query, [titles], [descriptions], [urls]]
    const titles: string[] = data[1] || [];
    const descriptions: string[] = data[2] || [];

    return titles.map((title, idx) => ({
      title,
      description: descriptions[idx] || 'Wikipedia Article',
    }));
  } catch (error) {
    console.error('Wikipedia search error:', error);
    return [];
  }
}

export async function fetchWikipediaSummary(title: string): Promise<WikipediaArticle | null> {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/\s+/g, '_'))}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();

    return {
      pageid: data.pageid || Math.floor(Math.random() * 1000000),
      title: data.title || title,
      extract: data.extract || 'No extract available.',
      description: data.description || '',
      thumbnailUrl: data.thumbnail?.source || undefined,
      contentUrl: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
    };
  } catch (error) {
    console.error('Fetch Wikipedia summary error:', error);
    return null;
  }
}

/**
 * Algorithmic quiz generator from Wikipedia text
 * Parses sentences, key facts, numbers, dates, and proper nouns
 * to form valid multiple choice questions.
 */
export function generateQuizFromWikipediaExtract(article: WikipediaArticle): Question[] {
  const text = article.extract;
  if (!text || text.length < 50) {
    return generateFallbackWikiQuestions(article.title);
  }

  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 30);
  const questions: Question[] = [];

  sentences.forEach((sentence, idx) => {
    // 1. Check for year/date pattern
    const yearMatch = sentence.match(/\b(1[0-9]{3}|20[0-9]{2})\b/);
    if (yearMatch && questions.length < 5) {
      const targetYear = parseInt(yearMatch[1], 10);
      const replacedSentence = sentence.replace(yearMatch[0], '________');
      
      const wrongYear1 = targetYear - 12;
      const wrongYear2 = targetYear + 7;
      const wrongYear3 = targetYear - 45;

      questions.push({
        id: `wiki-${article.pageid}-${idx}`,
        category: 'wikipedia-live',
        topic: article.title,
        question: `According to Wikipedia's record on "${article.title}", fill in the missing year:\n"${replacedSentence}"`,
        options: shuffleArray([
          `${targetYear}`,
          `${wrongYear1}`,
          `${wrongYear2}`,
          `${wrongYear3}`
        ]),
        correctAnswer: 0, // will be set correctly after shuffle logic
        explanation: `Full Fact: ${sentence}`,
        difficulty: 'Medium',
        sourceUrl: article.contentUrl,
        tags: ['Wikipedia', article.title]
      });
    }

    // 2. Fact / Definition check
    if (sentence.includes(' is ') || sentence.includes(' was ') || sentence.includes(' refers to ')) {
      if (questions.length < 5) {
        const parts = sentence.split(/ is | was | refers to /);
        if (parts.length >= 2 && parts[0].length > 5) {
          const subject = parts[0].trim();
          const predicate = parts[1].trim();

          questions.push({
            id: `wiki-def-${article.pageid}-${idx}`,
            category: 'wikipedia-live',
            topic: article.title,
            question: `In relation to ${article.title}, what is described by the following detail?\n"${predicate.slice(0, 140)}..."`,
            options: shuffleArray([
              subject,
              `The alternative ${article.title} protocol`,
              `The historical precedent of ${article.title}`,
              `A secondary theory disputed by scholars`
            ]),
            correctAnswer: 0,
            explanation: sentence,
            difficulty: 'Easy',
            sourceUrl: article.contentUrl,
            tags: ['Wikipedia', article.title]
          });
        }
      }
    }
  });

  // Ensure options shuffle sets correct answer index properly
  const formattedQuestions = questions.map((q) => {
    const correctVal = q.options[0]; // before shuffle, option 0 was target
    const shuffled = shuffleArray([...q.options]);
    const correctIdx = shuffled.indexOf(correctVal);
    return {
      ...q,
      options: shuffled,
      correctAnswer: correctIdx >= 0 ? correctIdx : 0
    };
  });

  if (formattedQuestions.length < 3) {
    return generateFallbackWikiQuestions(article.title, article.extract);
  }

  return formattedQuestions.slice(0, 5);
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateFallbackWikiQuestions(title: string, extract?: string): Question[] {
  const mainFact = extract ? extract.slice(0, 200) + '...' : `Wikipedia topic concerning ${title}.`;
  
  return [
    {
      id: `wiki-fb-1`,
      category: 'wikipedia-live',
      topic: title,
      question: `What is the primary focus of the Wikipedia entry for "${title}"?`,
      options: [
        mainFact,
        `A fictional planet in 20th century science fiction novels.`,
        `An obsolete software standard deprecated in 1995.`,
        `A geographical feature in the Antarctic continent.`
      ],
      correctAnswer: 0,
      explanation: `According to Wikipedia: ${extract || title}`,
      difficulty: 'Easy',
      tags: ['Wikipedia', title]
    },
    {
      id: `wiki-fb-2`,
      category: 'wikipedia-live',
      topic: title,
      question: `In research databases and Wikipedia citations, how is "${title}" officially classified?`,
      options: [
        `As a recognized domain topic with peer-reviewed references.`,
        `As an unverified internet creepypasta.`,
        `As a trademark registered exclusively by a single corporation.`,
        `As an secret military code name.`
      ],
      correctAnswer: 0,
      explanation: `Wikipedia pages maintain neutral point of view and verifiable citations.`,
      difficulty: 'Medium',
      tags: ['Wikipedia', title]
    }
  ];
}
