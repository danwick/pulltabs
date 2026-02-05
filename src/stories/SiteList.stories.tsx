import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SiteCard from '../components/SiteCard';
import { ThemeProvider } from '../contexts/ThemeContext';
import { Site } from '../types/site';

// Mock site data
const mockSites: Site[] = [
  {
    site_id: 1,
    site_name: "Jimmy's Bar & Grill",
    organization_name: 'Minneapolis VFW Post 246',
    gambling_manager: 'John Smith',
    street_address: '1234 Main Street',
    city: 'Minneapolis',
    state: 'MN',
    zip_code: '55401',
    full_address: '1234 Main Street, Minneapolis, MN 55401',
    latitude: 44.9778,
    longitude: -93.2650,
    license_number: 'G-12345',
    gambling_types_inferred: 'Pull-Tabs, E-Tabs, Bingo',
    gross_receipts: 500000,
    net_receipts: 75000,
    fiscal_year: '2025',
    is_active: true,
    listing_status: 'unclaimed',
  },
  {
    site_id: 2,
    site_name: "Lucky's Gaming Lounge",
    organization_name: 'St. Paul Eagles Club',
    gambling_manager: 'Jane Doe',
    street_address: '567 Oak Avenue',
    city: 'St. Paul',
    state: 'MN',
    zip_code: '55102',
    full_address: '567 Oak Avenue, St. Paul, MN 55102',
    latitude: 44.9537,
    longitude: -93.0900,
    license_number: 'G-12346',
    gambling_types_inferred: 'Pull-Tabs, E-Tabs',
    gross_receipts: 750000,
    net_receipts: 120000,
    fiscal_year: '2025',
    is_active: true,
    listing_status: 'premium',
    tab_type: 'booth',
    pull_tab_prices: [5, 3, 2, 1],
    etab_system: 'pilot',
  },
  {
    site_id: 3,
    site_name: 'The Corner Pub',
    organization_name: 'Bloomington Lions Club',
    gambling_manager: 'Bob Johnson',
    street_address: '890 Elm Street',
    city: 'Bloomington',
    state: 'MN',
    zip_code: '55420',
    full_address: '890 Elm Street, Bloomington, MN 55420',
    latitude: 44.8408,
    longitude: -93.2983,
    license_number: 'G-12347',
    gambling_types_inferred: 'Pull-Tabs',
    gross_receipts: 250000,
    net_receipts: 35000,
    fiscal_year: '2025',
    is_active: true,
    listing_status: 'standard',
    tab_type: 'behind_bar',
    pull_tab_prices: [2, 1],
  },
  {
    site_id: 4,
    site_name: 'Northside Tavern',
    organization_name: 'North Minneapolis VFW',
    gambling_manager: 'Sarah Williams',
    street_address: '321 North Street',
    city: 'Minneapolis',
    state: 'MN',
    zip_code: '55411',
    full_address: '321 North Street, Minneapolis, MN 55411',
    latitude: 44.9978,
    longitude: -93.2850,
    license_number: 'G-12348',
    gambling_types_inferred: 'Pull-Tabs, Bingo, Raffles',
    gross_receipts: 450000,
    net_receipts: 65000,
    fiscal_year: '2025',
    is_active: true,
    listing_status: 'unclaimed',
  },
];

interface SiteListDemoProps {
  sites?: Site[];
  loading?: boolean;
  empty?: boolean;
  selectedId?: number | null;
  isJackpot?: boolean;
}

function SiteListDemo({
  sites = mockSites,
  loading = false,
  empty = false,
  selectedId = null,
  isJackpot = true,
}: SiteListDemoProps) {
  if (loading) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className={`h-32 rounded-lg ${isJackpot ? 'bg-gray-800' : 'bg-gray-200'}`} />
          </div>
        ))}
      </div>
    );
  }

  if (empty) {
    return (
      <div className={`flex flex-col items-center justify-center h-64 ${isJackpot ? 'text-gray-500' : 'text-gray-500'}`}>
        <p className="text-lg font-medium">No sites found</p>
        <p className="text-sm">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4 overflow-y-auto">
      <p className={`text-sm mb-2 ${isJackpot ? 'text-gray-400' : 'text-gray-500'}`}>
        {sites.length} {sites.length === 1 ? 'location' : 'locations'} found
      </p>
      {sites.map((site) => (
        <SiteCard
          key={site.site_id}
          site={site}
          isSelected={selectedId === site.site_id}
        />
      ))}
    </div>
  );
}

function SiteListShowcase() {
  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-3xl font-bold text-white mb-2">Site List</h1>
      <p className="text-gray-400 mb-8">
        Scrollable list of SiteCard components. Shows in the desktop sidebar.
      </p>

      <div className="space-y-10">
        {/* Default State */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            With Sites
          </h2>
          <div className={`max-h-[500px] overflow-y-auto rounded-lg border border-gray-700 bg-gray-900`}>
            <ThemeProvider>
              <SiteListDemo />
            </ThemeProvider>
          </div>
        </section>

        {/* With Selection */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            With Selection
          </h2>
          <div className={`max-h-[500px] overflow-y-auto rounded-lg border border-gray-700 bg-gray-900`}>
            <ThemeProvider>
              <SiteListDemo selectedId={2} />
            </ThemeProvider>
          </div>
        </section>

        {/* Loading State */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            Loading
          </h2>
          <div className={`max-h-[400px] overflow-y-auto rounded-lg border border-gray-700 bg-gray-900`}>
            <SiteListDemo loading />
          </div>
        </section>

        {/* Empty State */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            Empty
          </h2>
          <div className={`rounded-lg border border-gray-700 bg-gray-900`}>
            <SiteListDemo empty />
          </div>
        </section>
      </div>

      {/* Implementation Notes */}
      <section className="mt-10 bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Implementation Notes</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Uses <code className="text-yellow-400">memo()</code> for performance optimization</li>
          <li>• Auto-scrolls selected card into view</li>
          <li>• Shows loading skeleton with <code className="text-yellow-400">animate-pulse</code></li>
          <li>• Displays count: "X locations found"</li>
          <li>• Spacing: <code className="text-yellow-400">space-y-3 p-4</code></li>
        </ul>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Components/SiteList',
  component: SiteListShowcase,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {};

export const WithSites: Story = {
  render: () => (
    <div className="p-4 max-w-md">
      <ThemeProvider>
        <SiteListDemo />
      </ThemeProvider>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="p-4 max-w-md bg-gray-900">
      <SiteListDemo loading />
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div className="p-4 max-w-md bg-gray-900">
      <SiteListDemo empty />
    </div>
  ),
};

export const WithSelection: Story = {
  render: () => (
    <div className="p-4 max-w-md">
      <ThemeProvider>
        <SiteListDemo selectedId={2} />
      </ThemeProvider>
    </div>
  ),
};
