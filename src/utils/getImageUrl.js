/**
 * Normalize image URL from API so it works on live.
 * - If url is already absolute (http/https), return as-is.
 * - If url is relative (e.g. /uploads/2024/01/xxx.jpg), prepend backend origin.
 * Backend returns relative paths; dashboard needs full URL to display images.
 */
const baseURL = import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:5055/api";
const BACKEND_ORIGIN = typeof baseURL === "string" && baseURL ? new URL(baseURL).origin : "";

export function getImageUrl(url) {
  if (url == null || typeof url !== "string" || url === "") return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/uploads/") && BACKEND_ORIGIN) return `${BACKEND_ORIGIN}${url}`;
  return url;
}
