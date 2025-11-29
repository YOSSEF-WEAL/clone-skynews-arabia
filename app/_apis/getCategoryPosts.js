import { headers as nextHeaders } from "next/headers";

export async function getCategoryPosts(categorySlug, perPage = 5) {
  try {
    const hdrs = nextHeaders?.();
    const xfProto = hdrs?.get("x-forwarded-proto") || "https";
    const host = hdrs?.get("host");
    const baseUrl = host
      ? `${xfProto}://${host}`
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const wpBase =
      process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
      process.env.WORDPRESS_API_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    // First, get category ID by slug
    const catRes = await fetch(
      `${wpBase}/wp-json/wp/v2/categories?slug=${categorySlug}`,
      { next: { revalidate: 3600 } }
    );

    if (!catRes.ok) return [];

    const categories = await catRes.json();
    if (!categories || categories.length === 0) return [];

    const categoryId = categories[0].id;

    // Fetch posts by category ID
    const postsRes = await fetch(
      `${wpBase}/wp-json/wp/v2/posts?categories=${categoryId}&per_page=${perPage}&_embed=wp:featuredmedia`,
      { next: { revalidate: 300 } }
    );

    if (!postsRes.ok) return [];

    const posts = await postsRes.json();

    return posts.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: { rendered: post.title?.rendered || "" },
      excerpt: { rendered: post.excerpt?.rendered || "" },
      imageUrl: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null,
      date: post.date,
      categories: post.categories || [],
    }));
  } catch (error) {
    console.error(`Error fetching posts for category ${categorySlug}:`, error);
    return [];
  }
}
