import { BASE_URL } from "./apisConfig";

const apiGetPostById = async (postId) => {
  try {
    const res = await fetch(
      `${BASE_URL}/wp-json/wp/v2/posts/${postId}?_fields=id,slug`
    );
    const post = await res.json();

    return post;
  } catch (error) {
    console.error("Error loading postId from API:", error);
    return [];
  }
};

export default apiGetPostById;
