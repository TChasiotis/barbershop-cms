"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Service from "./service";
import Calendar from "./calendar";
// import Timeslots from "./timeslots";
// import Details from "./details";

// Θα τα φτιάξουμε αμέσως μετά!
// import Step1Service from "./Step1_Service";
// import Step2Calendar from "./Step2_Calendar";
// import Step3TimeSlots from "./Step3_TimeSlots";
// import Step4Details from "./Step4_Details";

export default function BookingWizard({ services }: { services: any[] }) {
  const [step, setStep] = useState(1);

  // Εδώ αποθηκεύουμε ΟΛΕΣ τις επιλογές του πελάτη
  const [formData, setFormData] = useState({
    serviceId: "",
    serviceName: "",
    serviceDuration: "",
    date: null as Date | null,
    time: "",
    customerName: "",
    customerPhone: "",
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100">
      {/* HEADER: Τίτλος & Κουμπί Πίσω */}
      <div className="flex items-center mb-8 pb-6 border-b border-zinc-100">
        {step > 1 && step < 5 && (
          <button
            onClick={prevStep}
            className="mr-4 p-2 bg-zinc-50 rounded-full hover:bg-zinc-100 text-zinc-600 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Κράτηση Ραντεβού</h1>
          {step < 5 && (
            <p className="text-zinc-500 text-sm mt-1">Βήμα {step} από 4</p>
          )}
        </div>
      </div>

      {/* BODY: Εδώ θα φορτώνουν τα βήματα (είναι σε σχόλια προς το παρόν) */}
      <div className="min-h-[300px]">
        {step === 1 && (
          <div className="text-center py-10 text-zinc-500">
            Εδώ θα μπει το Step1_Service
          </div>
          // <Step1Service services={services} formData={formData} setFormData={setFormData} onNext={nextStep} />
        )}

        {step === 2 && (
          <div className="text-center py-10 text-zinc-500">
            Εδώ θα μπει το Step2_Calendar
          </div>
          // <Step2Calendar formData={formData} setFormData={setFormData} onNext={nextStep} />
        )}

        {step === 3 && (
          <div className="text-center py-10 text-zinc-500">
            Εδώ θα μπει το Step3_TimeSlots
          </div>
          // <Step3TimeSlots formData={formData} setFormData={setFormData} onNext={nextStep} />
        )}

        {step === 4 && (
          <div className="text-center py-10 text-zinc-500">
            Εδώ θα μπει το Step4_Details
          </div>
          // <Step4Details formData={formData} setFormData={setFormData} onNext={nextStep} />
        )}
      </div>
    </div>
  );
}
