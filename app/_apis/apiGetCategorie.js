import { BASE_URL, API_HEADERS, handleApiResponse } from "./apisConfig";

const apiGetCategorie = async (categorieId) => {
  try {
    const res = await fetch(
      `${BASE_URL}/wp-json/wp/v2/categories/${categorieId}`,
      {
        headers: API_HEADERS,
        next: { revalidate: 3600 },
      }
    );

    return await handleApiResponse(res);
  } catch (error) {
    console.error("Error loading category:", error);
    return null;
  }
};

export default apiGetCategorie;
