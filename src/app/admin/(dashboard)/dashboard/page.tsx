import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import { getServiceRoleClient } from "@/lib/supabase";

export const revalidate = 0; // Disable caching to always show live DB data

export default async function AdminDashboard() {
  const supabase = getServiceRoleClient();

  // 1. Fetch Status Counts
  const { data: bookings, error: countError } = await supabase
    .from("bookings")
    .select("status");

  let total = 0, pending = 0, confirmed = 0, cancelled = 0;
  if (bookings && !countError) {
    total = bookings.length;
    bookings.forEach((b) => {
      if (b.status === 'pending') pending++;
      else if (b.status === 'confirmed') confirmed++;
      else if (b.status === 'cancelled') cancelled++;
    });
  }

  // 2. Fetch Today's Appointments
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const { data: todayAppointments, error: todayError } = await supabase
    .from("bookings")
    .select("id, client_name, service_type, appointment_at, status")
    .gte("appointment_at", todayStart.toISOString())
    .lte("appointment_at", todayEnd.toISOString())
    .order("appointment_at", { ascending: true });

  const stats = [
    { label: "Total Bookings", value: total.toString(), icon: Calendar, color: "text-accent" },
    { label: "Pending", value: pending.toString(), icon: Clock, color: "text-text-warm" },
    { label: "Confirmed", value: confirmed.toString(), icon: CheckCircle, color: "text-green-500" },
    { label: "Cancelled", value: cancelled.toString(), icon: XCircle, color: "text-error" },
  ];

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-display mb-6 md:mb-8 mt-2 md:mt-0">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="card p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
              <div className={`p-4 bg-background border border-border-dark w-max ${stat.color}`}>
                <Icon className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <div>
                <p className="text-xs md:text-sm font-mono text-text-warm/60 uppercase">{stat.label}</p>
                <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="card">
        <h2 className="text-xl font-display mb-6 border-b border-border-dark pb-4">Today&apos;s Appointments</h2>
        <div className="space-y-4">
          {!todayAppointments || todayAppointments.length === 0 ? (
            <p className="text-text-warm/60 italic text-sm">No appointments scheduled for today.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-border-dark text-text-warm/60 font-mono text-xs uppercase tracking-wider">
                    <th className="pb-3 pr-4 font-normal">Time</th>
                    <th className="pb-3 pr-4 font-normal">Client</th>
                    <th className="pb-3 pr-4 font-normal">Service</th>
                    <th className="pb-3 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-dark/50">
                  {todayAppointments.map((apt) => (
                    <tr key={apt.id} className="text-text-warm hover:bg-surface-light transition-colors">
                      <td className="py-3 pr-4 font-mono text-accent">
                        {new Date(apt.appointment_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 pr-4 font-medium">{apt.client_name}</td>
                      <td className="py-3 pr-4 capitalize text-text-warm/80">{apt.service_type.replace(/_/g, ' ')}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 text-xs rounded-sm capitalize ${
                          apt.status === 'confirmed' ? 'bg-green-500/10 text-green-500' :
                          apt.status === 'cancelled' ? 'bg-error/10 text-error' :
                          'bg-text-warm/10 text-text-warm'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
