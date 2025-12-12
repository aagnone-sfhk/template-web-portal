import { cookies } from 'next/headers';

const SESSION_COOKIE = 'portal_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function login(username: string, password: string): Promise<boolean> {
  const validUsername = process.env.AUTH_USERNAME;
  const validPassword = process.env.AUTH_PASSWORD;

  if (!validUsername || !validPassword) {
    console.error('AUTH_USERNAME and AUTH_PASSWORD must be set');
    return false;
  }

  if (username === validUsername && password === validPassword) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    });
    return true;
  }

  return false;
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return session?.value === 'authenticated';
}

export async function getUser(): Promise<{ name: string } | null> {
  const authenticated = await isAuthenticated();
  if (!authenticated) return null;
  return { name: process.env.AUTH_USERNAME || 'User' };
}
