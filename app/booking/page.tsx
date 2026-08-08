import { PrismaClient } from "@prisma/client";
import BookingWizard from "./BookingWizard";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

export default async function BookingPage() {
  const services = await prisma.service.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="min-h-screen relative flex items-center justify-center pt-24 pb-12 px-4 md:px-6 overflow-hidden">
      {/* BACKGROUND IMAGES (Από την Αρχική Σελίδα) */}
      <div className="fixed top-0 left-0 w-full h-screen z-0 bg-zinc-900">
        {/* Desktop Hero Image */}
        <img
          src="/hero/hero_desktop.jpg"
          alt="Hero Background Desktop"
          className="hidden md:block w-full h-full object-cover object-center opacity-50 blur-[3px]"
        />
        {/* Mobile Hero Image */}
        <img
          src="/hero/hero_mobile.jpg"
          alt="Hero Background Mobile"
          className="block md:hidden w-full h-full object-cover object-center opacity-50 blur-[3px]"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-zinc-50/90"></div>
      </div>

      <div className="max-w-3xl w-full mx-auto relative z-10 shadow-2xl rounded-3xl">
        <BookingWizard services={services} />
      </div>
    </div>
  );
}
