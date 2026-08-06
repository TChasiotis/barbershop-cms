import { PrismaClient } from "@prisma/client";
import BookingWizard from "./BookingWizard";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

export default async function BookingPage() {
  const services = await prisma.service.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="min-h-screen relative flex items-center justify-center pt-24 pb-12 px-4 md:px-6">
      {/* BACKGROUND IMAGE ΜΕ BLUR ΚΑΙ OVERLAY */}
      <div className="fixed inset-0 z-0">
        <img
          src="/hero/hero_desktop.jpg"
          alt="Urban Fade Background"
          className="w-full h-full object-cover opacity-30 blur-md grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-100/90 to-zinc-200/95 backdrop-blur-sm"></div>
      </div>

      <div className="max-w-3xl w-full mx-auto relative z-10">
        <BookingWizard services={services} />
      </div>
    </div>
  );
}
