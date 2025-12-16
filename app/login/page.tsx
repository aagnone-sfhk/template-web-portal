'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// Animated floating orb component
function FloatingOrb({ 
  className, 
  delay = '0s',
  duration = '20s'
}: { 
  className: string; 
  delay?: string;
  duration?: string;
}) {
  return (
    <div 
      className={`absolute rounded-full blur-3xl animate-float ${className}`}
      style={{ 
        animationDelay: delay,
        animationDuration: duration
      }}
    />
  );
}

// Grid pattern overlay
function GridPattern() {
  return (
    <svg 
      className="absolute inset-0 h-full w-full opacity-[0.5]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Main grid */}
        <pattern 
          id="grid" 
          width="40" 
          height="40" 
          patternUnits="userSpaceOnUse"
        >
          <path 
            d="M 40 0 L 0 0 0 40" 
            fill="none" 
            stroke="#cbd5e1"
            strokeWidth="0.5"
          />
        </pattern>
        {/* Dot pattern */}
        <pattern
          id="dots"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1" fill="#94a3b8" />
        </pattern>
        {/* Diagonal lines */}
        <pattern
          id="diagonals"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 0 10 L 10 0"
            stroke="#e2e8f0"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

// Dot pattern overlay
function DotPattern() {
  return (
    <svg 
      className="absolute inset-0 h-full w-full opacity-[0.3]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="dots-large"
          width="30"
          height="30"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="15" cy="15" r="1.5" fill="#94a3b8" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots-large)" />
    </svg>
  );
}

// Cross-hatch pattern
function CrossHatchPattern() {
  return (
    <svg 
      className="absolute inset-0 h-full w-full opacity-[0.08]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="crosshatch"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <path d="M 0 0 L 8 8 M 8 0 L 0 8" stroke="#64748b" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#crosshatch)" />
    </svg>
  );
}

// Concentric circles pattern
function CirclePattern() {
  return (
    <svg 
      className="absolute inset-0 h-full w-full opacity-[0.06]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="circles"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="50" cy="50" r="40" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="10" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circles)" />
    </svg>
  );
}

// Geometric shapes floating in background
function GeometricShapes() {
  return (
    <>
      {/* Hexagon */}
      <div className="absolute top-[15%] left-[10%] w-24 h-24 animate-spin-slow opacity-[0.18]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-400">
          <polygon 
            points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" 
            fill="none" 
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      
      {/* Triangle */}
      <div className="absolute bottom-[20%] right-[15%] w-20 h-20 animate-bounce-slow opacity-[0.15]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-400">
          <polygon 
            points="50,10 90,90 10,90" 
            fill="none" 
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      
      {/* Circle */}
      <div className="absolute top-[60%] left-[5%] w-16 h-16 animate-pulse opacity-[0.15]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-400">
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      
      {/* Square rotated */}
      <div className="absolute top-[25%] right-[8%] w-14 h-14 animate-spin-reverse opacity-[0.12]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-400">
          <rect 
            x="15" 
            y="15" 
            width="70" 
            height="70" 
            fill="none" 
            stroke="currentColor"
            strokeWidth="1.5"
            transform="rotate(45 50 50)"
          />
        </svg>
      </div>

      {/* Diamond */}
      <div className="absolute bottom-[35%] left-[20%] w-12 h-12 animate-float opacity-[0.12]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-400">
          <polygon 
            points="50,5 95,50 50,95 5,50" 
            fill="none" 
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Additional shapes for more density */}
      
      {/* Large hexagon top right */}
      <div className="absolute top-[5%] right-[20%] w-32 h-32 animate-spin-slow opacity-[0.08]" style={{ animationDuration: '40s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-400">
          <polygon 
            points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" 
            fill="none" 
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Small triangle bottom left */}
      <div className="absolute bottom-[10%] left-[8%] w-10 h-10 animate-bounce-slow opacity-[0.15]" style={{ animationDelay: '1s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-400">
          <polygon 
            points="50,10 90,90 10,90" 
            fill="none" 
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Double circle center left */}
      <div className="absolute top-[45%] left-[12%] w-20 h-20 animate-pulse opacity-[0.1]" style={{ animationDelay: '0.5s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-400">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      {/* Pentagon top center */}
      <div className="absolute top-[8%] left-[40%] w-16 h-16 animate-spin-reverse opacity-[0.1]" style={{ animationDuration: '35s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-400">
          <polygon 
            points="50,5 97,35 80,92 20,92 3,35" 
            fill="none" 
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Octagon bottom right */}
      <div className="absolute bottom-[12%] right-[25%] w-18 h-18 animate-spin-slow opacity-[0.1]" style={{ animationDuration: '45s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-400">
          <polygon 
            points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" 
            fill="none" 
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Star shape center right */}
      <div className="absolute top-[35%] right-[3%] w-14 h-14 animate-float opacity-[0.12]" style={{ animationDelay: '3s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-400">
          <polygon 
            points="50,5 61,40 98,40 68,62 79,97 50,75 21,97 32,62 2,40 39,40" 
            fill="none" 
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Cross shape bottom center */}
      <div className="absolute bottom-[25%] left-[45%] w-12 h-12 animate-spin-slow opacity-[0.1]" style={{ animationDuration: '50s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-400">
          <path 
            d="M 40,10 L 60,10 L 60,40 L 90,40 L 90,60 L 60,60 L 60,90 L 40,90 L 40,60 L 10,60 L 10,40 L 40,40 Z" 
            fill="none" 
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Small squares scattered */}
      <div className="absolute top-[70%] right-[10%] w-8 h-8 animate-bounce-slow opacity-[0.15]" style={{ animationDelay: '2s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-400">
          <rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="absolute top-[18%] left-[35%] w-6 h-6 animate-float opacity-[0.12]" style={{ animationDelay: '1.5s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-400">
          <rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="2" transform="rotate(45 50 50)" />
        </svg>
      </div>

      {/* Concentric triangles */}
      <div className="absolute top-[50%] right-[18%] w-16 h-16 animate-pulse opacity-[0.08]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-400">
          <polygon points="50,10 90,85 10,85" fill="none" stroke="currentColor" strokeWidth="1" />
          <polygon points="50,25 75,75 25,75" fill="none" stroke="currentColor" strokeWidth="1" />
          <polygon points="50,40 60,65 40,65" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      {/* Spiral */}
      <div className="absolute bottom-[45%] left-[3%] w-20 h-20 animate-spin-slow opacity-[0.08]" style={{ animationDuration: '60s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-400">
          <path 
            d="M 50,50 m 0,-40 a 40,40 0 1,1 -0.1,0 M 50,50 m 0,-30 a 30,30 0 1,1 -0.1,0 M 50,50 m 0,-20 a 20,20 0 1,1 -0.1,0 M 50,50 m 0,-10 a 10,10 0 1,1 -0.1,0"
            fill="none" 
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </div>
    </>
  );
}

// Animated lines/rays
function LightRays() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-30">
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-slate-300 to-transparent animate-shimmer" style={{ animationDelay: '0s' }} />
      <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-slate-200 to-transparent animate-shimmer" style={{ animationDelay: '1s' }} />
      <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-slate-300 to-transparent animate-shimmer" style={{ animationDelay: '2s' }} />
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push('/');
      router.refresh();
    } else {
      setError('Invalid username or password');
    }
    setLoading(false);
  }

  return (
    <div className="relative min-h-screen flex justify-center items-start md:items-center p-8 overflow-hidden bg-background">
      {/* Base gradient background - subtle warm white */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
      
      {/* Soft radial overlays */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-100 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-slate-200 via-transparent to-transparent" />
      </div>

      {/* Floating orbs - subtle grays */}
      <FloatingOrb 
        className="w-[500px] h-[500px] -top-48 -left-48 bg-slate-200/40" 
        delay="0s"
        duration="25s"
      />
      <FloatingOrb 
        className="w-[400px] h-[400px] top-1/3 -right-32 bg-slate-100/50" 
        delay="5s"
        duration="30s"
      />
      <FloatingOrb 
        className="w-[350px] h-[350px] -bottom-24 left-1/4 bg-slate-200/30" 
        delay="10s"
        duration="22s"
      />

      {/* Pattern layers */}
      <div className="fixed inset-0">
        <GridPattern />
      </div>
      <div className="fixed inset-0">
        <DotPattern />
      </div>
      <div className="fixed inset-0">
        <CirclePattern />
      </div>
      <div className="fixed inset-0">
        <CrossHatchPattern />
      </div>

      {/* Geometric shapes */}
      <GeometricShapes />

      {/* Light rays */}
      <LightRays />

      {/* Noise texture overlay */}
      <div 
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Login card */}
      <Card className="relative w-full max-w-sm bg-card border-border shadow-xl shadow-slate-200/50">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
            Login
          </CardTitle>
          <CardDescription>
            Enter your credentials to access the portal.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
              />
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </CardContent>
          
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
