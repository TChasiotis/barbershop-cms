"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";

// Συνδέσαμε τα αρχεία που μόλις φτιάξαμε!
import Service from "./service";
import Calendar from "./calendar";
import Timeslots from "./timeslots";
import Details from "./details";

export default function BookingWizard({ services }: { services: any[] }) {
  const [step, setStep] = useState(1);

  // Η "μνήμη" του Wizard
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

      {/* BODY: Εδώ φορτώνουν τα πραγματικά βήματα πλέον */}
      <div className="min-h-[300px]">
        {step === 1 && (
          <Service
            services={services}
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
          />
        )}

        {step === 2 && (
          <Calendar
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
          />
        )}

        {step === 3 && (
          <Timeslots
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
          />
        )}

        {step === 4 && (
          <Details
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
          />
        )}
      </div>
    </div>
  );
}
