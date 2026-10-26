import { getStore } from "@netlify/blobs";

// Pilot usage counters: per-user, per-day counts of eligibility checks run
// and grants saved. Counts ONLY — no grant text, no names, no emails, no
// profile content. The store key is "<userId>:<UTC date>:<check|save>" and
// the value is a plain integer string.
//
// Why this exists: the pilot plan measures activation and retention from
// behavior, not from what testers remember to email. Without counters the
// pilot cannot tell whether the product worked.
//
// Privacy notes:
// - The bearer token is validated server-side by the Identity service
//   itself (same userFromAuth pattern as saved-grants/profile). An
//   unauthenticated caller gets 401, fail-closed.
// - A user reading their own counts (GET, no report key) sees only keys
//   prefixed with their own user id.
// - The cohort report (GET with x-usage-report-key) returns opaque
//   Netlify Identity user ids only — never emails or names. The founder
//   maps ids to testers via the Netlify Identity user list.
// - The cohort report is disabled unless USAGE_REPORT_KEY is set in
//   Netlify environment variables. If it is unset, the report returns
//   403 rather than opening the data.
// - Increments are read-modify-write, so two simultaneous increments
//   from the same user could lose one count. At pilot scale (human-speed
//   actions from ~10 users) that is acceptable: these counts steer a
//   build decision, they are not billing.

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

function utcToday() {
  return new Date().toISOString().slice(0, 10);
}

// List every key in the store, following Blobs pagination. Capped so a
// runaway store cannot hang the function; the pilot cohort is ~10 users,
// so the cap is far above any real size.
async function listAllKeys(store, prefix) {
  const keys = [];
  let cursor = undefined;
  for (let page = 0; page < 20 && keys.length < 5000; page++) {
    const res = await store.list({ prefix, cursor });
    for (const blob of res.blobs || []) keys.push(blob.key);
    cursor = res.cursor;
    if (!cursor) break;
  }
  return keys;
}

function parseKey(key) {
  const parts = key.split(':');
  if (parts.length !== 3) return null;
  const [userId, date, event] = parts;
  if (!userId || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  if (event !== 'check' && event !== 'save') return null;
  return { userId, date, event };
}

export default async function (req) {
  const user = await userFromAuth(req);
  if (!user) return json(401, { error: "Sign in required." });

  const store = getStore("usage-counts");

  if (req.method === "POST") {
    const raw = await req.text().catch(() => "");
    if (raw.length > MAX_RAW_BODY_LEN) return json(413, { error: "Request body is too large." });
    let body = null;
    try { body = JSON.parse(raw); } catch {}
    const event = body && body.event;
    if (event !== 'check' && event !== 'save') {
      return json(400, { error: "event must be 'check' or 'save'." });
    }
    const key = user.id + ':' + utcToday() + ':' + event;
    const current = await store.get(key);
    const next = (current === null ? 0 : (parseInt(current, 10) || 0)) + 1;
    await store.set(key, String(next));
    return json(200, { ok: true, event, count: next });
  }

  if (req.method === "GET") {
    const reportKey = req.headers.get('x-usage-report-key') || '';
    const configuredKey = process.env.USAGE_REPORT_KEY || '';
    if (reportKey && configuredKey && reportKey === configuredKey) {
      // Cohort report for the founder: per-user, per-day counts, opaque
      // user ids only. No emails, no names, no grant text.
      const keys = await listAllKeys(store, '');
      const users = {};
      for (const key of keys) {
        const parsed = parseKey(key);
        if (!parsed) continue;
        const value = await store.get(key);
        const count = value === null ? 0 : (parseInt(value, 10) || 0);
        users[parsed.userId] = users[parsed.userId] || {};
        users[parsed.userId][parsed.date] = users[parsed.userId][parsed.date] || { checks: 0, saves: 0 };
        if (parsed.event === 'check') users[parsed.userId][parsed.date].checks += count;
        else users[parsed.userId][parsed.date].saves += count;
      }
      return json(200, { users });
    }
    if (reportKey) {
      // A report key was offered but does not match (or none is
      // configured): fail closed, do not fall through to anything else.
      return json(403, { error: "Cohort report is not enabled." });
    }
    // Own counts only.
    const keys = await listAllKeys(store, user.id + ':');
    const days = {};
    for (const key of keys) {
      const parsed = parseKey(key);
      if (!parsed) continue;
      const value = await store.get(key);
      const count = value === null ? 0 : (parseInt(value, 10) || 0);
      days[parsed.date] = days[parsed.date] || { checks: 0, saves: 0 };
      if (parsed.event === 'check') days[parsed.date].checks += count;
      else days[parsed.date].saves += count;
    }
    const sorted = Object.keys(days).sort().map(date => ({ date, checks: days[date].checks, saves: days[date].saves }));
    return json(200, { days: sorted });
  }

  return json(405, { error: "Method not allowed." });
}

export const config = {
  path: "/.netlify/functions/usage",
  rateLimit: { windowLimit: 30, windowSize: 60, aggregateBy: ["ip"] }
};
