import { getStore } from "@netlify/blobs";

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}

function userFromAuth(req) {
  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
    if (!payload.sub && !payload.email) return null;
    return { id: payload.sub || payload.email, email: payload.email || "" };
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
    const next = grants.filter(g => g.id !== id);
    await store.setJSON(user.id, next);
    return json(200, { ok: true, grants: next });
  }

  return json(405, { error: "Method not allowed." });
}

export const config = { path: "/.netlify/functions/saved-grants" };
