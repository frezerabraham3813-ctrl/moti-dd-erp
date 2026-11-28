// Pending timer: shows minutes, then hours, then days. Starts counting from the time given.
// Use pendingBadge(timestamp) inside any page; every badge on the page updates itself.
function pendingText(ts) {
  const u = getLang() === "am" ? { m: "ደ", h: "ሰ", d: "ቀን" } : { m: "m", h: "h", d: "d" };
  const mins = Math.max(0, Math.floor((Date.now() - new Date(ts).getTime()) / 60000));
  if (mins < 60) return mins + u.m;
  if (mins < 1440) return Math.floor(mins / 60) + u.h + " " + (mins % 60) + u.m;
  return Math.floor(mins / 1440) + u.d + " " + Math.floor((mins % 1440) / 60) + u.h;
}
const isOld = ts => Date.now() - new Date(ts).getTime() >= 86400000;   // 24 hours -> red
function pendingBadge(ts) {
  return `<span class="pending-timer${isOld(ts) ? " old" : ""}" data-since="${esc(ts)}">⏳ ${pendingText(ts)}</span>`;
}

(function startTimers() {
  const css = document.createElement("style");
  css.textContent = `.pending-timer{display:inline-block;margin-left:6px;padding:2px 8px;border-radius:999px;font-size:.78rem;font-weight:600;
    background:#fff4d6;color:#8a5b00;white-space:nowrap}.pending-timer.old{background:#fde2e2;color:#b42318}`;
  document.head.appendChild(css);
  setInterval(() => document.querySelectorAll("[data-since]").forEach(el => {
    el.textContent = "⏳ " + pendingText(el.dataset.since);
    el.classList.toggle("old", isOld(el.dataset.since));
  }), 30000);
})();
