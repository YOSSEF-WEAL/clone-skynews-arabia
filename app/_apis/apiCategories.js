import { BASE_URL } from "./apisConfig";

const categoriesData = async () => {
  try {
    const res = await fetch(
      `${BASE_URL}/wp-json/wp/v2/categories?per_page=100&hide_empty=false`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const categories = await res.json();
    return categories;
  } catch (error) {
    console.error("Error loading categories from API:", error);
    return {};
  }
};

export default categoriesData;
