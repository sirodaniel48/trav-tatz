import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";

export default function AdminDashboard() {
  // In a real app, you would fetch these from Supabase Server Components
  const stats = [
    { label: "Total Bookings", value: "124", icon: Calendar, color: "text-accent" },
    { label: "Pending", value: "12", icon: Clock, color: "text-text-warm" },
    { label: "Confirmed", value: "98", icon: CheckCircle, color: "text-green-500" },
    { label: "Cancelled", value: "14", icon: XCircle, color: "text-error" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-display mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="card flex items-center gap-4">
              <div className={`p-4 bg-background border border-border-dark ${stat.color}`}>
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-mono text-text-warm/60 uppercase">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="card">
        <h2 className="text-xl font-display mb-6 border-b border-border-dark pb-4">Today&apos;s Appointments</h2>
        <div className="space-y-4">
          <p className="text-text-warm/60 italic">No appointments scheduled for today.</p>
        </div>
      </div>
    </div>
  );
}
