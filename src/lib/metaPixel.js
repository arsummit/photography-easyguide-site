/**
 * Meta Pixel + CAPI client-side helper.
 * Every trackEvent() call:
 *   1. Fires fbq() in the browser with a unique event_id for deduplication
 *   2. POSTs the same event + event_id to /api/meta-event for server-side CAPI mirroring
 */

function generateEventId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/**
 * Track a Meta Pixel event from the browser and mirror it via CAPI.
 *
 * @param {string} eventName - Standard or custom Meta event name
 * @param {object} params    - Event parameters (value, currency, content_ids, etc.)
 * @param {object} userData  - Optional user data for CAPI hashing (em, fn, ln, ph, zp, country)
 */
export function trackEvent(eventName, params = {}, userData = {}) {
  const eventId = generateEventId();

  // 1. Browser Pixel — include event_id for deduplication
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", eventName, params, { eventID: eventId });
  }

  // 2. Server-side CAPI mirror
  fetch("/api/meta-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventName,
      eventId,
      params,
      userData,
      sourceUrl: typeof window !== "undefined" ? window.location.href : "",
    }),
  }).catch(() => {}); // fire-and-forget; don't block UI on CAPI errors
}
