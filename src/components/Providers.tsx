'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/contexts/ThemeContext';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
