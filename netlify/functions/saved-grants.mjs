import { getStore } from "@netlify/blobs";
import { createHmac, timingSafeEqual } from "node:crypto";

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}

// Verifies a Netlify Identity JWT (GoTrue signs HS256 tokens with the site's
// Identity JWT secret). Set IDENTITY_JWT_SECRET in the Netlify site environment
// (Site settings -> Identity -> JWT secret). Fails closed: without the secret,
// every request is rejected instead of trusted.
function userFromAuth(req) {
  const secret = process.env.IDENTITY_JWT_SECRET;
  if (!secret) {
    console.error('IDENTITY_JWT_SECRET is not configured.');
    return null;
  }
  const header = req.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!token) return null;
  return verifyIdentityToken(token, secret);
}

function verifyIdentityToken(token, secret) {
  const parts = String(token).split('.');
  if (parts.length !== 3) return null;
  try {
    const decodedHeader = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
    // Reject alg=none and any unexpected algorithm (algorithm-confusion protection).
    if (decodedHeader.alg !== 'HS256') return null;
    const signingInput = parts[0] + '.' + parts[1];
    const expected = createHmac('sha256', secret).update(signingInput).digest();
    const actual = Buffer.from(parts[2], 'base64url');
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    if (!payload.sub) return null;
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp === 'number' && payload.exp <= now) return null;
    return { id: payload.sub, email: payload.email || '' };
  } catch {
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
  if (!process.env.IDENTITY_JWT_SECRET) {
    console.error("IDENTITY_JWT_SECRET is not configured.");
    return json(503, { error: "Account service is temporarily unavailable." });
  }
  const user = userFromAuth(req);
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
