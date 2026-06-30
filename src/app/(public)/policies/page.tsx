export default function PoliciesPage() {
  return (
    <main className="min-h-screen pt-32 pb-16 px-4 flex flex-col items-center">
      <div className="w-full max-w-[680px]">
        <h1 className="text-4xl md:text-5xl text-center mb-4">Studio Policies</h1>
        <div className="h-1 w-24 bg-accent mx-auto mb-16"></div>

        <div className="space-y-12 text-[18px] font-body leading-relaxed text-text-warm/90">
          
          <section className="bg-surface border border-border-dark p-8 rounded-none">
            <h2 className="text-2xl font-display text-text-heading mb-6 flex items-center gap-3">
              <span className="text-accent">‼️</span> PLEASE READ (BRING YOUR ID)
            </h2>
            <p className="mb-4">
              When booking, ALL APPOINTMENTS REQUIRE a <span className="font-mono text-accent font-bold">$35</span> deposit. 
              This WILL GO TOWARDS your service.
            </p>
            <p>
              Your appointment is not confirmed until the deposit is received and processed. 
              Please arrive on time. If you are more than 15 minutes late, your appointment 
              may need to be rescheduled and your deposit will be forfeited.
            </p>
          </section>

          <section className="bg-surface border border-border-dark p-8 rounded-none">
            <h2 className="text-2xl font-display text-text-heading mb-6 flex items-center gap-3">
              <span className="text-accent">‼️</span> CANCELLATION POLICY
            </h2>
            <p className="mb-4">
              If you do not cancel within 24 hours of your scheduled appointment time 
              <span className="font-bold text-accent"> YOUR DEPOSIT IS NON REFUNDABLE.</span>
            </p>
            <p>
              This means, if you schedule a future appointment you <span className="font-bold text-accent">WILL NEED TO SEND A NEW DEPOSIT.</span>
            </p>
            <p className="mt-6">
              Thank you for all the love & support, & most importantly for trusting me for your tattoo needs!
            </p>
          </section>
          
        </div>
      </div>
    </main>
  );
}
