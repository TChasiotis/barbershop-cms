import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      paymentMethod,
      date,
      time,
      serviceId,
    } = body;

    // 1. ΕΛΕΓΧΟΣ STRIKES (Ποινές)
    const strikeRecord = await prisma.customerStrike.findUnique({
      where: { phone: customerPhone },
    });

    const currentStrikes = strikeRecord ? strikeRecord.strikes : 0;

    if (currentStrikes >= 3) {
      return NextResponse.json(
        {
          success: false,
          error: "BLOCKED_BY_STRIKES",
          strikes: currentStrikes,
        },
        { status: 403 }, // 403 Forbidden
      );
    }

    // 2. ΕΛΕΓΧΟΣ ΓΙΑ ΕΝΕΡΓΟ ΡΑΝΤΕΒΟΥ ΜΕ ΤΟ ΙΔΙΟ ΤΗΛΕΦΩΝΟ
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    const futureAppointments = await prisma.appointment.findMany({
      where: {
        customerPhone,
        status: "PENDING",
        date: { gte: startOfToday }, // Τραβάμε τα σημερινά και τα μελλοντικά
      },
    });

    const now = new Date();
    const hasActiveBooking = futureAppointments.some((app) => {
      const appDate = new Date(app.date);
      const [h, m] = app.time.split(":").map(Number);

      // Αν το ραντεβού είναι σε επόμενη μέρα, τότε σίγουρα είναι ενεργό
      if (appDate > startOfToday) return true;

      // Αν το ραντεβού είναι σήμερα, ελέγχουμε αν έχει περάσει η ώρα
      const currentMins = now.getHours() * 60 + now.getMinutes();
      const appMins = h * 60 + m;
      return appMins >= currentMins;
    });

    if (hasActiveBooking) {
      return NextResponse.json(
        { success: false, error: "PHONE_ALREADY_BOOKED" },
        { status: 409 }, // 409 Conflict (Διένεξη δεδομένων)
      );
    }

    // 3. ΔΗΜΙΟΥΡΓΙΑ ΡΑΝΤΕΒΟΥ
    const newAppointment = await prisma.appointment.create({
      data: {
        customerName,
        customerPhone,
        customerEmail,
        paymentMethod,
        date: new Date(`${date}T00:00:00Z`),
        time,
        serviceId,
      },
    });

    return NextResponse.json({
      success: true,
      appointment: newAppointment,
      strikes: currentStrikes,
    });
  } catch (error) {
    console.error("Booking Error:", error);
    return NextResponse.json(
      { success: false, error: "Σφάλμα" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");

    if (!dateParam) {
      return NextResponse.json({ error: "No date" }, { status: 400 });
    }

    const startOfDay = new Date(`${dateParam}T00:00:00Z`);
    const endOfDay = new Date(`${dateParam}T23:59:59Z`);

    const appointments = await prisma.appointment.findMany({
      where: {
        date: { gte: startOfDay, lte: endOfDay },
        status: { not: "CANCELLED" },
      },
      include: { service: { select: { duration: true } } },
    });

    const bookedData = appointments.map((app) => ({
      time: app.time,
      duration: app.service?.duration || "30",
    }));

    return NextResponse.json({ bookedData });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
