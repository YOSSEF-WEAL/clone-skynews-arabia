import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { slug } = params;
  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  const headers = new Headers();
  headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=60');
  headers.set('Content-Type', 'application/json');

  try {
    const wpBase =
      process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
      process.env.WORDPRESS_API_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'http://localhost:3000';
    const postsUrl = `${wpBase}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=true`;

    const wpHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(process.env.NEXT_API_KEY ? { Authorization: `Bearer ${process.env.NEXT_API_KEY}` } : {}),
    };

    const res = await fetch(postsUrl, { headers: wpHeaders });
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch post' }, { status: 502 });
    }

    const arr = await res.json();
    const post = Array.isArray(arr) ? arr[0] : null;
    if (!post) {
      return NextResponse.json({ post: null }, { status: 200, headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60' } });
    }

    const filtered = {
      id: post.id,
      slug: post.slug,
      date: post.date,
      modified: post.modified,
      categories: post.categories || [],
      title: { rendered: post.title?.rendered || '' },
      excerpt: { rendered: post.excerpt?.rendered || '' },
      content: { rendered: post.content?.rendered || '' },
      featured_media: post.featured_media ?? null,
      featuredMedia: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
      authorName: post._embedded?.author?.[0]?.name || null,
      authorImage: post._embedded?.author?.[0]?.avatar_urls?.['96'] || null,
      tags: post._embedded?.['wp:term']?.[1]?.map((t) => t.name) || [],
      ogImage: post.yoast_head_json?.og_image?.[0]?.url || null,
      _embedded: {
        ...(post._embedded?.['wp:featuredmedia']
          ? { 'wp:featuredmedia': [{ source_url: post._embedded['wp:featuredmedia'][0]?.source_url || null }] }
          : {}),
      },
    };

    const headers = new Headers();
    // Cache shorter (1 min) for single post, but serve stale while revalidating for 1 min
    headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=60');
    headers.set('Content-Type', 'application/json');

    return new NextResponse(JSON.stringify({ post: filtered }), { status: 200, headers });
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
