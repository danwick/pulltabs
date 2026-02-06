import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// RTL auto-cleanup doesn't trigger reliably with dynamic imports — force it
afterEach(() => {
  cleanup();
});

// Mock next/link — renders as simple <a> in jsdom
vi.mock('next/link', async () => {
  const React = await import('react');
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: React.forwardRef(function MockLink(
      { children, href, ...props }: any,
      ref: any
    ) {
      return React.createElement('a', { href, ref, ...props }, children as React.ReactNode);
    }),
  };
});

// Mock next/image — renders as simple <img> in jsdom
vi.mock('next/image', async () => {
  const React = await import('react');
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: function MockImage(props: any) {
      return React.createElement('img', props);
    },
  };
});
