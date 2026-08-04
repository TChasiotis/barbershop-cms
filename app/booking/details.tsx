"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Phone, CheckCircle2 } from "lucide-react";

export default function Details({ formData, setFormData, onNext, lang }: any) {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Μετατροπή ημερομηνίας σε YYYY-MM-DD string για αποφυγή σφαλμάτων ζώνης ώρας
      const dateString = `${formData.date.getFullYear()}-${(formData.date.getMonth() + 1).toString().padStart(2, "0")}-${formData.date.getDate().toString().padStart(2, "0")}`;

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: formData.serviceId,
          date: dateString,
          time: formData.time,
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        alert(
          lang === "el"
            ? "Κάτι πήγε στραβά, προσπαθήστε ξανά."
            : "Something went wrong, please try again.",
        );
      }
    } catch (error) {
      console.error(error);
      alert(lang === "el" ? "Σφάλμα σύνδεσης." : "Connection error.");
    }
    setLoading(false);
  };

  if (isSuccess) {
    const formattedDate = formData.date?.toLocaleDateString(
      lang === "el" ? "el-GR" : "en-US",
    );

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
        <p className="text-zinc-600 mb-8">
          {lang === "el" ? (
            <>
              Σας περιμένουμε στις <strong>{formattedDate}</strong> στις{" "}
              <strong>{formData.time}</strong> για {formData.serviceName}.
            </>
          ) : (
            <>
              We look forward to seeing you on <strong>{formattedDate}</strong>{" "}
              at <strong>{formData.time}</strong> for {formData.serviceName}.
            </>
          )}
        </p>
        <a
          href="/"
          className="inline-block bg-zinc-950 text-white px-8 py-4 rounded-xl font-bold hover:bg-zinc-800 transition-colors"
        >
          {lang === "el" ? "Επιστροφή στην Αρχική" : "Back to Home"}
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-zinc-900">
        <User size={20} className="text-zinc-500" />
        {lang === "el" ? "Τα στοιχεία σας" : "Your Details"}
      </h2>

      {/* Σύνοψη Κράτησης */}
      <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 mb-8 flex justify-between items-center">
        <div>
          <div className="text-sm text-zinc-500">
            {lang === "el" ? "Επιλογή" : "Service"}
          </div>
          <div className="font-bold text-zinc-900">{formData.serviceName}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-zinc-500">
            {formData.date?.toLocaleDateString(
              lang === "el" ? "el-GR" : "en-US",
            )}
          </div>
          <div className="font-bold text-zinc-900">{formData.time}</div>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-zinc-900 mb-2">
            {lang === "el" ? "Ονοματεπώνυμο" : "Full Name"}
          </label>
          <input
            type="text"
            placeholder={
              lang === "el" ? "π.χ. Γιάννης Παπαδόπουλος" : "e.g. John Doe"
            }
            value={formData.customerName}
            onChange={(e) =>
              setFormData({ ...formData, customerName: e.target.value })
            }
            className="w-full p-4 bg-white border-2 border-zinc-200 rounded-xl outline-none focus:border-zinc-900 text-zinc-900 font-medium placeholder:text-zinc-400 transition-colors"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-zinc-900 mb-2">
            {lang === "el" ? "Τηλέφωνο Επικοινωνίας" : "Phone Number"}
          </label>
          <input
            type="tel"
            placeholder={lang === "el" ? "π.χ. 6900000000" : "e.g. 6900000000"}
            value={formData.customerPhone}
            onChange={(e) =>
              setFormData({ ...formData, customerPhone: e.target.value })
            }
            className="w-full p-4 bg-white border-2 border-zinc-200 rounded-xl outline-none focus:border-zinc-900 text-zinc-900 font-medium placeholder:text-zinc-400 transition-colors"
          />
        </div>
      </div>

      <button
        disabled={
          !formData.customerName ||
          formData.customerPhone.length < 10 ||
          loading
        }
        onClick={handleSubmit}
        className="w-full mt-10 bg-zinc-950 text-white py-4 rounded-xl font-bold text-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading
          ? lang === "el"
            ? "Γίνεται Κράτηση..."
            : "Booking..."
          : lang === "el"
            ? "Ολοκλήρωση Κράτησης"
            : "Complete Booking"}
      </button>
    </motion.div>
  );
}
