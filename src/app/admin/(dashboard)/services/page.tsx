"use client";

import { useEffect, useState } from "react";
import { Scissors, Sparkles } from "lucide-react";

type DBService = {
  id: string;
  name: string;
  icon: string;
  description: string;
  deposit: number;
};

export default function AdminServices() {
  const [services, setServices] = useState<DBService[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      if (Array.isArray(data)) {
        setServices(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (id: string, field: keyof DBService, value: any) => {
    setServices(prev => 
      prev.map(s => s.id === id ? { ...s, [field]: value } : s)
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await fetch("/api/admin/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(services)
      });
      alert("Services saved successfully!");
    } catch (e) {
      console.error(e);
      alert("Failed to save services.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading services...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-display mb-8">Manage Services Pricing</h1>
      
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {services.map((s) => {
            const Icon = s.icon === "Sparkles" ? Sparkles : Scissors;
            return (
              <div key={s.id} className="card flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-display">{s.name}</h2>
                </div>
                
                <div>
                  <label className="block text-sm font-mono mb-2 uppercase tracking-wider text-text-warm/70">Description / Price</label>
                  <input 
                    type="text" 
                    value={s.description}
                    onChange={(e) => handleUpdate(s.id, "description", e.target.value)}
                    className="input-field" 
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-mono mb-2 uppercase tracking-wider text-text-warm/70">Deposit Amount ($)</label>
                  <input 
                    type="number" 
                    value={s.deposit}
                    onChange={(e) => handleUpdate(s.id, "deposit", parseInt(e.target.value) || 0)}
                    className="input-field" 
                    required
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-end border-t border-border-dark pt-6 mt-8">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
