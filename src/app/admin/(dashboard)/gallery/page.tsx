"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function AdminGallery() {
  const [images, setImages] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("tattoo");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/admin/gallery");
      const data = await res.json();
      setImages(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    formData.append("caption", caption);

    try {
      await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      });
      setFile(null);
      setCaption("");
      fetchImages();
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, cloudinaryId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    
    try {
      await fetch(`/api/admin/gallery?id=${id}&cloudinaryId=${cloudinaryId}`, {
        method: "DELETE"
      });
      fetchImages();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReorder = async (currentIndex: number, direction: 'left' | 'right') => {
    if (direction === 'left' && currentIndex === 0) return;
    if (direction === 'right' && currentIndex === images.length - 1) return;

    const newImages = [...images];
    const targetIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    
    // Swap
    const temp = newImages[currentIndex];
    newImages[currentIndex] = newImages[targetIndex];
    newImages[targetIndex] = temp;
    
    // Update display_order property
    const updates = newImages.map((img, index) => ({
      id: img.id,
      display_order: index
    }));
    
    // Optimistic update
    setImages(newImages);
    
    try {
      await fetch("/api/admin/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
    } catch (e) {
      console.error(e);
      fetchImages(); // Revert on error
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-display mb-8">Manage Portfolio</h1>
      
      <div className="card mb-8 bg-accent/5 border-accent/20">
        <h2 className="text-xl font-display mb-4">Upload New Image</h2>
        <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-mono mb-2 uppercase tracking-wider text-text-warm/70">Image File</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full bg-background border border-border-dark text-text-warm p-2" 
              required
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-mono mb-2 uppercase tracking-wider text-text-warm/70">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field py-2"
            >
              <option value="tattoo">Tattoo</option>
              <option value="eyebrows">Eyebrows</option>
            </select>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-mono mb-2 uppercase tracking-wider text-text-warm/70">Caption (Optional)</label>
            <input 
              type="text" 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="input-field py-2" 
              placeholder="e.g. Fine line floral" 
            />
          </div>
          <button type="submit" disabled={uploading || !file} className="btn-primary py-2.5 disabled:opacity-50">
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
      
      <div className="card">
        <h2 className="text-xl font-display mb-6">Current Gallery (Drag or click arrows to reorder)</h2>
        {loading ? (
          <div className="text-center p-12 text-text-warm/50 italic">Loading gallery...</div>
        ) : images.length === 0 ? (
          <div className="text-center p-12 border border-dashed border-border-dark text-text-warm/50 italic">
            No images found. Upload one above!
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div key={img.id} className="relative aspect-square bg-background border border-border-dark group overflow-hidden">
                <Image src={img.url} alt={img.caption || "Gallery Image"} fill className="object-cover" />
                
                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs uppercase font-mono mb-4">{img.category}</span>
                  
                  <div className="flex gap-2 mb-4">
                    <button 
                      onClick={() => handleReorder(idx, 'left')}
                      disabled={idx === 0}
                      className="bg-surface text-text-warm text-xs px-2 py-1 font-bold disabled:opacity-30 hover:text-accent"
                    >
                      ←
                    </button>
                    <button 
                      onClick={() => handleReorder(idx, 'right')}
                      disabled={idx === images.length - 1}
                      className="bg-surface text-text-warm text-xs px-2 py-1 font-bold disabled:opacity-30 hover:text-accent"
                    >
                      →
                    </button>
                  </div>

                  <button 
                    onClick={() => handleDelete(img.id, img.cloudinary_id)}
                    className="bg-error text-white text-xs px-3 py-1 font-bold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
