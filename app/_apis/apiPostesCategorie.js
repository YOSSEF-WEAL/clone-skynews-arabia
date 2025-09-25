import { BASE_URL, API_HEADERS } from "./apisConfig";

const apiPostesCategorie = async (categorieId) => {
  try {
    const res = await fetch(
      `${BASE_URL}/wp-json/wp/v2/posts?categories=${categorieId}&_embed=true&per_page=40`,
      {
        headers: API_HEADERS,
        next: { revalidate: 50000 },
      }
    );

    // console.log("Fetched from API at:", new Date().toISOString());

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const posts = await res.json();

    // Transform posts to include required data
    return posts.map((post) => ({
      ...post,
      imageUrl: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null,
      authorName: post._embedded?.author?.[0]?.name || null,
      authorImage: post._embedded?.author?.[0]?.avatar_urls?.["96"] || null,
      categoryName: post._embedded?.["wp:term"]?.[0]?.[0]?.name || null,
      tags: post._embedded?.["wp:term"]?.[1]?.map((tag) => tag.name) || [],
    }));
  } catch (error) {
    console.error("Error loading posts from API:", error);
    return [];
  }
};

export default apiPostesCategorie;
