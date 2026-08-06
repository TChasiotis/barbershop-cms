"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Edit,
  LogOut,
  Scissors,
  Package,
  X,
  ArrowUp,
  ArrowDown,
  Settings,
  Eye,
  EyeOff,
  Loader2,
  Menu,
  Camera,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";
import {
  createService,
  updateService,
  deleteService,
  moveService,
  createProduct,
  updateProduct,
  deleteProduct,
  moveProduct,
  updateAdminSettings,
  createGalleryImage,
  deleteGalleryImage,
  addStrike,
  deleteStrike,
} from "./actions";

export default function AdminDashboard({
  initialServices,
  initialProducts,
  initialGallery = [],
  initialStrikes = [],
  monthlyUploadsCount = 0,
}: any) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "services" | "products" | "gallery" | "strikes"
  >("services");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useRemoveBg, setUseRemoveBg] = useState(true);

  const [isServiceModalOpen, setServiceModalOpen] = useState(false);
  const [isProductModalOpen, setProductModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isNewCategory, setIsNewCategory] = useState(false);

  const defaultService = { name: "", nameEn: "", duration: "", price: "" };
  const [serviceForm, setServiceForm] = useState(defaultService);

  // --- GALLERY STATES ---
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);

  // --- STRIKE STATES ---
  const [newStrikePhone, setNewStrikePhone] = useState("");
  const [isStriking, setIsStriking] = useState(false);

  // --- SETTINGS & LOGOUT STATES ---
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsUsername, setSettingsUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const defaultProduct = {
    name: "",
    category: "care",
    price: "",
    img: "",
    desc: "",
    descEn: "",
  };
  const [productForm, setProductForm] = useState<any>(defaultProduct);
  const [productFile, setProductFile] = useState<File | null>(null);

  const existingCategories = Array.from(
    new Set(initialProducts?.map((p: any) => p.category).filter(Boolean)),
  ) as string[];

  if (existingCategories.length === 0) {
    existingCategories.push("prep", "pomades", "waxes", "care", "cologne");
  }

  const sortedServices = [...(initialServices || [])].sort(
    (a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0),
  );
  const sortedProducts = [...(initialProducts || [])].sort(
    (a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0),
  );

  // --- SERVICE HANDLERS ---
  const openNewService = () => {
    setServiceForm(defaultService);
    setEditingId(null);
    setServiceModalOpen(true);
  };

  const openEditService = (service: any) => {
    setServiceForm({
      name: service.name || "",
      nameEn: service.nameEn || "",
      duration: service.duration || "",
      price: service.price || "",
    });
    setEditingId(service.id);
    setServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateService(editingId, serviceForm);
    } else {
      await createService(serviceForm);
    }
    setServiceModalOpen(false);
    router.refresh();
  };

  // --- PRODUCT HANDLERS ---
  const openNewProduct = () => {
    setProductForm(defaultProduct);
    setProductFile(null);
    setEditingId(null);
    setIsNewCategory(false);
    setProductModalOpen(true);
  };

  const openEditProduct = (product: any) => {
    setProductForm({
      name: product.name || "",
      category: product.category || "care",
      price: product.price || "",
      img: product.img || "",
      desc: product.desc || "",
      descEn: product.descEn || "",
    });
    setProductFile(null);
    setEditingId(product.id);
    setIsNewCategory(false);
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (productFile && productFile.size > 5 * 1024 * 1024) {
      alert("⚠️ The image is too large (exceeds 5MB).");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateProduct(editingId, productForm);
      } else {
        const formData = new FormData();
        formData.append("name", productForm.name);
        formData.append("price", productForm.price);
        formData.append("category", productForm.category);
        formData.append("desc", productForm.desc);
        formData.append("descEn", productForm.descEn);
        formData.append("useRemoveBg", useRemoveBg ? "true" : "false");
        if (productFile) formData.append("file", productFile);
        await createProduct(formData);
      }
      setProductModalOpen(false);
      router.refresh();
    } catch (error) {
      alert("An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- GALLERY HANDLERS ---
  const handleUploadGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryFile) return;
    if (galleryFile.size > 5 * 1024 * 1024) {
      alert("⚠️ The photo exceeds 5MB.");
      return;
    }

    setIsGalleryUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", galleryFile);
      await createGalleryImage(formData);
      setGalleryFile(null);

      const fileInput = document.getElementById(
        "galleryInput",
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      router.refresh();
    } catch (error) {
      alert("Failed to upload photo.");
    } finally {
      setIsGalleryUploading(false);
    }
  };

  // --- STRIKE HANDLERS ---
  const handleAddStrike = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStrikePhone) return;
    setIsStriking(true);
    await addStrike(newStrikePhone);
    setNewStrikePhone("");
    setIsStriking(false);
    router.refresh();
  };

  // --- SETTINGS & LOGOUT HANDLERS ---
  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ callbackUrl: "/login" });
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsMessage(null);

    if (newPassword && newPassword !== confirmPassword) {
      setSettingsMessage({
        type: "error",
        text: "New passwords do not match.",
      });
      setSettingsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("username", settingsUsername);
    formData.append("oldPassword", oldPassword);
    formData.append("newPassword", newPassword);

    const result = await updateAdminSettings(formData);
    setSettingsLoading(false);

    if (result.success) {
      if (result.passwordChanged) {
        alert("Password changed successfully. Please log in again.");
        await signOut({ callbackUrl: "/login" });
      } else {
        setSettingsMessage({
          type: "success",
          text: result.message || "Success!",
        });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setIsSettingsOpen(false), 2000);
      }
    } else {
      setSettingsMessage({ type: "error", text: result.error || "Error!" });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col md:flex-row text-zinc-900 font-sans">
      {/* MOBILE HEADER */}
      <div className="md:hidden bg-zinc-950 text-white p-4 flex items-center gap-3 sticky top-0 z-30 shadow-md">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 -ml-2 hover:bg-zinc-800 rounded-lg transition-colors flex-shrink-0"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-bold tracking-tight truncate">
          Urban Fade
        </h1>
      </div>

      {/* OVERLAY MOBILE MENU */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 z-50 h-[100dvh] w-64 bg-zinc-950 text-white flex flex-col justify-between p-6 overflow-y-auto transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div>
          <div className="mb-8 border-b border-zinc-800 pb-4 flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold tracking-tight uppercase">
                Urban Fade
              </h1>
              <p className="text-xs text-zinc-400 mt-1">Control Room v1.0</p>
            </div>
            <button
              className="md:hidden text-zinc-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          <nav className="space-y-2">
            <button
              onClick={() => {
                setActiveTab("services");
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "services" ? "bg-white text-zinc-950" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"}`}
            >
              <Scissors size={18} /> Services
            </button>
            <button
              onClick={() => {
                setActiveTab("products");
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "products" ? "bg-white text-zinc-950" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"}`}
            >
              <Package size={18} /> Products
            </button>
            <button
              onClick={() => {
                setActiveTab("gallery");
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "gallery" ? "bg-white text-zinc-950" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"}`}
            >
              <Camera size={18} /> Our Work
            </button>
            {/* ΝΕΟ TAB STRIKES */}
            <button
              onClick={() => {
                setActiveTab("strikes");
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "strikes" ? "bg-white text-zinc-950" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"}`}
            >
              <ShieldAlert size={18} /> Strikes
            </button>
          </nav>
        </div>

        <div className="mt-8">
          <button
            onClick={() => {
              setIsSettingsOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors w-full mb-2"
          >
            <Settings size={20} /> <span className="font-medium">Settings</span>
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors disabled:opacity-50"
          >
            {isLoggingOut ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <LogOut size={18} />
            )}{" "}
            {isLoggingOut ? "Logging out..." : "Log Out"}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:pl-72 md:pr-8 md:py-8 bg-zinc-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-zinc-200 pb-5">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                {activeTab === "services" && "Manage Services"}
                {activeTab === "products" && "Manage Products"}
                {activeTab === "gallery" && "Manage Gallery (Our Work)"}
                {activeTab === "strikes" && "Manage Strikes (No-Shows)"}
              </h2>
              {activeTab === "products" && (
                <p className="text-xs font-medium text-zinc-500 mt-1">
                  Remove.bg usage this month:{" "}
                  <span
                    className={`font-bold ${monthlyUploadsCount >= 50 ? "text-red-500" : "text-zinc-900"}`}
                  >
                    {monthlyUploadsCount} / 50
                  </span>{" "}
                  free removals.
                </p>
              )}
              {activeTab === "gallery" && (
                <p className="text-xs font-medium text-zinc-500 mt-1">
                  Photos appear on the homepage in the order they are uploaded.
                </p>
              )}
              {activeTab === "strikes" && (
                <p className="text-xs font-medium text-zinc-500 mt-1">
                  Πελάτες που δεν εμφανίστηκαν. Στα 3 strikes μπλοκάρονται
                  αυτόματα.
                </p>
              )}
            </div>

            {(activeTab === "services" || activeTab === "products") && (
              <button
                onClick={
                  activeTab === "services" ? openNewService : openNewProduct
                }
                className="flex items-center justify-center gap-2 bg-zinc-950 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm w-full sm:w-auto"
              >
                <Plus size={16} />{" "}
                {activeTab === "services" ? "New Service" : "New Product"}
              </button>
            )}
          </div>

          {/* TABLE SERVICES */}
          {activeTab === "services" && (
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                      <th className="px-6 py-4">Name (Primary/Sec)</th>
                      <th className="px-6 py-4">Duration</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-sm">
                    {sortedServices.map((service: any) => (
                      <tr
                        key={service.id}
                        className="hover:bg-zinc-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold text-zinc-900">
                            {service.name}
                          </p>
                          <p className="text-xs text-zinc-400">
                            {service.nameEn || "-"}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-zinc-500">
                          {service.duration}
                        </td>
                        <td className="px-6 py-4 font-medium text-zinc-900">
                          {service.price}
                        </td>
                        <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                          <button
                            onClick={async () => {
                              await moveService(service.id, "up");
                              router.refresh();
                            }}
                            className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            onClick={async () => {
                              await moveService(service.id, "down");
                              router.refresh();
                            }}
                            className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md"
                          >
                            <ArrowDown size={16} />
                          </button>
                          <span className="text-zinc-300">|</span>
                          <button
                            onClick={() => openEditService(service)}
                            className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={async () => {
                              if (
                                window.confirm(
                                  `Are you sure you want to delete the service "${service.name}"?`,
                                )
                              ) {
                                await deleteService(service.id);
                                router.refresh();
                              }
                            }}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TABLE PRODUCTS */}
          {activeTab === "products" && (
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-sm">
                    {sortedProducts.map((product: any) => (
                      <tr
                        key={product.id}
                        className="hover:bg-zinc-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 flex items-center gap-4">
                          <div className="w-10 h-10 flex-shrink-0 bg-zinc-100 rounded-lg p-1 flex items-center justify-center overflow-hidden border border-zinc-200">
                            <img
                              src={product.img || ""}
                              alt={product.name}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-zinc-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-zinc-400 max-w-xs truncate">
                              {product.desc}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-md text-xs font-medium">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-zinc-900">
                          {product.price}
                        </td>
                        <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                          <button
                            onClick={async () => {
                              await moveProduct(product.id, "up");
                              router.refresh();
                            }}
                            className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            onClick={async () => {
                              await moveProduct(product.id, "down");
                              router.refresh();
                            }}
                            className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md"
                          >
                            <ArrowDown size={16} />
                          </button>
                          <span className="text-zinc-300">|</span>
                          <button
                            onClick={() => openEditProduct(product)}
                            className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={async () => {
                              if (
                                window.confirm(
                                  `Are you sure you want to delete the product "${product.name}"?`,
                                )
                              ) {
                                await deleteProduct(product.id);
                                router.refresh();
                              }
                            }}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW / INTERFACE ΓΙΑ ΤΗΝ ΓΚΑΛΕΡΙ (NEW TAB) */}
          {activeTab === "gallery" && (
            <div className="space-y-8">
              {/* Φόρμα Ανεβάσματος */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm max-w-xl">
                <h3 className="font-bold text-zinc-900 mb-2">Add New Photo</h3>
                <form
                  onSubmit={handleUploadGallery}
                  className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
                >
                  <input
                    id="galleryInput"
                    type="file"
                    required
                    accept="image/*"
                    onChange={(e) =>
                      setGalleryFile(e.target.files?.[0] || null)
                    }
                    className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-950 file:text-white hover:file:bg-zinc-800 cursor-pointer"
                  />
                  <button
                    type="submit"
                    disabled={isGalleryUploading || !galleryFile}
                    className="bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-sm px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 whitespace-nowrap w-full sm:w-auto justify-center"
                  >
                    {isGalleryUploading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Plus size={16} />
                    )}
                    {isGalleryUploading ? "Uploading..." : "Upload"}
                  </button>
                </form>
              </div>

              {/* Πλέγμα Φωτογραφιών */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {initialGallery.map((img: any) => (
                  <div
                    key={img.id}
                    className="relative aspect-[4/5] bg-white border border-zinc-200 rounded-xl p-2 group shadow-sm overflow-hidden"
                  >
                    <img
                      src={img.url}
                      alt="Gallery Work"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {/* Κουμπί Διαγραφής Overlapped */}
                    <button
                      onClick={async () => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this photo from Our Work?",
                          )
                        ) {
                          await deleteGalleryImage(img.id);
                          router.refresh();
                        }
                      }}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg text-white"
                    >
                      <div className="bg-red-600 p-2.5 rounded-full hover:scale-110 transition-transform">
                        <Trash2 size={20} />
                      </div>
                    </button>
                  </div>
                ))}
                {initialGallery.length === 0 && (
                  <div className="col-span-full py-12 text-center text-zinc-400 font-medium border-2 border-dashed border-zinc-200 rounded-2xl">
                    📸 No custom photos. The site displays default screenshots.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW / INTERFACE ΓΙΑ ΤΑ STRIKES */}
          {activeTab === "strikes" && (
            <div className="space-y-8">
              {/* Φόρμα χειροκίνητης προσθήκης Strike */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm max-w-xl">
                <h3 className="font-bold text-zinc-900 mb-2 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-500" />
                  Χειροκίνητη Προσθήκη Strike
                </h3>
                <p className="text-sm text-zinc-500 mb-4">
                  Αν κάποιος δεν εμφανίστηκε στο ραντεβού του, ρίξε του ένα
                  strike εδώ.
                </p>
                <form
                  onSubmit={handleAddStrike}
                  className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
                >
                  <input
                    type="text"
                    required
                    placeholder="Τηλέφωνο (π.χ. 69...)"
                    value={newStrikePhone}
                    onChange={(e) => setNewStrikePhone(e.target.value)}
                    className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none font-medium text-zinc-900"
                  />
                  <button
                    type="submit"
                    disabled={isStriking || !newStrikePhone}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 whitespace-nowrap w-full sm:w-auto justify-center"
                  >
                    {isStriking ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Plus size={16} />
                    )}
                    Προσθήκη Strike
                  </button>
                </form>
              </div>

              {/* Λίστα με Strikes */}
              <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                        <th className="px-6 py-4">Τηλέφωνο</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4 text-center">
                          Σύνολο Strikes
                        </th>
                        <th className="px-6 py-4 text-right">Ενέργειες</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-sm">
                      {initialStrikes.map((strike: any) => {
                        // Χρώματα ανάλογα με τα strikes
                        let badgeColor =
                          "bg-yellow-100 text-yellow-800 border-yellow-200";
                        if (strike.strikes === 2)
                          badgeColor =
                            "bg-orange-100 text-orange-800 border-orange-200";
                        if (strike.strikes >= 3)
                          badgeColor = "bg-red-100 text-red-800 border-red-200";

                        return (
                          <tr
                            key={strike.id}
                            className="hover:bg-zinc-50/50 transition-colors"
                          >
                            <td className="px-6 py-4 font-bold text-zinc-900">
                              {strike.phone}
                            </td>
                            <td className="px-6 py-4 text-zinc-500">
                              {strike.email || "-"}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span
                                className={`inline-flex items-center justify-center w-8 h-8 rounded-full border-2 font-black ${badgeColor}`}
                              >
                                {strike.strikes}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={async () => {
                                  if (
                                    window.confirm(
                                      "Είστε σίγουροι ότι θέλετε να σβήσετε εντελώς το ιστορικό strikes αυτού του πελάτη;",
                                    )
                                  ) {
                                    await deleteStrike(strike.id);
                                    router.refresh();
                                  }
                                }}
                                className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                              >
                                Συγχώρεση (Διαγραφή)
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {initialStrikes.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="py-12 text-center text-zinc-400 font-medium"
                          >
                            Δεν υπάρχουν strikes! Οι πελάτες σας είναι άψογοι.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL ΥΠΗΡΕΣΙΑΣ */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-zinc-100 flex-shrink-0">
              <h3 className="text-lg md:text-xl font-bold text-zinc-900">
                {editingId ? "Edit Service" : "New Service"}
              </h3>
              <button
                onClick={() => setServiceModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-900"
              >
                <X size={24} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              <form
                onSubmit={handleSaveService}
                className="p-4 md:p-6 space-y-4 md:space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">
                      Name (Primary) *
                    </label>
                    <input
                      type="text"
                      required
                      value={serviceForm.name}
                      onChange={(e) =>
                        setServiceForm({ ...serviceForm, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">
                      Name (Secondary)
                    </label>
                    <input
                      type="text"
                      value={serviceForm.nameEn}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          nameEn: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">
                      Price *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. $15"
                      value={serviceForm.price}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          price: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">
                      Duration *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 30 min"
                      value={serviceForm.duration}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          duration: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setServiceModalOpen(false)}
                    className="px-5 py-2.5 text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-white bg-zinc-950 hover:bg-zinc-800 rounded-lg font-medium"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ΠΡΟΪΟΝΤΟΣ */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-zinc-100 flex-shrink-0">
              <h3 className="text-lg md:text-xl font-bold text-zinc-900">
                {editingId ? "Edit Product" : "New Product"}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-900"
              >
                <X size={24} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              <form
                onSubmit={handleSaveProduct}
                className="p-4 md:p-6 space-y-4 md:space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">
                      Brand / Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) =>
                        setProductForm({ ...productForm, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">
                      Price *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. $13"
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          price: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {isNewCategory ? (
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">
                        New Category *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          placeholder="e.g. accessories"
                          value={productForm.category}
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              category: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setIsNewCategory(false);
                            setProductForm({
                              ...productForm,
                              category: existingCategories[0] || "care",
                            });
                          }}
                          className="px-3 bg-zinc-100 text-zinc-700 rounded-lg text-xs font-semibold"
                        >
                          List
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">
                        Category *
                      </label>
                      <select
                        value={productForm.category}
                        onChange={(e) => {
                          if (e.target.value === "__NEW__") {
                            setIsNewCategory(true);
                            setProductForm({ ...productForm, category: "" });
                          } else {
                            setProductForm({
                              ...productForm,
                              category: e.target.value,
                            });
                          }
                        }}
                        className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none"
                      >
                        {existingCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                        <option
                          value="__NEW__"
                          className="font-bold text-zinc-600"
                        >
                          + New Category...
                        </option>
                      </select>
                    </div>
                  )}
                  {editingId === null && (
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">
                        Product Image *
                      </label>
                      <input
                        type="file"
                        required
                        accept="image/*"
                        onChange={(e) =>
                          setProductFile(e.target.files?.[0] || null)
                        }
                        className="w-full px-4 py-1.5 border border-zinc-200 rounded-lg outline-none file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-zinc-950 file:text-white"
                      />
                      <div className="mt-3 mb-1 flex items-center gap-2 bg-zinc-50 p-2 rounded border border-zinc-200">
                        <input
                          type="checkbox"
                          id="removeBgToggle"
                          checked={useRemoveBg}
                          onChange={(e) => setUseRemoveBg(e.target.checked)}
                          className="rounded border-zinc-300 text-zinc-900 cursor-pointer"
                        />
                        <label
                          htmlFor="removeBgToggle"
                          className="text-sm font-medium text-zinc-700 cursor-pointer"
                        >
                          Auto-remove background (AI)
                        </label>
                      </div>
                      {useRemoveBg && monthlyUploadsCount >= 50 ? (
                        <p className="text-[11px] text-amber-600 font-medium bg-amber-50 border border-amber-200 rounded p-1.5">
                          ⚠️ 50 free removals reached.
                        </p>
                      ) : useRemoveBg ? (
                        <p className="text-[11px] text-zinc-400">
                          ✨ Background will be removed automatically.
                        </p>
                      ) : (
                        <p className="text-[11px] text-zinc-400">
                          ℹ️ Image will be uploaded as is.
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Description (Primary) *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={productForm.desc}
                    onChange={(e) =>
                      setProductForm({ ...productForm, desc: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none resize-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Description (Secondary)
                  </label>
                  <textarea
                    rows={2}
                    value={productForm.descEn}
                    onChange={(e) =>
                      setProductForm({ ...productForm, descEn: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none resize-none"
                  ></textarea>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setProductModalOpen(false)}
                    className="px-5 py-2.5 text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 text-white bg-zinc-950 hover:bg-zinc-800 rounded-lg font-medium disabled:opacity-50"
                  >
                    {isSubmitting && (
                      <Loader2 size={16} className="animate-spin" />
                    )}{" "}
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ΡΥΘΜΙΣΕΩΝ */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-zinc-100">
              <div>
                <h3 className="text-xl font-bold text-zinc-900">
                  Account Settings
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Change username or password.
                </p>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-zinc-400 hover:text-zinc-900"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateSettings} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                  Old Password *
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-zinc-900"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  >
                    {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                  New Username
                </label>
                <input
                  type="text"
                  placeholder="e.g. admin"
                  value={settingsUsername}
                  onChange={(e) => setSettingsUsername(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-zinc-900"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 pr-10 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                    >
                      {showNewPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                    Confirm
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 pr-10 bg-zinc-50 border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              {settingsMessage && (
                <div
                  className={`p-3 rounded-lg text-sm font-medium ${settingsMessage.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                >
                  {settingsMessage.text}
                </div>
              )}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={settingsLoading}
                  className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-sm px-5 py-3 rounded-xl transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {settingsLoading && (
                    <Loader2 size={16} className="animate-spin" />
                  )}{" "}
                  {settingsLoading ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
