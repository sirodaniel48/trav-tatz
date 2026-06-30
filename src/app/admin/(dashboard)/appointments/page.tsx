"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { X, Download, Mail } from "lucide-react";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [serviceFilter, setServiceFilter] = useState("All Services");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, serviceFilter, dateFilter]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      let url = "/api/admin/appointments?";
      if (statusFilter !== "All Statuses") url += `status=${statusFilter}&`;
      
      const res = await fetch(url);
      let data = await res.json();
      
      // Client-side filter for service and date (for simplicity)
      if (serviceFilter !== "All Services") {
        data = data.filter((app: any) => app.service_type.toLowerCase() === serviceFilter.toLowerCase());
      }
      if (dateFilter) {
        data = data.filter((app: any) => app.appointment_at.startsWith(dateFilter));
      }
      
      setAppointments(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch("/api/admin/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
      fetchAppointments();
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const exportCSV = () => {
    if (appointments.length === 0) return;
    const headers = ["Date", "Time", "Client Name", "Email", "Phone", "Service", "Status", "Deposit Paid"];
    const csvRows = [headers.join(",")];
    
    appointments.forEach(app => {
      const dateObj = new Date(app.appointment_at);
      const row = [
        format(dateObj, "yyyy-MM-dd"),
        format(dateObj, "h:mm a"),
        `"${app.client_name}"`,
        `"${app.client_email}"`,
        `"${app.client_phone}"`,
        app.service_type,
        app.status,
        app.deposit_paid ? "Yes" : "No"
      ];
      csvRows.push(row.join(","));
    });
    
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `bookings_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleResendEmail = async (id: string) => {
    setResending(true);
    try {
      const res = await fetch(`/api/admin/appointments/resend?id=${id}`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to resend");
      alert("Confirmation email resent successfully.");
    } catch (e) {
      console.error(e);
      alert("Failed to resend email.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="p-8 relative">
      <div className="flex justify-between items-end mb-8">
        <h1 className="text-3xl font-display">Appointments</h1>
        <button onClick={exportCSV} className="btn-ghost flex items-center gap-2 py-2 px-4 text-sm" disabled={appointments.length === 0}>
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>
      
      <div className="card">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <h2 className="text-xl font-display">All Appointments</h2>
          <div className="flex flex-wrap gap-4">
            <input 
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-background border border-border-dark text-text-warm p-2 text-sm font-mono"
            />
            <select 
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="bg-background border border-border-dark text-text-warm p-2 text-sm font-mono"
            >
              <option>All Services</option>
              <option>Tattoo</option>
              <option>Eyebrows</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-background border border-border-dark text-text-warm p-2 text-sm font-mono"
            >
              <option>All Statuses</option>
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-dark font-mono text-sm uppercase text-text-warm/50 tracking-wider">
                <th className="p-4">Date</th>
                <th className="p-4">Client</th>
                <th className="p-4">Service</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-warm/50 italic">
                    Loading appointments...
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-text-warm/50 italic">
                    No appointments found matching filters.
                  </td>
                </tr>
              ) : (
                appointments.map(app => (
                  <tr key={app.id} className="border-b border-border-dark/50 hover:bg-accent/5 cursor-pointer transition-colors" onClick={() => setSelectedBooking(app)}>
                    <td className="p-4 font-mono text-sm">
                      {format(new Date(app.appointment_at), "MMM d, yyyy h:mm a")}
                    </td>
                    <td className="p-4">
                      <div className="font-bold">{app.client_name}</div>
                    </td>
                    <td className="p-4 capitalize">{app.service_type}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs uppercase font-mono rounded-full font-bold ${
                        app.status === 'confirmed' ? 'text-green-900 bg-green-500/80' :
                        app.status === 'completed' ? 'text-blue-900 bg-blue-500/80' :
                        app.status === 'cancelled' ? 'text-red-900 bg-red-500/80' :
                        'text-yellow-900 bg-yellow-500/80'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <select 
                        value={app.status}
                        onChange={(e) => { e.stopPropagation(); updateStatus(app.id, e.target.value); }}
                        className="bg-background border border-border-dark text-text-warm p-1 text-xs font-mono"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirm</option>
                        <option value="completed">Complete</option>
                        <option value="cancelled">Cancel</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-surface border border-border-dark rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-surface border-b border-border-dark p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-display text-accent">Booking Details</h2>
              <button onClick={() => setSelectedBooking(null)} className="text-text-warm/50 hover:text-text-warm transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-widest text-text-warm/50 mb-1">Client Info</h3>
                  <p className="text-xl font-bold">{selectedBooking.client_name}</p>
                  <p className="text-text-warm/80">{selectedBooking.client_email}</p>
                  <p className="text-text-warm/80">{selectedBooking.client_phone}</p>
                </div>
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-widest text-text-warm/50 mb-1">Appointment</h3>
                  <p className="text-lg">{format(new Date(selectedBooking.appointment_at), "EEEE, MMMM d, yyyy")}</p>
                  <p className="text-accent font-bold">{format(new Date(selectedBooking.appointment_at), "h:mm a")}</p>
                  <p className="capitalize mt-1 font-mono text-sm">Service: {selectedBooking.service_type}</p>
                </div>
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-widest text-text-warm/50 mb-1">Financials</h3>
                  <p className="text-sm">Deposit Paid: <span className="font-bold">{selectedBooking.deposit_paid ? "Yes" : "No"}</span></p>
                </div>
                <div className="pt-4 border-t border-border-dark">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-text-warm/50 mb-3">Actions</h3>
                  <div className="flex flex-col gap-3">
                    <select 
                      value={selectedBooking.status}
                      onChange={(e) => updateStatus(selectedBooking.id, e.target.value)}
                      className="bg-background border border-border-dark text-text-warm p-2 text-sm font-mono w-full"
                    >
                      <option value="pending">Mark Pending</option>
                      <option value="confirmed">Mark Confirmed</option>
                      <option value="completed">Mark Completed</option>
                      <option value="cancelled">Mark Cancelled</option>
                    </select>
                    
                    <button 
                      onClick={() => handleResendEmail(selectedBooking.id)}
                      disabled={resending}
                      className="btn-ghost flex justify-center items-center gap-2 py-2 text-sm w-full"
                    >
                      <Mail className="w-4 h-4" /> {resending ? "Sending..." : "Resend Confirmation Email"}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-widest text-text-warm/50 mb-2">Service Description</h3>
                  <div className="bg-background border border-border-dark p-4 rounded-xl text-sm min-h-[100px] whitespace-pre-wrap">
                    {selectedBooking.service_detail || "No description provided."}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-widest text-text-warm/50 mb-2">Reference Image</h3>
                  {selectedBooking.reference_image_url ? (
                    <a href={selectedBooking.reference_image_url} target="_blank" rel="noreferrer" className="block relative aspect-square rounded-xl overflow-hidden border border-border-dark group">
                      <img src={selectedBooking.reference_image_url} alt="Reference" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-accent text-background px-4 py-2 text-xs font-bold font-mono uppercase tracking-widest rounded-full">View Full Size</span>
                      </div>
                    </a>
                  ) : (
                    <div className="aspect-video bg-background border border-border-dark border-dashed rounded-xl flex items-center justify-center text-text-warm/40 text-sm">
                      No reference image
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
