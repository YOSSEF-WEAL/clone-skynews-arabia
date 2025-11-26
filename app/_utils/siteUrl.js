export function getSiteUrl() {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000";

  try {
    // Ensure we always return a normalized absolute URL without a trailing slash
    const candidate = envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;
    const parsed = new URL(candidate);
    const normalizedPath = parsed.pathname.replace(/\/+$/, "");
    parsed.pathname = normalizedPath === "/" ? "" : normalizedPath;
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return "http://localhost:3000";
  }
}

export function buildAbsoluteUrl(pathname = "/") {
  const base = getSiteUrl();
  const cleanedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${cleanedPath}`;
}
