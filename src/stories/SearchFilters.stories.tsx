import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Search, MapPin, ChevronDown, X } from 'lucide-react';

interface FilterDemoProps {
  isJackpot?: boolean;
  hasFilters?: boolean;
  useLocation?: boolean;
  selectedTabTypes?: string[];
  selectedPrices?: number[];
  selectedEtab?: string;
}

function FilterDemo({
  isJackpot = true,
  hasFilters = false,
  useLocation = false,
  selectedTabTypes = [],
  selectedPrices = [],
  selectedEtab = '',
}: FilterDemoProps) {
  return (
    <div
      className={`border-b transition-colors ${
        isJackpot ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
      }`}
    >
      {/* Search Bar */}
      <div className="p-4 pb-2">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
            isJackpot ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder="Search by name or city..."
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors ${
              isJackpot
                ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>
      </div>

      {/* Primary Filters */}
      <div className="px-4 pb-3 space-y-2">
        {/* Seller Type */}
        <button
          className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg text-sm transition-colors ${
            selectedTabTypes.length > 0
              ? isJackpot
                ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400'
                : 'border-blue-500 bg-blue-50 text-blue-700'
              : isJackpot
                ? 'border-gray-700 text-gray-300 hover:border-gray-600'
                : 'border-gray-300 text-gray-700 hover:border-gray-400'
          }`}
        >
          <span>
            {selectedTabTypes.length > 0
              ? `Seller Type: ${selectedTabTypes.join(', ')}`
              : 'Seller Type (Booth / Bar / Machine)'
            }
          </span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {/* Prices */}
        <button
          className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg text-sm transition-colors ${
            selectedPrices.length > 0
              ? isJackpot
                ? 'border-green-500 bg-green-500/20 text-green-400'
                : 'border-green-500 bg-green-50 text-green-700'
              : isJackpot
                ? 'border-gray-700 text-gray-300 hover:border-gray-600'
                : 'border-gray-300 text-gray-700 hover:border-gray-400'
          }`}
        >
          <span>
            {selectedPrices.length > 0
              ? `Pull-Tabs: ${selectedPrices.map(p => `$${p}`).join(', ')}`
              : 'Pull-Tab Prices ($5, $4, $3, $2, $1)'
            }
          </span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {/* E-Tabs */}
        <button
          className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg text-sm transition-colors ${
            selectedEtab
              ? isJackpot
                ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                : 'border-purple-500 bg-purple-50 text-purple-700'
              : isJackpot
                ? 'border-gray-700 text-gray-300 hover:border-gray-600'
                : 'border-gray-300 text-gray-700 hover:border-gray-400'
          }`}
        >
          <span>{selectedEtab ? `E-Tabs: ${selectedEtab}` : 'E-Tabs (Pilot / 3 Diamonds)'}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Secondary Actions */}
      <div className={`px-4 pb-3 flex items-center gap-2 border-t pt-3 ${
        isJackpot ? 'border-gray-800' : 'border-gray-200'
      }`}>
        <button
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors ${
            useLocation
              ? isJackpot
                ? 'bg-yellow-500 text-gray-900'
                : 'bg-blue-500 text-white'
              : isJackpot
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Near Me
        </button>

        {hasFilters && (
          <button
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors ${
              isJackpot
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Distance (when using location) */}
      {useLocation && (
        <div className={`px-4 pb-3 border-t pt-3 ${isJackpot ? 'border-gray-800' : 'border-gray-200'}`}>
          <label className={`block text-sm mb-2 ${isJackpot ? 'text-gray-400' : 'text-gray-600'}`}>
            Distance: 25 miles
          </label>
          <div className="flex gap-2">
            {[5, 10, 25, 50, 100].map((d) => (
              <button
                key={d}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  d === 25
                    ? isJackpot
                      ? 'bg-yellow-500 text-gray-900'
                      : 'bg-blue-500 text-white'
                    : isJackpot
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {d} mi
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SearchFiltersShowcase() {
  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-3xl font-bold text-white mb-2">Search Filters</h1>
      <p className="text-gray-400 mb-8">
        Desktop filter sidebar component. Appears in the left panel on desktop views.
      </p>

      <div className="space-y-10">
        {/* Default State - No Filters */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            Default (No Filters)
          </h2>
          <div className="rounded-lg overflow-hidden border border-gray-700">
            <FilterDemo isJackpot={true} />
          </div>
        </section>

        {/* With Active Filters */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            With Active Filters
          </h2>
          <div className="rounded-lg overflow-hidden border border-gray-700">
            <FilterDemo
              isJackpot={true}
              hasFilters={true}
              selectedTabTypes={['Booth', 'Behind Bar']}
              selectedPrices={[5, 3]}
              selectedEtab="Pilot"
            />
          </div>
        </section>

        {/* With Location Active */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            With "Near Me" Active
          </h2>
          <div className="rounded-lg overflow-hidden border border-gray-700">
            <FilterDemo
              isJackpot={true}
              hasFilters={true}
              useLocation={true}
            />
          </div>
        </section>

        {/* Default Mode */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            Default Mode (Light)
          </h2>
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <FilterDemo
              isJackpot={false}
              hasFilters={true}
              selectedTabTypes={['Booth']}
              selectedPrices={[5, 3, 1]}
            />
          </div>
        </section>
      </div>

      {/* Dropdown Expanded Example */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
          Dropdown Expanded (Seller Type)
        </h2>
        <div className="rounded-lg overflow-hidden border border-gray-700 bg-gray-900 p-4">
          <div className="relative">
            <button
              className="w-full flex items-center justify-between px-3 py-2 border border-yellow-500 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm"
            >
              <span>Seller Type: Booth</span>
              <ChevronDown className="w-4 h-4 rotate-180" />
            </button>
            <div className="absolute top-full left-0 right-0 mt-1 border border-gray-700 rounded-lg shadow-lg z-20 p-3 bg-gray-900">
              <p className="text-xs mb-2 text-gray-400">Select seller types:</p>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 rounded-lg text-sm font-medium bg-yellow-500 text-gray-900">
                  Booth
                </button>
                <button className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 text-gray-300 hover:bg-gray-700">
                  Behind Bar
                </button>
                <button className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 text-gray-300 hover:bg-gray-700">
                  Machine
                </button>
              </div>
              <button className="mt-2 text-xs text-gray-400 hover:text-gray-300">
                Clear selection
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Notes */}
      <section className="mt-10 bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Implementation Notes</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Search is debounced (300ms) before triggering filter update</li>
          <li>• Seller Type and Prices are multi-select (array values)</li>
          <li>• E-Tabs is single-select</li>
          <li>• "Near Me" triggers browser geolocation request</li>
          <li>• Dropdowns close when clicking outside the filter container</li>
          <li>• All filters controlled via <code className="text-yellow-400">FilterState</code> interface</li>
        </ul>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Components/SearchFilters',
  component: SearchFiltersShowcase,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {};

export const Default: Story = {
  render: () => (
    <div className="p-4 max-w-sm">
      <FilterDemo isJackpot={true} />
    </div>
  ),
};

export const WithFilters: Story = {
  render: () => (
    <div className="p-4 max-w-sm">
      <FilterDemo
        isJackpot={true}
        hasFilters={true}
        selectedTabTypes={['Booth', 'Behind Bar']}
        selectedPrices={[5, 3]}
        selectedEtab="Pilot"
      />
    </div>
  ),
};

export const WithLocation: Story = {
  render: () => (
    <div className="p-4 max-w-sm">
      <FilterDemo
        isJackpot={true}
        hasFilters={true}
        useLocation={true}
      />
    </div>
  ),
};

export const LightMode: Story = {
  render: () => (
    <div className="p-4 max-w-sm">
      <FilterDemo isJackpot={false} />
    </div>
  ),
};
