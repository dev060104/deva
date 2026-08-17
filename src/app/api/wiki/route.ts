import { NextRequest, NextResponse } from 'next/server';
import { searchWikipediaArticles, fetchWikipediaSummary, generateQuizFromWikipediaExtract } from '@/lib/wikipedia';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const action = searchParams.get('action') || 'search';

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  if (action === 'search') {
    const results = await searchWikipediaArticles(query);
    return NextResponse.json({ results });
  }

  if (action === 'quiz') {
    const summary = await fetchWikipediaSummary(query);
    if (!summary) {
      return NextResponse.json({ error: `Article "${query}" not found.` }, { status: 404 });
    }
    const questions = generateQuizFromWikipediaExtract(summary);
    return NextResponse.json({ summary, questions });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
