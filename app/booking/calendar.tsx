"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";

export default function Calendar({ formData, setFormData, onNext, lang }: any) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentMonthView, setCurrentMonthView] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  // --- ΝΕΟ STATE ΓΙΑ ΤΙΣ ΚΛΕΙΔΩΜΕΝΕΣ ΜΕΡΕΣ ---
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

  // Ρωτάμε τη βάση ποιες μέρες έχει κλειδώσει ο Admin
  useEffect(() => {
    fetch("/api/blocked-days")
      .then((res) => res.json())
      .then((data) => {
        if (data.blockedDates) {
          setBlockedDates(data.blockedDates);
        }
      })
      .catch((err) => console.error("Error fetching blocked days:", err));
  }, []);
  // ------------------------------------------

  const maxMonthView = new Date(today.getFullYear(), today.getMonth() + 3, 1);

  const handlePrevMonth = () =>
    setCurrentMonthView(
      new Date(
        currentMonthView.getFullYear(),
        currentMonthView.getMonth() - 1,
        1,
      ),
    );
  const handleNextMonth = () =>
    setCurrentMonthView(
      new Date(
        currentMonthView.getFullYear(),
        currentMonthView.getMonth() + 1,
        1,
      ),
    );

  const isPrevDisabled =
    currentMonthView <= new Date(today.getFullYear(), today.getMonth(), 1);
  const isNextDisabled = currentMonthView >= maxMonthView;

  const daysInMonth = new Date(
    currentMonthView.getFullYear(),
    currentMonthView.getMonth() + 1,
    0,
  ).getDate();
  const startDay =
    (new Date(
      currentMonthView.getFullYear(),
      currentMonthView.getMonth(),
      1,
    ).getDay() +
      6) %
    7;

  const monthNames = {
    el: [
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
    ],
    en: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  };
  const weekDays = {
    el: ["Δευ", "Τρι", "Τετ", "Πεμ", "Παρ", "Σαβ", "Κυρ"],
    en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  };

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: startDay }, (_, i) => i);

  const handleSelectDate = (day: number) => {
    setFormData({
      ...formData,
      date: new Date(
        currentMonthView.getFullYear(),
        currentMonthView.getMonth(),
        day,
      ),
      time: "",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-zinc-900">
        <CalendarIcon size={20} className="text-zinc-500" />
        {lang === "el" ? "Επιλέξτε Ημερομηνία" : "Select Date"}
      </h2>

      <div className="border border-zinc-200 rounded-2xl p-4 md:p-6 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handlePrevMonth}
            disabled={isPrevDisabled}
            className="p-2 rounded-full hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-900 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-lg font-bold text-zinc-900">
            {monthNames[lang as "el" | "en"][currentMonthView.getMonth()]}{" "}
            {currentMonthView.getFullYear()}
          </div>
          <button
            onClick={handleNextMonth}
            disabled={isNextDisabled}
            className="p-2 rounded-full hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-900 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
          {weekDays[lang as "el" | "en"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-bold text-zinc-400 uppercase"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {blanksArray.map((blank) => (
            <div key={`blank-${blank}`} className="p-2 md:p-3"></div>
          ))}

          {daysArray.map((day) => {
            const thisDate = new Date(
              currentMonthView.getFullYear(),
              currentMonthView.getMonth(),
              day,
            );

            // Μετατροπή της τρέχουσας μέρας σε YYYY-MM-DD για σύγκριση
            const dateString = `${thisDate.getFullYear()}-${(thisDate.getMonth() + 1).toString().padStart(2, "0")}-${thisDate.getDate().toString().padStart(2, "0")}`;

            const isPast = thisDate < today;
            const isWeekend =
              thisDate.getDay() === 0 || thisDate.getDay() === 6;

            // Ελέγχουμε αν η μέρα υπάρχει στη λίστα των Blocked Days
            const isAdminBlocked = blockedDates.includes(dateString);

            // Η μέρα κλειδώνει αν είναι Παρελθόν Ή Σ/Κ Ή Κλειδωμένη από τον Admin
            const isDisabled = isPast || isWeekend || isAdminBlocked;

            const isSelected =
              formData.date &&
              formData.date.getDate() === day &&
              formData.date.getMonth() === currentMonthView.getMonth() &&
              formData.date.getFullYear() === currentMonthView.getFullYear();

            const baseClass =
              "p-2 md:p-3 rounded-full md:rounded-xl text-center font-medium transition-all text-sm md:text-base ";

            // Αν είναι κλειδωμένη, την κάνουμε γκρι. Αν είναι συγκεκριμένα Admin Blocked, μπορούμε να της δώσουμε λίγο πιο "κόκκινο/απαγορευτικό" χρώμα, αλλά το γκρι είναι πιο minimal.
            const disabledClass = isDisabled
              ? "text-zinc-300 cursor-not-allowed"
              : "";

            const selectedClass = isSelected
              ? "bg-zinc-900 text-white shadow-md"
              : !isDisabled
                ? "text-zinc-900 hover:bg-zinc-100"
                : "";

            return (
              <button
                key={day}
                disabled={isDisabled}
                onClick={() => handleSelectDate(day)}
                className={baseClass + disabledClass + selectedClass}
                title={isAdminBlocked ? "Μη διαθέσιμη ημέρα" : ""}
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
        className="w-full mt-8 bg-zinc-950 text-white py-4 rounded-xl font-bold text-lg hover:bg-zinc-800 transition-colors disabled:opacity-50"
      >
        {lang === "el" ? "Συνέχεια" : "Continue"}
      </button>
    </motion.div>
  );
}
