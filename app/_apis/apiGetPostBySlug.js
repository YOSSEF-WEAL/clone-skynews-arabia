import { BASE_URL, API_HEADERS } from "./apisConfig";

const apiGetPostBySlug = async (slug) => {
  try {
    const res = await fetch(
      `${BASE_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed=true`,
      {
        headers: API_HEADERS,
        next: { revalidate: 1000 },
      }
    );
    const posts = await res.json();
    console.log("🚀 ~ apiGetPostBySlug ~ posts:", posts);

    if (Array.isArray(posts) && posts.length > 0) {
      const post = posts[0];

      return {
        ...post,
        authorName: post._embedded?.author?.[0]?.name || null,
        authorImage: post._embedded?.author?.[0]?.avatar_urls?.["96"] || null,
        featuredImage:
          post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null,
        tags: post._embedded?.["wp:term"]?.[1]?.map((tag) => tag.name) || [],
      };
    }

    return null;
  } catch (error) {
    console.error("Error loading post by slug from API:", error);
    return null;
  }
};

export default apiGetPostBySlug;
