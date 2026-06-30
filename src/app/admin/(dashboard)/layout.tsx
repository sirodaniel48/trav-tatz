import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <AdminSidebar />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-background min-h-screen relative">
        {children}
      </main>
    </div>
  );
}
