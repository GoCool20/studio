import Link from 'next/link';
import { Terminal } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Back to homepage">
      <Terminal className="h-6 w-6 text-primary" />
      <span className="text-xl font-bold tracking-tight text-foreground">
        DevFolio
      </span>
    </Link>
  );
}
