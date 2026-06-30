import Link from "next/link";
import { LogOut, LayoutDashboard, Calendar, Image as ImageIcon, Settings } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface border-r border-border-dark flex flex-col">
        <div className="p-6 border-b border-border-dark">
          <h2 className="font-display text-2xl font-bold text-accent">Trav-Tatz</h2>
          <p className="text-xs text-text-warm/50 font-mono mt-1">Admin Panel</p>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-text-warm hover:bg-accent/10 hover:text-accent rounded-sm transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/admin/appointments" className="flex items-center gap-3 px-4 py-3 text-text-warm hover:bg-accent/10 hover:text-accent rounded-sm transition-colors">
            <Calendar className="w-5 h-5" />
            Appointments
          </Link>
          <Link href="/admin/calendar" className="flex items-center gap-3 px-4 py-3 text-text-warm hover:bg-accent/10 hover:text-accent rounded-sm transition-colors">
            <Calendar className="w-5 h-5" />
            Calendar
          </Link>
          <Link href="/admin/gallery" className="flex items-center gap-3 px-4 py-3 text-text-warm hover:bg-accent/10 hover:text-accent rounded-sm transition-colors">
            <ImageIcon className="w-5 h-5" />
            Gallery
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-text-warm hover:bg-accent/10 hover:text-accent rounded-sm transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-border-dark">
          <Link href="/admin/login" className="flex items-center gap-3 px-4 py-3 text-text-warm/70 hover:text-error transition-colors w-full text-left">
            <LogOut className="w-5 h-5" />
            Logout
          </Link>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
