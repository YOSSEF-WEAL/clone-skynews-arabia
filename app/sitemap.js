import categoriesData from "./_apis/apiCategories";
import { API_HEADERS, BASE_URL } from "./_apis/apisConfig";
import { buildAbsoluteUrl } from "./_utils/siteUrl";

const POSTS_LIMIT = 200;

async function fetchPostsForSitemap() {
  try {
    const params = new URLSearchParams({
      per_page: String(POSTS_LIMIT),
      _fields: "slug,modified,date",
    });
    const res = await fetch(`${BASE_URL}/wp-json/wp/v2/posts?${params.toString()}`, {
      headers: API_HEADERS,
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[sitemap] posts fetch failed", res.status, text);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("[sitemap] unexpected error loading posts", error);
    return [];
  }
}

export default async function sitemap() {
  const generatedAt = new Date().toISOString();

  const [categories, posts] = await Promise.all([
    categoriesData().catch(() => []),
    fetchPostsForSitemap(),
  ]);

  const staticRoutes = [
    { url: buildAbsoluteUrl("/"), lastModified: generatedAt },
    { url: buildAbsoluteUrl("/categories"), lastModified: generatedAt },
  ];

  const categoryRoutes = (categories || []).map((cat) => ({
    url: buildAbsoluteUrl(`/categories/${cat.slug || cat.id}`),
    lastModified: cat?.modified || cat?.date || generatedAt,
  }));

  const postRoutes = posts.map((post) => {
    const postId = post?.id || post?.ID || "";
    const slug = post?.slug || postId;
    return {
      url: buildAbsoluteUrl(`/${postId}/${slug}`),
      lastModified: post?.modified || post?.date || generatedAt,
    };
  });

  return [...staticRoutes, ...categoryRoutes, ...postRoutes];
}
