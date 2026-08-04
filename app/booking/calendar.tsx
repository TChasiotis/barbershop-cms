"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";

export default function Calendar({ formData, setFormData, onNext }: any) {
  // Ημερομηνία σήμερα (με μηδενισμένη ώρα για σωστές συγκρίσεις)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Ο μήνας που βλέπει ο χρήστης τώρα (ξεκινάει από τον τρέχοντα)
  const [currentMonthView, setCurrentMonthView] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  // Όριο: 3 μήνες μπροστά
  const maxMonthView = new Date(today.getFullYear(), today.getMonth() + 3, 1);

  // Πλοήγηση Μηνών
  const handlePrevMonth = () => {
    setCurrentMonthView(
      new Date(
        currentMonthView.getFullYear(),
        currentMonthView.getMonth() - 1,
        1,
      ),
    );
  };
  const handleNextMonth = () => {
    setCurrentMonthView(
      new Date(
        currentMonthView.getFullYear(),
        currentMonthView.getMonth() + 1,
        1,
      ),
    );
  };

  const isPrevDisabled =
    currentMonthView <= new Date(today.getFullYear(), today.getMonth(), 1);
  const isNextDisabled = currentMonthView >= maxMonthView;

  // Μαθηματικά Ημερολογίου
  const daysInMonth = new Date(
    currentMonthView.getFullYear(),
    currentMonthView.getMonth() + 1,
    0,
  ).getDate();
  // Βρίσκουμε ποια μέρα της εβδομάδας πέφτει η 1η του μήνα (0 = Κυριακή, 1 = Δευτέρα)
  // Μετατροπή ώστε Δευτέρα = 0, Κυριακή = 6 (Ευρωπαϊκό σύστημα)
  const startDay =
    (new Date(
      currentMonthView.getFullYear(),
      currentMonthView.getMonth(),
      1,
    ).getDay() +
      6) %
    7;

  const monthNames = [
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
  const weekDays = ["Δευ", "Τρι", "Τετ", "Πεμ", "Παρ", "Σαβ", "Κυρ"];

  // Δημιουργία των κελιών του ημερολογίου
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: startDay }, (_, i) => i);

  const handleSelectDate = (day: number) => {
    const selectedDate = new Date(
      currentMonthView.getFullYear(),
      currentMonthView.getMonth(),
      day,
    );
    setFormData({ ...formData, date: selectedDate, time: "" }); // Μηδενίζουμε την ώρα αν αλλάξει μέρα
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-zinc-900">
        <CalendarIcon size={20} className="text-zinc-500" />
        Επιλέξτε Ημερομηνία
      </h2>

      <div className="border border-zinc-200 rounded-2xl p-4 md:p-6 bg-white shadow-sm">
        {/* Controls Μήνα */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handlePrevMonth}
            disabled={isPrevDisabled}
            className="p-2 rounded-full hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-lg font-bold text-zinc-900">
            {monthNames[currentMonthView.getMonth()]}{" "}
            {currentMonthView.getFullYear()}
          </div>
          <button
            onClick={handleNextMonth}
            disabled={isNextDisabled}
            className="p-2 rounded-full hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Ονόματα Ημερών */}
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-bold text-zinc-400 uppercase"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Πλέγμα Ημερολογίου */}
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {/* Κενά κελιά πριν την 1η του μήνα */}
          {blanksArray.map((blank) => (
            <div key={`blank-${blank}`} className="p-2 md:p-3"></div>
          ))}

          {/* Πραγματικές ημέρες */}
          {daysArray.map((day) => {
            const thisDate = new Date(
              currentMonthView.getFullYear(),
              currentMonthView.getMonth(),
              day,
            );
            const isPast = thisDate < today;

            // Είναι επιλεγμένη;
            // Ελέγχουμε αν το Date στο formData συμπίπτει με αυτό το κελί
            const isSelected =
              formData.date &&
              formData.date.getDate() === day &&
              formData.date.getMonth() === currentMonthView.getMonth() &&
              formData.date.getFullYear() === currentMonthView.getFullYear();

            return (
              <button
                key={day}
                disabled={isPast}
                onClick={() => handleSelectDate(day)}
                className={`
                  p-2 md:p-3 rounded-full md:rounded-xl text-center font-medium transition-all text-sm md:text-base
                  ${isPast ? "text-zinc-300 cursor-not-allowed" : "hover:bg-zinc-100 text-zinc-900"}
                  ${isSelected ? "bg-zinc-900 hover:bg-zinc-900 text-white shadow-md" : ""}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <button
        disabled={!formData.date}
        onClick={onNext}
        className="w-full mt-8 bg-zinc-950 text-white py-4 rounded-xl font-bold text-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Συνέχεια
      </button>
    </motion.div>
  );
}
