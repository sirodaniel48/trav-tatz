import { cn } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";

export default function ImageGallery({ images }: { images?: string[] }) {
  const defaultImages = [
    "https://images.unsplash.com/photo-1719368472026-dc26f70a9b76?q=80&h=800&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1649265825072-f7dd6942baed?q=80&h=800&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&h=800&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1729086046027-09979ade13fd?q=80&h=800&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1601568494843-772eb04aca5d?q=80&h=800&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1585687501004-615dfdfde7f1?q=80&h=800&w=800&auto=format&fit=crop",
  ];

  const displayImages = images || defaultImages;

  return (
    <section className="w-full flex flex-col items-center justify-start py-12">
      {/* We omit the global Poppins style block here so we don't break the dark luxury theme (Playfair/Inter) */}
      <div className="flex items-center gap-4 md:gap-2 h-[400px] md:h-[500px] w-full max-w-7xl px-4 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory hide-scrollbar">
        {displayImages.map((src, idx) => (
          <div
            key={idx}
            className="relative group transition-all rounded-lg overflow-hidden h-full duration-500 border border-border-dark/30 md:hover:border-accent 
            flex-shrink-0 w-[75vw] snap-center md:flex-grow md:w-56 md:hover:w-full"
          >
            <Image
              className="h-full w-full object-cover object-center grayscale-0 md:grayscale md:group-hover:grayscale-0 transition-all duration-500"
              src={src}
              alt={`image-${idx}`}
              fill
              sizes="(max-width: 768px) 75vw, 33vw"
            />
          </div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </section>
  );
}
