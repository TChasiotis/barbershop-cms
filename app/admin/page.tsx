import { PrismaClient } from "@prisma/client";
import AdminDashboard from "./AdminDashboard";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // 1. Τραβάμε τις Υπηρεσίες, Προϊόντα, Gallery, Strikes
  const services = await prisma.service.findMany({
    orderBy: { sortOrder: "asc" },
  });
  const products = await prisma.product.findMany({
    orderBy: { sortOrder: "asc" },
  });
  const gallery = await prisma.galleryImage.findMany({
    orderBy: { sortOrder: "asc" },
  });
  const strikes = await prisma.customerStrike.findMany({
    orderBy: { updatedAt: "desc" },
  });

  // 2. ΕΔΩ ΗΤΑΝ ΤΟ ΛΑΘΟΣ! Τραβάμε ΤΑ ΡΑΝΤΕΒΟΥ απευθείας από τη βάση!
  const appointments = await prisma.appointment.findMany({
    orderBy: [{ date: "desc" }, { time: "desc" }],
    include: { service: true }, // Φέρνει και τα στοιχεία της υπηρεσίας
  });

  // 3. Υπολογισμός Uploads για το Remove.bg (Αν το έχεις κρατήσει)
  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  firstDayOfMonth.setHours(0, 0, 0, 0);

  const monthlyUploads = await prisma.apiLog.count({
    where: { createdAt: { gte: firstDayOfMonth } },
  });

  // 4. Περνάμε ΟΛΑ τα δεδομένα (και τα ραντεβού) στο Dashboard Component
  return (
    <AdminDashboard
      initialServices={services}
      initialProducts={products}
      initialGallery={gallery}
      initialStrikes={strikes}
      initialAppointments={appointments} // <--- ΑΥΤΟ ΕΛΕΙΠΕ ΚΑΙ ΗΤΑΝ ΑΔΕΙΟ ΤΟ AGENDA!
      monthlyUploadsCount={monthlyUploads}
    />
  );
}
