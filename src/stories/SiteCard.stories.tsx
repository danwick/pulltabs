import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SiteCard from '../components/SiteCard';
import { ThemeProvider } from '../contexts/ThemeContext';
import { Site } from '../types/site';

// Mock site data
const baseSite: Site = {
  site_id: 1,
  site_name: "Jimmy's Bar & Grill",
  organization_name: 'Minneapolis VFW Post 246',
  gambling_manager: 'John Smith',
  street_address: '1234 Main Street',
  city: 'Minneapolis',
  state: 'MN',
  zip_code: '55401',
  latitude: 44.9778,
  longitude: -93.2650,
  license_number: 'G-12345',
  gambling_types_inferred: 'Pull-Tabs, E-Tabs, Bingo',
  gross_receipts: 500000,
  net_receipts: 75000,
  listing_status: 'unclaimed',
};

const premiumSite: Site = {
  ...baseSite,
  site_id: 2,
  site_name: "Lucky's Gaming Lounge",
  listing_status: 'premium',
  tab_type: 'booth',
  pull_tab_prices: [5, 3, 2, 1],
  etab_system: 'pilot',
  hours: {
    monday: { open: '11:00 AM', close: '1:00 AM' },
    tuesday: { open: '11:00 AM', close: '1:00 AM' },
    wednesday: { open: '11:00 AM', close: '1:00 AM' },
    thursday: { open: '11:00 AM', close: '1:00 AM' },
    friday: { open: '11:00 AM', close: '2:00 AM' },
    saturday: { open: '11:00 AM', close: '2:00 AM' },
    sunday: { open: '12:00 PM', close: '12:00 AM' },
  },
};

const claimedSite: Site = {
  ...baseSite,
  site_id: 3,
  site_name: 'The Corner Pub',
  listing_status: 'standard',
  tab_type: 'behind_bar',
  pull_tab_prices: [2, 1],
};

// Wrapper to provide theme context
function ThemeWrapper({ children, isJackpot = true }: { children: React.ReactNode; isJackpot?: boolean }) {
  return (
    <div className={isJackpot ? 'jackpot-mode' : ''}>
      <div style={{ background: isJackpot ? '#0A0A0A' : '#F9FAFB', padding: '1rem' }}>
        {children}
      </div>
    </div>
  );
}

const meta: Meta<typeof SiteCard> = {
  title: 'Components/SiteCard',
  component: SiteCard,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ maxWidth: '400px' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isSelected: {
      control: 'boolean',
      description: 'Whether the card is selected',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SiteCard>;

export const Unclaimed: Story = {
  args: {
    site: baseSite,
    isSelected: false,
  },
};

export const Premium: Story = {
  args: {
    site: premiumSite,
    isSelected: false,
  },
};

export const Claimed: Story = {
  args: {
    site: claimedSite,
    isSelected: false,
  },
};

export const Selected: Story = {
  args: {
    site: premiumSite,
    isSelected: true,
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4" style={{ maxWidth: '400px' }}>
      <h3 className="text-lg font-semibold text-white mb-2">Unclaimed (GCB data only)</h3>
      <SiteCard site={baseSite} />

      <h3 className="text-lg font-semibold text-white mb-2 mt-6">Claimed (Standard)</h3>
      <SiteCard site={claimedSite} />

      <h3 className="text-lg font-semibold text-white mb-2 mt-6">Premium</h3>
      <SiteCard site={premiumSite} />

      <h3 className="text-lg font-semibold text-white mb-2 mt-6">Selected</h3>
      <SiteCard site={premiumSite} isSelected />
    </div>
  ),
};
