import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-07-29.dahlia",
});

export async function POST(req: Request) {
  try {
    // Παίρνουμε ΚΑΙ τα στοιχεία ραντεβού τώρα
    const { serviceName, price, appointmentId, date, time, lang, strikes } =
      await req.json();

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      req.headers.get("origin") ||
      "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: serviceName,
              description: "Κράτηση στο Urban Fade",
            },
            unit_amount: parseInt(price.replace(/[^0-9]/g, "")) * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // ΕΔΩ ΠΕΡΝΑΜΕ ΤΑ ΔΕΔΟΜΕΝΑ ΣΤΗ ΣΕΛΙΔΑ ΕΠΙΤΥΧΙΑΣ ΟΤΑΝ ΓΥΡΙΣΕΙ:
      success_url: `${baseUrl}/booking/success?date=${date}&time=${time}&lang=${lang}&strikes=${strikes}`,
      cancel_url: `${baseUrl}/?canceled=true`,
      metadata: { appointmentId },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Error" },
      { status: 500 },
    );
  }
}
