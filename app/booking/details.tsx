"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  CheckCircle2,
  CreditCard,
  Wallet,
  AlertTriangle,
  Ban,
} from "lucide-react";

export default function Details({ formData, setFormData, onNext, lang }: any) {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false); // Για το LocalStorage spam

  // 1. Ελέγχουμε αν η συσκευή έχει ήδη ενεργό ραντεβού
  useEffect(() => {
    const activeBooking = localStorage.getItem("activeBooking");
    if (activeBooking) {
      // Αν βρούμε σημάδι, τον μπλοκάρουμε!
      setIsBlocked(true);
    }

    // Αρχικοποιούμε τον τρόπο πληρωμής αν δεν υπάρχει
    if (!formData.paymentMethod) {
      setFormData((prev: any) => ({
        ...prev,
        paymentMethod: "STORE",
        customerEmail: "",
      }));
    }
  }, []);

  const formatDate = (date: Date | null, lang: string) => {
    if (!date) return "";
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return lang === "el" ? `${d}/${m}/${y}` : `${m}/${d}/${y}`;
  };

  const handlePhoneChange = (e: any) => {
    let val = e.target.value.replace(/[^\d+ ]/g, "");
    const plusIndex = val.indexOf("+");
    if (plusIndex !== -1) {
      val =
        val.substring(0, plusIndex + 1) +
        val.substring(plusIndex + 1).replace(/\+/g, "");
    }
    let finalVal = "";
    let charCount = 0;
    for (let char of val) {
      if (char !== " ") {
        if (charCount < 15) {
          finalVal += char;
          charCount++;
        }
      } else {
        finalVal += char;
      }
    }
    setFormData({ ...formData, customerPhone: finalVal });
  };

  const phoneDigitsCount =
    formData.customerPhone?.replace(/\D/g, "").length || 0;

  const handleSubmit = async () => {
    if (formData.paymentMethod === "ONLINE") {
      alert(
        lang === "el"
          ? "Εδώ θα άνοιγε το περιβάλλον της Stripe για την κάρτα (Demo)!"
          : "Stripe checkout would open here (Demo)!",
      );
      // Για το demo, συνεχίζουμε κανονικά σαν να πλήρωσε
    }

    setLoading(true);
    try {
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
          customerEmail: formData.customerEmail, // Στέλνουμε και το Email
          paymentMethod: formData.paymentMethod, // Στέλνουμε πώς θα πληρώσει
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        // ΒΑΖΟΥΜΕ ΤΟ ΣΗΜΑΔΙ ΣΤΟΝ BROWSER!
        localStorage.setItem("activeBooking", "true");
      } else {
        alert(lang === "el" ? "Κάτι πήγε στραβά." : "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  // --- ΟΘΟΝΗ ΑΝ ΕΙΝΑΙ ΜΠΛΟΚΑΡΙΣΜΕΝΟΣ (SPAM) ---
  if (isBlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-10"
      >
        <Ban size={64} className="text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-zinc-900 mb-4">
          {lang === "el"
            ? "Έχετε ήδη ενεργή κράτηση"
            : "You already have an active booking"}
        </h2>
        <p className="text-zinc-600 mb-8 max-w-md mx-auto">
          {lang === "el"
            ? "Φαίνεται πως έχετε ήδη κλείσει ένα ραντεβού. Για να αποφύγουμε διπλές κρατήσεις, επιτρέπεται μόνο ένα ενεργό ραντεβού ανά συσκευή."
            : "It seems you already have a booking. To prevent spam, we only allow one active booking per device."}
        </p>
        <a
          href="/"
          className="inline-block bg-zinc-900 text-white px-8 py-3 rounded-xl font-bold"
        >
          {lang === "el" ? "Αρχική" : "Home"}
        </a>
      </motion.div>
    );
  }

  // --- ΟΘΟΝΗ ΕΠΙΤΥΧΙΑΣ ---
  if (isSuccess) {
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
              Σας περιμένουμε στις{" "}
              <strong>{formatDate(formData.date, lang)}</strong> στις{" "}
              <strong>{formData.time}</strong>.
            </>
          ) : (
            <>
              See you on <strong>{formatDate(formData.date, lang)}</strong> at{" "}
              <strong>{formData.time}</strong>.
            </>
          )}
        </p>
        <a
          href="/"
          className="inline-block bg-zinc-950 text-white px-8 py-4 rounded-xl font-bold hover:bg-zinc-800"
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

      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-bold text-zinc-900 mb-2">
            {lang === "el" ? "Ονοματεπώνυμο *" : "Full Name *"}
          </label>
          <input
            type="text"
            value={formData.customerName || ""}
            onChange={(e) =>
              setFormData({ ...formData, customerName: e.target.value })
            }
            className="w-full p-4 bg-white border-2 border-zinc-200 rounded-xl outline-none focus:border-zinc-900 font-medium"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-zinc-900 mb-2">
              {lang === "el" ? "Τηλέφωνο *" : "Phone *"}
            </label>
            <input
              type="tel"
              value={formData.customerPhone || ""}
              onChange={handlePhoneChange}
              className="w-full p-4 bg-white border-2 border-zinc-200 rounded-xl outline-none focus:border-zinc-900 font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-zinc-900 mb-2">
              {lang === "el" ? "Email (Προαιρετικό)" : "Email (Optional)"}
            </label>
            <input
              type="email"
              value={formData.customerEmail || ""}
              onChange={(e) =>
                setFormData({ ...formData, customerEmail: e.target.value })
              }
              className="w-full p-4 bg-white border-2 border-zinc-200 rounded-xl outline-none focus:border-zinc-900 font-medium"
            />
          </div>
        </div>
      </div>

      {/* --- ΕΠΙΛΟΓΗ ΠΛΗΡΩΜΗΣ --- */}
      <h2 className="text-lg font-bold mb-4 text-zinc-900 border-t border-zinc-100 pt-6">
        {lang === "el" ? "Τρόπος Πληρωμής" : "Payment Method"}
      </h2>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setFormData({ ...formData, paymentMethod: "STORE" })}
          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
            formData.paymentMethod === "STORE"
              ? "border-zinc-900 bg-zinc-50"
              : "border-zinc-200 hover:border-zinc-300"
          }`}
        >
          <Wallet
            size={24}
            className={
              formData.paymentMethod === "STORE"
                ? "text-zinc-900"
                : "text-zinc-400"
            }
          />
          <div className="text-left">
            <div className="font-bold text-zinc-900">
              {lang === "el" ? "Στο Ταμείο" : "Pay at Store"}
            </div>
            <div className="text-xs text-zinc-500">
              {lang === "el" ? "Μετρητά ή Κάρτα (POS)" : "Cash or Card"}
            </div>
          </div>
        </button>

        <button
          onClick={() => setFormData({ ...formData, paymentMethod: "ONLINE" })}
          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
            formData.paymentMethod === "ONLINE"
              ? "border-zinc-900 bg-zinc-50"
              : "border-zinc-200 hover:border-zinc-300"
          }`}
        >
          <CreditCard
            size={24}
            className={
              formData.paymentMethod === "ONLINE"
                ? "text-zinc-900"
                : "text-zinc-400"
            }
          />
          <div className="text-left">
            <div className="font-bold text-zinc-900">
              {lang === "el" ? "Online Πληρωμή" : "Pay Online"}
            </div>
            <div className="text-xs text-zinc-500">
              {lang === "el" ? "Ασφαλής συναλλαγή" : "Secure transaction"}
            </div>
          </div>
        </button>
      </div>

      {/* Προειδοποίηση αν επιλέξει ταμείο */}
      {formData.paymentMethod === "STORE" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-sm text-amber-800 mb-8">
          <AlertTriangle size={20} className="text-amber-600 flex-shrink-0" />
          <p>
            {lang === "el"
              ? "Πολιτική Κρατήσεων: Παρακαλούμε ενημερώστε μας έγκαιρα σε περίπτωση ακύρωσης. Μετά από 3 αδικαιολόγητες απουσίες (no-shows), ο λογαριασμός σας θα κλειδωθεί αυτόματα από το σύστημα."
              : "Booking Policy: Please notify us of cancellations. After 3 unexplained no-shows, your account will be automatically restricted from making future bookings."}
          </p>
        </div>
      )}

      <button
        disabled={!formData.customerName || phoneDigitsCount < 8 || loading}
        onClick={handleSubmit}
        className="w-full mt-4 bg-zinc-950 text-white py-4 rounded-xl font-bold text-lg hover:bg-zinc-800 transition-colors disabled:opacity-50"
      >
        {loading
          ? lang === "el"
            ? "Επεξεργασία..."
            : "Processing..."
          : lang === "el"
            ? "Ολοκλήρωση Κράτησης"
            : "Complete Booking"}
      </button>
    </motion.div>
  );
}
