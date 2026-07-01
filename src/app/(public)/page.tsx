"use client";

import Image from "next/image";
import Link from "next/link";
import { Scissors, Eye, Sparkles, Plus, Minus, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { heroFadeUp } from "@/lib/animations";
import ImageGallery from "@/components/ui/image-gallery";
import { cn } from "@/lib/utils";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const parallaxImages = [
    { src: 'https://res.cloudinary.com/dm12f7lnc/image/upload/v1782802804/trav_tatz_gallery/dp1836njhmoud4brkbsz.jpg', alt: 'Tattoo Art' },
    { src: 'https://res.cloudinary.com/dm12f7lnc/image/upload/v1782802760/trav_tatz_gallery/b4y3rg5ux2zdnwp98ogq.jpg', alt: 'Tattoo Studio' },
    { src: 'https://res.cloudinary.com/dm12f7lnc/image/upload/v1782802740/trav_tatz_gallery/wz1jcggwlc2snkmpspom.jpg', alt: 'Fine Line Tattoo' },
    { src: 'https://res.cloudinary.com/dm12f7lnc/image/upload/v1782803217/IMG-20260629-WA0012_ikk8nx.jpg', alt: 'Eyebrows' },
    { src: 'https://res.cloudinary.com/dm12f7lnc/image/upload/v1782802724/trav_tatz_gallery/vjdwzwjn05hi3tnhenme.jpg', alt: 'Lashes' },
    { src: 'https://res.cloudinary.com/dm12f7lnc/image/upload/v1782803435/stygiangalleryphoto1_96c815a885_t9v5n9.jpg', alt: 'Studio Details' },
    { src: 'https://res.cloudinary.com/dm12f7lnc/image/upload/v1782802778/trav_tatz_gallery/pmoge9hq8isdahceqme7.jpg', alt: 'Tattoo Art' },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const services = [
    {
      title: "Tattoos",
      description: "Custom work, all styles. We bring your vision to life with precision and care.",
      icon: Scissors,
      link: "/book?service=tattoo"
    },
    {
      title: "Eyebrow Services",
      description: "Expert eyebrow shaping, tinting, and lamination services to perfectly frame your face and elevate your look.",
      icon: Sparkles,
      link: "/book?service=eyebrows"
    }
  ];

  const faqs = [
    {
      question: "Do you require a deposit?",
      answer: "Yes, all appointments require a non-refundable deposit that goes toward the final cost of your service. This secures your spot on the calendar."
    },
    {
      question: "What is your cancellation policy?",
      answer: "We require at least 24 hours notice to cancel or reschedule an appointment. Cancellations within 24 hours will forfeit the deposit, and a new deposit will be required to rebook."
    },
    {
      question: "How should I prepare for my tattoo?",
      answer: "Get a good night's sleep, eat a solid meal before coming in, and stay hydrated. Do not consume alcohol or blood-thinning medication 24 hours prior. Bring your ID!"
    }
  ];

  return (
    <main className="min-h-screen flex flex-col bg-background selection:bg-accent selection:text-background overflow-x-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 md:px-12 overflow-hidden">
        {/* Background Image / Texture */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/dm12f7lnc/image/upload/v1782803435/stygiangalleryphoto1_96c815a885_t9v5n9.jpg"
            alt="Tattoo Process"
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-[#C9A84C] opacity-[0.05] mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10"></div>
        </div>

        {/* Large Watermark */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none z-0">
          <h2 className="font-display font-light text-[12vw] leading-none text-white/[0.02] tracking-tighter">
            DESINKS
          </h2>
        </div>

        {/* Staggered Content */}
        <div className="relative z-10 max-w-4xl mx-auto w-full pt-16 flex flex-col items-center text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={heroFadeUp}
            className="mb-6 font-mono text-[11px] tracking-[0.3em] uppercase text-text-warm/60"
          >
            DESINKS Studio
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            custom={1}
            variants={heroFadeUp}
            className="text-[clamp(40px,6vw,72px)] leading-[1.1] mb-6 font-display"
          >
            Your Art.<br/>
            <span className="italic font-light text-text-warm/90">Your Appointment.</span><br/>
            No Hassle.
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={2}
            variants={heroFadeUp}
            className="text-lg md:text-xl text-text-warm/60 max-w-xl mx-auto mb-10 font-body"
          >
            Premium tattoo, lashes, and eyebrows studio. We bring your vision to life with precision and care in an environment built on excellence.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={3}
            variants={heroFadeUp}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/book" className="btn-primary hover:scale-[1.02] transition-transform w-full sm:w-auto">
              Book Now
            </Link>
            <Link href="/gallery" className="btn-ghost hover:scale-[1.02] transition-transform w-full sm:w-auto">
              View Portfolio
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Marquee Section */}
      <section className="w-full overflow-hidden border-y border-border-dark py-4 bg-surface/30">
        <div className="marquee-track font-mono text-sm uppercase tracking-widest text-text-warm/80">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center whitespace-nowrap px-4">
              <span>Custom Tattoos</span>
              <span className="mx-6 text-accent">·</span>
              <span>All Styles</span>
              <span className="mx-6 text-accent">·</span>
              <span>Eyebrow Shaping</span>
              <span className="mx-6 text-accent">·</span>
              <span>Tinting</span>
              <span className="mx-6 text-accent">·</span>
              <span>Lamination</span>
              <span className="mx-6 text-accent">·</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Services Section */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <Reveal>
          <div className="mb-16">
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-text-warm/50 block mb-4">Services</span>
            <h2 className="text-4xl md:text-5xl font-display">What We Do</h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Reveal key={index} index={index}>
                <Link href={service.link} className="block group pb-10 border-b border-border-dark/50 hover:border-accent/30 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold font-display group-hover:text-accent transition-colors">{service.title}</h3>
                    <Icon className="w-5 h-5 text-text-warm/40 group-hover:text-accent transition-colors" strokeWidth={1.5} />
                  </div>
                  <p className="text-text-warm/60 text-[15px] leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <span className="font-mono text-xs uppercase tracking-widest text-accent flex items-center gap-2">
                    Book Service <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Parallax Showcase Section -> Replaced with ImageGallery per request */}
      <section className="w-full bg-background border-t border-border-dark relative overflow-hidden py-16">
        <div className="relative flex flex-col items-center justify-center text-center">
          <div
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute -top-1/2 left-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 rounded-full',
              'bg-[radial-gradient(ellipse_at_center,var(--color-accent)_0%,transparent_30%)]',
              'blur-[60px] opacity-10',
            )}
          />
          <h2 className="text-3xl md:text-5xl font-display text-text-heading">
            Immerse in the Art
          </h2>
          <p className="text-sm text-text-warm/60 mt-4 max-w-2xl font-body">
            A visual collection of our most recent works – each piece crafted
            with intention, emotion, and style.
          </p>
        </div>
        
        <ImageGallery images={parallaxImages.map(img => img.src)} />
      </section>

      {/* 4. About the Artist / Social Proof */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="space-y-6">
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-text-warm/50 block mb-4">About the Studio</span>
              <h2 className="text-4xl md:text-5xl font-display leading-tight">Mastering the Craft</h2>
              <p className="text-text-warm/70 text-lg leading-relaxed font-body">
                Based in Atlanta, GA, DESINKS has built a reputation for mastering fine art principles with precision tattooing and beauty services - bringing premium artistry to clients across the Metro region. Every custom tattoo, precise eyebrow shaping, and lamination session is executed with hyper-focus, ensuring your aesthetic goals are not just met, but masterfully exceeded.
              </p>
              <div className="pt-4">
                <Link href="https://www.tiktok.com/@desinks?_r=1&_t=ZS-97fVsMSfzxB" target="_blank" className="btn-ghost inline-flex gap-2 items-center">
                  Follow on TikTok <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal index={2}>
            {/* 4-Image Instagram-style Static Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square relative rounded-2xl overflow-hidden group">
                <Image src={parallaxImages[0].src} alt="Instagram post" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="aspect-square relative rounded-2xl overflow-hidden group translate-y-8">
                <Image src={parallaxImages[1].src} alt="Instagram post" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="aspect-square relative rounded-2xl overflow-hidden group">
                <Image src={parallaxImages[2].src} alt="Instagram post" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="aspect-square relative rounded-2xl overflow-hidden group translate-y-8">
                <Image src={parallaxImages[3].src} alt="Instagram post" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. FAQ Accordion */}
      <section className="py-24 px-6 md:px-12 max-w-3xl mx-auto w-full border-t border-border-dark">
        <Reveal>
          <div className="text-center mb-16">
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-text-warm/50 block mb-4">FAQ</span>
            <h2 className="text-4xl md:text-5xl font-display">Questions?</h2>
          </div>
        </Reveal>

        <div className="border-t border-border-dark">
          {faqs.map((faq, index) => (
            <Reveal key={index} index={index}>
              <div className="border-b border-border-dark">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center py-6 text-left hover:text-accent transition-colors"
                >
                  <span className="text-base font-medium">{faq.question}</span>
                  {openFaq === index ? (
                    <Minus className="w-5 h-5 text-accent flex-shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 text-text-warm/40 flex-shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-text-warm/60 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 5. Contact CTA */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto w-full text-center">
        <Reveal>
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-text-warm/50 block mb-6">Chat</span>
          <a 
            href="https://wa.me/16054502811"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block group"
          >
            <h2 className="text-4xl md:text-7xl font-display text-text-heading group-hover:text-accent transition-colors duration-300">
              Let's Talk <ArrowUpRight className="inline w-8 h-8 md:w-16 md:h-16 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-accent" />
            </h2>
            <div className="h-[1px] w-0 bg-accent mt-4 transition-all duration-500 group-hover:w-full mx-auto origin-left"></div>
          </a>
        </Reveal>
      </section>

    </main>
  );
}
