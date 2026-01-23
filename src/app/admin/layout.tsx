import { AdminGuard } from '@/components/auth/AdminGuard';
import { AdminSidebar } from './components/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-8">
            {children}
        </main>
      </div>
    </AdminGuard>
  );
}
