// Vercel server function: lets a MANAGER create users and set passwords.
// Uses the SECRET key, which lives only in Vercel > Settings > Environment Variables.
// Needed variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (the "secret" key).

const BASE = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
// New "sb_secret_" keys go in the apikey header only; old JWT-style keys are sent in both.
const svc = { apikey: KEY, ...(KEY && KEY.startsWith("eyJ") ? { Authorization: "Bearer " + KEY } : {}) };

const call = (path, opts = {}) =>
  fetch(BASE + path, { ...opts, headers: { "Content-Type": "application/json", ...svc, ...(opts.headers || {}) } });

module.exports = async (req, res) => {
  const fail = (code, error) => res.status(code).json({ error });
  try {
    if (req.method !== "POST") return fail(405, "POST only");
    if (!BASE || !KEY) return fail(500, "Server is not configured (missing environment variables).");

    // 1) Who is calling? Check their login token.
    const token = (req.headers.authorization || "").replace("Bearer ", "");
    const who = await fetch(BASE + "/auth/v1/user", { headers: { apikey: KEY, Authorization: "Bearer " + token } });
    if (!who.ok) return fail(401, "Not logged in.");
    const caller = await who.json();

    // 2) Are they an active manager?
    const prof = await (await call(`/rest/v1/profiles?id=eq.${caller.id}&select=role,active`)).json();
    if (!prof[0] || prof[0].role !== "manager" || !prof[0].active) return fail(403, "Managers only.");

    const { action, username, full_name, password, role } = req.body || {};
    if (!/^[a-z0-9._-]{3,30}$/.test(username || "")) return fail(400, "Username: 3-30 letters/numbers (a-z, 0-9, . _ -).");
    if (!password || password.length < 8) return fail(400, "Password must be at least 8 characters.");
    const email = `${username}@${process.env.EMAIL_DOMAIN || "moti.local"}`;

    if (action === "create") {
      if (!full_name) return fail(400, "Full name is required.");
      const r = await call("/auth/v1/admin/users", { method: "POST", body: JSON.stringify({ email, password, email_confirm: true }) });
      const made = await r.json();
      if (!r.ok) return fail(400, made.msg || made.message || "Could not create user (username may already exist).");
      const p = await call("/rest/v1/profiles", {
        method: "POST", headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ id: made.id, username, full_name, role: ["manager", "admin"].includes(role) ? role : "engineer" }),
      });
      if (!p.ok) { await call(`/auth/v1/admin/users/${made.id}`, { method: "DELETE" }); return fail(400, "Could not save profile (username may already exist)."); }
      return res.json({ ok: true });
    }

    if (action === "setpassword") {
      const found = await (await call(`/rest/v1/profiles?username=eq.${username}&select=id`)).json();
      if (!found[0]) return fail(404, "No such user.");
      const r = await call(`/auth/v1/admin/users/${found[0].id}`, { method: "PUT", body: JSON.stringify({ password }) });
      if (!r.ok) return fail(400, "Could not change password.");
      return res.json({ ok: true });
    }

    return fail(400, "Unknown action.");
  } catch (e) {
    return fail(500, "Server error.");
  }
};
