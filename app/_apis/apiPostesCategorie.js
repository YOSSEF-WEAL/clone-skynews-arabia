// Using internal API route; external BASE_URL and headers are not needed here
import { headers as nextHeaders } from "next/headers";

const apiPostesCategorie = async (categorieId) => {
  try {
    // Guard: if category is missing/invalid, do not call the API
    if (
      categorieId === undefined ||
      categorieId === null ||
      categorieId === '' ||
      String(categorieId).toLowerCase() === 'undefined' ||
      String(categorieId).toLowerCase() === 'null'
    ) {
      console.warn('[apiPostesCategorie] skipped due to invalid categorieId:', categorieId);
      return [];
    }
    // Use internal API route to benefit from Edge caching and filtered payload
    // Prefer building base URL from the current request headers (server components)
    const hdrs = nextHeaders?.();
    const xfProto = hdrs?.get("x-forwarded-proto") || "https";
    const host = hdrs?.get("host");
    const baseUrl = host
      ? `${xfProto}://${host}`
      : process.env.NEXT_PUBLIC_SITE_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const encodedId = encodeURIComponent(String(categorieId));
    const requestUrl = `${baseUrl}/api/posts/${encodedId}?per_page=40`;
    const res = await fetch(
      requestUrl,
      {
        // Let the route's Cache-Control drive caching at the edge
        // You can tweak revalidate if needed for ISR on server fetch
        next: { revalidate: 0 },
      }
    );

    console.log("[apiPostesCategorie] url:", requestUrl, "cache:", res.headers.get("x-vercel-cache")); 

    if (!res.ok) {
      // If internal route returns 404 (e.g., unknown category), do not break the page
      const errText = await res.text().catch(() => "");
      console.error("[apiPostesCategorie] HTTP error", res.status, requestUrl, errText);
      if (res.status === 404) return [];
      return [];
    }

    const data = await res.json();
    const posts = Array.isArray(data?.posts) ? data.posts : [];

    // Normalize to the previously expected structure where possible
    return posts.map((post) => {
      const featuredUrl = post.featuredMedia || null;
      return {
        // Keep raw fields
        id: post.id,
        slug: post.slug,
        date: post.date,
        modified: post.modified,
        categories: post.categories || [],

        // Keep title/excerpt compatible with prior usage (title.rendered, excerpt.rendered)
        title: typeof post.title === "string" ? { rendered: post.title } : post.title,
        excerpt: typeof post.excerpt === "string" ? { rendered: post.excerpt } : post.excerpt,

        // Convenience fields used by UI
        imageUrl: featuredUrl,

        // Minimal _embedded shape for components that rely on it
        _embedded: {
          ...(featuredUrl
            ? { "wp:featuredmedia": [{ source_url: featuredUrl }] }
            : {}),
        },

        // Optional SEO image if needed by UI
        ogImage: post.ogImage || null,

        // Placeholders to avoid breaking code if referenced
        authorName: null,
        authorImage: null,
        categoryName: null,
        tags: [],
      };
    });
  } catch (error) {
    console.error("Error loading posts from API:", error);
    return [];
  }
};

export default apiPostesCategorie;
