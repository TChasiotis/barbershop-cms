"use client";

import { Suspense, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Check,
  CalendarDays,
  Clock,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("id"); // Πήραμε και το ID από το URL
  const dateStr = searchParams.get("date");
  const time = searchParams.get("time");
  const lang = searchParams.get("lang") || "el";
  const strikes = parseInt(searchParams.get("strikes") || "0", 10);

  // --- ΛΟΓΙΚΗ ΑΠΟΣΤΟΛΗΣ EMAIL ---
  // Ασπίδα για να μην σταλεί το email 2 φορές (λόγω React Strict Mode)
  const hasTriggeredEmail = useRef(false);

  useEffect(() => {
    // Αν υπάρχει ID στο URL και δεν έχουμε ξαναστείλει το email
    if (appointmentId && !hasTriggeredEmail.current) {
      hasTriggeredEmail.current = true; // Το κλειδώνουμε

      console.log(
        `[Frontend] Εντοπίστηκε ραντεβού με ID: ${appointmentId}. Κλήση του API...`,
      );

      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("[Frontend] Απάντηση από το API Email:", data);
        })
        .catch((err) => {
          console.error("[Frontend] Αποτυχία κλήσης API Email:", err);
        });
    } else if (!appointmentId) {
      console.warn(
        "[Frontend] Προσοχή: Το URL δεν έχει ?id= , άρα δεν μπορεί να σταλεί email!",
      );
    }
  }, [appointmentId]);
  // ------------------------------

  const formatDate = (dateString: string | null, lang: string) => {
    if (!dateString) return "";
    const [y, m, d] = dateString.split("-");
    return lang === "el" ? `${d}/${m}/${y}` : `${m}/${d}/${y}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-auto overflow-hidden relative z-10 border border-zinc-100"
    >
      {/* Premium Success Header */}
      <div className="pt-10 pb-6 px-8 text-center bg-zinc-50/50 border-b border-zinc-100">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_8px_30px_rgba(34,197,94,0.3)]">
          <Check size={36} strokeWidth={3} className="text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight mb-2">
          {lang === "el" ? "Το ραντεβού έκλεισε!" : "Booking Confirmed!"}
        </h1>
        <p className="text-zinc-500 font-medium text-sm sm:text-base">
          {lang === "el"
            ? "Η κράτησή σας ολοκληρώθηκε με επιτυχία."
            : "Your appointment has been successfully secured."}
        </p>
      </div>

      {/* Body Details */}
      <div className="p-8 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-zinc-400">
              <CalendarDays size={20} />
              <span className="text-sm font-bold uppercase tracking-wider">
                {lang === "el" ? "Ημερομηνια" : "Date"}
              </span>
            </div>
            <span className="font-bold text-zinc-900 text-lg">
              {formatDate(dateStr, lang)}
            </span>
          </div>

          <div className="w-full h-px bg-zinc-100"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-zinc-400">
              <Clock size={20} />
              <span className="text-sm font-bold uppercase tracking-wider">
                {lang === "el" ? "Ωρα" : "Time"}
              </span>
            </div>
            <span className="font-bold text-zinc-900 text-lg">{time}</span>
          </div>

          <div className="w-full h-px bg-zinc-100"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-zinc-400">
              <MapPin size={20} />
              <span className="text-sm font-bold uppercase tracking-wider">
                {lang === "el" ? "Τοποθεσια" : "Location"}
              </span>
            </div>
            <span className="font-bold text-zinc-900 text-right">
              Urban Fade
            </span>
          </div>
        </div>

        {/* Strikes Warning */}
        {strikes > 0 && strikes < 3 && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 mt-6">
            <AlertTriangle
              size={20}
              className="text-amber-600 mt-0.5 flex-shrink-0"
            />
            <div className="text-sm text-amber-800 leading-relaxed">
              <strong>{lang === "el" ? "Προσοχή:" : "Warning:"}</strong>{" "}
              {lang === "el"
                ? `Έχετε ${strikes} Strike(s) λόγω απουσίας (No-Show). Στα 3 Strikes ο λογαριασμός κλειδώνει.`
                : `You have ${strikes} no-show strike(s). At 3 strikes, your account will be restricted.`}
            </div>
          </div>
        )}

        {/* Button */}
        <Link
          href="/"
          className="flex items-center justify-center w-full bg-zinc-950 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-zinc-800 transition-colors mt-8"
        >
          {lang === "el" ? "Επιστροφή στην Αρχική" : "Back to Home"}
        </Link>
      </div>
    </motion.div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center pt-24 pb-12 px-4 md:px-6 overflow-hidden">
      {/* BACKGROUND IMAGES (Ακριβώς όπως στο BookingWizard) */}
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

      <div className="max-w-3xl w-full mx-auto relative z-10 rounded-3xl">
        <Suspense
          fallback={
            <div className="text-center py-10 text-white font-bold animate-pulse">
              Loading...
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
