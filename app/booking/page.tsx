import { PrismaClient } from "@prisma/client";
import BookingWizard from "./BookingWizard";

const prisma = new PrismaClient();

// Αυτό λέει στο Next.js να μην κάνει cache τη σελίδα,
// ώστε να τραβάει ΠΑΝΤΑ τις πιο φρέσκες υπηρεσίες από τη βάση
export const dynamic = "force-dynamic";

export default async function BookingPage() {
  // Τραβάμε τις υπηρεσίες
  const services = await prisma.service.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-12 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <BookingWizard services={services} />
      </div>
    </div>
  );
}
