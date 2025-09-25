export const BASE_URL = "https://a3raff.com/next";

export const API_HEADERS = {
  Accept: "application/json",
  Authorization: `Bearer ${process.env.NEXT_API_KEY}`,
  "Content-Type": "application/json",
};

export async function handleApiResponse(response) {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API Error: ${response.status} - ${text}`);
  }

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("API response was not JSON");
  }

  return response.json();
}
