"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  CalendarDays,
  Clock,
  MapPin,
} from "lucide-react";
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
      className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md mx-auto overflow-hidden relative z-10"
    >
      {/* 1. Εντυπωσιακή Μαύρη Κεφαλίδα */}
      <div className="bg-zinc-950 px-8 py-10 text-center relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-500 via-transparent to-transparent"></div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative z-10"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
            <CheckCircle2 size={40} className="text-white" />
          </div>
        </motion.div>
        <h1 className="text-2xl sm:text-3xl font-black text-white relative z-10 tracking-tight">
          {lang === "el" ? "Επιτυχής Κράτηση!" : "Booking Confirmed!"}
        </h1>
      </div>

      {/* 2. Κυρίως Σώμα & Ticket */}
      <div className="px-6 sm:px-8 py-8">
        <p className="text-center text-zinc-500 font-medium mb-6">
          {lang === "el"
            ? "Το ραντεβού σας κατοχυρώθηκε. Παρακάτω βρίσκονται οι λεπτομέρειες της κράτησής σας."
            : "Your appointment has been secured. Below are your booking details."}
        </p>

        {/* --- ΨΗΦΙΑΚΟ ΕΙΣΙΤΗΡΙΟ (TICKET) --- */}
        <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-5 mb-8 relative">
          {/* Διακοσμητικά κοψίματα για εφέ εισιτηρίου */}
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-r border-zinc-200"></div>
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-l border-zinc-200"></div>

          <div className="space-y-4">
            {/* Ημερομηνία */}
            <div className="flex items-center gap-4">
              <div className="bg-zinc-200/50 p-3 rounded-xl">
                <CalendarDays className="text-zinc-700" size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  {lang === "el" ? "Ημερομηνια" : "Date"}
                </p>
                <p className="font-bold text-zinc-900 text-lg">
                  {formatDate(dateStr, lang)}
                </p>
              </div>
            </div>

            <div className="h-px w-full border-t border-dashed border-zinc-300"></div>

            {/* Ώρα */}
            <div className="flex items-center gap-4">
              <div className="bg-zinc-200/50 p-3 rounded-xl">
                <Clock className="text-zinc-700" size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  {lang === "el" ? "Ωρα προσελευσης" : "Time"}
                </p>
                <p className="font-bold text-zinc-900 text-lg">{time}</p>
              </div>
            </div>

            <div className="h-px w-full border-t border-dashed border-zinc-300"></div>

            {/* Τοποθεσία */}
            <div className="flex items-center gap-4">
              <div className="bg-zinc-200/50 p-3 rounded-xl">
                <MapPin className="text-zinc-700" size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  {lang === "el" ? "Τοποθεσια" : "Location"}
                </p>
                <p className="font-bold text-zinc-900">Urban Fade Barbershop</p>
              </div>
            </div>
          </div>
        </div>

        {/* Warning για τα Strikes (Μόνο αν ο χρήστης έχει) */}
        {strikes > 0 && strikes < 3 && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl mb-8 text-sm flex gap-3 text-left">
            <AlertTriangle
              size={24}
              className="flex-shrink-0 text-amber-600 mt-0.5"
            />
            <div className="leading-relaxed">
              <strong className="block mb-1">
                {lang === "el" ? "Προσοχή (No-Show):" : "Warning (No-Show):"}
              </strong>
              {lang === "el"
                ? `Έχετε ${strikes} Strike(s). Αν δεν εμφανιστείτε στο ραντεβού σας, θα φτάσετε στα 3 Strikes και ο λογαριασμός σας θα μπλοκαριστεί οριστικά.`
                : `You currently have ${strikes} strike(s). Reaching 3 strikes will permanently restrict your account.`}
            </div>
          </div>
        )}

        {/* Κουμπί Επιστροφής */}
        <Link
          href="/"
          className="flex items-center justify-center w-full bg-zinc-950 text-white px-8 py-4 rounded-xl font-bold hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-950/20"
        >
          {lang === "el" ? "Επιστροφή στην Αρχική" : "Back to Home"}
        </Link>
      </div>
    </motion.div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 md:px-6 overflow-hidden">
      {/* BACKGROUND IMAGES (Από την Αρχική Σελίδα) */}
      <div className="fixed top-0 left-0 w-full h-screen z-0 bg-zinc-900">
        <img
          src="/hero/hero_desktop.jpg"
          alt="Hero Background Desktop"
          className="hidden md:block w-full h-full object-cover object-center opacity-40 blur-[5px] scale-105"
        />
        <img
          src="/hero/hero_mobile.jpg"
          alt="Hero Background Mobile"
          className="block md:hidden w-full h-full object-cover object-center opacity-40 blur-[5px] scale-105"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-zinc-950/90"></div>
      </div>

      {/* Κεντρικό Content */}
      <div className="w-full mx-auto relative z-10 flex justify-center">
        <Suspense
          fallback={
            <div className="text-center py-10 text-white font-bold animate-pulse">
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
