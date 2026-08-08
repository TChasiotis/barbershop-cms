"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  Menu,
  X,
  Settings,
  LogOut,
  Scissors,
  Package,
  Camera,
  ShieldAlert,
  CalendarDays,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { updateAdminSettings } from "./actions";

// --- ΕΙΣΑΓΩΓΗ ΤΩΝ COMPONENTS (TABS) ---
import AgendaTab from "./tabs/AgendaTab";
import ServicesTab from "./tabs/ServicesTab";
import ProductsTab from "./tabs/ProductsTab";
import GalleryTab from "./tabs/GalleryTab";
import StrikesTab from "./tabs/StrikesTab";

export default function AdminDashboard({
  initialServices,
  initialProducts,
  initialGallery = [],
  initialStrikes = [],
  initialAppointments = [],
  monthlyUploadsCount = 0,
}: any) {
  const [activeTab, setActiveTab] = useState<
    "appointments" | "services" | "products" | "gallery" | "strikes"
  >("appointments");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Settings States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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
                setActiveTab("appointments");
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "appointments" ? "bg-white text-zinc-950" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"}`}
            >
              <CalendarDays size={18} /> Ημερήσια Ατζέντα
            </button>
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

      {/* MAIN CONTENT (Δυναμική φόρτωση των Tabs) */}
      <main className="flex-1 p-4 md:pl-72 md:pr-8 md:py-8 bg-zinc-50 min-h-screen relative">
        <div className="max-w-6xl mx-auto">
          {activeTab === "appointments" && (
            <AgendaTab initialAppointments={initialAppointments} />
          )}
          {activeTab === "services" && (
            <ServicesTab initialServices={initialServices} />
          )}
          {activeTab === "products" && (
            <ProductsTab
              initialProducts={initialProducts}
              monthlyUploadsCount={monthlyUploadsCount}
            />
          )}
          {activeTab === "gallery" && (
            <GalleryTab initialGallery={initialGallery} />
          )}
          {activeTab === "strikes" && (
            <StrikesTab initialStrikes={initialStrikes} />
          )}
        </div>
      </main>

      {/* SETTINGS MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-zinc-100">
              <div>
                <h3 className="text-xl font-bold text-zinc-900">
                  Account Settings
                </h3>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-zinc-400 hover:text-zinc-900"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateSettings} className="p-6 space-y-5">
              {/* (Ο κώδικας του Settings form είναι ακριβώς ο ίδιος, τον συμπτύσσω για εξοικονόμηση χώρου, αντέγραψέ τον από το παλιό ή άστον έτσι) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                  Old Password *
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                  New Username
                </label>
                <input
                  type="text"
                  value={settingsUsername}
                  onChange={(e) => setSettingsUsername(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl"
                />
              </div>
              {settingsMessage && (
                <div
                  className={`p-3 rounded-lg text-sm font-medium ${settingsMessage.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                >
                  {settingsMessage.text}
                </div>
              )}
              <button
                type="submit"
                disabled={settingsLoading}
                className="w-full bg-zinc-950 text-white py-3 rounded-xl"
              >
                {settingsLoading ? "Updating..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
