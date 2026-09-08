import { NextResponse } from "next/server";
import { sendConfirmationEmail } from "@/app/lib/mailer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // 1. Έλεγχος ότι τα κλειδιά διαβάζονται σωστά
    console.log("=== EMAIL CONFIG TEST ===");
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log(
      "EMAIL_PASS ΥΠΑΡΧΕΙ;:",
      process.env.EMAIL_PASS ? "✅ ΝΑΙ" : "❌ ΟΧΙ (Είναι κενό)",
    );

    // 2. Παίρνουμε το ID του ραντεβού από την κλήση
    const { appointmentId } = await req.json();

    if (!appointmentId) {
      console.error("❌ Δεν δόθηκε ID ραντεβού!");
      return NextResponse.json(
        { error: "Missing appointment ID" },
        { status: 400 },
      );
    }

    // 3. Βρίσκουμε το ραντεβού στη βάση
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { service: true },
    });

    // 4. Στέλνουμε το email αν ο πελάτης είχε συμπληρώσει το πεδίο
    if (appointment && appointment.customerEmail) {
      // Μετατρέπουμε την ημερομηνία της Prisma σε YYYY-MM-DD
      const dateStr = appointment.date.toISOString().split("T")[0];

      console.log(
        `Προσπάθεια αποστολής email στο: ${appointment.customerEmail}...`,
      );

      await sendConfirmationEmail(
        appointment.customerEmail,
        appointment.customerName,
        dateStr,
        appointment.time,
        appointment.service?.name || "Υπηρεσία Barbershop",
      );

      console.log("✅ ΤΟ EMAIL ΣΤΑΛΘΗΚΕ ΕΠΙΤΥΧΩΣ!");
    } else {
      console.log(
        "⚠️ Το ραντεβού δεν είχε email ή δεν βρέθηκε, δεν στάλθηκε κάτι.",
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ ΣΦΑΛΜΑ EMAIL:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
