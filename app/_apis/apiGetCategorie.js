import { BASE_URL, API_HEADERS, handleApiResponse } from "./apisConfig";

const apiGetCategorie = async (categorieInput) => {
  try {
    const isNumeric = /^\d+$/.test(String(categorieInput));
    let url = "";
    if (isNumeric) {
      url = `${BASE_URL}/wp-json/wp/v2/categories/${categorieInput}`;
      const res = await fetch(url, {
        headers: API_HEADERS,
        next: { revalidate: 1000 },
      });
      return await handleApiResponse(res);
    } else {
      url = `${BASE_URL}/wp-json/wp/v2/categories?slug=${encodeURIComponent(
        String(categorieInput)
      )}&per_page=1`;
      const res = await fetch(url, {
        headers: API_HEADERS,
        next: { revalidate: 1000 },
      });
      const list = await handleApiResponse(res);
      return Array.isArray(list) ? list[0] ?? null : null;
    }
  } catch (error) {
    console.error("Error loading category:", error);
    return null;
  }
};

export default apiGetCategorie;
