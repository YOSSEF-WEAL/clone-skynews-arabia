const resolveBaseUrl = () => {
  const raw =
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
    process.env.WORDPRESS_API_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";
  try {
    const parsed = new URL(raw);
    // Keep subdirectory installs but drop trailing slash to avoid double slashes
    const trimmedPath = parsed.pathname.replace(/\/+$/, "");
    return `${parsed.origin}${trimmedPath === "/" ? "" : trimmedPath}`;
  } catch {
    return raw.replace(/\/+$/, "");
  }
};

export const BASE_URL = resolveBaseUrl();

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
