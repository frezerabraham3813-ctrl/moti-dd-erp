// All visible text lives here. To change a word or add a language, edit this file only.
const TEXT = {
  en: {
    appName: "Moti Dire Dawa ERP", username: "Username", password: "Password",
    login: "Log in", logout: "Log out", forgot: "Forgot password?",
    wrongLogin: "Wrong username or password.", enterUsername: "Enter your username first.",
    requestSent: "Request sent to the manager.", shipments: "Shipments", users: "Users",
    loading: "Loading...", error: "Something went wrong.",
  },
  am: {
    appName: "ሞቲ ድሬዳዋ ERP", username: "የተጠቃሚ ስም", password: "የይለፍ ቃል",
    login: "ግባ", logout: "ውጣ", forgot: "የይለፍ ቃል ረሳሁ?",
    wrongLogin: "የተጠቃሚ ስም ወይም የይለፍ ቃል ልክ አይደለም።", enterUsername: "መጀመሪያ የተጠቃሚ ስምዎን ያስገቡ።",
    requestSent: "ጥያቄዎ ለማናጀሩ ተልኳል።", shipments: "የእቃ ሪፖርት", users: "ተጠቃሚዎች",
    loading: "በመጫን ላይ...", error: "ችግር ተፈጥሯል።",
  },
};

function getLang() { return localStorage.getItem("lang") || "en"; }
function setLang(l) { localStorage.setItem("lang", l); location.reload(); }
function t(key) { return (TEXT[getLang()] || TEXT.en)[key] || key; }

// Fills elements that have data-t="key" (text) or data-ph="key" (placeholder)
function translatePage() {
  document.querySelectorAll("[data-t]").forEach(el => (el.textContent = t(el.dataset.t)));
  document.querySelectorAll("[data-ph]").forEach(el => (el.placeholder = t(el.dataset.ph)));
}
