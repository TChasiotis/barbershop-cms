"use client";

import { useState, Suspense } from "react";
import { ChevronLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";

import Service from "./service";
import Calendar from "./calendar";
import Timeslots from "./timeslots";
import Details from "./details";

function WizardContent({ services }: { services: any[] }) {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") === "en" ? "en" : "el"; // Διαβάζει τη γλώσσα

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceId: "",
    serviceName: "",
    serviceDuration: "",
    date: null as Date | null,
    time: "",
    customerName: "",
    customerPhone: "",
  });

  const nextStep = () => setStep((p) => p + 1);
  const prevStep = () => setStep((p) => p - 1);

  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100">
      <div className="flex items-center mb-8 pb-6 border-b border-zinc-100">
        {step > 1 && step < 5 && (
          <button
            onClick={prevStep}
            className="mr-4 p-2 bg-zinc-50 rounded-full hover:bg-zinc-100 text-zinc-900 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">
            {lang === "el" ? "Κράτηση Ραντεβού" : "Book Appointment"}
          </h1>
          {step < 5 && (
            <p className="text-zinc-500 text-sm mt-1">
              {lang === "el" ? `Βήμα ${step} από 4` : `Step ${step} of 4`}
            </p>
          )}
        </div>
      </div>

      <div className="min-h-[300px]">
        {step === 1 && (
          <Service
            services={services}
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
            lang={lang}
          />
        )}
        {step === 2 && (
          <Calendar
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
            lang={lang}
          />
        )}
        {step === 3 && (
          <Timeslots
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
            lang={lang}
          />
        )}
        {step === 4 && (
          <Details
            formData={formData}
            setFormData={setFormData}
            onNext={nextStep}
            lang={lang}
          />
        )}
      </div>
    </div>
  );
}

// Τυλίγουμε με Suspense επειδή το useSearchParams το απαιτεί στο Next.js
export default function BookingWizard({ services }: { services: any[] }) {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <WizardContent services={services} />
    </Suspense>
  );
}
