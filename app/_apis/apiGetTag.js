import { BASE_URL, API_HEADERS, handleApiResponse } from "./apisConfig";

const apiGetTag = async (tagInput) => {
  try {
    const isNumeric = /^\d+$/.test(String(tagInput));
    let url = "";
    if (isNumeric) {
      url = `${BASE_URL}/wp-json/wp/v2/tags/${tagInput}`;
      const res = await fetch(url, {
        headers: API_HEADERS,
        next: { revalidate: 3600 },
      });
      return await handleApiResponse(res);
    } else {
      url = `${BASE_URL}/wp-json/wp/v2/tags?slug=${encodeURIComponent(
        String(tagInput)
      )}&per_page=1`;
      const res = await fetch(url, {
        headers: API_HEADERS,
        next: { revalidate: 3600 },
      });
      const list = await handleApiResponse(res);
      return Array.isArray(list) ? list[0] ?? null : null;
    }
  } catch (error) {
    console.error("Error loading tag:", error);
    return null;
  }
};

export default apiGetTag;
