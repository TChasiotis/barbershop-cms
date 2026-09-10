import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendReminderEmail } from "@/app/lib/mailer";

const prisma = new PrismaClient();

// Χρησιμοποιούμε GET γιατί τα Cron Jobs συνήθως κάνουν απλές "επισκέψεις" (GET requests)
export async function GET(req: Request) {
  try {
    console.log("=== ΕΛΕΓΧΟΣ ΓΙΑ REMINDERS ===");

    // 1. Παίρνουμε την Τωρινή Ώρα ΕΛΛΑΔΟΣ (πολύ σημαντικό για το Vercel)
    const athensTimeStr = new Date().toLocaleString("en-US", {
      timeZone: "Europe/Athens",
    });
    const athensNow = new Date(athensTimeStr);

    // 2. Υπολογίζουμε την ώρα σε 45 λεπτά από τώρα (Το "παράθυρο" του reminder)
    const athensFuture = new Date(athensNow.getTime() + 35 * 60000);

    // 3. Τραβάμε τα ραντεβού που ΕΧΟΥΝ email και ΔΕΝ έχουν πάρει reminder
    const upcomingAppointments = await prisma.appointment.findMany({
      where: {
        reminderSent: false,
        customerEmail: { not: null },
      },
      include: { service: true },
    });

    let sentCount = 0;

    for (const appt of upcomingAppointments) {
      // Φτιάχνουμε την ημερομηνία/ώρα του ραντεβού
      const dateString = appt.date.toISOString().split("T")[0];
      const appointmentTime = new Date(`${dateString}T${appt.time}:00`);

      // Ελέγχουμε: Είναι το ραντεβού από "Τώρα" μέχρι "Σε 45 λεπτά";
      if (appointmentTime > athensNow && appointmentTime <= athensFuture) {
        await sendReminderEmail(
          appt.customerEmail!,
          appt.customerName,
          appt.time,
          appt.service?.name || "Υπηρεσία",
        );

        // Σημειώνουμε στη βάση ότι στάλθηκε για να μην ξανασταλεί!
        await prisma.appointment.update({
          where: { id: appt.id },
          data: { reminderSent: true },
        });

        console.log(
          `✅ Στάλθηκε reminder στον ${appt.customerName} για τις ${appt.time}`,
        );
        sentCount++;
      }
    }

    return NextResponse.json({ success: true, remindersSent: sentCount });
  } catch (error: any) {
    console.error("❌ Σφάλμα στα reminders:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
