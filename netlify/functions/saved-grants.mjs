import { getStore } from "@netlify/blobs";

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

function cleanGrant(body) {
  if (!body || typeof body !== "object") return null;
  const title = String(body.title || "").trim().slice(0, 300);
  if (!title) return null;
  return {
    id: String(body.id || body.opportunityId || title).slice(0, 120),
    title,
    agency: String(body.agency || "").slice(0, 200),
    number: String(body.number || "").slice(0, 80),
    opportunityId: String(body.opportunityId || "").slice(0, 80),
    closeDate: String(body.closeDate || "").slice(0, 40),
    amount: String(body.amount || "").slice(0, 40),
    source: String(body.source || "federal").slice(0, 20),
    savedAt: new Date().toISOString()
  };
}

export default async function (req) {
  const user = await userFromAuth(req);
  if (!user) return json(401, { error: "Sign in required." });

  const store = getStore("saved-grants");
  const current = (await store.get(user.id, { type: "json" })) || [];
  const grants = Array.isArray(current) ? current : [];

  if (req.method === "GET") return json(200, { grants });

  if (req.method === "POST") {
    const grant = cleanGrant(await req.json().catch(() => null));
    if (!grant) return json(400, { error: "A grant title is required." });
    const next = [grant, ...grants.filter(g => g.id !== grant.id)].slice(0, 100);
    await store.setJSON(user.id, next);
    return json(200, { ok: true, grants: next });
  }

  if (req.method === "DELETE") {
    const body = await req.json().catch(() => ({}));
    const id = String(body.id || "");
    if (id === "__all__") {
      await store.setJSON(user.id, []);
      return json(200, { ok: true, grants: [] });
    }
    const next = grants.filter(g => g.id !== id);
    await store.setJSON(user.id, next);
    return json(200, { ok: true, grants: next });
  }

  return json(405, { error: "Method not allowed." });
}

export const config = { path: "/.netlify/functions/saved-grants" };
