// All visible text lives here. To change a word or add a language, edit this file only.
// {n} style words are filled in by the program.
const TEXT = {
  en: {
    appName: "Moti Dire Dawa ERP", username: "Username", password: "Password",
    login: "Log in", logout: "Log out", forgot: "Forgot password?",
    wrongLogin: "Wrong username or password.", enterUsername: "Enter your username first.",
    requestSent: "Request sent to the manager.", shipments: "Shipments", users: "Users",
    loading: "Loading...", error: "Something went wrong.",
    newShipment: "New shipment", editShipment: "Edit shipment", receiver: "Receiver name",
    voucher: "Voucher no", plate: "Plate number", from: "From", to: "To", itemType: "Item type",
    quantity: "Quantity", amount: "Amount paid (birr)", save: "Save", update: "Update", cancel: "Cancel",
    edit: "Edit", del: "Delete", confirmDelete: "Delete this record?", dateTime: "Date & time",
    engineer: "Engineer", manager: "Manager", status: "Status", sent: "Sent", received: "Received",
    markReceived: "I received it", total: "Total", saved: "Saved.", noData: "No records yet.",
    actions: "Actions", fillRequired: "Please fill the required fields.",
    reportDue: "Unreported total is {n} birr (limit {limit}). Report is ready.",
    markReported: "Mark as reported", unreportedTotal: "Total not yet reported",
    createUser: "Create user", fullName: "Full name", tempPassword: "Temporary password (min 8)",
    role: "Role", active: "Active", deactivate: "Deactivate", activate: "Activate",
    setPassword: "Set new password", newPasswordPrompt: "New password (min 8 characters):",
    passwordRequests: "Password requests", reject: "Reject", noRequests: "No pending requests.",
    userCreated: "User created.", done: "Done.", yes: "Yes", no: "No",
  },
  am: {
    appName: "ሞቲ ድሬዳዋ ERP", username: "የተጠቃሚ ስም", password: "የይለፍ ቃል",
    login: "ግባ", logout: "ውጣ", forgot: "የይለፍ ቃል ረሳሁ?",
    wrongLogin: "የተጠቃሚ ስም ወይም የይለፍ ቃል ልክ አይደለም።", enterUsername: "መጀመሪያ የተጠቃሚ ስምዎን ያስገቡ።",
    requestSent: "ጥያቄዎ ለማናጀሩ ተልኳል።", shipments: "የእቃ ሪፖርት", users: "ተጠቃሚዎች",
    loading: "በመጫን ላይ...", error: "ችግር ተፈጥሯል።",
    newShipment: "አዲስ የእቃ ሪፖርት", editShipment: "ሪፖርት አስተካክል", receiver: "የተቀባይ ስም",
    voucher: "የቫውቸር ቁጥር", plate: "የታርጋ ቁጥር", from: "ከ", to: "ወደ", itemType: "የእቃ ዓይነት",
    quantity: "ብዛት", amount: "የተከፈለ ብር", save: "አስቀምጥ", update: "አዘምን", cancel: "ተው",
    edit: "አስተካክል", del: "ሰርዝ", confirmDelete: "ይህ ሪፖርት ይሰረዝ?", dateTime: "ቀንና ሰዓት",
    engineer: "ኢንጂነር", manager: "ማናጀር", status: "ሁኔታ", sent: "ተልኳል", received: "ተቀብሏል",
    markReceived: "ተቀብያለሁ", total: "ድምር", saved: "ተቀምጧል።", noData: "ገና ምንም ሪፖርት የለም።",
    actions: "ተግባር", fillRequired: "እባክዎ አስፈላጊ መስኮችን ይሙሉ።",
    reportDue: "ገና ሪፖርት ያልተደረገ ድምር {n} ብር ሆኗል (ገደብ {limit})። ሪፖርቱ ዝግጁ ነው።",
    markReported: "ሪፖርት ተደርጓል በል", unreportedTotal: "ገና ሪፖርት ያልተደረገ ድምር",
    createUser: "ተጠቃሚ ፍጠር", fullName: "ሙሉ ስም", tempPassword: "ጊዜያዊ የይለፍ ቃል (ቢያንስ 8)",
    role: "ሚና", active: "ንቁ", deactivate: "አቁም", activate: "አንቃ",
    setPassword: "አዲስ የይለፍ ቃል ስጥ", newPasswordPrompt: "አዲስ የይለፍ ቃል (ቢያንስ 8 ቁምፊ)፦",
    passwordRequests: "የይለፍ ቃል ጥያቄዎች", reject: "ውድቅ አድርግ", noRequests: "ምንም ጥያቄ የለም።",
    userCreated: "ተጠቃሚ ተፈጥሯል።", done: "ተጠናቀቀ።", yes: "አዎ", no: "አይ",
  },
};

function getLang() { return localStorage.getItem("lang") || "en"; }
function setLang(l) { localStorage.setItem("lang", l); location.reload(); }
function t(key, vars = {}) {
  let s = (TEXT[getLang()] || TEXT.en)[key] || TEXT.en[key] || key;
  for (const k in vars) s = s.split("{" + k + "}").join(vars[k]);
  return s;
}

// Fills elements that have data-t="key" (text) or data-ph="key" (placeholder)
function translatePage() {
  document.querySelectorAll("[data-t]").forEach(el => (el.textContent = t(el.dataset.t)));
  document.querySelectorAll("[data-ph]").forEach(el => (el.placeholder = t(el.dataset.ph)));
}
