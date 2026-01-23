import { AdminGuard } from '@/components/auth/AdminGuard';
import { AdminSidebar } from './components/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="bg-background md:flex md:min-h-screen">
        <AdminSidebar />
        <main className="w-full p-6 md:p-10">
            {children}
        </main>
      </div>
    </AdminGuard>
  );
}
