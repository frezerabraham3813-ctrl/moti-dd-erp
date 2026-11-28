// Animated machine drawings (inline SVG). The movements are in css/modern.css (classes a-*).
// Use: ART.atm(), ART.itm(), ART.part()  -> returns SVG text to put inside any element.
const ART = (() => {
  const keys = (x, y) => Array.from({ length: 9 }, (_, i) =>
    `<rect x="${x + (i % 3) * 13}" y="${y + Math.floor(i / 3) * 8}" width="10" height="5" rx="1.5" fill="#8fa3bd"/>`).join("");
  const base = (label, inner) => `<svg viewBox="0 0 160 200" role="img" aria-label="${label}" class="a-float">
    <ellipse cx="80" cy="194" rx="52" ry="5" fill="#000" opacity=".18"/>
    <rect x="22" y="8" width="116" height="182" rx="14" fill="#2b3a4d" stroke="#5b8fd0" stroke-width="2"/>${inner}</svg>`;
  const lower = `${keys(34, 112)}
    <rect x="82" y="110" width="46" height="7" rx="3" fill="#0b1a2b"/><circle class="a-led" cx="122" cy="113.5" r="2" fill="#25b36a"/>
    <rect x="82" y="122" width="46" height="22" rx="4" fill="#0b1a2b"/>
    <svg x="82" y="122" width="46" height="22" overflow="hidden"><rect class="a-bill" x="6" y="2" width="34" height="9" rx="1.5" fill="#3bbfae"/><rect class="a-bill b2" x="10" y="6" width="34" height="9" rx="1.5" fill="#f0b429"/></svg>
    <rect x="34" y="150" width="92" height="30" rx="6" fill="#1d2937"/><rect x="44" y="160" width="72" height="8" rx="3" fill="#0b1a2b"/>
    <rect class="a-receipt" x="66" y="158" width="28" height="14" rx="1" fill="#fff"/>`;
  const head = (c, name) => `<rect x="30" y="16" width="100" height="20" rx="6" fill="${c}"/>
    <text x="80" y="31" text-anchor="middle" font-size="13" font-weight="800" fill="#fff" font-family="Arial,sans-serif" letter-spacing="2">${name}</text>
    <rect x="34" y="42" width="92" height="60" rx="7" fill="#0b1a2b"/>`;
  return {
    // NCR-style cash machine: glowing screen, blinking card light, cash coming out
    atm: () => base("NCR ATM", `${head("#3a68a3", "NCR")}
      <rect class="a-screen" x="38" y="46" width="84" height="52" rx="5" fill="#3bbfae"/>
      <rect x="46" y="54" width="50" height="5" rx="2" fill="#fff" opacity=".9"/><rect x="46" y="64" width="36" height="4" rx="2" fill="#fff" opacity=".6"/>
      <circle class="a-pulse" cx="104" cy="78" r="9" fill="#fff" opacity=".9"/><text x="104" y="82" text-anchor="middle" font-size="11" font-weight="800" fill="#178a50" font-family="Arial">Br</text>
      <rect class="a-scan" x="38" y="46" width="84" height="6" rx="3" fill="#fff" opacity=".25"/>${lower}`),
    // ITM: video-teller screen with a live agent and a blinking camera light
    itm: () => base("ITM", `${head("#7b5cc4", "ITM")}
      <rect class="a-screen" x="38" y="46" width="84" height="52" rx="5" fill="#5b8fd0"/>
      <path d="M58 98 q0-20 22-20 q22 0 22 20z" fill="#1f3a5f"/><circle cx="80" cy="68" r="11" fill="#ffd9b3"/>
      <path d="M69 66 q0-12 11-12 q11 0 11 12" fill="none" stroke="#2b3a4d" stroke-width="3"/><rect x="67" y="64" width="4" height="8" rx="2" fill="#2b3a4d"/>
      <circle class="a-blink" cx="76" cy="68" r="1.6" fill="#1b1f24"/><circle class="a-blink" cx="84" cy="68" r="1.6" fill="#1b1f24"/>
      <rect class="a-bubble" x="96" y="50" width="22" height="12" rx="6" fill="#fff"/><circle class="a-led" cx="46" cy="52" r="3" fill="#ea6a6a"/>${lower}`),
    // Spare parts: circuit board with a blinking chip and turning gears
    part: () => `<svg viewBox="0 0 200 160" role="img" aria-label="Spare parts" class="a-float">
      <rect x="14" y="36" width="120" height="90" rx="10" fill="#178a50" stroke="#7be0a8" stroke-width="2"/>
      <path d="M28 56h30v16h22M28 100h40v-14h30M110 52v24h14M90 112h30" fill="none" stroke="#7be0a8" stroke-width="2.5" stroke-linecap="round"/>
      <rect x="58" y="62" width="36" height="36" rx="5" fill="#1b1f24"/><rect class="a-chip" x="66" y="70" width="20" height="20" rx="3" fill="#3bbfae"/>
      <circle class="a-led" cx="122" cy="108" r="3" fill="#f0b429"/><circle cx="26" cy="114" r="3" fill="#d6e0ee"/>
      <g class="a-spin" style="transform-origin:150px 62px"><circle cx="150" cy="62" r="26" fill="none" stroke="#f0b429" stroke-width="9" stroke-dasharray="7 6.2"/><circle cx="150" cy="62" r="20" fill="#f0b429"/><circle cx="150" cy="62" r="7" fill="#1f3a5f"/></g>
      <g class="a-spin-r" style="transform-origin:146px 112px"><circle cx="146" cy="112" r="17" fill="none" stroke="#8fa3bd" stroke-width="7" stroke-dasharray="5 4.2"/><circle cx="146" cy="112" r="12" fill="#8fa3bd"/><circle cx="146" cy="112" r="4" fill="#1f3a5f"/></g>
      <rect x="30" y="8" width="54" height="22" rx="4" fill="#2b3a4d"/><text x="57" y="23" text-anchor="middle" font-size="10" font-weight="800" fill="#fff" font-family="Arial">SPARE</text></svg>`,
  };
})();

// Login page: show the three machines under the logo (no change to index.html needed)
(() => {
  const logo = document.querySelector(".login-card .login-logo");
  if (logo) logo.insertAdjacentHTML("afterend", `<div class="login-art">${ART.atm()}${ART.itm()}${ART.part()}</div>`);
})();
