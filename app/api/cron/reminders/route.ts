import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendReminderEmail } from "@/app/lib/mailer";

const prisma = new PrismaClient();

// Αποτρέπει τη Next.js από το να κάνει "cache" το αρχείο
export const dynamic = "force-dynamic";

async function processReminders() {
  try {
    console.log("=== ΕΛΕΓΧΟΣ ΓΙΑ REMINDERS ===");

    const athensTimeStr = new Date().toLocaleString("en-US", {
      timeZone: "Europe/Athens",
    });
    const athensNow = new Date(athensTimeStr);
    const athensFuture = new Date(athensNow.getTime() + 35 * 60000);

    const upcomingAppointments = await prisma.appointment.findMany({
      where: {
        reminderSent: false,
        customerEmail: { not: null },
      },
      include: { service: true },
    });

    let sentCount = 0;

    for (const appt of upcomingAppointments) {
      const dateString = appt.date.toISOString().split("T")[0];
      const appointmentTime = new Date(`${dateString}T${appt.time}:00`);

      if (appointmentTime > athensNow && appointmentTime <= athensFuture) {
        const lang = (appt as any).lang || "el";

        const serviceName =
          lang === "en"
            ? appt.service?.nameEn || "Service"
            : appt.service?.name || "Υπηρεσία";

        await sendReminderEmail(
          appt.customerEmail!,
          appt.customerName,
          dateString,
          appt.time,
          serviceName,
          lang as "el" | "en",
        );

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

// Ό,τι και να ζητήσει το cron-job.org (GET ή POST), το αρχείο θα δουλέψει!
export async function GET() {
  return processReminders();
}

export async function POST() {
  return processReminders();
}
