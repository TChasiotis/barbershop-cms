"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Phone, CheckCircle2 } from "lucide-react";

export default function Details({ formData, setFormData, onNext }: any) {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: formData.serviceId,
          date: formData.date,
          time: formData.time,
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        alert("Κάτι πήγε στραβά, προσπαθήστε ξανά.");
      }
    } catch (error) {
      console.error(error);
      alert("Σφάλμα σύνδεσης.");
    }
    setLoading(false);
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <CheckCircle2 size={72} className="text-green-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-zinc-900 mb-2">
          Το ραντεβού έκλεισε!
        </h2>
        <p className="text-zinc-500 mb-8">
          Σας περιμένουμε στις{" "}
          <strong>{formData.date?.toLocaleDateString("el-GR")}</strong> στις{" "}
          <strong>{formData.time}</strong> για {formData.serviceName}.
        </p>
        <a
          href="/"
          className="inline-block bg-zinc-950 text-white px-8 py-4 rounded-xl font-bold hover:bg-zinc-800 transition-colors"
        >
          Επιστροφή στην Αρχική
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
        Τα στοιχεία σας
      </h2>

      {/* Σύνοψη της κράτησης */}
      <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 mb-8 flex justify-between items-center">
        <div>
          <div className="text-sm text-zinc-500">Επιλογή</div>
          <div className="font-bold text-zinc-900">{formData.serviceName}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-zinc-500">
            {formData.date?.toLocaleDateString("el-GR")}
          </div>
          <div className="font-bold text-zinc-900">{formData.time}</div>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 mb-2">
            Ονοματεπώνυμο
          </label>
          <input
            type="text"
            placeholder="π.χ. Γιάννης Παπαδόπουλος"
            value={formData.customerName}
            onChange={(e) =>
              setFormData({ ...formData, customerName: e.target.value })
            }
            className="w-full p-4 bg-white border-2 border-zinc-200 rounded-xl outline-none focus:border-zinc-900 transition-colors"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-zinc-700 mb-2">
            Τηλέφωνο Επικοινωνίας
          </label>
          <input
            type="tel"
            placeholder="π.χ. 6900000000"
            value={formData.customerPhone}
            onChange={(e) =>
              setFormData({ ...formData, customerPhone: e.target.value })
            }
            className="w-full p-4 bg-white border-2 border-zinc-200 rounded-xl outline-none focus:border-zinc-900 transition-colors"
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
        {loading ? "Γίνεται Κράτηση..." : "Ολοκλήρωση Κράτησης"}
      </button>
    </motion.div>
  );
}
