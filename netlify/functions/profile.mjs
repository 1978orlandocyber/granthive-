import { getStore } from "@netlify/blobs";

const MAX_RAW_BODY_LEN = 20000;

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}

// Validates the caller's Netlify Identity token by asking the Identity
// service itself (GoTrue): the token is accepted only if the site's own
// Identity endpoint recognizes it. No secret to configure, nothing to
// rotate -- validation is done by the token issuer. Returns { id, email }
// or null.
async function userFromAuth(req) {
  const header = req.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!token) return null;
  const base = (process.env.URL || process.env.DEPLOY_URL || '').replace(/\/$/, '');
  if (!base) {
    console.error('Site URL is not configured; cannot validate sign-in.');
    return null;
  }
  try {
    const res = await fetch(base + '/.netlify/identity/user', {
      headers: { Authorization: 'Bearer ' + token }
    });
    if (!res.ok) return null;
    const user = await res.json().catch(() => null);
    if (!user || !user.id) return null;
    return { id: user.id, email: user.email || '' };
  } catch (err) {
    console.error('Identity validation failed:', err && err.message);
    return null;
  }
}

export default async function (req) {
  const user = await userFromAuth(req);
  if (!user) return json(401, { error: "Sign in required." });

  const store = getStore("profiles");
  if (req.method === "GET") {
    const profile = await store.get(user.id, { type: "json" });
    return json(200, { email: user.email, profile: profile || null });
  }
  if (req.method === "POST") {
    const raw = await req.text().catch(() => "");
    if (raw.length > MAX_RAW_BODY_LEN) return json(413, { error: "Request body is too large." });
    let body = null;
    try { body = JSON.parse(raw); } catch {}
    if (!body || typeof body !== "object") return json(400, { error: "Invalid profile." });
    const profile = {
      orgType: String(body.orgType || "").slice(0, 40),
      stage: String(body.stage || "").slice(0, 40),
      industry: String(body.industry || "").slice(0, 200),
      location: String(body.location || "").slice(0, 200),
      employees: String(body.employees || "").slice(0, 40),
      email: user.email,
      updatedAt: new Date().toISOString()
    };
    await store.setJSON(user.id, profile);
    return json(200, { ok: true });
  }
  if (req.method === "DELETE") {
    await store.delete(user.id);
    return json(200, { ok: true });
  }
  return json(405, { error: "Method not allowed." });
}

export const config = {
  path: "/.netlify/functions/profile",
  rateLimit: { windowLimit: 30, windowSize: 60, aggregateBy: ["ip"] }
};
