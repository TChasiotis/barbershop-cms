"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

// Βοηθητική συνάρτηση που μετατρέπει κείμενο (π.χ. "1 ώ. 30 λ.") σε λεπτά (π.χ. 90)
function parseDurationToMinutes(durationStr: string) {
  if (!durationStr) return 30; // Προεπιλογή
  let totalMinutes = 0;

  // Ψάχνει για ώρες (h, ώ, ωρα)
  const hoursMatch = durationStr.match(/(\d+)\s*(ώ|h|ω)/i);
  // Ψάχνει για λεπτά (m, λ, min, λεπ)
  const minsMatch = durationStr.match(/(\d+)\s*(λ|m|min)/i);

  if (hoursMatch) totalMinutes += parseInt(hoursMatch[1], 10) * 60;
  if (minsMatch) totalMinutes += parseInt(minsMatch[1], 10);

  // Αν έγραψες απλά ένα νούμερο π.χ. "45"
  if (totalMinutes === 0) {
    const justNumber = parseInt(durationStr, 10);
    if (!isNaN(justNumber)) totalMinutes = justNumber;
    else totalMinutes = 30; // Αν κάτι πάει στραβά, βάλε 30
  }

  return totalMinutes;
}

export default function Timeslots({ formData, setFormData, onNext }: any) {
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Μόλις φορτώσει αυτό το βήμα, ρωτάμε τη βάση ποια ραντεβού υπάρχουν ήδη αυτή τη μέρα
  useEffect(() => {
    async function fetchBookedTimes() {
      if (!formData.date) return;

      // Μετατροπή της ημερομηνίας σε μορφή YYYY-MM-DD
      const dateString = formData.date.toISOString().split("T")[0];

      try {
        const res = await fetch(`/api/appointments?date=${dateString}`);
        if (res.ok) {
          const data = await res.json();
          // Παίρνουμε έναν πίνακα με τις κλεισμένες ώρες (π.χ. ["14:30", "15:00"])
          setBookedSlots(data.bookedTimes || []);
        }
      } catch (error) {
        console.error("Σφάλμα φόρτωσης ραντεβού:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBookedTimes();
  }, [formData.date]);

  // Υπολογισμός Διάρκειας σε λεπτά
  const durationInMinutes = parseDurationToMinutes(formData.serviceDuration);

  // Όλες οι πιθανές ώρες λειτουργίας (π.χ. 10:00 - 20:30 ανά μισάωρο)
  const generateAllSlots = () => {
    const slots = [];
    let currentHour = 10;
    let currentMinute = 0;

    // Κλείνετε στις 21:00, άρα το τελευταίο ραντεβού εξαρτάται από τη διάρκειά του!
    while (currentHour < 21) {
      const formattedHour = currentHour.toString().padStart(2, "0");
      const formattedMinute = currentMinute.toString().padStart(2, "0");
      slots.push(`${formattedHour}:${formattedMinute}`);

      currentMinute += 30;
      if (currentMinute >= 60) {
        currentHour += 1;
        currentMinute = 0;
      }
    }
    return slots;
  };

  const allSlots = generateAllSlots();

  // Φιλτράρισμα: Δείχνουμε ΜΟΝΟ όσα ραντεβού χωράνε τη διάρκεια ΚΑΙ δεν πέφτουν πάνω σε κλεισμένα
  const availableSlots = allSlots.filter((slot) => {
    // 1. Έλεγχος αν η ώρα είναι ήδη κλεισμένη
    if (bookedSlots.includes(slot)) return false;

    // 2. Έλεγχος αν "χωράει" μέχρι το κλείσιμο (21:00 = 1260 λεπτά)
    const [h, m] = slot.split(":").map(Number);
    const slotTimeInMinutes = h * 60 + m;
    if (slotTimeInMinutes + durationInMinutes > 21 * 60) return false;

    // 3. (ΠΡΟΑΙΡΕΤΙΚΟ ΑΛΛΑ ΣΩΣΤΟ) Έλεγχος αν "καβαλάει" το επόμενο κλεισμένο ραντεβού
    // Αν η υπηρεσία θέλει 60 λεπτά, και επιλέξει το 14:00, πρέπει το 14:30 να μην είναι κλεισμένο!
    const slotsNeeded = Math.ceil(durationInMinutes / 30);
    for (let i = 1; i < slotsNeeded; i++) {
      const nextTimeInMins = slotTimeInMinutes + i * 30;
      const nextH = Math.floor(nextTimeInMins / 60)
        .toString()
        .padStart(2, "0");
      const nextM = (nextTimeInMins % 60).toString().padStart(2, "0");
      const nextSlotStr = `${nextH}:${nextM}`;

      if (bookedSlots.includes(nextSlotStr)) {
        return false; // Αν πέφτει πάνω σε άλλο ραντεβού, το κρύβουμε!
      }
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
        Επιλέξτε Ώρα
        <span className="text-sm font-normal text-zinc-400 ml-2">
          (Διάρκεια: {formData.serviceDuration})
        </span>
      </h2>

      {loading ? (
        <div className="text-center py-10 text-zinc-500 font-medium animate-pulse">
          Έλεγχος διαθεσιμότητας...
        </div>
      ) : (
        <>
          {availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {availableSlots.map((time) => {
                const isSelected = formData.time === time;
                return (
                  <div
                    key={time}
                    onClick={() => setFormData({ ...formData, time })}
                    className={`p-3 text-center rounded-xl border-2 cursor-pointer transition-all font-bold ${
                      isSelected
                        ? "border-zinc-900 bg-zinc-900 text-white shadow-md"
                        : "border-zinc-100 hover:border-zinc-300 text-zinc-700 hover:text-zinc-900"
                    }`}
                  >
                    {time}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 bg-red-50 text-red-600 rounded-2xl border border-red-100">
              Δυστυχώς δεν υπάρχει κενό για αυτή την υπηρεσία τη συγκεκριμένη
              μέρα. Δοκιμάστε άλλη ημερομηνία!
            </div>
          )}
        </>
      )}

      <button
        disabled={!formData.time}
        onClick={onNext}
        className="w-full mt-8 bg-zinc-950 text-white py-4 rounded-xl font-bold text-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Συνέχεια
      </button>
    </motion.div>
  );
}
