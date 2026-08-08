"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, AlertTriangle } from "lucide-react";
import { addStrike, deleteStrike } from "../actions";

export default function StrikesTab({
  initialStrikes,
}: {
  initialStrikes: any[];
}) {
  const router = useRouter();
  const [newStrikePhone, setNewStrikePhone] = useState("");
  const [isStriking, setIsStriking] = useState(false);

  const handleAddStrike = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStrikePhone) return;
    setIsStriking(true);
    await addStrike(newStrikePhone);
    setNewStrikePhone("");
    setIsStriking(false);
    router.refresh();
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-zinc-200 pb-5">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Manage Strikes (No-Shows)
          </h2>
          <p className="text-xs font-medium text-zinc-500 mt-1">
            Πελάτες που δεν εμφανίστηκαν. Στα 3 strikes μπλοκάρονται αυτόματα.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm max-w-xl">
          <h3 className="font-bold text-zinc-900 mb-2 flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" /> Χειροκίνητη
            Προσθήκη Strike
          </h3>
          <p className="text-sm text-zinc-500 mb-4">
            Αν κάποιος δεν εμφανίστηκε στο ραντεβού του, ρίξε του ένα strike
            εδώ.
          </p>
          <form
            onSubmit={handleAddStrike}
            className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
          >
            <input
              type="text"
              required
              placeholder="Τηλέφωνο (π.χ. 69...)"
              value={newStrikePhone}
              onChange={(e) => setNewStrikePhone(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none font-medium text-zinc-900"
            />
            <button
              type="submit"
              disabled={isStriking || !newStrikePhone}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 whitespace-nowrap w-full sm:w-auto justify-center"
            >
              {isStriking ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )}{" "}
              Προσθήκη Strike
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Τηλέφωνο</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4 text-center">Σύνολο Strikes</th>
                  <th className="px-6 py-4 text-right">Ενέργειες</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-sm">
                {initialStrikes.map((strike: any) => {
                  let badgeColor =
                    "bg-yellow-100 text-yellow-800 border-yellow-200";
                  if (strike.strikes === 2)
                    badgeColor =
                      "bg-orange-100 text-orange-800 border-orange-200";
                  if (strike.strikes >= 3)
                    badgeColor = "bg-red-100 text-red-800 border-red-200";
                  return (
                    <tr
                      key={strike.id}
                      className="hover:bg-zinc-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-zinc-900">
                        {strike.phone}
                      </td>
                      <td className="px-6 py-4 text-zinc-500">
                        {strike.email || "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full border-2 font-black ${badgeColor}`}
                        >
                          {strike.strikes}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={async () => {
                            if (window.confirm("Είστε σίγουροι;")) {
                              await deleteStrike(strike.id);
                              router.refresh();
                            }
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                        >
                          Συγχώρεση
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {initialStrikes.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-12 text-center text-zinc-400 font-medium"
                    >
                      Δεν υπάρχουν strikes! Οι πελάτες σας είναι άψογοι.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
