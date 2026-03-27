import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') ?? '';
  const year = searchParams.get('year') ?? '';
  const type = searchParams.get('type') ?? 'Movie';

  if (!title) {
    return NextResponse.json({ url: null }, { status: 400 });
  }

  try {
    const typeWord = type === 'Movie' ? 'film' : 'TV series';
    const query = `${title} ${year} ${typeWord}`;
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;

    const res = await fetch(ddgUrl, {
      headers: { 'User-Agent': 'WatchNow/1.0' },
      next: { revalidate: 86400 }, // cache for 24h
    });

    if (!res.ok) {
      return NextResponse.json({ url: null });
    }

    const data = await res.json() as { Image?: string };
    const imagePath = data.Image;

    if (!imagePath) {
      return NextResponse.json({ url: null });
    }

    const url = imagePath.startsWith('http')
      ? imagePath
      : `https://duckduckgo.com${imagePath}`;

    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ url: null });
  }
}
