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

    // shipments: receiver + pending
    receiverEng: "Send to (receiving engineer)", selectOne: "— select —", pending: "Pending",
    // attendance
    attendance: "Attendance", iAmReady: "I'm ready for work", iAmField: "I'm in the field",
    attendanceRule: "Press \"I'm ready\" between 1:30 and 2:30 (Ethiopian morning time). From 2:30 to 3:30 you are marked late. After 3:30 you are marked absent.",
    holidayToday: "Today is a day off: {name}.", tooEarly: "Too early. The button opens at 1:30 (Ethiopian morning time).",
    st_none: "Not marked yet", st_ready: "Ready for work", st_late: "Late", st_absent: "Absent",
    st_leave: "On leave", st_field: "Field", st_dayoff: "Day off",
    date: "Date", time: "Time", reason: "Reason", approved: "Approved",
    myRecords: "My attendance (last 31 days)", dayBoard: "Attendance board", editRecord: "Edit record",
    leave: "Leave", requestLeave: "Request leave", fromDate: "From date", toDate: "To date",
    sendRequest: "Send request", leaveSent: "Leave request sent.", myLeaves: "My leave requests",
    leaveRequests: "Leave requests waiting", approve: "Approve", managerNote: "Manager note",
    ls_pending: "Pending", ls_approved: "Approved", ls_rejected: "Rejected",
    holidays: "Holidays / days off", holidayName: "Name", add: "Add",
    reports: "Reports (Saturday – Friday)", weeklyReport: "Weekly report", monthlyReport: "Monthly report",
    download: "Download Excel", summary: "Summary", daily: "Daily",
    notifications: "Notifications", noNotes: "No notifications.",
    // notification messages
    n_late: "You are late. Press \"I'm ready\" now; after 3:30 you will be marked absent.",
    n_late_mgr: "{name} is late on {day}.",
    n_absent: "You were not at work on {day}. You are marked absent.",
    n_absent_mgr: "{name} is absent on {day}.",
    n_field_mgr: "{name} is in the field today.",
    n_leave_req_mgr: "{name} requested leave: {from} to {to}.",
    n_leave_approved: "Your leave ({from} to {to}) was approved.",
    n_leave_rejected: "Your leave ({from} to {to}) was rejected. {note}",
    n_ship_incoming: "Shipment #{serial} ({item} x {qty}, from {place}) was sent to you. Please confirm when you receive it.",
    n_ship_received: "Your shipment #{serial} was received by {name}.",
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

    receiverEng: "የሚላክለት ኢንጂነር", selectOne: "— ይምረጡ —", pending: "በመጠባበቅ ላይ",
    attendance: "ክትትል (Attendance)", iAmReady: "ለስራ ዝግጁ ነኝ", iAmField: "ፊልድ ነኝ",
    attendanceRule: "ከጠዋቱ 1:30 እስከ 2:30 «ለስራ ዝግጁ ነኝ» ይጫኑ። ከ2:30 እስከ 3:30 ካርፈዱ «አርፍደዋል» ይባላሉ። ከ3:30 በኋላ «ቀሪ» ይሆናሉ።",
    holidayToday: "ዛሬ የእረፍት ቀን ነው፦ {name}።", tooEarly: "ገና ነው። ቁልፉ ከጠዋቱ 1:30 ይከፈታል።",
    st_none: "ገና አልተመዘገበም", st_ready: "ለስራ ዝግጁ", st_late: "አርፍዷል", st_absent: "ቀሪ",
    st_leave: "ፈቃድ ላይ", st_field: "ፊልድ", st_dayoff: "የእረፍት ቀን",
    date: "ቀን", time: "ሰዓት", reason: "ምክንያት", approved: "ጸድቋል",
    myRecords: "የእኔ ክትትል (ያለፉት 31 ቀናት)", dayBoard: "የዕለቱ ክትትል", editRecord: "መዝገብ አስተካክል",
    leave: "ፈቃድ", requestLeave: "ፈቃድ ጠይቅ", fromDate: "ከቀን", toDate: "እስከ ቀን",
    sendRequest: "ጥያቄ ላክ", leaveSent: "የፈቃድ ጥያቄ ተልኳል።", myLeaves: "የእኔ የፈቃድ ጥያቄዎች",
    leaveRequests: "ምላሽ የሚጠብቁ የፈቃድ ጥያቄዎች", approve: "ፍቀድ", managerNote: "የማናጀር ማስታወሻ",
    ls_pending: "በመጠባበቅ ላይ", ls_approved: "ተፈቅዷል", ls_rejected: "ውድቅ ተደርጓል",
    holidays: "በዓላት / የእረፍት ቀናት", holidayName: "ስም", add: "ጨምር",
    reports: "ሪፖርቶች (ቅዳሜ – አርብ)", weeklyReport: "ሳምንታዊ ሪፖርት", monthlyReport: "ወርሃዊ ሪፖርት",
    download: "Excel አውርድ", summary: "ማጠቃለያ", daily: "ዕለታዊ",
    notifications: "መልዕክቶች", noNotes: "ምንም መልዕክት የለም።",
    n_late: "አርፍደዋል። አሁን «ለስራ ዝግጁ ነኝ» ይጫኑ፤ ከ3:30 በኋላ ቀሪ ይሆናሉ።",
    n_late_mgr: "{name} በ{day} አርፍዷል።",
    n_absent: "{day} ስራ ላይ አልተገኙም። ቀሪ ተደርገዋል።",
    n_absent_mgr: "{name} በ{day} ቀሪ ነው።",
    n_field_mgr: "{name} ዛሬ ፊልድ ነው።",
    n_leave_req_mgr: "{name} ፈቃድ ጠይቋል፦ ከ{from} እስከ {to}።",
    n_leave_approved: "ፈቃድዎ (ከ{from} እስከ {to}) ተፈቅዷል።",
    n_leave_rejected: "ፈቃድዎ (ከ{from} እስከ {to}) ተቀባይነት አላገኘም። {note}",
    n_ship_incoming: "እቃ #{serial} ({item} x {qty}፣ ከ{place}) ተልኮልዎታል። ሲደርስዎ «ተቀብያለሁ» ይበሉ።",
    n_ship_received: "የላኩት እቃ #{serial} በ{name} ተቀብሏል።",
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
