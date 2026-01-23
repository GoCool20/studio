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

  const NavLink = ({ item, isMobile = false }: { item: typeof navItems[0], isMobile?: boolean }) => {
    const isActive = pathname === item.href;
    return (
      <Link 
        href={item.href} 
        onClick={() => {
          if(isMobile) setIsOpen(false)
        }}
      >
        <Button
          variant={isActive ? 'secondary' : 'ghost'}
          className="w-full justify-start h-12 text-sm"
        >
          <item.icon className="mr-3 h-5 w-5" />
          {item.label}
        </Button>
      </Link>
    );
  };

  const sidebarContent = (isMobile: boolean) => (
    <div className="flex h-full flex-col bg-card text-card-foreground">
      <div className="p-4 border-b h-20 flex items-center">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => <NavLink key={item.href} item={item} isMobile={isMobile} />)}
      </nav>
      <div className="mt-auto border-t p-4">
        <Button variant="ghost" className="w-full justify-start h-12 text-sm" onClick={handleLogout}>
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header & Sidebar */}
      <div className="md:hidden">
        <header className="sticky top-0 bg-card z-20 w-full p-4 border-b flex items-center justify-between h-20">
          <Logo />
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
              <Menu className="h-6 w-6" />
          </Button>
        </header>
        {isOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/60" 
            onClick={() => setIsOpen(false)} 
          />
        )}
        <div
          className={cn(
            'fixed top-0 left-0 z-50 h-full w-72 bg-card border-r transform transition-transform',
            isOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {sidebarContent(true)}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 flex-shrink-0 border-r bg-card">
        <div className="sticky top-0 h-screen">
          {sidebarContent(false)}
        </div>
      </aside>
    </>
  );
}
