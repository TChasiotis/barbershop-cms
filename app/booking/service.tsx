"use client";

import { motion } from "framer-motion";
import { Scissors } from "lucide-react";

export default function Service({
  services,
  formData,
  setFormData,
  onNext,
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-zinc-900">
        <Scissors size={20} className="text-zinc-500" />
        Επιλέξτε Υπηρεσία
      </h2>

      <div className="grid gap-3">
        {services.map((srv: any) => {
          const isSelected = formData.serviceId === srv.id;
          return (
            <div
              key={srv.id}
              onClick={() =>
                setFormData({
                  ...formData,
                  serviceId: srv.id,
                  serviceName: srv.name,
                  serviceDuration: srv.duration,
                })
              }
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? "border-zinc-900 bg-zinc-50 shadow-sm"
                  : "border-zinc-100 hover:border-zinc-300"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-zinc-900 text-lg">
                  {srv.name}
                </span>
                <span className="font-bold text-zinc-900">{srv.price}</span>
              </div>
              <div className="text-sm text-zinc-500">{srv.duration}</div>
            </div>
          );
        })}
      </div>

      <button
        disabled={!formData.serviceId}
        onClick={onNext}
        className="w-full mt-8 bg-zinc-950 text-white py-4 rounded-xl font-bold text-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Συνέχεια
      </button>
    </motion.div>
  );
}
