"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 h-16 flex items-center transition-all duration-200 ${
        scrolled ? "bg-[#F9F8F5]/5 backdrop-blur-md border-b border-border-dark" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" className="relative h-20 w-48 -ml-2 hover:scale-105 transition-transform duration-300">
            <img 
              src="/logo.png" 
              alt="DESINKS" 
              className="w-full h-full object-contain"
            />
          </Link>
          <span className="hidden lg:inline-block text-xs font-mono text-text-warm/50 tracking-wide mt-2">
            Atlanta, GA · USA
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 font-mono text-sm tracking-widest uppercase">
          <Link href="/gallery" className="text-text-warm hover:text-accent hover:underline decoration-accent underline-offset-4 transition-all">
            Portfolio
          </Link>
          <Link href="/book" className="btn-primary py-2 px-6 text-xs tracking-widest">
            Book Appointment
          </Link>
        </nav>
        {/* Mobile menu could be added here, but keeping it simple for now */}
        <div className="md:hidden">
          <Link href="/book" className="btn-primary py-2 px-4 text-xs uppercase tracking-widest">
            Book
          </Link>
        </div>
      </div>
    </header>
  );
}
