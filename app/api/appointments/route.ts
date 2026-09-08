import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

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

    // 3. ΔΗΜΙΟΥΡΓΙΑ ΡΑΝΤΕΒΟΥ ΣΤΗ ΒΑΣΗ (ΧΩΡΙΣ EMAIL ΕΔΩ!)
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
