import { BASE_URL } from "./apisConfig";

const apiMedia = async (mediaId) => {
  try {
    const res = await fetch(`${BASE_URL}/wp-json/wp/v2/media/${mediaId}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
    const allMedia = await res.json();
    const renderUrl = allMedia?.guid?.rendered;
    return renderUrl;
  } catch (error) {
    console.error("Error loading MediaId from API:", error);
    return [];
  }
};

export default apiMedia;
