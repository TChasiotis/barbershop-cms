import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const blockedDays = await prisma.blockedDay.findMany();
    // Μετατρέπουμε τις ημερομηνίες σε απλά strings μορφής "YYYY-MM-DD"
    const formattedDates = blockedDays.map(
      (b) => b.date.toISOString().split("T")[0],
    );

    return NextResponse.json({ blockedDates: formattedDates });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch blocked days" },
      { status: 500 },
    );
  }
}
