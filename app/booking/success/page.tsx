"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { Check, AlertTriangle, Calendar, Clock, MapPin } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const dateStr = searchParams.get("date");
  const time = searchParams.get("time");
  const lang = searchParams.get("lang") || "el";
  const strikes = parseInt(searchParams.get("strikes") || "0", 10);

  const formatDate = (dateString: string | null, lang: string) => {
    if (!dateString) return "";
    const [y, m, d] = dateString.split("-");
    return lang === "el" ? `${d}/${m}/${y}` : `${m}/${d}/${y}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg mx-auto p-8 sm:p-12 relative z-10"
    >
      {/* 1. Premium Icon (Stripe Style) */}
      <div className="flex justify-center mb-8">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center border-[8px] border-green-100/50">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
            <Check size={32} strokeWidth={3} className="text-white" />
          </div>
        </div>
      </div>

      {/* 2. Title & Subtitle */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 mb-3 tracking-tight">
          {lang === "el" ? "Επιτυχής Κράτηση" : "Booking Confirmed"}
        </h1>
        <p className="text-zinc-500 text-lg">
          {lang === "el"
            ? "Το ραντεβού σας έχει κατοχυρωθεί επιτυχώς."
            : "Your appointment has been successfully secured."}
        </p>
      </div>

      {/* 3. Minimalist Details Box */}
      <div className="bg-zinc-50/50 border border-zinc-100 rounded-2xl p-6 sm:p-8 mb-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-zinc-500">
            <Calendar size={20} />
            <span className="text-sm font-semibold uppercase tracking-wider">
              {lang === "el" ? "Ημερομηνια" : "Date"}
            </span>
          </div>
          <span className="font-bold text-zinc-900 text-lg">
            {formatDate(dateStr, lang)}
          </span>
        </div>

        <div className="w-full h-px bg-zinc-200/60"></div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-zinc-500">
            <Clock size={20} />
            <span className="text-sm font-semibold uppercase tracking-wider">
              {lang === "el" ? "Ωρα" : "Time"}
            </span>
          </div>
          <span className="font-bold text-zinc-900 text-lg">{time}</span>
        </div>

        <div className="w-full h-px bg-zinc-200/60"></div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-zinc-500">
            <MapPin size={20} />
            <span className="text-sm font-semibold uppercase tracking-wider">
              {lang === "el" ? "Τοποθεσια" : "Location"}
            </span>
          </div>
          <span className="font-bold text-zinc-900 text-right">Urban Fade</span>
        </div>
      </div>

      {/* 4. Warning Box (If needed) */}
      {strikes > 0 && strikes < 3 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-8 flex items-start gap-3">
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

      {/* 5. Action Button */}
      <Link
        href="/"
        className="flex items-center justify-center w-full bg-zinc-950 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/20"
      >
        {lang === "el" ? "Επιστροφή στην Αρχική" : "Back to Home"}
      </Link>
    </motion.div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center pt-24 pb-12 px-4 md:px-6 overflow-hidden">
      {/* ΑΚΡΙΒΩΣ το Background από το Booking Wizard σου */}
      <div className="fixed top-0 left-0 w-full h-screen z-0 bg-zinc-900">
        <img
          src="/hero/hero_desktop.jpg"
          alt="Hero Background Desktop"
          className="hidden md:block w-full h-full object-cover object-center opacity-50 blur-[3px]"
        />
        <img
          src="/hero/hero_mobile.jpg"
          alt="Hero Background Mobile"
          className="block md:hidden w-full h-full object-cover object-center opacity-50 blur-[3px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-zinc-50/90"></div>
      </div>

      <div className="w-full mx-auto relative z-10 flex justify-center">
        <Suspense
          fallback={
            <div className="text-center py-10 text-zinc-900 font-bold animate-pulse">
              Φόρτωση...
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
