import { BASE_URL, API_HEADERS, handleApiResponse } from "./apisConfig";

const categoriesData = async () => {
  try {
    const res = await fetch(
      `${BASE_URL}/wp-json/wp/v2/categories?per_page=30&hide_empty=true`,
      {
        headers: API_HEADERS,
        next: { revalidate: 1000 },
      }
    );

    const data = await handleApiResponse(res);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export default categoriesData;
