/** Backend base URL. Empty = same origin (local dev proxy or full-stack deploy). */
export const apiBaseUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ?? "";

export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return apiBaseUrl ? `${apiBaseUrl}${normalized}` : normalized;
}

export const socketOrigin = apiBaseUrl || undefined;
