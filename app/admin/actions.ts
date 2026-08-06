"use server";

import prisma from "../lib/prisma"; // Ανέβηκα 2 επίπεδα, από το app/admin
import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";
import bcrypt from "bcryptjs";

// --- SERVICES ---
export async function createService(data: any) {
  const maxService = await prisma.service.findFirst({
    orderBy: { sortOrder: "desc" },
  });
  const nextOrder = (maxService?.sortOrder || 0) + 1;

  await prisma.service.create({
    data: {
      name: data.name,
      nameEn: data.nameEn,
      price: data.price,
      duration: data.duration,
      sortOrder: nextOrder,
    },
  });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateService(id: string, data: any) {
  await prisma.service.update({
    where: { id },
    data: {
      name: data.name,
      nameEn: data.nameEn,
      price: data.price,
      duration: data.duration,
    },
  });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteService(id: string) {
  await prisma.service.delete({
    where: { id },
  });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function moveService(id: string, direction: "up" | "down") {
  const services = await prisma.service.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const index = services.findIndex((s) => s.id === id);
  if (index === -1) return;

  if (direction === "up" && index > 0) {
    const current = services[index];
    const prev = services[index - 1];
    const currentOrder = current.sortOrder;
    const prevOrder =
      prev.sortOrder === currentOrder ? currentOrder - 1 : prev.sortOrder;

    await prisma.service.update({
      where: { id: current.id },
      data: { sortOrder: prevOrder },
    });
    await prisma.service.update({
      where: { id: prev.id },
      data: { sortOrder: currentOrder },
    });
  } else if (direction === "down" && index < services.length - 1) {
    const current = services[index];
    const next = services[index + 1];
    const currentOrder = current.sortOrder;
    const nextOrder =
      next.sortOrder === currentOrder ? currentOrder + 1 : next.sortOrder;

    await prisma.service.update({
      where: { id: current.id },
      data: { sortOrder: nextOrder },
    });
    await prisma.service.update({
      where: { id: next.id },
      data: { sortOrder: currentOrder },
    });
  }
  revalidatePath("/admin");
  revalidatePath("/");
}

// --- PRODUCTS ---
export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const desc = formData.get("desc") as string;
    const descEn = formData.get("descEn") as string;
    const category = formData.get("category") as string;
    const file = formData.get("file") as File;
    const useRemoveBg = formData.get("useRemoveBg") === "true";

    let imgPath = "./products/default.png";
    let apiUsed = false;

    if (file && file.size > 0) {
      let finalData: File | ArrayBuffer = file;
      let fileNameToSave = file.name;
      const apiKey = process.env.REMOVE_BG_API_KEY;

      if (useRemoveBg && apiKey) {
        const apiFormData = new FormData();
        apiFormData.append("image_file", file);
        apiFormData.append("size", "preview");

        const apiResponse = await fetch("https://api.remove.bg/v1.0/removebg", {
          method: "POST",
          headers: { "X-Api-Key": apiKey },
          body: apiFormData,
        });

        if (apiResponse.ok) {
          finalData = await apiResponse.arrayBuffer();
          fileNameToSave = `nobg_${file.name}.png`;
          apiUsed = true;
        }
      }

      const uniqueFilename = `${Date.now()}-${fileNameToSave.replace(/\s+/g, "_")}`;
      const blobResponse = await put(uniqueFilename, finalData, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      imgPath = blobResponse.url;
    }

    const maxProduct = await prisma.product.findFirst({
      orderBy: { sortOrder: "desc" },
    });
    const nextOrder = (maxProduct?.sortOrder || 0) + 1;

    await prisma.product.create({
      data: {
        name,
        price,
        img: imgPath,
        desc,
        descEn,
        category: category || "care",
        sortOrder: nextOrder,
      },
    });

    if (apiUsed) {
      await prisma.apiLog.create({ data: {} });
    }

    revalidatePath("/admin");
    revalidatePath("/");
  } catch (error: any) {
    throw new Error("Failed to create product.");
  }
}

export async function updateProduct(id: string, data: any) {
  await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      price: data.price,
      desc: data.desc,
      descEn: data.descEn,
      category: data.category,
    },
  });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (product?.img && product.img.includes("vercel-storage.com")) {
      await del(product.img, { token: process.env.BLOB_READ_WRITE_TOKEN });
    }
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin");
    revalidatePath("/");
  } catch (error) {
    throw new Error("Failed to delete product.");
  }
}

export async function moveProduct(id: string, direction: "up" | "down") {
  const products = await prisma.product.findMany({
    orderBy: { sortOrder: "asc" },
  });
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return;

  if (direction === "up" && index > 0) {
    const current = products[index];
    const prev = products[index - 1];
    const currentOrder = current.sortOrder;
    const prevOrder =
      prev.sortOrder === currentOrder ? currentOrder - 1 : prev.sortOrder;

    await prisma.product.update({
      where: { id: current.id },
      data: { sortOrder: prevOrder },
    });
    await prisma.product.update({
      where: { id: prev.id },
      data: { sortOrder: currentOrder },
    });
  } else if (direction === "down" && index < products.length - 1) {
    const current = products[index];
    const next = products[index + 1];
    const currentOrder = current.sortOrder;
    const nextOrder =
      next.sortOrder === currentOrder ? currentOrder + 1 : next.sortOrder;

    await prisma.product.update({
      where: { id: current.id },
      data: { sortOrder: nextOrder },
    });
    await prisma.product.update({
      where: { id: next.id },
      data: { sortOrder: currentOrder },
    });
  }
  revalidatePath("/admin");
  revalidatePath("/");
}

// --- GALLERY ACTIONS ---
export async function createGalleryImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file || file.size === 0) return;

    const uniqueFilename = `gallery-${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const blobResponse = await put(uniqueFilename, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const maxImg = await prisma.galleryImage.findFirst({
      orderBy: { sortOrder: "desc" },
    });
    const nextOrder = (maxImg?.sortOrder || 0) + 1;

    await prisma.galleryImage.create({
      data: { url: blobResponse.url, sortOrder: nextOrder },
    });

    revalidatePath("/admin");
    revalidatePath("/");
  } catch (error) {
    throw new Error("Failed to upload image.");
  }
}

export async function deleteGalleryImage(id: string) {
  try {
    const img = await prisma.galleryImage.findUnique({ where: { id } });
    if (img?.url && img.url.includes("vercel-storage.com")) {
      await del(img.url, { token: process.env.BLOB_READ_WRITE_TOKEN });
    }
    await prisma.galleryImage.delete({ where: { id } });
    revalidatePath("/admin");
    revalidatePath("/");
  } catch (error) {
    throw new Error("Failed to delete image.");
  }
}

// --- ADMIN SETTINGS ---
export async function updateAdminSettings(formData: FormData) {
  try {
    const newUsername = formData.get("username") as string;
    const oldPassword = formData.get("oldPassword") as string;
    const newPassword = formData.get("newPassword") as string;

    if (!newUsername || !oldPassword) {
      return {
        success: false,
        error: "Username and old password are required fields.",
      };
    }

    const adminUser = await prisma.user.findFirst();
    if (!adminUser) {
      return {
        success: false,
        error: "Admin account not found.",
      };
    }

    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      adminUser.password,
    );
    if (!isPasswordValid) {
      return { success: false, error: "Incorrect old password." };
    }

    const updateData: any = { username: newUsername };
    let passwordChanged = false;

    if (newPassword && newPassword.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
      passwordChanged = true;
    }

    await prisma.user.update({ where: { id: adminUser.id }, data: updateData });
    revalidatePath("/admin");

    return {
      success: true,
      message: "Settings saved successfully!",
      passwordChanged,
    };
  } catch (error: any) {
    return { success: false, error: "Something went wrong." };
  }
}

// --- STRIKES ACTIONS ---
export async function addStrike(phone: string, email?: string) {
  const existing = await prisma.customerStrike.findUnique({ where: { phone } });

  if (existing) {
    await prisma.customerStrike.update({
      where: { phone },
      data: {
        strikes: existing.strikes + 1,
        email: email || existing.email, // Ενημερώνει το email αν δοθεί νέο
      },
    });
  } else {
    await prisma.customerStrike.create({
      data: { phone, email, strikes: 1 },
    });
  }
  revalidatePath("/admin");
}

export async function deleteStrike(id: string) {
  await prisma.customerStrike.delete({ where: { id } });
  revalidatePath("/admin");
}
