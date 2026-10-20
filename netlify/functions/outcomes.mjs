// netlify/functions/outcomes.mjs
//
// Per-user grant outcome tracking: the raw material for calibrating the
// pursuit gauge. Records what the user did with a saved grant
// (applied / won / lost / abandoned) and the award amount when won.
//
// Outcomes are private to each user. Any future aggregate calibration must
// be anonymized and opt-in — this function only stores and returns the
// calling user's own records.

import { getStore } from "@netlify/blobs";

const ALLOWED_STATUSES = new Set(["saved", "applied", "won", "lost", "abandoned"]);
const MAX_NOTES_LEN = 500;
const MAX_RECORDS = 200;
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

function cleanOutcome(body) {
  if (!body || typeof body !== "object") return null;
  const id = String(body.id || "").trim().slice(0, 120);
  const status = String(body.status || "").trim().toLowerCase();
  if (!id || !ALLOWED_STATUSES.has(status)) return null;
  let awardAmount = null;
  if (body.awardAmount !== undefined && body.awardAmount !== null && body.awardAmount !== "") {
    const n = Number(body.awardAmount);
    if (!Number.isFinite(n) || n < 0 || n > 1e12) return null;
    awardAmount = Math.round(n);
  }
  const notes = String(body.notes || "").slice(0, MAX_NOTES_LEN);
  return { id, status, awardAmount, notes, updatedAt: new Date().toISOString() };
}

export default async function (req) {
  const user = await userFromAuth(req);
  if (!user) return json(401, { error: "Sign in required." });

  const store = getStore("grant-outcomes");
  const current = (await store.get(user.id, { type: "json" })) || [];
  const outcomes = Array.isArray(current) ? current : [];

  if (req.method === "GET") return json(200, { outcomes });

  if (req.method === "POST") {
    const raw = await req.text().catch(() => "");
    if (raw.length > MAX_RAW_BODY_LEN) return json(413, { error: "Request body is too large." });
    let parsed = null;
    try { parsed = JSON.parse(raw); } catch {}
    const outcome = cleanOutcome(parsed);
    if (!outcome) return json(400, { error: "A grant id and a valid status are required." });
    const next = [outcome, ...outcomes.filter(o => o.id !== outcome.id)].slice(0, MAX_RECORDS);
    await store.setJSON(user.id, next);
    return json(200, { ok: true, outcomes: next });
  }

  if (req.method === "DELETE") {
    await store.delete(user.id);
    return json(200, { ok: true, outcomes: [] });
  }

  return json(405, { error: "Method not allowed." });
}

export const config = {
  path: "/.netlify/functions/outcomes",
  rateLimit: {
    windowLimit: 30,
    windowSize: 60,
    aggregateBy: ["ip"]
  }
};
