import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendConfirmationEmail } from "@/app/lib/mailer"; // ΠΡΟΣΘΗΚΗ: Εισαγωγή της συνάρτησης του email

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
      lang, // ΠΡΟΣΘΗΚΗ: Διαβάζουμε και τη γλώσσα από το frontend
    } = body;

    // 1. ΕΛΕΓΧΟΣ STRIKES (No-Shows)
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

    // 2. ΕΛΕΓΧΟΣ ΓΙΑ ΥΠΑΡΧΟΝ ΕΝΕΡΓΟ ΡΑΝΤΕΒΟΥ
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

    // 3. ΔΗΜΙΟΥΡΓΙΑ ΡΑΝΤΕΒΟΥ ΣΤΗ ΒΑΣΗ
    const newAppointment = await prisma.appointment.create({
      data: {
        customerName,
        customerPhone,
        customerEmail,
        paymentMethod,
        date: new Date(`${date}T00:00:00Z`),
        time,
        serviceId,
        // Αν χρειάζεται να περάσεις default status, π.χ.: status: "PENDING"
      },
      include: { service: true },
    });

    // 4. ΑΠΟΣΤΟΛΗ EMAIL ΕΠΙΒΕΒΑΙΩΣΗΣ (ΝΕΟ)
    // Αν ο πελάτης έχει δώσει email, του στέλνουμε την επιβεβαίωση στην επιλεγμένη γλώσσα
    if (customerEmail) {
      // Τυλίγουμε την κλήση σε try/catch για να μην αποτύχει η κράτηση αν υπάρξει σφάλμα στο email
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
        console.error("Σφάλμα αποστολής email επιβεβαίωσης:", emailError);
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
