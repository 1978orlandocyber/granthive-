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

export default async function (req) {
  if (!process.env.IDENTITY_JWT_SECRET) {
    console.error("IDENTITY_JWT_SECRET is not configured.");
    return json(503, { error: "Account service is temporarily unavailable." });
  }
  const user = userFromAuth(req);
  if (!user) return json(401, { error: "Sign in required." });

  const store = getStore("profiles");
  if (req.method === "GET") {
    const profile = await store.get(user.id, { type: "json" });
    return json(200, { email: user.email, profile: profile || null });
  }
  if (req.method === "POST") {
    const body = await req.json().catch(() => null);
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

export const config = { path: "/.netlify/functions/profile" };
