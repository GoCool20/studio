import { siteConfig } from '@/config/site';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex h-16 items-center justify-center">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
