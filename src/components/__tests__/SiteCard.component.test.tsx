import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Site } from '@/types/site';

// Mock ThemeContext
vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({ isJackpot: false, toggleTheme: vi.fn() }),
}));

// Must import after mocks
const { default: SiteCard } = await import('../SiteCard');

const baseSite: Site = {
  site_id: 42,
  site_name: 'Test Tavern',
  organization_name: 'Test Org',
  gambling_manager: 'John Doe',
  street_address: '123 Main St',
  city: 'Minneapolis',
  state: 'MN',
  zip_code: '55401',
  full_address: '123 Main St, Minneapolis, MN 55401',
  license_number: '12345',
  gross_receipts: null,
  net_receipts: null,
  fiscal_year: null,
  gambling_types_inferred: 'Pull-Tabs, E-Tabs',
  latitude: 44.98,
  longitude: -93.27,
  listing_status: 'unclaimed',
  is_active: true,
};

describe('SiteCard', () => {
  it('renders site name', () => {
    render(<SiteCard site={baseSite} />);
    expect(screen.getByText('Test Tavern')).toBeInTheDocument();
  });

  it('renders View Details as a link with correct href', () => {
    render(<SiteCard site={baseSite} />);
    const link = screen.getByRole('link', { name: /view details/i });
    expect(link).toHaveAttribute('href', '/site/42');
  });

  it('shows address', () => {
    render(<SiteCard site={baseSite} />);
    expect(screen.getByText(/123 Main St/)).toBeInTheDocument();
  });

  it('shows gambling types when no operator details', () => {
    render(<SiteCard site={baseSite} />);
    expect(screen.getByText('Pull-Tabs')).toBeInTheDocument();
    expect(screen.getByText('E-Tabs')).toBeInTheDocument();
  });

  it('shows tab type badges when operator details present', () => {
    const site: Site = {
      ...baseSite,
      tab_type: ['booth', 'machine'],
    };
    render(<SiteCard site={site} />);
    expect(screen.getByText('Booth')).toBeInTheDocument();
    expect(screen.getByText('Machine')).toBeInTheDocument();
  });

  it('shows pull tab prices', () => {
    const site: Site = {
      ...baseSite,
      tab_type: ['booth'],
      pull_tab_prices: [1, 3, 5],
    };
    render(<SiteCard site={site} />);
    expect(screen.getByText('$1')).toBeInTheDocument();
    expect(screen.getByText('$3')).toBeInTheDocument();
    expect(screen.getByText('$5')).toBeInTheDocument();
  });

  it('shows premium badge for premium listings', () => {
    const site: Site = { ...baseSite, listing_status: 'premium' };
    render(<SiteCard site={site} />);
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('shows "Hours available" when hours exist', () => {
    const site: Site = {
      ...baseSite,
      hours: { monday: { open: '11:00', close: '23:00' } },
    };
    render(<SiteCard site={site} />);
    expect(screen.getByText('Hours available')).toBeInTheDocument();
  });
});
