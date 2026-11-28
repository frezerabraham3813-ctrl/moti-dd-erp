// One person's page (profile.html?id=...), for managers and admins.
// Score uses the same rule as the Performance page: 100 − 5×absent − 2×late − 2×(spare requests over the weekly limit) + manual points.
async function showPerson(id) {
  const box = document.getElementById("personView");
  box.hidden = false;
  const TZ = "Africa/Addis_Ababa";
  const today = new Date().toLocaleDateString("en-CA", { timeZone: TZ });
  const addDays = (s, n) => { const d = new Date(s + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
  const clock = ts => new Date(ts).toLocaleTimeString("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });
  const lateMins = r => { if (r.status !== "late" || !r.checked_at) return 0; const [h, m] = clock(r.checked_at).split(":").map(Number); return Math.max(0, h * 60 + m - 510); };
  const nice = d => new Date(d + "T12:00:00Z").toLocaleDateString(getLang() === "am" ? "am-ET" : "en-GB", { weekday: "short", day: "numeric", month: "short" });
  const chip = (text, kind = "") => `<span class="chip ${kind}">${esc(text)}</span>`;
  const m1 = today.slice(0, 8) + "01";
  const wFrom = addDays(today, -((new Date(today + "T00:00:00Z").getUTCDay() + 1) % 7)), wTo = addDays(wFrom, 6);   // Saturday → Friday
  const from = wFrom < m1 ? wFrom : m1;

  const [people, att, sent, recv, spare, adj, set] = await Promise.all([
    db.rpc("list_profiles"),
    db.from("attendance").select("*").eq("user_id", id).gte("day", from).order("day", { ascending: false }),
    db.from("shipments").select("amount, sent_at").eq("engineer_id", id).gte("sent_at", m1 + "T00:00:00+03:00"),
    db.from("shipments").select("id", { count: "exact", head: true }).eq("receiver_id", id).eq("status", "received").gte("sent_at", m1 + "T00:00:00+03:00"),
    db.from("spare_requests").select("requested_at, status").eq("requester_id", id).gte("requested_at", from + "T00:00:00+03:00"),
    db.from("performance_adjustments").select("points").eq("engineer_id", id).gte("adjustment_date", wFrom).lte("adjustment_date", wTo),
    db.from("performance_settings").select("weekly_spare_request_limit").maybeSingle(),
  ]);
  const u = (people.data || []).find(p => p.id === id);
  if (!u) { box.innerHTML = `<div class="card"><p>${t("personNotFound")}</p><a href="profile.html">${t("backTeam")}</a></div>`; return; }
  const role = t(u.role === "manager" ? "manager" : u.role === "admin" ? "admin" : "engineer");

  // Score this week
  const A = att.data || [], inWeek = d => d >= wFrom && d <= wTo;
  const W = A.filter(r => inWeek(r.day)), absent = W.filter(r => r.status === "absent").length, late = W.filter(r => r.status === "late").length;
  const limit = set.data ? set.data.weekly_spare_request_limit : 3;
  const reqW = (spare.data || []).filter(r => inWeek(new Date(r.requested_at).toLocaleDateString("en-CA", { timeZone: TZ }))).length, extra = Math.max(0, reqW - limit);
  const pts = (adj.data || []).reduce((x, r) => x + Number(r.points), 0);
  const score = Math.max(0, Math.min(100, 100 - 5 * absent - 2 * late - 2 * extra + pts));
  const label = score >= 90 ? t("excellent") : score >= 75 ? t("good") : score >= 60 ? t("fair") : t("low");
  const cls = score >= 75 ? "" : score >= 60 ? "mid" : "low";
  const why = [absent && chip(t("absentN", { n: absent }) + "  −" + 5 * absent, "bad"), late && chip(t("lateN", { n: late, m: W.reduce((x, r) => x + lateMins(r), 0) }) + "  −" + 2 * late, "warn"),
    extra && chip(t("extraN", { n: extra }) + "  −" + 2 * extra, "warn"), pts && chip(t("manualN", { n: (pts > 0 ? "+" : "") + pts }), pts > 0 ? "ok" : "bad")].filter(Boolean);

  // This month
  const M = A.filter(r => r.day >= m1), c = s => M.filter(r => r.status === s).length;
  const COLORS = { ready: "#22a565", late: "#e8a317", absent: "#e05a5a", leave: "#5b8fd0", field: "#8e6ed8" };
  const ICON = { ready: "✓", late: "⏰", absent: "✕", leave: "🌴", field: "🛠" };
  const S = sent.data || [], amount = S.reduce((x, r) => x + Number(r.amount || 0), 0);
  const spareMonth = (spare.data || []).filter(r => r.requested_at >= m1).length;

  box.innerHTML = `
    <div class="card person-head">
      ${avatar(u, "lg")}
      <div><h2>${esc(u.full_name)}</h2><div class="muted">${esc(role)}${u.employee_id ? " · " + esc(u.employee_id) : ""}</div>
        <p><a href="profile.html">← ${t("backTeam")}</a></p></div>
      <div class="person-score sc ${cls}"><small>${t("scoreThisWeek")}</small><b>${score.toFixed(0)}%</b><small>${esc(label)}</small>
        <div class="scorebar ${cls}"><i style="width:${score}%"></i></div></div>
    </div>
    <div class="card"><div class="card-head"><h2>${t("scoreThisWeek")}</h2><span class="muted">${esc(nice(wFrom))} → ${esc(nice(wTo))}</span></div>
      <div class="chips">${why.join("") || chip("✓ " + t("noProblems"), "ok")}</div>
      <p><a href="performance.html">${t("seeRanking")} ›</a></p></div>
    <div class="dash-top">
      <div class="card"><div class="card-head"><h2>${t("attMonth")}</h2><span class="muted">${esc(t("lateMinTotal", { n: M.reduce((x, r) => x + lateMins(r), 0) }))}</span></div>
        <div class="stats">${Object.keys(COLORS).map(s => `<div class="stat"><span class="dot" style="background:${COLORS[s]}">${ICON[s]}</span><div><b>${c(s)}</b><small>${t("st_" + s)}</small></div></div>`).join("")}</div>
        <p class="mini-title">${t("recentDays")}</p>
        <ul class="attn-list">${A.slice(0, 7).map(r => `<li><div><b>${esc(nice(r.day))}</b>${r.checked_at ? `<small>${esc(clock(r.checked_at))}</small>` : ""}</div><span class="badge ${r.status}">${t("st_" + r.status)}</span></li>`).join("") || `<li class="muted">${t("noRecord")}</li>`}</ul>
      </div>
      <div class="card"><div class="card-head"><h2>${t("workMonth")}</h2></div>
        <a class="attn-row" href="shipments.html"><span class="ico">📤</span><span class="txt">${t("shipSentN")}</span><span class="cnt">${S.length}</span></a>
        <a class="attn-row" href="shipments.html"><span class="ico">📥</span><span class="txt">${t("shipRecvN")}</span><span class="cnt">${recv.count || 0}</span></a>
        <a class="attn-row" href="shipments.html"><span class="ico">💵</span><span class="txt">${t("shipAmount")}</span><span class="cnt">${amount.toLocaleString()}</span></a>
        <a class="attn-row" href="spare.html"><span class="ico">🔧</span><span class="txt">${t("spareMadeN")}</span><span class="cnt">${spareMonth}</span></a>
      </div>
    </div>`;
  document.title = u.full_name + " - Moti DD ERP";
  const h1 = document.querySelector(".hero h1"); if (h1) h1.textContent = u.full_name;
}
