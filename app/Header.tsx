import Link from 'next/link';
import { env } from './config/env';
import { isAuthenticated, getUser } from '@/lib/auth';
import { UserMenu } from '@/components/ui/UserMenu';

export async function Header() {
  const authenticated = await isAuthenticated();
  const user = await getUser();

  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 ml-14">
      <div className="text-2xl font-bold">{env.NEXT_PUBLIC_APP_TITLE}</div>
      <div className="flex gap-4 items-center">
        {authenticated && user ? (
          <UserMenu username={user.name} />
        ) : (
          <Link href="/login" className="text-sm font-medium hover:underline">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
