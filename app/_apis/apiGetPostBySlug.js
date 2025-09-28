import { headers as nextHeaders } from "next/headers";

const apiGetPostBySlug = async (slug) => {
  try {
    // Build absolute base URL from current request context
    const hdrs = nextHeaders?.();
    const xfProto = hdrs?.get("x-forwarded-proto") || "https";
    const host = hdrs?.get("host");
    const baseUrl = host
      ? `${xfProto}://${host}`
      : process.env.NEXT_PUBLIC_SITE_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const url = `${baseUrl}/api/post/${encodeURIComponent(slug)}`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) {
      console.error("apiGetPostBySlug internal error", res.status, await res.text().catch(() => ""));
      return null;
    }
    const data = await res.json();
    return data?.post || null;
  } catch (error) {
    console.error("Error loading post by slug from API:", error);
    return null;
  }
};

export default apiGetPostBySlug;
