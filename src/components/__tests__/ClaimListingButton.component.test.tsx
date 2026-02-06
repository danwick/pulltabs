import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock next-auth/react
const mockUseSession = vi.fn();
vi.mock('next-auth/react', () => ({
  useSession: () => mockUseSession(),
}));

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, back: vi.fn() }),
}));

// Must import after mocks
const { default: ClaimListingButton } = await import('../ClaimListingButton');

describe('ClaimListingButton', () => {
  it('shows "Sign Up to Claim" when not authenticated', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    render(<ClaimListingButton siteId={1} siteName="Test Bar" />);
    expect(screen.getByText('Sign Up to Claim')).toBeInTheDocument();
  });

  it('shows "Claim This Listing" for authenticated operator', () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: '1', role: 'operator', email: 'user@test.com' } },
      status: 'authenticated',
    });
    render(<ClaimListingButton siteId={1} siteName="Test Bar" />);
    expect(screen.getByText('Claim This Listing')).toBeInTheDocument();
  });

  it('shows "Claim & Edit Now" for super admin', () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: '1', role: 'super_admin', email: 'admin@test.com' } },
      status: 'authenticated',
    });
    render(<ClaimListingButton siteId={1} siteName="Test Bar" />);
    expect(screen.getByText('Claim & Edit Now')).toBeInTheDocument();
  });

  it('shows Loading state while session loading', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'loading' });
    render(<ClaimListingButton siteId={1} siteName="Test Bar" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays site name in the prompt', () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    render(<ClaimListingButton siteId={1} siteName="Lure Lakebar" />);
    expect(screen.getByText(/Lure Lakebar/)).toBeInTheDocument();
  });

  it('shows email when authenticated', () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: '1', role: 'operator', email: 'jay@test.com' } },
      status: 'authenticated',
    });
    render(<ClaimListingButton siteId={1} siteName="Test Bar" />);
    expect(screen.getByText(/jay@test.com/)).toBeInTheDocument();
  });
});
