"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, LayoutDashboard, Calendar, Image as ImageIcon, Settings, Menu, X } from "lucide-react";

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Top Bar with Hamburger */}
      <div className="md:hidden flex items-center justify-between p-4 bg-surface border-b border-border-dark sticky top-0 z-40">
        <div>
          <h2 className="font-display text-xl font-bold text-accent">Trav-Tatz</h2>
          <p className="text-[10px] text-text-warm/50 font-mono">Admin Panel</p>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 text-text-warm hover:text-accent focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border-dark flex flex-col 
        transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6 border-b border-border-dark hidden md:block">
          <h2 className="font-display text-2xl font-bold text-accent">Trav-Tatz</h2>
          <p className="text-xs text-text-warm/50 font-mono mt-1">Admin Panel</p>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <Link 
            href="/admin/dashboard" 
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${
              pathname === '/admin/dashboard' ? 'bg-accent/20 text-accent font-medium' : 'text-text-warm hover:bg-accent/10 hover:text-accent'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link 
            href="/admin/appointments" 
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${
              pathname === '/admin/appointments' ? 'bg-accent/20 text-accent font-medium' : 'text-text-warm hover:bg-accent/10 hover:text-accent'
            }`}
          >
            <Calendar className="w-5 h-5" />
            Appointments
          </Link>
          <Link 
            href="/admin/calendar" 
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${
              pathname === '/admin/calendar' ? 'bg-accent/20 text-accent font-medium' : 'text-text-warm hover:bg-accent/10 hover:text-accent'
            }`}
          >
            <Calendar className="w-5 h-5" />
            Calendar
          </Link>
          <Link 
            href="/admin/gallery" 
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${
              pathname === '/admin/gallery' ? 'bg-accent/20 text-accent font-medium' : 'text-text-warm hover:bg-accent/10 hover:text-accent'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            Gallery
          </Link>
          <Link 
            href="/admin/settings" 
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${
              pathname === '/admin/settings' ? 'bg-accent/20 text-accent font-medium' : 'text-text-warm hover:bg-accent/10 hover:text-accent'
            }`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-border-dark">
          <Link 
            href="/admin/login" 
            className="flex items-center gap-3 px-4 py-3 text-text-warm/70 hover:text-error transition-colors w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Link>
        </div>
      </aside>
    </>
  );
}
