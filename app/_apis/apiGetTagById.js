import { BASE_URL, API_HEADERS } from "./apisConfig";

const apiGetTagById = async (tagId) => {
  try {
    const res = await fetch(`${BASE_URL}/wp-json/wp/v2/tags/${tagId}`, {
      headers: API_HEADERS,
      next: { revalidate: 1000 },
    });
    const allTag = await res.json();
    const tagName = await allTag.name;

    return tagName;
  } catch (error) {
    console.error("Error loading tagId from API:", error);
    return [];
  }
};

export default apiGetTagById;
