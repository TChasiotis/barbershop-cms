"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

function parseDurationToMinutes(durationStr: string) {
  if (!durationStr) return 30;
  let totalMinutes = 0;
  const hoursMatch = durationStr.match(/(\d+)\s*(ώ|h|ω)/i);
  const minsMatch = durationStr.match(/(\d+)\s*(λ|m|min)/i);
  if (hoursMatch) totalMinutes += parseInt(hoursMatch[1], 10) * 60;
  if (minsMatch) totalMinutes += parseInt(minsMatch[1], 10);
  if (totalMinutes === 0) {
    const justNumber = parseInt(durationStr, 10);
    totalMinutes = !isNaN(justNumber) ? justNumber : 30;
  }
  return totalMinutes;
}

export default function Timeslots({
  formData,
  setFormData,
  onNext,
  lang,
}: any) {
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookedTimes() {
      if (!formData.date) return;

      const dateString = `${formData.date.getFullYear()}-${(formData.date.getMonth() + 1).toString().padStart(2, "0")}-${formData.date.getDate().toString().padStart(2, "0")}`;

      try {
        const res = await fetch(`/api/appointments?date=${dateString}`);
        if (res.ok) {
          const data = await res.json();
          const fetchedAppointments = data.bookedData || [];

          const occupied: string[] = [];
          fetchedAppointments.forEach((app: any) => {
            const start = app.time;
            const dur = parseDurationToMinutes(app.duration);
            const blocks = Math.ceil(dur / 30);

            const [h, m] = start.split(":").map(Number);
            let mins = h * 60 + m;

            for (let i = 0; i < blocks; i++) {
              const hh = Math.floor(mins / 60)
                .toString()
                .padStart(2, "0");
              const mm = (mins % 60).toString().padStart(2, "0");
              occupied.push(`${hh}:${mm}`);
              mins += 30;
            }
          });
          setBookedSlots(occupied);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchBookedTimes();
  }, [formData.date]);

  const durationInMinutes = parseDurationToMinutes(formData.serviceDuration);

  // ΕΛΕΓΧΟΣ ΣΗΜΕΡΙΝΗΣ ΗΜΕΡΑΣ (Για να κρύβει τις περασμένες ώρες)
  const now = new Date();
  const isToday =
    formData.date &&
    formData.date.getDate() === now.getDate() &&
    formData.date.getMonth() === now.getMonth() &&
    formData.date.getFullYear() === now.getFullYear();

  const currentTotalMins = now.getHours() * 60 + now.getMinutes();

  const allSlots = [];
  let currentMins = 10 * 60; // 10:00
  while (currentMins < 21 * 60) {
    const h = Math.floor(currentMins / 60)
      .toString()
      .padStart(2, "0");
    const m = (currentMins % 60).toString().padStart(2, "0");
    allSlots.push(`${h}:${m}`);
    currentMins += 30;
  }

  const availableSlots = allSlots.filter((slot) => {
    const blocksNeeded = Math.ceil(durationInMinutes / 30);
    const [startH, startM] = slot.split(":").map(Number);
    let checkMins = startH * 60 + startM;

    // 1. Έχει περάσει η ώρα σήμερα;
    if (isToday && checkMins <= currentTotalMins) return false;

    // 2. Βγαίνει εκτός ωραρίου;
    if (checkMins + durationInMinutes > 21 * 60) return false;

    // 3. Πέφτει πάνω σε άλλο ραντεβού;
    for (let i = 0; i < blocksNeeded; i++) {
      const hh = Math.floor(checkMins / 60)
        .toString()
        .padStart(2, "0");
      const mm = (checkMins % 60).toString().padStart(2, "0");
      if (bookedSlots.includes(`${hh}:${mm}`)) return false;
      checkMins += 30;
    }
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-zinc-900">
        <Clock size={20} className="text-zinc-500" />
        {lang === "el" ? "Επιλέξτε Ώρα" : "Select Time"}
      </h2>

      {loading ? (
        <div className="text-center py-10 text-zinc-500">
          {lang === "el"
            ? "Φόρτωση διαθεσιμότητας..."
            : "Loading availability..."}
        </div>
      ) : (
        <>
          {availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {availableSlots.map((time) => (
                <div
                  key={time}
                  onClick={() => setFormData({ ...formData, time })}
                  className={`p-3 text-center rounded-xl border-2 cursor-pointer transition-all font-bold ${
                    formData.time === time
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-100 hover:border-zinc-300 text-zinc-700 hover:text-zinc-900"
                  }`}
                >
                  {time}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-red-50 text-red-600 rounded-2xl border border-red-100">
              {lang === "el"
                ? "Δεν υπάρχει κενό για αυτή την υπηρεσία."
                : "No availability for this service."}
            </div>
          )}
        </>
      )}

      <button
        disabled={!formData.time}
        onClick={onNext}
        className="w-full mt-8 bg-zinc-950 text-white py-4 rounded-xl font-bold text-lg hover:bg-zinc-800 disabled:opacity-50"
      >
        {lang === "el" ? "Συνέχεια" : "Continue"}
      </button>
    </motion.div>
  );
}
