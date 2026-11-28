// Extra words (round 3): payment source, lateness, spare-part requests, new messages.
// Loaded after i18n.js. To change a word, edit it here.
Object.assign(TEXT.en, {
  paySource: "Paid from", pay_self: "Self pay", pay_petty_cash: "Petty cash",
  selfTotal: "Paid by self (birr)", pettyTotal: "Paid from petty cash (birr)",
  minShort: "min", lateMin: "Late (minutes)",
  spare: "Spare part requests", spareNav: "Spare parts", newSpare: "New spare part request", editSpare: "Edit request",
  askedPerson: "Asked person", bank: "Bank", branch: "Branch", requestedAt: "Requested at", requester: "Requested by",
  accept: "Yes, I have it", rejectNote: "Reason for saying no (optional):",
  sp_pending: "Waiting", sp_approved: "Yes", sp_rejected: "No",
  spareReport: "Spare part report", totalRequests: "Total requests", totalQty: "Total quantity", answeredAt: "Answered at",
  n_spare_incoming: "{sender} is asking you for a spare part: {item} x {qty} (bank: {bank}, branch: {branch}). Please answer Yes or No in Spare parts.",
  n_spare_approved: "{name} said YES to your spare part request: {item} x {qty}.",
  n_spare_rejected: "{name} said NO to your spare part request: {item} x {qty}. {note}",
  n_ship_received: "Received! {name} confirmed they received your shipment #{serial}.",
});
Object.assign(TEXT.am, {
  paySource: "የተከፈለው ከ", pay_self: "ከራስ (Self pay)", pay_petty_cash: "ከፔቲ ካሽ",
  selfTotal: "ከራስ የተከፈለ (ብር)", pettyTotal: "ከፔቲ ካሽ የተከፈለ (ብር)",
  minShort: "ደቂቃ", lateMin: "ያረፈደበት (ደቂቃ)",
  spare: "የስፔር ፓርት ጥያቄዎች", spareNav: "ስፔር ፓርት", newSpare: "አዲስ የስፔር ፓርት ጥያቄ", editSpare: "ጥያቄ አስተካክል",
  askedPerson: "የተጠየቀው ሰው", bank: "ባንክ", branch: "ቅርንጫፍ", requestedAt: "የተጠየቀበት ጊዜ", requester: "የጠየቀው",
  accept: "አዎ አለኝ", rejectNote: "የለም ለማለት ምክንያት (አማራጭ)፦",
  sp_pending: "በመጠባበቅ ላይ", sp_approved: "አዎ", sp_rejected: "የለም",
  spareReport: "የስፔር ፓርት ሪፖርት", totalRequests: "ጠቅላላ ጥያቄዎች", totalQty: "ጠቅላላ ብዛት", answeredAt: "የተመለሰበት ጊዜ",
  n_spare_incoming: "{sender} ስፔር ፓርት ጠይቆዎታል፦ {item} x {qty} (ባንክ፦ {bank}፣ ቅርንጫፍ፦ {branch})። በስፔር ፓርት ገጽ «አዎ» ወይም «የለም» ይበሉ።",
  n_spare_approved: "{name} ለጠየቁት ስፔር ፓርት ({item} x {qty}) «አዎ አለኝ» ብሏል።",
  n_spare_rejected: "{name} ለጠየቁት ስፔር ፓርት ({item} x {qty}) «የለም» ብሏል። {note}",
  n_ship_received: "ተቀብሏል! {name} የላኩትን እቃ #{serial} መቀበሉን አረጋግጧል።",
});
window.__r1 = true;
