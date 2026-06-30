"use client";

import { useEffect, useState } from "react";

export default function AdminSettings() {
  const [timeSlots, setTimeSlots] = useState("");
  const [deposit, setDeposit] = useState("35");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data) {
        setTimeSlots(data.time_slots.join(", "));
        setDeposit(data.deposit_amount);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const slotsArray = timeSlots.split(",").map(s => s.trim()).filter(Boolean);
    
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          time_slots: slotsArray,
          deposit_amount: parseFloat(deposit)
        })
      });
      alert("Settings saved successfully!");
    } catch (e) {
      console.error(e);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-display mb-8">Settings</h1>
      
      <div className="max-w-2xl space-y-8">
        <div className="card">
          <h2 className="text-xl font-display mb-6 border-b border-border-dark pb-4">Booking Configuration</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-mono mb-2 uppercase tracking-wider text-text-warm/70">Deposit Amount ($)</label>
              <input 
                type="number" 
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                className="input-field" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-mono mb-2 uppercase tracking-wider text-text-warm/70">Available Time Slots (Comma separated)</label>
              <input 
                type="text" 
                value={timeSlots}
                onChange={(e) => setTimeSlots(e.target.value)}
                className="input-field" 
                required
              />
            </div>
            <button type="submit" disabled={saving} className="btn-primary mt-4 disabled:opacity-50">
              {saving ? "Saving..." : "Save Configuration"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
