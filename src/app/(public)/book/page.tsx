"use client";

import { useState, useEffect } from "react";
import { Scissors, Eye, Sparkles, Check, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type ServiceType = "tattoo_appt" | "quarter_sleeve" | "half_sleeve" | "cover_up" | "spine" | "full_sleeve" | null;

interface BookingState {
  service: ServiceType;
  date: Date | undefined;
  time: string;
  name: string;
  email: string;
  phone: string;
  details: string;
  reference_image_url?: string;
  policyAgreed: boolean;
}

const SERVICES = [
  { id: "tattoo_appt", name: "Tattoo Appointment", icon: Scissors, desc: "Starts at $150. Pricing depends on detail.", deposit: 35 },
  { id: "quarter_sleeve", name: "Quarter Sleeve", icon: Scissors, desc: "Starts at $385. Pricing depends on detail.", deposit: 35 },
  { id: "half_sleeve", name: "Half Sleeve", icon: Scissors, desc: "Starts at $875. Pricing depends on detail.", deposit: 55 },
  { id: "cover_up", name: "Cover Up", icon: Scissors, desc: "Starts at $425. Requires more time/attention.", deposit: 75 },
  { id: "spine", name: "Spine Tattoo", icon: Scissors, desc: "Starts at $300. Pricing depends on detail.", deposit: 35 },
  { id: "full_sleeve", name: "Full Sleeve", icon: Scissors, desc: "5 hours. $3,500 Total.", deposit: 35 },
] as const;

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Dynamic Data
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [depositAmount, setDepositAmount] = useState<number>(35);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [dateBlockedSlots, setDateBlockedSlots] = useState<string[]>([]);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [formData, setFormData] = useState<BookingState>({
    service: null,
    date: undefined,
    time: "",
    name: "",
    email: "",
    phone: "",
    details: "",
    reference_image_url: "",
    policyAgreed: false,
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [settingsRes, datesRes] = await Promise.all([
          fetch("/api/public/settings"),
          fetch("/api/public/blocked-dates")
        ]);
        
        const settings = await settingsRes.json();
        if (settings && !settings.error) {
          setTimeSlots(settings.time_slots);
          setDepositAmount(settings.deposit_amount);
        }
        
        const dates = await datesRes.json();
        if (Array.isArray(dates)) {
          // Add local timezone offset so Date constructor doesn't shift the day backwards
          setBlockedDates(dates.map((d: any) => new Date(d.date + "T00:00:00")));
        }
      } catch (e) {
        console.error("Error loading booking data", e);
      } finally {
        setDataLoaded(true);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    async function fetchTimeSlotsForDate() {
      if (!formData.date) {
        setDateBlockedSlots([]);
        return;
      }
      setIsFetchingSlots(true);
      try {
        const localDateStr = format(formData.date, "yyyy-MM-dd");
        const res = await fetch(`/api/public/blocked-time-slots?date=${localDateStr}`);
        const data = await res.json();
        setDateBlockedSlots(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to fetch blocked slots", e);
      } finally {
        setIsFetchingSlots(false);
      }
    }
    fetchTimeSlotsForDate();
  }, [formData.date]);

  const updateForm = (updates: Partial<BookingState>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Combine date and time into a single Date object for appointment_at
      let appointmentAt = new Date().toISOString();
      if (formData.date && formData.time) {
        // e.g., formData.time = "10:00 AM"
        const timeMatch = formData.time.match(/(\d+):(\d+)\s+(AM|PM)/i);
        if (timeMatch) {
          let [_, hours, minutes, ampm] = timeMatch;
          let h = parseInt(hours, 10);
          if (ampm.toUpperCase() === 'PM' && h < 12) h += 12;
          if (ampm.toUpperCase() === 'AM' && h === 12) h = 0;
          
          const combinedDate = new Date(formData.date);
          combinedDate.setHours(h, parseInt(minutes, 10), 0, 0);
          appointmentAt = combinedDate.toISOString();
        }
      }

      // 2. Call bookings API
      const bookingRes = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_type: formData.service,
          client_name: formData.name,
          client_email: formData.email,
          client_phone: formData.phone,
          service_detail: formData.details || undefined,
          reference_image_url: formData.reference_image_url || undefined,
          appointment_at: appointmentAt,
        })
      });
      
      const bookingData = await bookingRes.json();
      
      if (!bookingRes.ok) {
        throw new Error(bookingData.error || "Failed to create booking");
      }

      // 3. Call Stripe API
      const stripeRes = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: bookingData.bookingId })
      });
      
      const stripeData = await stripeRes.json();

      if (stripeData.url) {
        window.location.href = stripeData.url;
      } else {
        throw new Error("Failed to get Stripe checkout URL");
      }
    } catch (e: any) {
      console.error(e);
      alert(`Error processing booking: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!dataLoaded) return <div className="min-h-screen pt-32 text-center text-text-warm/50">Loading booking system...</div>;

  return (
    <main className="min-h-screen pt-32 pb-16 px-4">
      <div className="max-w-3xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl text-center mb-8">Book Appointment</h1>
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-border-dark -z-10"></div>
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex flex-col items-center gap-2 bg-background px-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold transition-colors ${
                  step >= num 
                    ? "bg-accent text-background" 
                    : "bg-surface border-2 border-border-dark text-text-warm/50"
                }`}
              >
                {step > num ? <Check className="w-5 h-5" /> : num}
              </div>
              <span className={`text-xs font-mono uppercase hidden sm:block ${step >= num ? "text-accent" : "text-text-warm/50"}`}>
                {num === 1 && "Service"}
                {num === 2 && "Date/Time"}
                {num === 3 && "Details"}
                {num === 4 && "Review"}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Service */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl mb-6 text-center">Select a Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {SERVICES.map((s) => {
                const Icon = s.icon;
                const isSelected = formData.service === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => updateForm({ service: s.id as ServiceType })}
                    className={`card text-left transition-all duration-300 flex flex-col items-center text-center group ${
                      isSelected 
                        ? "border-accent shadow-[0_0_15px_rgba(201,168,76,0.2)] bg-accent/5" 
                        : "hover:border-accent/50"
                    }`}
                  >
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-4 ${isSelected ? "bg-accent text-background" : "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-background transition-colors"}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl mb-1 font-display">{s.name}</h3>
                    <p className="text-sm text-text-warm/60 mb-2">{s.desc}</p>
                    <p className="text-sm font-bold text-accent">${s.deposit} Deposit</p>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end">
              <button 
                onClick={nextStep} 
                disabled={!formData.service}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl mb-6 text-center">Pick a Date & Time</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="card flex justify-center custom-calendar">
                <style dangerouslySetInnerHTML={{__html: `
                  .custom-calendar .rdp {
                    --rdp-color-selected: var(--color-accent);
                    --rdp-color-selected-text: var(--color-background);
                    --rdp-color-hover: rgba(201,168,76,0.1);
                    --rdp-background-color-hover: rgba(201,168,76,0.1);
                    margin: 0;
                  }
                  .custom-calendar .rdp-day_selected, 
                  .custom-calendar .rdp-day_selected:focus-visible, 
                  .custom-calendar .rdp-day_selected:hover {
                    background-color: var(--rdp-color-selected);
                    color: var(--rdp-color-selected-text);
                    font-weight: bold;
                  }
                `}} />
                <DayPicker
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => updateForm({ date, time: "" })}
                  disabled={[{ before: new Date() }, ...blockedDates]}
                  className="bg-transparent"
                />
              </div>
              
              <div className="card">
                <h3 className="text-xl mb-4 font-display">
                  {formData.date ? format(formData.date, "EEEE, MMMM d") : "Select a date first"}
                </h3>
                {formData.date ? (
                  isFetchingSlots ? (
                    <div className="h-full min-h-[150px] flex items-center justify-center text-text-warm/50 text-sm italic">
                      Checking availability...
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {timeSlots.map((t) => {
                        const isBlocked = dateBlockedSlots.includes(t);
                        return (
                          <button
                            key={t}
                            disabled={isBlocked}
                            onClick={() => updateForm({ time: t })}
                            className={`py-3 px-4 text-sm font-mono transition-colors border ${
                              isBlocked
                                ? "bg-background border-border-dark text-text-warm/20 cursor-not-allowed line-through"
                                : formData.time === t
                                ? "bg-accent border-accent text-background font-bold"
                                : "bg-background border-border-dark text-text-warm hover:border-accent/50"
                            }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  )
                ) : (
                  <div className="h-full min-h-[150px] flex items-center justify-center text-text-warm/40 border border-dashed border-border-dark">
                    No date selected
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <button onClick={prevStep} className="btn-ghost">Back</button>
              <button 
                onClick={nextStep} 
                disabled={!formData.date || !formData.time}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl mb-6 text-center">Your Details</h2>
            <div className="card mb-8 space-y-4">
              <div>
                <label className="block text-sm font-mono mb-2 uppercase tracking-wider text-text-warm/70">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => updateForm({ name: e.target.value })}
                  className="input-field" 
                  placeholder="Jane Doe"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-mono mb-2 uppercase tracking-wider text-text-warm/70">Email</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => updateForm({ email: e.target.value })}
                    className="input-field" 
                    placeholder="jane@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-mono mb-2 uppercase tracking-wider text-text-warm/70">Phone</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => updateForm({ phone: e.target.value })}
                    className="input-field" 
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-mono mb-2 uppercase tracking-wider text-text-warm/70">Service Details</label>
                <textarea 
                  value={formData.details}
                  onChange={(e) => updateForm({ details: e.target.value })}
                  className="input-field min-h-[100px] resize-y" 
                  placeholder="Describe what you'd like — size, style, placement, reference images, etc."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-mono mb-2 uppercase tracking-wider text-text-warm/70">Reference Image (Optional)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="file" 
                    accept="image/*"
                    disabled={isUploadingImage}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setIsUploadingImage(true);
                      try {
                        const fd = new FormData();
                        fd.append("file", file);
                        const res = await fetch("/api/public/upload", { method: "POST", body: fd });
                        const data = await res.json();
                        if (data.url) updateForm({ reference_image_url: data.url });
                      } catch (error) {
                        console.error("Upload failed", error);
                        alert("Failed to upload image.");
                      } finally {
                        setIsUploadingImage(false);
                      }
                    }}
                    className="w-full bg-background border border-border-dark text-text-warm p-2 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-bold file:bg-accent file:text-background hover:file:bg-accent/90" 
                  />
                  {isUploadingImage && <span className="text-sm text-text-warm/50 animate-pulse">Uploading...</span>}
                  {formData.reference_image_url && !isUploadingImage && <Check className="w-5 h-5 text-accent" />}
                </div>
              </div>

              {/* Policy Agreement */}
              <div className="mt-8 pt-8 border-t border-border-dark">
                <h3 className="text-lg mb-3 font-display text-accent flex items-center gap-2">
                  <span>‼️</span> Cancellation & Deposit Policy
                </h3>
                <div className="bg-background border border-border-dark p-4 h-[150px] overflow-y-auto mb-4 text-sm text-text-warm/80 font-body">
                  <p className="mb-2"><strong>PLEASE READ (BRING YOUR ID)</strong></p>
                  <p className="mb-4">When booking, ALL APPOINTMENTS REQUIRE a ${depositAmount} deposit. This WILL GO TOWARDS your service.</p>
                  <p className="mb-2"><strong>CANCELLATION POLICY</strong></p>
                  <p className="mb-4">If you do not cancel within 24 hours of your scheduled appointment time YOUR DEPOSIT IS NON REFUNDABLE. This means, if you schedule a future appointment you WILL NEED TO SEND A NEW DEPOSIT.</p>
                  <p>Thank you for all the love & support, & most importantly for trusting me for your tattoo needs!</p>
                </div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center mt-1">
                    <input 
                      type="checkbox" 
                      checked={formData.policyAgreed}
                      onChange={(e) => updateForm({ policyAgreed: e.target.checked })}
                      className="sr-only" 
                    />
                    <div className={`w-5 h-5 border transition-colors flex items-center justify-center ${formData.policyAgreed ? 'bg-accent border-accent' : 'bg-transparent border-border-dark group-hover:border-accent'}`}>
                      {formData.policyAgreed && <Check className="w-4 h-4 text-background" />}
                    </div>
                  </div>
                  <span className="text-sm select-none">I have read and agree to the cancellation and deposit policy.</span>
                </label>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button onClick={prevStep} className="btn-ghost">Back</button>
              <button 
                onClick={nextStep} 
                disabled={!formData.name || !formData.email || !formData.phone || !formData.policyAgreed}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Review <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review & Pay */}
        {step === 4 && (() => {
          const selectedServiceDef = SERVICES.find(s => s.id === formData.service);
          const activeDepositAmount = selectedServiceDef ? selectedServiceDef.deposit : depositAmount;
          
          return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl mb-6 text-center">Review & Confirm</h2>
              
              <div className="card mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-display text-accent mb-4 border-b border-border-dark pb-2">Appointment</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-warm/50 font-mono uppercase">Service</span>
                        <span className="font-bold">{selectedServiceDef?.name || formData.service}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-warm/50 font-mono uppercase">Date</span>
                        <span className="font-bold">{formData.date ? format(formData.date, "MMM d, yyyy") : ""}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-warm/50 font-mono uppercase">Time</span>
                        <span className="font-bold">{formData.time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-display text-accent mb-4 border-b border-border-dark pb-2">Client Details</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-warm/50 font-mono uppercase">Name</span>
                        <span className="font-bold">{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-warm/50 font-mono uppercase">Email</span>
                        <span className="font-bold truncate max-w-[150px]">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-warm/50 font-mono uppercase">Phone</span>
                        <span className="font-bold">{formData.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {formData.details && (
                  <div className="mt-6 pt-6 border-t border-border-dark">
                    <span className="block text-text-warm/50 font-mono uppercase text-sm mb-2">Details</span>
                    <p className="text-sm bg-background p-4 rounded-sm border border-border-dark whitespace-pre-wrap">
                      {formData.details}
                    </p>
                  </div>
                )}
                {formData.reference_image_url && (
                  <div className="mt-4">
                    <span className="block text-text-warm/50 font-mono uppercase text-sm mb-2">Reference Image</span>
                    <div className="relative h-32 w-32 rounded-md overflow-hidden border border-border-dark">
                      <img src={formData.reference_image_url} alt="Reference" className="object-cover w-full h-full" />
                    </div>
                  </div>
                )}

                <div className="mt-8 bg-accent/5 border border-accent/20 p-6 flex justify-between items-center">
                  <div>
                    <span className="block text-lg font-display text-accent">Required Deposit</span>
                    <span className="text-xs text-text-warm/60">Applied to your total service cost</span>
                  </div>
                  <span className="text-3xl font-mono font-bold">${activeDepositAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button onClick={prevStep} className="btn-ghost" disabled={loading}>Back</button>
                <button 
                  onClick={handlePayment} 
                  disabled={loading}
                  className="btn-primary flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-background" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>Confirm & Pay ${activeDepositAmount} <ChevronRight className="w-5 h-5" /></>
                  )}
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </main>
  );
}
