import Link from 'next/link';
import { env } from './config/env';
import { isAuthenticated } from '@/lib/auth';

export async function Header() {
  const authenticated = await isAuthenticated();

  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 ml-14">
      <div className="text-2xl font-bold">{env.NEXT_PUBLIC_APP_TITLE}</div>
      {!authenticated && (
        <Link href="/login" className="text-sm font-medium hover:underline">
          Sign In
        </Link>
      )}
    </header>
  );
}
