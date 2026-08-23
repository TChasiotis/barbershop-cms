"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle } from "lucide-react";
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <CheckCircle2 size={72} className="text-green-500 mx-auto mb-6" />
      <h2 className="text-3xl font-bold text-zinc-900 mb-2">
        {lang === "el" ? "Το ραντεβού έκλεισε!" : "Appointment Booked!"}
      </h2>
      <p className="text-zinc-600 mb-6 text-lg">
        {lang === "el" ? (
          <>
            Σας περιμένουμε στις <strong>{formatDate(dateStr, lang)}</strong>{" "}
            στις <strong>{time}</strong>.
          </>
        ) : (
          <>
            See you on <strong>{formatDate(dateStr, lang)}</strong> at{" "}
            <strong>{time}</strong>.
          </>
        )}
      </p>

      {strikes > 0 && strikes < 3 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl mb-6 text-sm mx-auto max-w-sm flex gap-3 text-left">
          <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
          <div>
            <strong>{lang === "el" ? "Προσοχή:" : "Warning:"}</strong>{" "}
            {lang === "el"
              ? `Έχετε καταγεγραμμένα ${strikes} Strike(s) για απουσία. Στα 3 Strikes το σύστημα θα σας μπλοκάρει.`
              : `You have ${strikes} no-show strike(s). At 3 strikes, you will be blocked.`}
          </div>
        </div>
      )}

      <Link
        href="/"
        className="inline-block bg-zinc-950 text-white px-8 py-4 rounded-xl font-bold hover:bg-zinc-800 transition-colors"
      >
        {lang === "el" ? "Επιστροφή στην Αρχική" : "Back to Home"}
      </Link>
    </motion.div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-8 max-w-md w-full border border-zinc-100">
        <Suspense
          fallback={<div className="text-center py-10">Loading...</div>}
        >
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
