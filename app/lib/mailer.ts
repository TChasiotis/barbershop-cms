import nodemailer from "nodemailer";

// Σύνδεση με το Gmail σου
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // Ασφαλής θύρα
  secure: true, // Χρήση SSL/TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Η συνάρτηση που στέλνει το επιβεβαιωτικό email
export async function sendConfirmationEmail(
  toEmail: string,
  customerName: string,
  date: string,
  time: string,
  serviceName: string,
) {
  // Φορμάρισμα της ημερομηνίας σε Ευρωπαϊκό στυλ (DD/MM/YYYY)
  const [y, m, d] = date.split("-");
  const formattedDate = `${d}/${m}/${y}`;

  const mailOptions = {
    from: `"Urban Fade Barbershop" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Επιβεβαίωση Ραντεβού - Urban Fade ✂️",
    html: `
      <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 12px;">
        <div style="background-color: #09090b; padding: 30px; border-radius: 12px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 1px;">URBAN FADE</h1>
          <p style="color: #a1a1aa; font-size: 14px; margin-top: 5px;">Επιβεβαίωση Κράτησης</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; margin-top: -15px; border: 1px solid #e4e4e7; position: relative; z-index: 10;">
          <h2 style="margin-top: 0; color: #18181b; font-size: 20px;">Γεια σου, ${customerName}!</h2>
          <p style="color: #52525b; line-height: 1.6;">Το ραντεβού σου στο Urban Fade Barbershop έχει καταχωρηθεί επιτυχώς. Σε περιμένουμε για να σου προσφέρουμε την καλύτερη εμπειρία.</p>
          
          <div style="background-color: #f4f4f5; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <p style="margin: 0 0 10px 0; color: #52525b; font-size: 13px; text-transform: uppercase; font-weight: bold;">Λεπτομερειες Κρατησης</p>
            <p style="margin: 5px 0; color: #18181b;"><strong>Υπηρεσία:</strong> ${serviceName}</p>
            <p style="margin: 5px 0; color: #18181b;"><strong>Ημερομηνία:</strong> ${formattedDate}</p>
            <p style="margin: 5px 0; color: #18181b;"><strong>Ώρα:</strong> ${time}</p>
          </div>

          <p style="color: #71717a; font-size: 13px; text-align: center; margin-bottom: 0;">
            📍 Τοποθεσία: Urban Fade Barbershop<br>
            Αν χρειαστεί να ακυρώσεις, παρακαλούμε επικοινώνησε μαζί μας εγκαίρως. (Προσοχή στα 3 strikes).
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

// Η συνάρτηση που στέλνει το Reminder (Υπενθύμιση)
export async function sendReminderEmail(
  toEmail: string,
  customerName: string,
  time: string,
  serviceName: string,
) {
  const mailOptions = {
    from: `"Urban Fade Barbershop" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Υπενθύμιση Ραντεβού σε λίγο - Urban Fade ⏳",
    html: `
      <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 12px;">
        <div style="background-color: #09090b; padding: 30px; border-radius: 12px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 1px;">URBAN FADE</h1>
          <p style="color: #a1a1aa; font-size: 14px; margin-top: 5px;">Υπενθύμιση Ραντεβού</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; margin-top: -15px; border: 1px solid #e4e4e7; position: relative; z-index: 10;">
          <h2 style="margin-top: 0; color: #18181b; font-size: 20px;">Γεια σου, ${customerName}!</h2>
          <p style="color: #52525b; line-height: 1.6;">Σου υπενθυμίζουμε ότι το ραντεβού σου στο Urban Fade ξεκινάει σε λιγότερο από μία ώρα. Σε περιμένουμε!</p>
          
          <div style="background-color: #f4f4f5; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <p style="margin: 0 0 10px 0; color: #52525b; font-size: 13px; text-transform: uppercase; font-weight: bold;">Λεπτομερειες</p>
            <p style="margin: 5px 0; color: #18181b;"><strong>Υπηρεσία:</strong> ${serviceName}</p>
            <p style="margin: 5px 0; color: #18181b;"><strong>Ώρα:</strong> ${time}</p>
          </div>

          <p style="color: #71717a; font-size: 13px; text-align: center; margin-bottom: 0;">
            📍 Τοποθεσία: Urban Fade Barbershop
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
