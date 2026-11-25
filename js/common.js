// Shared helpers used by every page: database connection, login check, header, notifications bell.
const db = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

function toEmail(username) { return username.trim().toLowerCase() + "@" + CONFIG.EMAIL_DOMAIN; }

// Stops text from being run as HTML (security). Use esc() on any user-entered text you display.
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Call at the top of each page. Returns { session, profile } or sends the user to the login page.
async function requireLogin(managerOnly = false) {
  const { data: { session } } = await db.auth.getSession();
  if (!session) { location.href = "index.html"; return null; }
  const { data: profile } = await db.from("profiles").select("*").eq("id", session.user.id).single();
  if (!profile || !profile.active) { await db.auth.signOut(); location.href = "index.html"; return null; }
  if (managerOnly && profile.role !== "manager") { location.href = "shipments.html"; return null; }
  return { session, profile };
}

// Top bar with menu, notifications, language switch and logout. Needs <header id="header"></header> in the page.
function renderHeader(profile) {
  const links = [["shipments.html", "shipments"], ["attendance.html", "attendance"]];
  if (profile.role === "manager") links.push(["users.html", "users"]);
  const page = location.pathname.split("/").pop() || "index.html";
  document.getElementById("header").innerHTML = `
    <div class="bar">
      <img src="img/logo-small.jpg" alt="Moti">
      <b>${t("appName")}</b>
      <span>${esc(profile.full_name)}</span>
      <button id="bellBtn" class="secondary" aria-label="${esc(t("notifications"))}">🔔<span id="bellN"></span></button>
      <select id="langSel"><option value="en">English</option><option value="am">አማርኛ</option></select>
      <button id="logoutBtn" class="secondary">${t("logout")}</button>
    </div>
    <div id="notePanel" class="panel" hidden></div>
    <nav>${links.map(([h, k]) => `<a href="${h}" class="${h === page ? "active" : ""}">${t(k)}</a>`).join("")}</nav>`;
  const sel = document.getElementById("langSel");
  sel.value = getLang();
  sel.onchange = () => setLang(sel.value);
  document.getElementById("logoutBtn").onclick = async () => { await db.auth.signOut(); location.href = "index.html"; };
  document.getElementById("bellBtn").onclick = toggleBell;
  // Marks holidays / absent / late for everyone, then loads the messages
  db.rpc("sync_attendance").then(refreshBell, refreshBell);
}

// ----- Notifications (late, absent, leave, shipments) -----
let NOTES = [];
async function refreshBell() {
  const { data } = await db.from("notifications").select("*").order("created_at", { ascending: false }).limit(20);
  NOTES = data || [];
  const n = NOTES.filter(x => !x.read).length;
  const el = document.getElementById("bellN");
  if (el) el.textContent = n ? " " + n : "";
}

async function toggleBell() {
  const p = document.getElementById("notePanel");
  if (!p.hidden) { p.hidden = true; return; }
  const when = x => new Date(x).toLocaleString(getLang() === "am" ? "am-ET" : "en-GB");
  p.innerHTML = NOTES.length
    ? NOTES.map(n => `<div class="note-item${n.read ? "" : " unread"}">${esc(t("n_" + n.kind, n.data || {}))}<small>${esc(when(n.created_at))}</small></div>`).join("")
    : `<div class="note-item">${t("noNotes")}</div>`;
  p.hidden = false;
  if (NOTES.some(x => !x.read)) {
    await db.from("notifications").update({ read: true }).eq("read", false);
    document.getElementById("bellN").textContent = "";
  }
}
