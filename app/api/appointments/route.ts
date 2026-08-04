import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, date, time, serviceId } = body;

    // Αποθήκευση στη βάση μέσω Prisma
    const newAppointment = await prisma.appointment.create({
      data: {
        customerName,
        customerPhone,
        date: new Date(date), // Μετατρέπουμε το string της ημερομηνίας σε κανονικό Date
        time,
        serviceId,
      },
    });

    return NextResponse.json({ success: true, appointment: newAppointment });
  } catch (error) {
    console.error("Booking Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Κάτι πήγε στραβά με το κλείσιμο του ραντεβού.",
      },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date"); // π.χ. "2026-08-05"

    if (!dateParam) {
      return NextResponse.json({ error: "No date provided" }, { status: 400 });
    }

    // Φτιάχνουμε αρχή και τέλος της ημέρας για την αναζήτηση στη βάση
    const startOfDay = new Date(dateParam);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(dateParam);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // Βρίσκουμε όλα τα ραντεβού αυτής της μέρας
    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          not: "CANCELLED", // Αγνοούμε τα ακυρωμένα
        },
      },
      select: {
        time: true, // Θέλουμε μόνο την ώρα (π.χ. "14:30")
      },
    });

    const bookedTimes = appointments.map((app) => app.time);

    return NextResponse.json({ bookedTimes });
  } catch (error) {
    console.error("Fetch Appointments Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
