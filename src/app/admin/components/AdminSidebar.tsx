'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  User,
  Briefcase,
  Code,
  GraduationCap,
  Inbox,
  Palette,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/profile', label: 'Profile', icon: User },
  { href: '/admin/projects', label: 'Projects', icon: Briefcase },
  { href: '/admin/skills', label: 'Skills', icon: Code },
  { href: '/admin/education', label: 'Education', icon: GraduationCap },
  { href: '/admin/messages', label: 'Messages', icon: Inbox },
  { href: '/admin/theme', label: 'Theme', icon: Palette },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const NavLink = ({ item }: { item: typeof navItems[0] }) => {
    const isActive = pathname === item.href;
    return (
      <Link href={item.href} onClick={() => setIsOpen(false)}>
        <Button
          variant={isActive ? 'secondary' : 'ghost'}
          className="w-full justify-start"
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.label}
        </Button>
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="p-4 border-b">
        <Logo />
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => <NavLink key={item.href} item={item} />)}
      </nav>
      <div className="mt-auto border-t p-4">
        <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden sticky top-0 bg-background/80 backdrop-blur-sm z-10 w-full p-2 border-b">
         <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            <Menu className="h-6 w-6" />
        </Button>
      </div>
      
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setIsOpen(false)} />
      )}
      
      <div
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-background border-r transform transition-transform md:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block md:w-64 md:flex-shrink-0 border-r">
        <div className="sticky top-0 h-screen">
          {sidebarContent}
        </div>
      </aside>
    </>
  );
}
