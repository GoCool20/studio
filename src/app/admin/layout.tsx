import { AdminGuard } from '@/components/auth/AdminGuard';
import { AdminSidebar } from './components/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-secondary/20">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-12">
            {children}
        </main>
      </div>
    </AdminGuard>
  );
}
