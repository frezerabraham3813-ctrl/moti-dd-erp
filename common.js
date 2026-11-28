// Shared helpers used by every page: database connection, login check, header, notifications bell.
// Round-3 words, the machine drawings and the modern look are loaded here, so every page gets them.
if (!window.__r1) document.write('<script src="js/i18n-round1.js"><\/script>');
if (!window.__r3) document.write('<script src="js/i18n-round3.js"><\/script>');
if (typeof ART === "undefined") document.write('<script src="js/art.js"><\/script>');
document.head.insertAdjacentHTML("beforeend", '<link rel="stylesheet" href="css/modern.css">');

// Light / dark look: saved in this browser; "auto" follows the phone
const THEME = {
  get: () => localStorage.getItem("theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
  apply() {
    const d = this.get(); document.documentElement.dataset.theme = d;
    const m = document.querySelector("meta[name=theme-color]"); if (m) m.content = d === "dark" ? "#0f1722" : "#3a68a3";
    if (window.Chart) { Chart.defaults.color = d === "dark" ? "#cbd5e1" : "#475569"; Chart.defaults.borderColor = d === "dark" ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"; }
  },
  set(v) { v === "auto" ? localStorage.removeItem("theme") : localStorage.setItem("theme", v); location.reload(); },
};
THEME.apply();

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

// Small message that pops up for a few seconds (used for new notifications)
function toast(text) {
  let box = document.getElementById("toasts");
  if (!box) { box = document.createElement("div"); box.id = "toasts"; document.body.appendChild(box); }
  const el = document.createElement("div");
  el.className = "toast"; el.textContent = text;
  box.appendChild(el);
  setTimeout(() => el.remove(), 7000);
}

// Round picture with the photo, or the first letter of the name when there is no photo
function avatar(p, size = "") {
  return p.photo ? `<img class="avatar ${size}" src="${esc(p.photo)}" alt="">` : `<span class="avatar ${size}">${esc((p.full_name || "?").trim().charAt(0).toUpperCase())}</span>`;
}

// Which machine drawing and which title each page shows in its banner
const HERO = { "dashboard.html": ["atm", "dashboard"], "shipments.html": ["part", "shipments"], "spare.html": ["part", "spareNav"],
  "attendance.html": ["itm", "attendance"], "users.html": ["atm", "users"],
  "performance.html": ["atm", "performance"], "analysis.html": ["part", "analysis"], "profile.html": ["itm", "profile"] };

// Top bar with menu, notifications, language switch and logout. Needs <header id="header"></header> in the page.
function renderHeader(profile) {
  const links = [["dashboard.html", "dashboard"], ["shipments.html", "shipments"], ["spare.html", "spareNav"], ["attendance.html", "attendance"], ["performance.html", "performance"]];
  if (canView(profile)) links.push(["analysis.html", "analysis"]);
  if (isManager(profile)) links.push(["users.html", "users"]);
  const page = location.pathname.split("/").pop() || "index.html";
  const hero = HERO[page];
  document.getElementById("header").innerHTML = `
    <div class="bar">
      <img src="img/logo-small.jpg" alt="Moti">
      <b>${t("appName")}</b>
      <a class="who" href="profile.html">${avatar(profile)}<span>${esc(profile.full_name)}${profile.role === "admin" ? ` <span class="role-pill">${t("admin")}</span>` : ""}</span></a>
      <button id="themeBtn" class="secondary" aria-label="${esc(t("theme"))}">${THEME.get() === "dark" ? "☀️" : "🌙"}</button>
      <button id="bellBtn" class="secondary" aria-label="${esc(t("notifications"))}">🔔<span id="bellN"></span></button>
      <select id="langSel"><option value="en">English</option><option value="am">አማርኛ</option></select>
      <button id="logoutBtn" class="secondary">${t("logout")}</button>
    </div>
    <div id="notePanel" class="panel" hidden></div>
    <nav>${links.map(([h, k]) => `<a href="${h}" class="${h === page ? "active" : ""}">${t(k)}</a>`).join("")}</nav>
    ${hero && typeof ART !== "undefined" ? `<div class="hero"><div><h1>${t(hero[1])}</h1><p>${t("loginSub")}</p></div><div class="art">${ART[hero[0]]()}</div></div>` : ""}`;
  const sel = document.getElementById("langSel");
  sel.value = getLang();
  sel.onchange = () => setLang(sel.value);
  document.getElementById("logoutBtn").onclick = async () => { await db.auth.signOut(); location.href = "index.html"; };
  document.getElementById("bellBtn").onclick = toggleBell;
  document.getElementById("themeBtn").onclick = () => THEME.set(THEME.get() === "dark" ? "light" : "dark");
  document.getElementById("notePanel").onclick = onNoteClick;
  // Marks holidays / absent / late for everyone, then loads the messages
  db.rpc("sync_attendance").then(refreshBell, refreshBell);
  setInterval(refreshBell, 30000);   // new messages (spare-part answers, "received") pop up without reloading
}

// ----- Notifications (late, absent, leave, shipments, spare parts) - can be deleted after reading -----
let NOTES = [], SEEN = null;
const noteText = n => t("n_" + n.kind, { sender: "", note: "", ...(n.data || {}) });
async function refreshBell() {
  const { data } = await db.from("notifications").select("*").order("created_at", { ascending: false }).limit(30);
  NOTES = data || [];
  // After the first load, every new unread message also pops up as a toast
  if (SEEN) NOTES.filter(n => !n.read && !SEEN.has(n.id)).slice(0, 3).forEach(n => toast(noteText(n)));
  SEEN = new Set(NOTES.map(n => n.id));
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
      NOTES.map(n => `<div class="note-item${n.read ? "" : " unread"}"><div class="txt">${esc(noteText(n))}<small>${esc(when(n.created_at))}</small></div>
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
