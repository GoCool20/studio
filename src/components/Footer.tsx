import { siteConfig } from '@/config/site';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-4 text-center md:flex-row md:px-8">
        <Logo />
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
