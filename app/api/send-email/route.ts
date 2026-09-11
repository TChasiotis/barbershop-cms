import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Το απενεργοποιήσαμε γιατί πλέον το email φεύγει
  // απευθείας από το /api/appointments με τη σωστή γλώσσα!
  return NextResponse.json({
    success: true,
    message: "Email handling moved to appointments API",
  });
}
