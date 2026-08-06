import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "../lib/prisma";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const now = new Date();
  const resetDay = 19;
  let startOfBillingCycle;

  if (now.getDate() >= resetDay) {
    startOfBillingCycle = new Date(now.getFullYear(), now.getMonth(), resetDay);
  } else {
    startOfBillingCycle = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      resetDay,
    );
  }

  const monthlyUploadsCount = await prisma.apiLog.count({
    where: { createdAt: { gte: startOfBillingCycle } },
  });

  const services = await prisma.service.findMany({
    orderBy: { sortOrder: "asc" },
  });
  const products = await prisma.product.findMany({
    orderBy: { sortOrder: "asc" },
  });
  const gallery = await prisma.galleryImage.findMany({
    orderBy: { sortOrder: "asc" },
  });

  // ΝΕΟ: Τραβάμε τα strikes
  const strikes = await prisma.customerStrike.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <AdminDashboard
      initialServices={services}
      initialProducts={products}
      initialGallery={gallery}
      initialStrikes={strikes} // Το περνάμε εδώ!
      monthlyUploadsCount={monthlyUploadsCount}
    />
  );
}
