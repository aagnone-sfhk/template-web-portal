import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { env } from './config/env';
import ChatBubble from './chat/ChatBubble';
import { ChatProvider } from './chat/ChatContext';
import { SocketProvider } from './chat/SocketContext';
import { Suspense } from 'react';
import { Header } from './Header';

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
    'A demo partner portal configured with Heroku, Next.js, Postgres, Tailwind CSS, TypeScript, and Prettier.'
};

function HeaderFallback() {
  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 ml-14">
      <div className="text-2xl font-bold">{env.NEXT_PUBLIC_APP_TITLE}</div>
      <div className="flex gap-4 items-center">
        <div className="w-16 h-8 rounded bg-gray-200 animate-pulse" />
      </div>
    </header>
  );
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <SocketProvider sessionId="portal">
            <ChatProvider welcomeMessage={env.NEXT_PUBLIC_APP_INTRO_MESSAGE}>
              <Suspense fallback={<HeaderFallback />}>
                <Header />
              </Suspense>
              {children}
              <ChatBubble
                welcomeMessage={env.NEXT_PUBLIC_APP_INTRO_MESSAGE}
              />
            </ChatProvider>
          </SocketProvider>
        </Suspense>
      </body>
    </html>
  );
}
