import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Ρυθμίσεις Καταστήματος
const SHOP_PHONE = "+30 210 1234567";
const SHOP_ADDRESS = "12 Tech Avenue, Athens";
const LOGO_URL =
  "https://whrxzzmokjsbgluz.public.blob.vercel-storage.com/logo_removebg.png";

// Λεξικό Μεταφράσεων
const dict = {
  el: {
    confSubject: "Επιβεβαίωση Κράτησης - Urban Fade ✂️",
    remSubject: "Υπενθύμιση Ραντεβού σε λίγο - Urban Fade ⏳",
    confSubtitle: "ΕΠΙΒΕΒΑΙΩΣΗ ΚΡΑΤΗΣΗΣ",
    remSubtitle: "ΥΠΕΝΘΥΜΙΣΗ ΡΑΝΤΕΒΟΥ",
    hello: "Γεια σου",
    confMsg:
      "Το ραντεβού σου στο Urban Fade έχει καταχωρηθεί επιτυχώς. Ετοιμάσου για την απόλυτη εμπειρία περιποίησης.",
    remMsg:
      "Σου υπενθυμίζουμε ότι το ραντεβού σου στο Urban Fade ξεκινάει σε λιγότερο από μία ώρα. Σε περιμένουμε!",
    detailsTitle: "ΛΕΠΤΟΜΕΡΕΙΕΣ ΚΡΑΤΗΣΗΣ",
    service: "Υπηρεσία",
    date: "Ημερομηνία",
    time: "Ώρα",
    promo:
      "🔥 Tip: Ρώτησε τον μπαρμπέρη σου για τα νέα μας premium προϊόντα styling που μόλις παραλάβαμε!",
    locationTitle: "Τοποθεσία",
    contactMsg: "Χρειάζεται να αλλάξεις την ώρα; Κάλεσέ μας εγκαίρως στο",
    strikesMsg:
      "(Προσοχή: 3 απουσίες / no-shows οδηγούν σε περιορισμό του λογαριασμού)",
  },
  en: {
    confSubject: "Booking Confirmation - Urban Fade ✂️",
    remSubject: "Upcoming Appointment - Urban Fade ⏳",
    confSubtitle: "BOOKING CONFIRMATION",
    remSubtitle: "APPOINTMENT REMINDER",
    hello: "Hello",
    confMsg:
      "Your appointment at Urban Fade is successfully booked. Get ready for a premium grooming experience.",
    remMsg:
      "This is a reminder that your appointment at Urban Fade starts in less than an hour. See you soon!",
    detailsTitle: "BOOKING DETAILS",
    service: "Service",
    date: "Date",
    time: "Time",
    promo:
      "🔥 Tip: Ask your barber about our newly arrived premium styling products!",
    locationTitle: "Location",
    contactMsg: "Need to reschedule? Call us ahead of time at",
    strikesMsg: "(Note: 3 no-shows will result in account restriction)",
  },
};

// Κοινό HTML Template Builder για τα emails
const buildEmailHTML = (
  lang: "el" | "en",
  subtitle: string,
  customerName: string,
  message: string,
  detailsHtml: string,
) => {
  const t = dict[lang] || dict.el;

  return `
    <div style="background-color: #f4f4f5; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
        
        <!-- Header / Logo Area -->
        <div style="background-color: #09090b; padding: 40px 20px; text-align: center;">
          
          <!-- Το Logo με το λευκό φόντο από πίσω -->
          <div style="background-color: #ffffff; display: inline-block; padding: 12px 24px; border-radius: 12px; margin-bottom: 15px;">
            <img src="${LOGO_URL}" alt="Urban Fade" style="max-height: 55px; width: auto; display: block;" />
          </div>
          
          <p style="color: #a1a1aa; font-size: 12px; margin: 0; font-weight: bold; letter-spacing: 2px;">${subtitle}</p>
        </div>
        
        <!-- Main Body -->
        <div style="padding: 40px 30px;">
          <h2 style="margin-top: 0; color: #18181b; font-size: 22px;">${t.hello}, ${customerName}!</h2>
          <p style="color: #52525b; line-height: 1.6; font-size: 16px; margin-bottom: 30px;">${message}</p>
          
          <!-- Booking Details Box -->
          <div style="background-color: #fafafa; border: 1px solid #e4e4e7; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
            <h3 style="margin: 0 0 15px 0; color: #18181b; font-size: 13px; letter-spacing: 1px; font-weight: bold;">${t.detailsTitle}</h3>
            ${detailsHtml}
          </div>

          <!-- Promo Banner -->
          <div style="background-color: #fefce8; border: 1px solid #fef08a; padding: 16px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
            <p style="margin: 0; color: #854d0e; font-size: 14px; font-weight: 500;">${t.promo}</p>
          </div>

          <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 30px 0;" />

          <!-- Footer Info -->
          <div style="text-align: center;">
            <p style="color: #18181b; font-size: 15px; margin: 0 0 15px 0;"><strong>📍 ${t.locationTitle}:</strong> ${SHOP_ADDRESS}</p>
            <p style="color: #52525b; font-size: 13px; margin: 0 0 5px 0;">${t.contactMsg} 
              <a href="tel:${SHOP_PHONE.replace(/\s/g, "")}" style="color: #09090b; font-weight: bold; text-decoration: none;">${SHOP_PHONE}</a>
            </p>
            <p style="color: #ef4444; font-size: 12px; margin: 10px 0 0 0;">${t.strikesMsg}</p>
          </div>
        </div>

      </div>
    </div>
  `;
};

// 1. Email Επιβεβαίωσης
export async function sendConfirmationEmail(
  toEmail: string,
  customerName: string,
  date: string,
  time: string,
  serviceName: string,
  lang: "el" | "en" = "el",
) {
  const t = dict[lang] || dict.el;

  const detailsHtml = `
    <p style="margin: 5px 0; color: #52525b; font-size: 15px;"><strong>${t.service}:</strong> ${serviceName}</p>
    <p style="margin: 5px 0; color: #52525b; font-size: 15px;"><strong>${t.date}:</strong> ${date}</p>
    <p style="margin: 5px 0; color: #52525b; font-size: 15px;"><strong>${t.time}:</strong> ${time}</p>
  `;

  const htmlContent = buildEmailHTML(
    lang,
    t.confSubtitle,
    customerName,
    t.confMsg,
    detailsHtml,
  );

  await transporter.sendMail({
    from: `"Urban Fade Barbershop" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `${t.confSubject} (${date})`,
    html: htmlContent,
  });
}

// 2. Email Υπενθύμισης
export async function sendReminderEmail(
  toEmail: string,
  customerName: string,
  date: string,
  time: string,
  serviceName: string,
  lang: "el" | "en" = "el",
) {
  const t = dict[lang] || dict.el;

  const detailsHtml = `
    <p style="margin: 5px 0; color: #52525b; font-size: 15px;"><strong>${t.service}:</strong> ${serviceName}</p>
    <p style="margin: 5px 0; color: #52525b; font-size: 15px;"><strong>${t.time}:</strong> ${time}</p>
  `;

  const htmlContent = buildEmailHTML(
    lang,
    t.remSubtitle,
    customerName,
    t.remMsg,
    detailsHtml,
  );

  await transporter.sendMail({
    from: `"Urban Fade Barbershop" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `${t.remSubject} (${date})`,
    html: htmlContent,
  });
}
