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
        'text-md font-medium transition-colors hover:text-primary',
        pathname === item.href ? 'text-primary' : 'text-muted-foreground'
      )}
    >
      {item.title}
    </Link>
  ));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-10">
          <Logo />
          <nav className="hidden gap-8 md:flex">{mainNav}</nav>
        </div>
        <div className="flex items-center gap-2">
          {!loading && user && (
            <Link href="/admin">
              <Button variant="ghost" size="icon" aria-label="Admin Dashboard">
                <UserCircle className="h-6 w-6" />
              </Button>
            </Link>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="p-6">
                <Logo />
              </div>
              <div className="mt-8 flex flex-col space-y-6 px-6">{mainNav}</div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
