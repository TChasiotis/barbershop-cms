"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarOff, Trash2, Plus, Loader2 } from "lucide-react";
import { addBlockedDay, deleteBlockedDay } from "../actions";

export default function BlockedDaysTab({ initialBlockedDays }: any) {
  const [blockedDays, setBlockedDays] = useState(initialBlockedDays || []);
  const [dateStr, setDateStr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!dateStr) return;
    setLoading(true);
    const res = await addBlockedDay(dateStr);
    if (res?.success) {
      // Ανανέωση του τοπικού state
      const newDay = {
        id: Date.now().toString(),
        date: new Date(`${dateStr}T00:00:00Z`),
      };
      setBlockedDays(
        [...blockedDays, newDay].sort((a: any, b: any) => a.date - b.date),
      );
      setDateStr("");
    } else {
      alert(res?.error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Είστε σίγουροι ότι θέλετε να ξεκλειδώσετε αυτή τη μέρα;")) {
      await deleteBlockedDay(id);
      setBlockedDays(blockedDays.filter((d: any) => d.id !== id));
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("el-GR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-red-100 text-red-600 rounded-xl">
          <CalendarOff size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Blocked Days</h2>
          <p className="text-zinc-500 text-sm mt-1">
            Κλειδώστε ημερομηνίες (π.χ. Αργίες, Ρεπό) για να μην μπορούν να
            κλείσουν ραντεβού οι πελάτες.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 mb-8 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
            Επιλογή Ημερομηνίας
          </label>
          <input
            type="date"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-zinc-900 outline-none focus:border-zinc-900 transition-colors"
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={!dateStr || loading}
          className="bg-zinc-950 text-white px-6 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center gap-2 h-[50px]"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Plus size={18} />
          )}
          Κλείδωμα
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        {blockedDays.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 font-medium">
            Δεν υπάρχουν κλειδωμένες ημερομηνίες.
          </div>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {blockedDays.map((day: any) => (
              <li
                key={day.id}
                className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors"
              >
                <span className="font-bold text-zinc-900 capitalize">
                  {formatDate(day.date)}
                </span>
                <button
                  onClick={() => handleDelete(day.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Ξεκλείδωμα"
                >
                  <Trash2 size={20} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
