import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock next/navigation
const mockBack = vi.fn();
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: mockBack, push: mockPush }),
}));

// Must import after mocks
const { default: BackButton } = await import('../BackButton');

describe('BackButton', () => {
  it('renders as a link with href="/"', () => {
    render(<BackButton />);
    const link = screen.getByRole('link', { name: /back to map/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('contains visible text "Back to Map"', () => {
    render(<BackButton />);
    expect(screen.getByText('Back to Map')).toBeInTheDocument();
  });
});
