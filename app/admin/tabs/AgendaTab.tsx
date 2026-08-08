"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  X,
  User,
  Phone,
  Mail,
  CreditCard,
  Wallet,
  Ban,
  ShieldAlert,
} from "lucide-react";
import { updateAppointmentStatus } from "../actions";

export default function AgendaTab({
  initialAppointments,
}: {
  initialAppointments: any[];
}) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  );
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(
    null,
  );

  const today = new Date();
  const minMonthView = new Date(today.getFullYear(), today.getMonth() - 3, 1);
  const maxMonthView = new Date(today.getFullYear(), today.getMonth() + 3, 1);
  const isPrevDisabled = viewMonth <= minMonthView;
  const isNextDisabled = viewMonth >= maxMonthView;

  const handlePrevMonth = () =>
    setViewMonth(
      new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1),
    );
  const handleNextMonth = () =>
    setViewMonth(
      new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1),
    );

  const daysInMonth = new Date(
    viewMonth.getFullYear(),
    viewMonth.getMonth() + 1,
    0,
  ).getDate();
  const startDay =
    (new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1).getDay() + 6) %
    7;
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: startDay }, (_, i) => i);

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

  const handleSelectDate = (day: number) => {
    setSelectedDate(
      new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day),
    );
    setIsCalendarOpen(false);
  };

  const selectedDateStr = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, "0")}-${selectedDate.getDate().toString().padStart(2, "0")}`;

  const dailyAppointments = initialAppointments
    .filter((app: any) => {
      const appDateObj = new Date(app.date);
      const appDateStr = `${appDateObj.getFullYear()}-${(appDateObj.getMonth() + 1).toString().padStart(2, "0")}-${appDateObj.getDate().toString().padStart(2, "0")}`;
      return appDateStr === selectedDateStr;
    })
    .sort((a: any, b: any) => a.time.localeCompare(b.time));

  const formattedHeaderDate = new Intl.DateTimeFormat("el-GR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(selectedDate);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-zinc-200 pb-5">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Ατζέντα Ημέρας
        </h2>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="mb-6 relative">
          <button
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="w-full bg-white border border-zinc-200 hover:border-zinc-300 shadow-sm rounded-2xl p-4 flex items-center justify-between transition-colors group"
          >
            <div className="flex items-center gap-3 text-zinc-900">
              <CalendarIcon
                size={24}
                className="text-zinc-500 group-hover:text-zinc-900 transition-colors"
              />
              <span className="text-xl font-bold capitalize">
                {formattedHeaderDate}
              </span>
            </div>
            <div className="text-zinc-400 bg-zinc-50 px-3 py-1.5 rounded-lg text-sm font-semibold">
              Αλλαγή Ημέρας
            </div>
          </button>

          {isCalendarOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-zinc-100 p-6 z-20 animate-in fade-in slide-in-from-top-4">
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={handlePrevMonth}
                  disabled={isPrevDisabled}
                  className="p-2 rounded-full hover:bg-zinc-100 disabled:opacity-30 text-zinc-900"
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="text-lg font-bold text-zinc-900">
                  {monthNames[viewMonth.getMonth()]} {viewMonth.getFullYear()}
                </div>
                <button
                  onClick={handleNextMonth}
                  disabled={isNextDisabled}
                  className="p-2 rounded-full hover:bg-zinc-100 disabled:opacity-30 text-zinc-900"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-2 mb-2">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-bold text-zinc-400"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {blanksArray.map((b) => (
                  <div key={`blank-${b}`} />
                ))}
                {daysArray.map((day) => {
                  const isSelected =
                    selectedDate.getDate() === day &&
                    selectedDate.getMonth() === viewMonth.getMonth() &&
                    selectedDate.getFullYear() === viewMonth.getFullYear();
                  return (
                    <button
                      key={day}
                      onClick={() => handleSelectDate(day)}
                      className={`p-2 rounded-xl text-center font-bold text-sm transition-all ${isSelected ? "bg-zinc-900 text-white shadow-md" : "text-zinc-900 hover:bg-zinc-100"}`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden min-h-[400px]">
          {dailyAppointments.length > 0 ? (
            <div className="divide-y divide-zinc-100">
              {dailyAppointments.map((app: any) => (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppointment(app)}
                  className={`flex items-center gap-6 p-5 cursor-pointer transition-colors ${app.status === "PENDING" ? "hover:bg-zinc-50" : "opacity-60 bg-zinc-50/50"}`}
                >
                  <div className="font-black text-2xl text-zinc-900 tracking-tight w-20 flex-shrink-0">
                    {app.time}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-zinc-900 truncate">
                      {app.service?.name || "Άγνωστη Υπηρεσία"}
                    </h4>
                    <p className="text-zinc-500 font-medium text-sm truncate">
                      {app.customerName}
                    </p>
                  </div>
                  <div>
                    {app.status === "PENDING" && (
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md">
                        ΑΝΑΜΟΝΗ
                      </span>
                    )}
                    {app.status === "CANCELLED" && (
                      <span className="bg-zinc-200 text-zinc-600 text-xs font-bold px-2.5 py-1 rounded-md">
                        ΑΚΥΡΩΘΗΚΕ
                      </span>
                    )}
                    {app.status === "NO-SHOW" && (
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-md">
                        NO-SHOW
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-20 text-zinc-400">
              <CalendarDays size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium text-zinc-500">
                Κανένα ραντεβού για αυτή τη μέρα.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL ΛΕΠΤΟΜΕΡΕΙΩΝ ΡΑΝΤΕΒΟΥ */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-zinc-100 flex justify-between items-start bg-zinc-50">
              <div>
                <h3 className="text-2xl font-black text-zinc-900 tracking-tight">
                  {selectedAppointment.time}
                </h3>
                <p className="text-sm font-bold text-zinc-500 mt-1">
                  {selectedAppointment.service?.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-zinc-400 hover:text-zinc-900 bg-white p-2 rounded-full shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-zinc-700">
                  <User size={20} className="text-zinc-400 flex-shrink-0" />
                  <span className="font-bold text-lg text-zinc-900">
                    {selectedAppointment.customerName}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-zinc-700">
                  <Phone size={20} className="text-zinc-400 flex-shrink-0" />
                  <a
                    href={`tel:${selectedAppointment.customerPhone}`}
                    className="font-medium hover:text-zinc-900 hover:underline"
                  >
                    {selectedAppointment.customerPhone}
                  </a>
                </div>
                {selectedAppointment.customerEmail && (
                  <div className="flex items-center gap-3 text-zinc-700">
                    <Mail size={20} className="text-zinc-400 flex-shrink-0" />
                    <span className="font-medium break-all">
                      {selectedAppointment.customerEmail}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-zinc-700">
                  {selectedAppointment.paymentMethod === "ONLINE" ? (
                    <CreditCard
                      size={20}
                      className="text-zinc-400 flex-shrink-0"
                    />
                  ) : (
                    <Wallet size={20} className="text-zinc-400 flex-shrink-0" />
                  )}
                  <span className="font-medium">
                    Πληρωμή:{" "}
                    <strong className="text-zinc-900">
                      {selectedAppointment.paymentMethod === "ONLINE"
                        ? "Online"
                        : "Στο Ταμείο"}
                    </strong>
                  </span>
                </div>
              </div>

              {selectedAppointment.status === "PENDING" && (
                <div className="pt-6 border-t border-zinc-100 flex flex-col gap-3">
                  <button
                    onClick={async () => {
                      if (
                        window.confirm(
                          "Ακύρωση ραντεβού; Η ώρα θα ελευθερωθεί αμέσως στο σύστημα.",
                        )
                      ) {
                        await updateAppointmentStatus(
                          selectedAppointment.id,
                          "CANCELLED",
                          selectedAppointment.customerPhone,
                        );
                        setSelectedAppointment(null);
                        router.refresh();
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold rounded-xl transition-colors"
                  >
                    <Ban size={18} /> Ακύρωση Ραντεβού
                  </button>
                  <button
                    onClick={async () => {
                      if (
                        window.confirm(
                          "Ο πελάτης δεν εμφανίστηκε; Θα ακυρωθεί το ραντεβού και θα του δοθεί 1 Strike αυτόματα.",
                        )
                      ) {
                        await updateAppointmentStatus(
                          selectedAppointment.id,
                          "NO-SHOW",
                          selectedAppointment.customerPhone,
                          selectedAppointment.customerEmail,
                        );
                        setSelectedAppointment(null);
                        router.refresh();
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors"
                  >
                    <ShieldAlert size={18} /> Δεν Εμφανίστηκε (Strike)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
