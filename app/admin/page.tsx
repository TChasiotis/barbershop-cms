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

  // 2. Τραβάμε τα Ραντεβού
  const appointments = await prisma.appointment.findMany({
    orderBy: [{ date: "desc" }, { time: "desc" }],
    include: { service: true },
  });

  // 3. --- ΝΕΟ: Τραβάμε τις Κλειδωμένες Μέρες ---
  const blockedDays = await prisma.blockedDay.findMany({
    orderBy: { date: "asc" },
  });

  // 4. Υπολογισμός Uploads για το Remove.bg
  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  firstDayOfMonth.setHours(0, 0, 0, 0);

  const monthlyUploads = await prisma.apiLog.count({
    where: { createdAt: { gte: firstDayOfMonth } },
  });

  // 5. Περνάμε ΟΛΑ τα δεδομένα στο Dashboard
  return (
    <AdminDashboard
      initialServices={services}
      initialProducts={products}
      initialGallery={gallery}
      initialStrikes={strikes}
      initialAppointments={appointments}
      initialBlockedDays={blockedDays} // <--- ΤΑ ΠΕΡΝΑΜΕ ΕΔΩ ΣΤΟ DASHBOARD
      monthlyUploadsCount={monthlyUploads}
    />
  );
}
