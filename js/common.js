// Shared helpers used by every page: database connection, login check, header.
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

// Top bar with menu, language switch and logout. Needs <header id="header"></header> in the page.
function renderHeader(profile) {
  const links = [["shipments.html", "shipments"]];
  if (profile.role === "manager") links.push(["users.html", "users"]);
  const page = location.pathname.split("/").pop() || "index.html";
  document.getElementById("header").innerHTML = `
    <div class="bar">
      <img src="img/logo-small.jpg" alt="Moti">
      <b>${t("appName")}</b>
      <span>${esc(profile.full_name)}</span>
      <select id="langSel"><option value="en">English</option><option value="am">አማርኛ</option></select>
      <button id="logoutBtn" class="secondary">${t("logout")}</button>
    </div>
    <nav>${links.map(([h, k]) => `<a href="${h}" class="${h === page ? "active" : ""}">${t(k)}</a>`).join("")}</nav>`;
  const sel = document.getElementById("langSel");
  sel.value = getLang();
  sel.onchange = () => setLang(sel.value);
  document.getElementById("logoutBtn").onclick = async () => { await db.auth.signOut(); location.href = "index.html"; };
}
