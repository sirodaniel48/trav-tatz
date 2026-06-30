"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const CATEGORIES = ["All", "Tattoos", "Eyebrows"];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [index, setIndex] = useState(-1);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await fetch("/api/public/gallery");
        const data = await res.json();
        setImages(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error loading gallery", e);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  // Filter based on active category
  const filteredImages = activeCategory === "All" 
    ? images 
    : images.filter(img => img.category.toLowerCase() === activeCategory.toLowerCase().replace(/s$/, '')); 
    // .replace handles "Tattoos" -> "Tattoo" if the db uses singular.

  const slides = filteredImages.map(img => ({
    src: img.url,
    alt: img.caption || img.category,
  }));

  return (
    <main className="min-h-screen pt-32 pb-16 px-4 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto w-full mb-12">
        <h1 className="text-5xl md:text-6xl text-center mb-4 font-display">The Portfolio</h1>
        <div className="h-1 w-24 bg-accent mx-auto mb-12"></div>
        
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {CATEGORIES.map((f) => (
            <button
              key={f}
              onClick={() => setActiveCategory(f)}
              className={`px-6 py-2 font-mono uppercase tracking-widest text-sm transition-all duration-300 border-2 rounded-xl ${
                activeCategory === f
                  ? "bg-accent border-accent text-background font-bold shadow-[0_0_15px_rgba(201,168,76,0.4)]"
                  : "bg-transparent border-border-dark text-text-warm hover:border-accent hover:text-accent"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
          {loading ? (
            <p className="text-center text-text-warm/50 w-full col-span-full font-mono uppercase tracking-widest animate-pulse">Loading gallery...</p>
          ) : filteredImages.length === 0 ? (
            <p className="text-center text-text-warm/50 w-full col-span-full font-mono uppercase tracking-widest">No images found.</p>
          ) : (
            filteredImages.map((img, i) => (
              <div 
                key={img.id} 
                className="relative break-inside-avoid cursor-pointer group rounded-2xl overflow-hidden border border-border-dark hover:border-accent transition-colors duration-300"
                onClick={() => setIndex(i)}
              >
                <Image
                  src={img.url}
                  alt={img.caption || img.category}
                  width={800}
                  height={800}
                  className="w-full h-auto object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-sm font-mono uppercase tracking-widest text-background bg-accent px-4 py-2 rounded-xl font-bold">View</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={slides}
        styles={{ container: { backgroundColor: "rgba(10, 10, 10, 0.95)" } }}
      />
    </main>
  );
}
