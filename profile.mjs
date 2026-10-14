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

export default async function (req) {
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
  return json(405, { error: "Method not allowed." });
}

export const config = { path: "/.netlify/functions/profile" };
