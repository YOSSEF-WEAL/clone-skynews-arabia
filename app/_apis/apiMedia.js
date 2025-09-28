import { BASE_URL } from "./apisConfig";

const apiMedia = async (mediaId) => {
  try {
    const res = await fetch(`${BASE_URL}/wp-json/wp/v2/media/${mediaId}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_API_KEY}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 1000},
    });
    if (!res.ok) {
      return null;
    }
    const m = await res.json();
    // Prefer source_url; fall back to sizes/full or guid as last resort
    const sourceUrl =
      m?.source_url ||
      m?.media_details?.sizes?.full?.source_url ||
      m?.media_details?.sizes?.large?.source_url ||
      m?.guid?.rendered ||
      null;
    return sourceUrl;
  } catch (error) {
    console.error("Error loading MediaId from API:", error);
    return [];
  }
};

export default apiMedia;
