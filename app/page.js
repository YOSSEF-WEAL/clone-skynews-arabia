import HeroSlider from "./_components/HeroSlider";
import CategorySectionStyle1 from "./_components/CategorySectionStyle1";
import CategorySectionStyle2 from "./_components/CategorySectionStyle2";
import CategorySectionStyle3 from "./_components/CategorySectionStyle3";
import HorizontalScroll from "./_components/HorizontalScroll";
import { headers as nextHeaders } from "next/headers";

// Helper function to fetch posts
async function fetchPosts(perPage = 10, page = 1) {
  try {
    const hdrs = nextHeaders?.();
    const xfProto = hdrs?.get("x-forwarded-proto") || "https";
    const host = hdrs?.get("host");
    const baseUrl = host
      ? `${xfProto}://${host}`
      : process.env.NEXT_PUBLIC_SITE_URL ||
        (process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000");

    const wpBase =
      process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
      process.env.WORDPRESS_API_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const wpHeaders = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(process.env.NEXT_API_KEY
        ? { Authorization: `Bearer ${process.env.NEXT_API_KEY}` }
        : {}),
    };

    const response = await fetch(
      `${wpBase}/wp-json/wp/v2/posts?per_page=${perPage}&page=${page}&_embed=wp:featuredmedia`,
      {
        headers: wpHeaders,
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch posts:", response.status);
      return [];
    }

    const posts = await response.json();

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
    console.error("Error fetching posts:", error);
    return [];
  }
}

export default async function Home() {
  // Fetch data for hero and trending
  const [heroPosts, trendingPosts] = await Promise.all([
    fetchPosts(9, 1), // Latest 9 posts for hero
    fetchPosts(8, 2), // 8 posts from page 2 for trending
  ]);

  return (
    <main className="min-h-screen">
      {/* Hero Slider Section */}
      <HeroSlider posts={heroPosts} />

      {/* Category Section 1: Big + List (e.g., Politics) */}
      <CategorySectionStyle1 categorySlug="politics" title="سياسة" />

      {/* Horizontal Scroll Section (Trending) */}
      <HorizontalScroll posts={trendingPosts} title="الأكثر قراءة" />

      {/* Category Section 2: Grid Cards (e.g., Sports) */}
      <CategorySectionStyle2 categorySlug="sports" title="رياضة" />

      {/* Category Section 3: Overlay Grid (e.g., Technology) */}
      <CategorySectionStyle3 categorySlug="technology" title="تكنولوجيا" />

      {/* Spacer */}
      <div className="h-12" />
    </main>
  );
}
