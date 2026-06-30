"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function AdminCalendar() {
  const [blockedDates, setBlockedDates] = useState<any[]>([]);
  const [blockedTimeSlots, setBlockedTimeSlots] = useState<any[]>([]);
  const [globalTimeSlots, setGlobalTimeSlots] = useState<string[]>([]);
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [datesRes, timesRes, settingsRes] = await Promise.all([
        fetch("/api/admin/blocked-dates"),
        fetch("/api/admin/blocked-time-slots"),
        fetch("/api/admin/settings")
      ]);
      
      const datesData = await datesRes.json();
      const timesData = await timesRes.json();
      const settingsData = await settingsRes.json();
      
      setBlockedDates(datesData || []);
      setBlockedTimeSlots(Array.isArray(timesData) ? timesData : []);
      if (settingsData && settingsData.time_slots) {
        setGlobalTimeSlots(settingsData.time_slots);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockFullDay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    const localDateStr = format(selectedDate, "yyyy-MM-dd");

    try {
      await fetch("/api/admin/blocked-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: localDateStr, reason }),
      });
      setReason("");
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnblockDay = async (id: string) => {
    try {
      await fetch(`/api/admin/blocked-dates?id=${id}`, { method: "DELETE" });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleBlockTimeSlot = async (timeSlot: string) => {
    if (!selectedDate) return;
    const localDateStr = format(selectedDate, "yyyy-MM-dd");
    try {
      const res = await fetch("/api/admin/blocked-time-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: localDateStr, time_slot: timeSlot, reason: "Manual Block" }),
      });
      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Failed to block time slot");
      } else {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnblockTimeSlot = async (id: string) => {
    try {
      await fetch(`/api/admin/blocked-time-slots?id=${id}`, { method: "DELETE" });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const localDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const isFullDayBlocked = blockedDates.some(bd => bd.date === localDateStr);
  const dateBlockedSlots = blockedTimeSlots.filter(bts => bts.date === localDateStr);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-display mb-8">Availability Manager</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Calendar */}
        <div className="card">
          <h2 className="text-xl font-display mb-4">Select Date</h2>
          <p className="text-sm text-text-warm/70 mb-6">Select a date to manage its availability.</p>
          
          <div className="flex justify-center custom-calendar border-b border-border-dark pb-6 mb-6">
            <style dangerouslySetInnerHTML={{__html: `
              .custom-calendar .rdp {
                --rdp-color-selected: var(--color-error);
                --rdp-color-selected-text: #fff;
                margin: 0;
              }
              .custom-calendar .rdp-day_selected, 
              .custom-calendar .rdp-day_selected:focus-visible, 
              .custom-calendar .rdp-day_selected:hover {
                background-color: var(--color-error);
                color: #fff;
                font-weight: bold;
              }
            `}} />
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="bg-transparent"
            />
          </div>

          {selectedDate && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-2">Manage {format(selectedDate, "MMMM d, yyyy")}</h3>
                {isFullDayBlocked ? (
                  <div className="bg-error/20 border border-error/50 p-4 rounded-xl flex justify-between items-center text-error">
                    <span>This entire day is blocked.</span>
                    <button 
                      onClick={() => {
                        const bd = blockedDates.find(b => b.date === localDateStr);
                        if (bd) handleUnblockDay(bd.id);
                      }}
                      className="bg-error text-white px-4 py-2 text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-error/80"
                    >
                      Unblock Day
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBlockFullDay} className="flex gap-4">
                    <input 
                      type="text" 
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="input-field flex-1" 
                      placeholder="Reason for blocking day (e.g. Vacation)" 
                    />
                    <button type="submit" className="px-6 bg-error text-white font-bold uppercase tracking-widest text-sm hover:bg-error/80 transition-colors">
                      Block Day
                    </button>
                  </form>
                )}
              </div>

              {!isFullDayBlocked && (
                <div>
                  <h3 className="text-sm font-mono uppercase tracking-widest text-text-warm/70 mb-4 border-t border-border-dark pt-4">Time Slots</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {globalTimeSlots.length === 0 ? (
                      <p className="col-span-2 text-text-warm/50 italic text-sm">No global time slots configured. Add them in Settings.</p>
                    ) : (
                      globalTimeSlots.map(time => {
                        const blockRecord = dateBlockedSlots.find(b => b.time_slot === time);
                        const isBlocked = !!blockRecord;
                        return (
                          <div key={time} className={`p-3 border rounded-xl flex justify-between items-center ${isBlocked ? 'bg-error/10 border-error/30 text-error' : 'bg-background border-border-dark text-text-warm'}`}>
                            <span className="font-mono text-sm font-bold">{time}</span>
                            <button
                              onClick={() => isBlocked ? handleUnblockTimeSlot(blockRecord.id) : handleBlockTimeSlot(time)}
                              className={`text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full ${isBlocked ? 'bg-error text-white' : 'bg-surface border border-border-dark hover:border-accent'}`}
                            >
                              {isBlocked ? 'Unblock' : 'Block'}
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Active Blocks */}
        <div className="space-y-8">
          <div className="card">
            <h2 className="text-xl font-display mb-6">Blocked Full Days</h2>
            {loading ? (
              <p className="text-text-warm/50 italic">Loading...</p>
            ) : blockedDates.length === 0 ? (
              <p className="text-text-warm/50 italic text-sm">No full days are currently blocked.</p>
            ) : (
              <ul className="space-y-3">
                {blockedDates.map(bd => (
                  <li key={bd.id} className="flex justify-between items-center p-3 rounded-xl border border-border-dark bg-background">
                    <div>
                      <span className="font-bold font-mono text-sm">{format(new Date(bd.date + "T00:00:00"), "MMM d, yyyy")}</span>
                      {bd.reason && <span className="block text-xs text-text-warm/60">{bd.reason}</span>}
                    </div>
                    <button 
                      onClick={() => handleUnblockDay(bd.id)}
                      className="text-xs font-mono uppercase tracking-widest bg-surface border border-border-dark px-3 py-1 hover:border-error transition-colors rounded-full"
                    >
                      Unblock
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card">
            <h2 className="text-xl font-display mb-6">Blocked Specific Times</h2>
            {loading ? (
              <p className="text-text-warm/50 italic">Loading...</p>
            ) : blockedTimeSlots.length === 0 ? (
              <p className="text-text-warm/50 italic text-sm">No specific time slots are blocked.</p>
            ) : (
              <ul className="space-y-3">
                {blockedTimeSlots.map(bts => (
                  <li key={bts.id} className="flex justify-between items-center p-3 rounded-xl border border-border-dark bg-background">
                    <div>
                      <span className="font-bold font-mono text-sm">{format(new Date(bts.date + "T00:00:00"), "MMM d, yyyy")} at {bts.time_slot}</span>
                      {bts.reason && <span className="block text-xs text-text-warm/60">{bts.reason}</span>}
                    </div>
                    <button 
                      onClick={() => handleUnblockTimeSlot(bts.id)}
                      className="text-xs font-mono uppercase tracking-widest bg-surface border border-border-dark px-3 py-1 hover:border-error transition-colors rounded-full"
                    >
                      Unblock
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
