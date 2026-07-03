import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function BookingConfirmationPage() {
  return (
    <main className="min-h-screen pt-32 pb-16 px-4 flex flex-col items-center justify-center">
      <div className="card max-w-lg w-full text-center border-accent/20 bg-accent/5 py-12 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/20 blur-[100px] rounded-full z-0 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <CheckCircle className="w-24 h-24 text-accent mb-6 animate-in zoom-in duration-500" />
          
          <h1 className="text-4xl md:text-5xl font-display text-text-heading mb-4">
            You&apos;re Booked!
          </h1>
          
          <div className="h-1 w-16 bg-accent mx-auto mb-6"></div>
          
          <p className="text-text-warm/80 mb-8 font-body max-w-sm mx-auto">
            Your appointment is confirmed and your deposit has been successfully processed. 
            Check your email for your confirmation receipt.
          </p>
          
          <div className="space-y-4 w-full px-8">
            <Link href="/" className="btn-primary w-full block">
              Return Home
            </Link>
            <p className="text-sm text-text-warm/50 mt-8">
              Questions? Contact us at <a href="mailto:deshawntattoos@gmail.com" className="text-accent hover:underline">deshawntattoos@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
