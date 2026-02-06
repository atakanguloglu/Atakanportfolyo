/**
 * Basit in-memory rate limiter (IP + route bazlı).
 * Sunucu yeniden başlayınca sıfırlanır; tek instance için yeterli.
 */

const store = new Map();
const WINDOW_MS = 60 * 1000; // 1 dakika

function getClientKey(request, routeId) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : request.headers.get("x-real-ip") || "unknown";
  return `${routeId}:${ip}`;
}

function cleanup() {
  const now = Date.now();
  for (const [key, data] of store.entries()) {
    if (data.resetAt < now) store.delete(key);
  }
}

/**
 * Limit aşıldıysa { limited: true } döner; aşılmadıysa { limited: false }.
 * @param {Request} request - Next.js request
 * @param {string} routeId - Örn. "login", "contact", "comment"
 * @param {number} maxRequests - Pencere başına max istek (örn. 5)
 */
export function checkRateLimit(request, routeId, maxRequests = 5) {
  cleanup();
  const key = getClientKey(request, routeId);
  const now = Date.now();
  let data = store.get(key);

  if (!data) {
    data = { count: 0, resetAt: now + WINDOW_MS };
    store.set(key, data);
  }

  if (now >= data.resetAt) {
    data.count = 0;
    data.resetAt = now + WINDOW_MS;
  }

  data.count += 1;

  if (data.count > maxRequests) {
    return { limited: true, retryAfter: Math.ceil((data.resetAt - now) / 1000) };
  }
  return { limited: false };
}
