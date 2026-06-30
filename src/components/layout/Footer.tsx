import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border-dark">
      <div className="max-w-7xl mx-auto py-12 px-6 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
        
        {/* 1. Brand Block */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="relative w-40 h-16 mb-3 -ml-2">
            <img 
              src="/logo.jpg" 
              alt="Trav-Tatz" 
              className="w-full h-full object-contain invert mix-blend-screen"
            />
          </div>
          <p className="font-body text-sm text-text-warm/80 mb-2">
            Tattoos · Lashes · Eyebrows
          </p>
          <p className="font-body text-sm text-text-warm/80 mb-4 flex items-center gap-1 justify-center md:justify-start">
            📍 Atlanta, GA, USA
          </p>
          <p className="font-body text-xs text-text-warm/60 italic">
            Bring a valid ID to every appointment.
          </p>
        </div>

        {/* 2. Quick Links */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="font-mono text-xs uppercase tracking-widest text-accent/70 mb-4">
            Quick Links
          </h3>
          <nav className="flex flex-col gap-3 text-center md:text-left">
            <Link 
              href="/" 
              className="font-body text-sm text-text-warm/80 hover:text-accent hover:underline decoration-accent underline-offset-4 transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded-sm"
            >
              Home
            </Link>
            <Link 
              href="/gallery" 
              className="font-body text-sm text-text-warm/80 hover:text-accent hover:underline decoration-accent underline-offset-4 transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded-sm"
            >
              Gallery
            </Link>
            <Link 
              href="/book" 
              className="font-body text-sm text-text-warm/80 hover:text-accent hover:underline decoration-accent underline-offset-4 transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded-sm"
            >
              Book Now
            </Link>
            <Link 
              href="/policies" 
              className="font-body text-sm text-text-warm/80 hover:text-accent hover:underline decoration-accent underline-offset-4 transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded-sm"
            >
              Policy
            </Link>
          </nav>
        </div>

        {/* 3. Booking Policy */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="font-mono text-xs uppercase tracking-widest text-accent/70 mb-4">
            Booking Policy
          </h3>
          <p className="font-body text-sm text-text-warm/80 leading-relaxed mb-3">
            $35 deposit required for all appointments. Non-refundable if not cancelled 24+ hours before your scheduled time.
          </p>
          <Link 
            href="/policies" 
            className="font-body text-sm text-accent hover:underline underline-offset-4 transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded-sm"
          >
            Read full policy &rarr;
          </Link>
        </div>

        {/* 4. Contact / Social */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="font-mono text-xs uppercase tracking-widest text-accent/70 mb-4">
            Contact
          </h3>
          <div className="flex flex-col gap-3 items-center md:items-start">
            <div className="font-body text-sm text-text-warm/80 mb-2 text-center md:text-left">
              Based in Atlanta, GA<br/>
              Serving clients across Metro Atlanta
            </div>
            <a 
              href="mailto:booking@travtatz.com" 
              className="font-body text-sm text-text-warm/80 hover:text-accent hover:underline decoration-accent underline-offset-4 transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded-sm"
            >
              booking@travtatz.com
            </a>
            <a 
              href="tel:+15551234567" 
              className="font-body text-sm text-text-warm/80 hover:text-accent hover:underline decoration-accent underline-offset-4 transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded-sm"
            >
              (555) 123-4567
            </a>
            <div className="mt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                aria-label="Instagram"
                className="text-text-warm/80 hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded-sm inline-block"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="border-t border-border-dark pt-6 pb-8 mt-4 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="font-body text-xs text-text-warm/50">
            &copy; {new Date().getFullYear()} Trav-Tatz. All rights reserved.
          </p>
          <p className="font-body text-xs text-text-warm/50">
            All deposits go toward your service cost. See booking policy for details.
          </p>
          <p className="font-body text-xs text-text-warm/50">
            Built with care
          </p>
        </div>
      </div>
    </footer>
  );
}
