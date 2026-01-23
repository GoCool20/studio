'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, UserCircle } from 'lucide-react';

import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/Logo';

export function Header() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const mainNav = siteConfig.mainNav.map((item) => (
    <Link
      key={item.href}
      href={item.href}
      className={cn(
        'text-sm font-medium transition-colors hover:text-primary',
        pathname === item.href ? 'text-primary' : 'text-muted-foreground'
      )}
    >
      {item.title}
    </Link>
  ));

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Logo />
          <nav className="hidden gap-6 md:flex">{mainNav}</nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {!loading && user && (
              <Link href="/admin">
                <Button variant="ghost" size="icon" aria-label="Admin Dashboard">
                  <UserCircle className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <Logo />
                <div className="mt-8 flex flex-col space-y-4">{mainNav}</div>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </div>
    </header>
  );
}
