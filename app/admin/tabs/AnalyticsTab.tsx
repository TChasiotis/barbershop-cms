"use client";

import { useState, useMemo } from "react";

export default function AnalyticsTab({
  appointments,
  services,
}: {
  appointments: any[];
  services: any[];
}) {
  const today = new Date();

  // Κρατάμε ως προεπιλογή τον τρέχοντα μήνα και χρονιά
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  // 1. Φιλτράρισμα Ραντεβού ανάλογα με τον επιλεγμένο μήνα
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      const d = new Date(appt.date);
      // Αν έχεις status "CANCELLED", μπορείς να τα εξαιρέσεις προσθέτοντας: && appt.status !== "CANCELLED"
      return d.getMonth() === month && d.getFullYear() === year;
    });
  }, [appointments, month, year]);

  // 2. Συνολικά Ραντεβού
  const totalAppointments = filteredAppointments.length;

  // 3. Υπολογισμός Εσόδων (άθροισμα των τιμών των υπηρεσιών)
  const totalRevenue = filteredAppointments.reduce((sum, appt) => {
    // Βρίσκουμε την υπηρεσία μέσα από το array 'services'
    const matchedService = services.find((s) => s.id === appt.serviceId);

    if (!matchedService || !matchedService.price) return sum;

    // "Ψαρεύουμε" τον πρώτο αριθμό που υπάρχει μέσα στο string,
    // αγνοώντας λέξεις όπως "from", "€" κλπ. Υποστηρίζει και δεκαδικά με κόμμα ή τελεία.
    const priceMatch = String(matchedService.price).match(/\d+([.,]\d+)?/);

    if (priceMatch) {
      // Αντικαθιστούμε το κόμμα με τελεία (αν υπάρχει) για να το καταλάβει η Javascript
      const numericPrice = Number(priceMatch[0].replace(",", "."));
      return sum + numericPrice;
    }

    return sum;
  }, 0);

  // 4. Κατάταξη Υπηρεσιών (Από την πιο δημοφιλή σε αυτή με 0)
  const serviceRanking = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredAppointments.forEach((appt) => {
      if (appt.serviceId) {
        counts[appt.serviceId] = (counts[appt.serviceId] || 0) + 1;
      }
    });

    return services
      .map((s) => ({
        name: s.name,
        count: counts[s.id] || 0,
      }))
      .sort((a, b) => b.count - a.count); // Φθίνουσα σειρά
  }, [filteredAppointments, services]);

  // 5. Δημοφιλέστερες Ώρες
  const popularTimes = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredAppointments.forEach((appt) => {
      counts[appt.time] = (counts[appt.time] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([time, count]) => ({ time, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredAppointments]);

  // Λίστα μηνών για το Dropdown
  const months = [
    "Ιανουάριος",
    "Φεβρουάριος",
    "Μάρτιος",
    "Απρίλιος",
    "Μάιος",
    "Ιούνιος",
    "Ιούλιος",
    "Αύγουστος",
    "Σεπτέμβριος",
    "Οκτώβριος",
    "Νοέμβριος",
    "Δεκέμβριος",
  ];

  return (
    <div className="space-y-6">
      {/* 1. Επικεφαλίδα & Φίλτρα Μήνα/Έτους */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-xl shadow-sm border border-gray-100 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Αναφορά Εσόδων & Στατιστικά
        </h2>
        <div className="flex gap-3">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border p-2 rounded-lg bg-gray-50 text-gray-700 font-medium outline-none focus:ring-2 focus:ring-black"
          >
            {months.map((m, i) => (
              <option key={m} value={i}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border p-2 rounded-lg bg-gray-50 text-gray-700 font-medium outline-none focus:ring-2 focus:ring-black"
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Κάρτες KPI (Μεγάλα Νούμερα) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <span className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-2">
            Κλεισμενα Ραντεβου
          </span>
          <span className="text-5xl font-black text-gray-800">
            {totalAppointments}
          </span>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <span className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-2">
            Συνολικος Τζιρος
          </span>
          <span className="text-5xl font-black text-emerald-600">
            {totalRevenue}€
          </span>
        </div>
      </div>

      {/* 3. Λίστες Δεδομένων */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Κατάταξη Υπηρεσιών */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-5 border-b pb-3 text-lg">
            Επίδοση Υπηρεσιών
          </h3>
          <div className="space-y-4">
            {serviceRanking.map((s, index) => (
              <div
                key={s.name}
                className="flex justify-between items-center text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 font-mono w-4">
                    {index + 1}.
                  </span>
                  <span className="font-semibold text-gray-700">{s.name}</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full font-bold ${s.count > 0 ? "bg-black text-white" : "bg-gray-100 text-gray-400"}`}
                >
                  {s.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Δημοφιλέστερες Ώρες */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-5 border-b pb-3 text-lg">
            Δημοφιλέστερες Ώρες
          </h3>
          <div className="space-y-4">
            {popularTimes.length > 0 ? (
              popularTimes.map((t, index) => (
                <div
                  key={t.time}
                  className="flex justify-between items-center text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 font-mono w-4">
                      {index + 1}.
                    </span>
                    <span className="font-black text-indigo-600 text-base">
                      {t.time}
                    </span>
                  </div>
                  <span className="text-gray-500 font-medium">
                    {t.count} ραντεβού
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm italic text-center py-6">
                Δεν υπάρχουν ραντεβού για αυτόν τον μήνα.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
