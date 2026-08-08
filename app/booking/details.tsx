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
  Info,
} from "lucide-react";

export default function Details({ formData, setFormData, onNext, lang }: any) {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  // Ξεχωρίζουμε τον λόγο του block για να δείχνουμε το σωστό μήνυμα
  const [blockReason, setBlockReason] = useState<
    "LOCAL_STORAGE" | "STRIKES" | "PHONE_EXISTS" | ""
  >("");
  const [userStrikes, setUserStrikes] = useState(0);

  const [cookieConsent, setCookieConsent] = useState(true);
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setShowCookieBanner(true);
    else setCookieConsent(true);

    const activeBookingExpiry = localStorage.getItem("activeBookingExpiry");
    if (activeBookingExpiry) {
      const expiryDate = new Date(activeBookingExpiry);
      const now = new Date();
      if (now > expiryDate) {
        localStorage.removeItem("activeBookingExpiry");
      } else {
        setBlockReason("LOCAL_STORAGE");
        setIsBlocked(true);
      }
    }

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

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setCookieConsent(true);
    setShowCookieBanner(false);
  };

  const handleSubmit = async () => {
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
          customerEmail: formData.customerEmail,
          paymentMethod: formData.paymentMethod,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setUserStrikes(data.strikes || 0);

        if (cookieConsent) {
          const [h, m] = formData.time.split(":");
          const expiryDate = new Date(formData.date);
          expiryDate.setHours(parseInt(h), parseInt(m), 0, 0);
          localStorage.setItem("activeBookingExpiry", expiryDate.toISOString());
        }
      } else if (res.status === 403) {
        setUserStrikes(data.strikes || 3);
        setBlockReason("STRIKES");
        setIsBlocked(true);
      } else if (res.status === 409) {
        setBlockReason("PHONE_EXISTS");
        setIsBlocked(true);
      } else {
        alert(lang === "el" ? "Κάτι πήγε στραβά." : "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  if (isBlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-10"
      >
        <Ban size={64} className="text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-zinc-900 mb-4">
          {blockReason === "STRIKES"
            ? lang === "el"
              ? "Ο λογαριασμός σας έχει περιοριστεί"
              : "Account Restricted"
            : blockReason === "PHONE_EXISTS"
              ? lang === "el"
                ? "Υπάρχει ήδη ραντεβού"
                : "Active Booking Exists"
              : lang === "el"
                ? "Έχετε ήδη ενεργή κράτηση"
                : "Active Booking Exists"}
        </h2>
        <p className="text-zinc-600 mb-8 max-w-md mx-auto">
          {blockReason === "STRIKES"
            ? lang === "el"
              ? `Έχετε ${userStrikes} strikes λόγω απουσίας (No-show). Η online κράτηση δεν είναι εφικτή.`
              : `You have ${userStrikes} no-show strikes. Online booking is disabled.`
            : blockReason === "PHONE_EXISTS"
              ? lang === "el"
                ? "Έχετε ήδη ένα ενεργό ραντεβού κλεισμένο με αυτόν τον αριθμό τηλεφώνου. Επιτρέπεται μόνο ένα ραντεβού ανά τηλέφωνο."
                : "An active booking already exists for this phone number. Only one booking per phone is allowed."
              : lang === "el"
                ? "Επιτρέπεται μόνο ένα ενεργό ραντεβού ανά συσκευή. Μόλις περάσει η ώρα του ραντεβού σας, η συσκευή θα ξεκλειδωθεί."
                : "Only one active booking is allowed per device. It will unlock after your appointment."}
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
        <p className="text-zinc-600 mb-6">
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

        {userStrikes > 0 && userStrikes < 3 && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl mb-6 text-sm mx-auto max-w-sm flex gap-3 text-left">
            <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <strong>{lang === "el" ? "Προσοχή:" : "Warning:"}</strong>{" "}
              {lang === "el"
                ? `Έχετε καταγεγραμμένα ${userStrikes} Strike(s) για απουσία. Στα 3 Strikes το σύστημα θα σας μπλοκάρει.`
                : `You have ${userStrikes} no-show strike(s). At 3 strikes, you will be blocked.`}
            </div>
          </div>
        )}

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
      {showCookieBanner && (
        <div className="bg-zinc-900 text-white p-4 rounded-2xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-3">
            <Info size={24} className="text-zinc-400 flex-shrink-0" />
            <p>
              {lang === "el"
                ? "Χρησιμοποιούμε cookies για την ομαλή λειτουργία των κρατήσεων."
                : "We use cookies to manage active bookings."}
            </p>
          </div>
          <button
            onClick={acceptCookies}
            className="bg-white text-zinc-900 px-4 py-2 rounded-lg font-bold whitespace-nowrap"
          >
            {lang === "el" ? "Αποδοχή" : "Accept"}
          </button>
        </div>
      )}

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
            className="w-full p-4 bg-white border-2 border-zinc-200 rounded-xl outline-none focus:border-zinc-900 font-bold text-zinc-900 placeholder:text-zinc-400 transition-colors"
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
              className="w-full p-4 bg-white border-2 border-zinc-200 rounded-xl outline-none focus:border-zinc-900 font-bold text-zinc-900 placeholder:text-zinc-400 transition-colors"
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
              className="w-full p-4 bg-white border-2 border-zinc-200 rounded-xl outline-none focus:border-zinc-900 font-bold text-zinc-900 placeholder:text-zinc-400 transition-colors"
            />
          </div>
        </div>
      </div>

      <h2 className="text-lg font-bold mb-4 text-zinc-900 border-t border-zinc-100 pt-6">
        {lang === "el" ? "Τρόπος Πληρωμής" : "Payment Method"}
      </h2>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setFormData({ ...formData, paymentMethod: "STORE" })}
          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${formData.paymentMethod === "STORE" ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 hover:border-zinc-300"}`}
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
              {lang === "el" ? "Μετρητά ή Κάρτα" : "Cash or Card"}
            </div>
          </div>
        </button>

        <button
          onClick={() => setFormData({ ...formData, paymentMethod: "ONLINE" })}
          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${formData.paymentMethod === "ONLINE" ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 hover:border-zinc-300"}`}
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

      {formData.paymentMethod === "STORE" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-sm text-amber-800 mb-8">
          <AlertTriangle size={20} className="text-amber-600 flex-shrink-0" />
          <p>
            {lang === "el"
              ? "Μετά από 3 απουσίες (no-shows), ο λογαριασμός σας θα κλειδωθεί."
              : "After 3 no-shows, your account will be restricted."}
          </p>
        </div>
      )}

      <button
        disabled={
          !formData.customerName ||
          phoneDigitsCount < 8 ||
          loading ||
          showCookieBanner
        }
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
