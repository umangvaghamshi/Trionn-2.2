"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { BlurTextReveal } from "@/components/TextAnimation";
import { WordShiftButton } from "@/components/Button";
import LinePlus from "@/components/LinePlus";
import { useSiteSound } from "@/components/SiteSoundContext";
import { HoverBlur } from "@/components/TextAnimation";

// --- Types ---
type FormData = {
  name: string;
  email: string;
  company: string;
  projectType: string[];
  message: string;
  budget: string;
};

const PROJECT_OPTIONS = [
  "Brand Experience Website",
  "Motion & Interactive Experience",
  "AI Product / Platform",
  "Digital Product Design",
  "Creative Development",
  "Something Custom",
];

const BUDGET_OPTIONS = [
  "Under $5K",
  "$5K - $15K",
  "$15K - $30K",
  "$30K - $60K",
];

export default function Forms() {
  // --- State ---
  const { soundEnabled } = useSiteSound();
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    projectType: [],
    message: "",
    budget: "",
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [hasStartedForm, setHasStartedForm] = useState(false);

  // --- Refs ---
  const sectionRef = useRef<HTMLElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // --- Hydration Fix ---
  useEffect(() => {
    setMounted(true);
  }, []);

  // --- Viewport observer: gate first headline voice until section is visible ---
  useEffect(() => {
    if (!mounted) return;
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [mounted]);

  // --- Voice Logic ---
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find((v) =>
        /female|samantha|victoria|karen|ava|google us english/i.test(v.name),
      );
      voiceRef.current = preferred || voices[0];
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  const speak = (text: string) => {
    if (
      !soundEnabled ||
      typeof window === "undefined" ||
      !window.speechSynthesis
    )
      return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (voiceRef.current) utterance.voice = voiceRef.current;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // --- Navigation & Animations ---
  useEffect(() => {
    if (!mounted) return;

    if (currentStep <= 4) {
      gsap.fromTo(
        stepRef.current,
        { opacity: 0, y: 40, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
        },
      );
    } else if (currentStep === 5) {
      const tl = gsap.timeline();
      tl.to(".success-circle", {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: "back.out(1.8)",
      })
        .to(
          ".success-check",
          { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" },
          "-=0.2",
        )
        .to(
          ".success-text",
          { opacity: 1, y: 0, stagger: 0.2, duration: 0.6 },
          "-=0.2",
        );

      // Wait 4 seconds, then Fade Out and Reset
      const timer = setTimeout(() => {
        gsap.to(stepRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          ease: "power2.in",
          onComplete: () => {
            // Reset Form Data
            setFormData({
              name: "",
              email: "",
              company: "",
              projectType: [],
              message: "",
              budget: "",
            });
            setErrors({});
            // Keep hasStartedForm = true so step 0 voice does NOT replay after submission.
            // Voice will resume from step 1 onwards if the user starts another inquiry.
            // Go back to first step
            setCurrentStep(0);
          },
        });
      }, 4000); // 4 second delay

      return () => clearTimeout(timer);
    }
  }, [currentStep, mounted]);

  // --- Voice: speaks per step. First step waits for the section to enter view,
  //     and is skipped if the user is returning to step 0 mid-flow ---
  useEffect(() => {
    if (!mounted) return;
    if (currentStep === 0 && (!hasEnteredView || hasStartedForm)) return;

    const headlines = [
      "Let's begin with an introduction.",
      "What are you looking to create?",
      "Tell us about the vision.",
      "What's your estimated budget?",
      "Ready to connect. Review your inquiry.",
    ];

    if (currentStep <= 4) {
      speak(headlines[currentStep]);
    } else if (currentStep === 5) {
      speak("Inquiry submitted successfully.");
    }
  }, [currentStep, mounted, hasEnteredView, hasStartedForm]);

  const validate = () => {
    const newErrors: Record<string, boolean> = {};
    if (currentStep === 0) {
      if (formData.name.length < 2) newErrors.name = true;
      if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = true;
    } else if (currentStep === 1) {
      if (formData.projectType.length === 0) newErrors.projectType = true;
    } else if (currentStep === 2) {
      if (formData.message.length < 20) newErrors.message = true;
    } else if (currentStep === 3) {
      if (!formData.budget) newErrors.budget = true;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      if (currentStep === 0) setHasStartedForm(true);
      if (currentStep < 4) setCurrentStep((s) => s + 1);
      else setCurrentStep(5);
    }
  };

  const handleToggleOption = (val: string, isMultiple: boolean) => {
    if (isMultiple) {
      const newTypes = formData.projectType.includes(val)
        ? formData.projectType.filter((i) => i !== val)
        : [...formData.projectType, val];
      setFormData((prev) => ({ ...prev, projectType: newTypes }));
      if (newTypes.length > 0)
        setErrors((prev) => ({ ...prev, projectType: false }));
    } else {
      setFormData((prev) => ({ ...prev, budget: val }));
      setErrors((prev) => ({ ...prev, budget: false }));
    }
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

  const progressPercent = (Math.min(currentStep + 1, 5) / 5) * 100;

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#040508] text-light-font overflow-hidden flex items-center py-20 lg:py-37.5"
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src="/video/form-background-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#040508]/40" />
      </div>

      <div className="grid grid-cols-12 tr__container w-full relative z-10">
        <div className="col-span-12 lg:col-span-6 lg:col-start-4 flex flex-col justify-between min-h-150">
          {/* Top Bar */}
          {currentStep < 5 && (
            <div className="flex justify-between items-start mb-16">
              <BlurTextReveal
                as="span"
                html="A short conversation is often the best place to begin."
                animationType="words"
                stagger={0.08}
                className="title max-w-70"
              />
              <div className="flex flex-col items-end gap-3">
                <span className="title text-light-font/50">
                  0{Math.min(currentStep + 1, 5)} / 05
                </span>
                <div className="w-32 h-px bg-light-font/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-light-font transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={stepRef}>
            {currentStep === 0 && (
              <div className="space-y-10">
                <h2>Let&apos;s begin with an introduction.</h2>
                <div className="grid gap-6">
                  <InputGroup
                    label="Full Name *"
                    error={errors.name}
                    errorMsg="Enter your name"
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (e.target.value.length >= 2)
                        setErrors((prev) => ({ ...prev, name: false }));
                    }}
                    placeholder="Full Name"
                  />
                  <InputGroup
                    label="Email Address *"
                    error={errors.email}
                    errorMsg="Enter a valid email"
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (/^\S+@\S+\.\S+$/.test(e.target.value))
                        setErrors((prev) => ({ ...prev, email: false }));
                    }}
                    placeholder="Email Address"
                  />
                  <InputGroup
                    label="Company / Brand"
                    value={formData.company}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    placeholder="Company / Brand (Optional)"
                  />
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-10">
                <h2>What are you looking to create?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PROJECT_OPTIONS.map((opt) => (
                    <OptionCard
                      key={opt}
                      label={opt}
                      active={formData.projectType.includes(opt)}
                      onClick={() => handleToggleOption(opt, true)}
                    />
                  ))}
                </div>
                {errors.projectType && (
                  <span className="text-red-500 title uppercase block">
                    Select at least one.
                  </span>
                )}
              </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-10">
                <h2>Tell us about the vision.</h2>
                <div className="relative">
                  <textarea
                    className={`w-full min-h-60 border bg-transparent ${
                      errors.message ? "border-red-500" : "border-light-font/20"
                    } focus:border-light-font p-6 outline-none transition-all resize-none`}
                    placeholder="Describe the project..."
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      // Real-time: Clear error once they reach 20 characters
                      if (e.target.value.length >= 20) {
                        setErrors((prev) => ({ ...prev, message: false }));
                      }
                    }}
                  />
                  <div className="flex justify-between items-center mt-2">
                    {/* Error message on the left */}
                    <div>
                      {errors.message && (
                        <span className="text-red-500 title">
                          Please enter at least 20 characters.
                        </span>
                      )}
                    </div>
                    {/* Character count on the right */}
                    <div className="text-xs opacity-30">
                      {formData.message.length}/800
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-10">
                <h2>What&apos;s your estimated budget?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {BUDGET_OPTIONS.map((opt) => (
                    <OptionCard
                      key={opt}
                      label={opt}
                      active={formData.budget === opt}
                      onClick={() => handleToggleOption(opt, false)}
                    />
                  ))}
                </div>
                {errors.budget && (
                  <span className="text-red-500 title uppercase block">
                    Please select a budget range.
                  </span>
                )}
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-10">
                <h2>Ready to connect.</h2>
                <div className="divide-y divide-light-font/50 border-t border-b border-light-font/50">
                  <SummaryRow label="Name" value={formData.name} />
                  <SummaryRow label="Email" value={formData.email} />
                  {formData.company.trim() !== "" && (
                    <SummaryRow label="Company" value={formData.company} />
                  )}
                  <SummaryRow
                    label="Project"
                    value={formData.projectType.join(", ")}
                  />
                  <SummaryRow label="Budget" value={formData.budget} />
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div
                ref={stepRef}
                className="flex flex-col items-center text-center py-20"
              >
                <div className="success-circle opacity-0 scale-0 w-32 h-32 border border-light-font rounded-full flex items-center justify-center mb-10">
                  <div className="success-check opacity-0 scale-0 w-12 h-6 border-l-4 border-b-4 border-light-font -rotate-45! -mt-2" />
                </div>
                <h2 className="success-text opacity-0 translate-y-6 mb-4">
                  Inquiry submitted.
                </h2>
                <p className="success-text opacity-0 translate-y-6 text-light-font/50">
                  We&apos;ll connect with you shortly.
                </p>
              </div>
            )}
          </div>

          {/* Footer Nav */}
          {currentStep < 5 && (
            <div className="flex justify-between items-center mt-10">
              <button
                onClick={() => setCurrentStep((s) => s - 1)}
                disabled={currentStep === 0}
                className={`uppercase transition-all cursor-pointer ${currentStep === 0 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
              >
                <HoverBlur>Back</HoverBlur>
              </button>
              <div onClick={handleNext} className="cursor-pointer">
                <WordShiftButton
                  text={currentStep === 4 ? "Send Inquiry" : "Continue"}
                  type="button"
                  styleVars={{ buttonWrapperColor: "#D8D8D8" }}
                />
              </div>
            </div>
          )}
        </div>
        <LinePlus
          customClass="col-span-12 my-20 lg:my-37.5"
          lineClass={"bg-[#2F323B] left-1/2! -translate-x-1/2"}
          plusClass={"col-span-12 mx-auto"}
          iconColor={"#D8D8D8"}
        />
        <div className="col-span-12 grid grid-cols-12 gap-20 md:gap-6">
          <div className="col-span-12 md:col-span-6 lg:col-span-5 lg:col-start-2 flex flex-col gap-6 lg:gap-10">
            <BlurTextReveal
              as="h2"
              html="Location"
              animationType="chars"
              stagger={0.08}
            />
            <p className="small">
              TRIONN <br />
              Office No. 216 - 4Plus Complex <br />
              Sardar nagar main road, Astron Chowk <br />
              Rajkot 360001, Gujarat, India.
            </p>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-5 flex flex-col gap-6 lg:gap-10">
            <BlurTextReveal
              as="h2"
              html="Join us"
              animationType="chars"
              stagger={0.08}
            />
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 sm:col-span-6 flex flex-col gap-2">
                <p className="small sm:max-w-75">
                  We work with people who care deeply about craft, clarity, and
                  thoughtful execution.
                </p>
                <p className="small sm:max-w-75">
                  Send a short note and your work.
                </p>
              </div>
              <div className="col-span-12 sm:col-span-6 flex flex-col gap-2 sm:items-end">
                <div className="flex flex-col items-start gap-2">
                  <Link href="mailto:hello@trionn.com" className="h3 mb-2">
                    <HoverBlur>hello@trionn.com</HoverBlur>
                  </Link>
                  <p className="small text-light-font/60">
                    Or, reach out via the contact form.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Helper Components ---

function InputGroup({ label, error, errorMsg, ...props }: any) {
  const shouldShowLabel = props.value.length > 0 || error;

  return (
    <div className="relative group">
      <label
        className={`absolute -top-3 left-4 py-1 px-2 bg-[#040508] text-xs uppercase tracking-widest transition-all duration-300 z-20 
          ${shouldShowLabel ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}
      >
        {error ? <span className="text-red-500">{errorMsg}</span> : label}
      </label>
      <input
        {...props}
        className={`w-full py-5 bg-transparent border ${error ? "border-red-500" : "border-light-font/20"} focus:border-light-font px-6 outline-none transition-all placeholder:text-light-font/50`}
      />
    </div>
  );
}

function OptionCard({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-6 text-left border transition-all duration-500 flex justify-between items-center cursor-pointer 
        ${active ? "bg-light-font text-black border-light-font" : "border-light-font/20 hover:border-light-font"}`}
    >
      <span className="title">{label}</span>
      {active && (
        <span className="w-4 h-2 border-l-2 border-b-2 border-black -rotate-45 -mt-1" />
      )}
    </button>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] py-6 items-center">
      <span className="title text-light-font/50">{label}</span>
      <span className="text-light-font">{value || "—"}</span>
    </div>
  );
}
