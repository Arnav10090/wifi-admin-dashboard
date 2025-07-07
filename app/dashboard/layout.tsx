import { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Toaster } from 'sonner';
import { PermissionGuard } from '@/components/PermissionGuard';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Toaster />
      <SidebarWrapper />
      <div className="ml-64">
        <Header />
        <main className="min-h-[calc(100vh-64px)] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

// SidebarWrapper is a fixed sidebar
function SidebarWrapper() {
  return (
    <div className="fixed left-0 top-0 h-screen w-64 z-30">
      <Sidebar />
    </div>
  );
} 