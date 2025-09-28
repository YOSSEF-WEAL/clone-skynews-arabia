import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { categorie } = params;
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || 1;
  const perPage = searchParams.get('per_page') || 10;

  try {
    const wpBase = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || process.env.WORDPRESS_API_URL || 'https://a3raff.com/next';
    const postsUrl = `${wpBase}/wp-json/wp/v2/posts`;
    const wpHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(process.env.NEXT_API_KEY ? { Authorization: `Bearer ${process.env.NEXT_API_KEY}` } : {}),
    };

    // Determine category ID (support slug or ID)
    let categoryId = categorie;
    if (!/^\d+$/.test(String(categorie))) {
      const resolveUrl = `${wpBase}/wp-json/wp/v2/categories?slug=${encodeURIComponent(
        categorie
      )}&_fields=id&per_page=1`;
      const resolveRes = await fetch(resolveUrl, { headers: wpHeaders });
      if (!resolveRes.ok) {
        return new NextResponse(
          JSON.stringify({ error: 'Failed to resolve category slug' }),
          { status: 502, headers: { 'Content-Type': 'application/json' } }
        );
      }
      const cats = await resolveRes.json();
      categoryId = cats?.[0]?.id;
      if (!categoryId) {
        return new NextResponse(
          JSON.stringify({ error: 'Category not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    const paramsQS = new URLSearchParams({
      categories: String(categoryId),
      page,
      per_page: perPage,
      _embed: 'wp:featuredmedia',
    });

    const response = await fetch(`${postsUrl}?${paramsQS}`, { headers: wpHeaders });
    
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const totalPages = response.headers.get('X-WP-TotalPages');
    const totalItems = response.headers.get('X-WP-Total');
    
    const posts = await response.json();

    // Transform the data to only include what's needed
    const filteredPosts = posts.map(post => ({
      id: post.id,
      title: post.title?.rendered || '',
      excerpt: post.excerpt?.rendered || '',
      slug: post.slug,
      date: post.date,
      modified: post.modified,
      // Keep both: media id and resolved URL for maximum compatibility
      featured_media: post.featured_media ?? null,
      featuredMedia: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
      categories: post.categories || [],
      ogImage: post.yoast_head_json?.og_image?.[0]?.url || null,
    }));

    const responseData = {
      posts: filteredPosts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: parseInt(totalPages || 1),
        totalItems: parseInt(totalItems || 0),
      },
    };

    // Set cache control headers for Vercel Edge Cache (1 hour)
    const resHeaders = new Headers();
    resHeaders.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=300');
    resHeaders.set('Content-Type', 'application/json');

    return new NextResponse(JSON.stringify(responseData), {
      status: 200,
      headers: resHeaders,
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch posts', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
