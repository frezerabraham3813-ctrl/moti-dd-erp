// Shared helpers used by every page: database connection, login check, header, notifications bell.
const db = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);

function toEmail(username) { return username.trim().toLowerCase() + "@" + CONFIG.EMAIL_DOMAIN; }

// Stops text from being run as HTML (security). Use esc() on any user-entered text you display.
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Roles: engineer (works), manager (full control), admin (view only: watches everything)
const isManager = p => p.role === "manager";
const canView = p => p.role === "manager" || p.role === "admin";

// Call at the top of each page. Returns { session, profile } or sends the user to the login page.
async function requireLogin(managerOnly = false) {
  const { data: { session } } = await db.auth.getSession();
  if (!session) { location.href = "index.html"; return null; }
  const { data: profile } = await db.from("profiles").select("*").eq("id", session.user.id).single();
  if (!profile || !profile.active) { await db.auth.signOut(); location.href = "index.html"; return null; }
  if (managerOnly && profile.role !== "manager") { location.href = "dashboard.html"; return null; }
  return { session, profile };
}

// Numbers that count up (dashboard)
function countUp(el, to, ms = 900) {
  const start = performance.now();
  const step = now => {
    const k = Math.min(1, (now - start) / ms);
    el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString();
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Top bar with menu, notifications, language switch and logout. Needs <header id="header"></header> in the page.
function renderHeader(profile) {
  const links = [["dashboard.html", "dashboard"], ["shipments.html", "shipments"], ["spare.html", "spareNav"], ["attendance.html", "attendance"]];
  if (isManager(profile)) links.push(["users.html", "users"]);
  const page = location.pathname.split("/").pop() || "index.html";
  document.getElementById("header").innerHTML = `
    <div class="bar">
      <img src="img/logo-small.jpg" alt="Moti">
      <b>${t("appName")}</b>
      <span>${esc(profile.full_name)}${profile.role === "admin" ? ` <span class="role-pill">${t("admin")}</span>` : ""}</span>
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
  document.getElementById("notePanel").onclick = onNoteClick;
  // Marks holidays / absent / late for everyone, then loads the messages
  db.rpc("sync_attendance").then(refreshBell, refreshBell);
}

// ----- Notifications (late, absent, leave, shipments) - can be deleted after reading -----
let NOTES = [];
async function refreshBell() {
  const { data } = await db.from("notifications").select("*").order("created_at", { ascending: false }).limit(30);
  NOTES = data || [];
  updateBellCount();
}
function updateBellCount() {
  const el = document.getElementById("bellN");
  if (el) { const n = NOTES.filter(x => !x.read).length; el.textContent = n ? " " + n : ""; }
}
function drawNotes() {
  const p = document.getElementById("notePanel");
  const when = x => new Date(x).toLocaleString(getLang() === "am" ? "am-ET" : "en-GB");
  p.innerHTML = NOTES.length
    ? `<div class="panel-head"><button class="secondary" data-del="all">${t("clearAll")}</button></div>` +
      NOTES.map(n => `<div class="note-item${n.read ? "" : " unread"}"><div class="txt">${esc(t("n_" + n.kind, { sender: "", note: "", ...(n.data || {}) }))}<small>${esc(when(n.created_at))}</small></div>
        <button class="secondary" data-del="${n.id}" aria-label="${esc(t("deleteNote"))}">✕</button></div>`).join("")
    : `<div class="note-item">${t("noNotes")}</div>`;
}
async function toggleBell() {
  const p = document.getElementById("notePanel");
  if (!p.hidden) { p.hidden = true; return; }
  drawNotes(); p.hidden = false;
  if (NOTES.some(x => !x.read)) {
    await db.from("notifications").update({ read: true }).eq("read", false);
    NOTES.forEach(n => (n.read = true)); updateBellCount();
  }
}
async function onNoteClick(e) {
  const b = e.target.closest("button[data-del]");
  if (!b) return;
  if (b.dataset.del === "all") { await db.from("notifications").delete().in("id", NOTES.map(n => n.id)); NOTES = []; }
  else { await db.from("notifications").delete().eq("id", b.dataset.del); NOTES = NOTES.filter(n => n.id !== b.dataset.del); }
  drawNotes(); updateBellCount();
}
