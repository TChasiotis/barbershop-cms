import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendConfirmationEmail } from "@/app/lib/mailer";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      serviceId,
      date,
      time,
      customerName,
      customerPhone,
      customerEmail,
      paymentMethod,
      lang,
    } = body;

    const existingAppointments = await prisma.appointment.findMany({
      where: { customerPhone },
    });

    const currentStrikes = existingAppointments.filter(
      (appt) => appt.status === "NO_SHOW",
    ).length;

    if (currentStrikes >= 3) {
      return NextResponse.json(
        { error: "Account blocked due to strikes", strikes: currentStrikes },
        { status: 403 },
      );
    }

    const hasActive = existingAppointments.some((appt) => {
      const apptDateTime = new Date(
        `${appt.date.toISOString().split("T")[0]}T${appt.time}:00`,
      );
      return apptDateTime > new Date();
    });

    if (hasActive) {
      return NextResponse.json(
        { error: "Active appointment exists" },
        { status: 409 },
      );
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        customerName,
        customerPhone,
        customerEmail,
        paymentMethod,
        date: new Date(`${date}T00:00:00Z`),
        time,
        serviceId,
        lang: lang || "el", // <-- ΑΠΟΘΗΚΕΥΕΤΑΙ Η ΓΛΩΣΣΑ ΣΤΗ ΒΑΣΗ
      },
      include: { service: true },
    });

    if (customerEmail) {
      try {
        await sendConfirmationEmail(
          customerEmail,
          customerName,
          date,
          time,
          lang === "en"
            ? newAppointment.service?.nameEn || "Service"
            : newAppointment.service?.name || "Υπηρεσία",
          lang || "el",
        );
      } catch (emailError) {
        console.error("Σφάλμα αποστολής email:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      appointment: newAppointment,
      strikes: currentStrikes,
    });
  } catch (error: any) {
    console.error("Σφάλμα δημιουργίας ραντεβού:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
