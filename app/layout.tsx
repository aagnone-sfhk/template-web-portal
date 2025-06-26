import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { env } from './config/env';
import ChatBubble from './chat/ChatBubble';
import { ChatProvider } from './chat/ChatContext';
import { SocketProvider } from './chat/SocketContext';
import { Suspense } from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata = {
  title: 'Demo Partner Portal on Heroku',
  description:
    'A demo partner portal configured with Heroku, Next.js, Postgres, NextAuth, Tailwind CSS, TypeScript, and Prettier.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <SocketProvider sessionId="portal">
              <ChatProvider welcomeMessage={env.NEXT_PUBLIC_APP_INTRO_MESSAGE}>
                <header className="flex justify-between items-center p-4 gap-4 h-16 ml-14">
                  <div className="text-2xl font-bold">
                    Next Gen Admin Portal
                  </div>
                  <div className="flex gap-4">
                    <SignedOut>
                      <SignInButton />
                      <SignUpButton />
                    </SignedOut>
                    <SignedIn>
                      <UserButton />
                    </SignedIn>
                  </div>
                </header>
                {children}
                <ChatBubble
                  welcomeMessage={env.NEXT_PUBLIC_APP_INTRO_MESSAGE}
                  logo={env.NEXT_PUBLIC_LOGO}
                  logoAlt={env.NEXT_PUBLIC_LOGO_ALT}
                />
              </ChatProvider>
            </SocketProvider>
          </Suspense>
        </body>
      </html>
    </ClerkProvider>
  );
}
