import { BASE_URL } from "./apisConfig";

const apiGetCategorie = async (categorieId) => {
  try {
    const res = await fetch(
      `${BASE_URL}/wp-json/wp/v2/categories/${categorieId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const allCategorie = await res.json();
    return allCategorie;
  } catch (error) {
    console.error("Error loading categorieId from API:", error);
    return [];
  }
};

export default apiGetCategorie;
