/**
 * /api/meta-event
 * Server-side Meta Conversions API (CAPI) endpoint.
 * Receives events from the browser, hashes user data with SHA-256,
 * and forwards them to Meta's Graph API for server-side deduplication.
 */

import crypto from "crypto";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;

/** SHA-256 hash a string (lowercase + trimmed) as required by Meta */
function hash(value) {
  if (!value) return undefined;
  return crypto
    .createHash("sha256")
    .update(String(value).trim().toLowerCase())
    .digest("hex");
}

export async function POST(req) {
  try {
    const { eventName, eventId, params, userData = {}, sourceUrl } = await req.json();

    if (!PIXEL_ID || !ACCESS_TOKEN) {
      return Response.json({ error: "Meta credentials not configured" }, { status: 500 });
    }

    const eventTime = Math.floor(Date.now() / 1000);

    // Get client IP and user agent for required CAPI fields
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      null;
    const clientUserAgent = req.headers.get("user-agent") || null;

    // Hash all user data fields before sending to Meta
    const hashedUserData = {
      ...(clientIp && { client_ip_address: clientIp }),
      ...(clientUserAgent && { client_user_agent: clientUserAgent }),
      ...(userData.em && { em: [hash(userData.em)] }),
      ...(userData.ph && { ph: [hash(userData.ph)] }),
      ...(userData.fn && { fn: [hash(userData.fn)] }),
      ...(userData.ln && { ln: [hash(userData.ln)] }),
      ...(userData.zp && { zp: [hash(userData.zp)] }),
      ...(userData.country && { country: [hash(userData.country)] }),
    };

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: eventTime,
          event_id: eventId,           // matches browser pixel event_id for deduplication
          event_source_url: sourceUrl,
          action_source: "website",
          user_data: hashedUserData,
          custom_data: params,
        },
      ],
      ...(TEST_EVENT_CODE && { test_event_code: TEST_EVENT_CODE }),
    };

    const url = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Meta CAPI error:", result);
      return Response.json({ error: result }, { status: response.status });
    }

    return Response.json({ success: true, result });
  } catch (err) {
    console.error("meta-event route error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
