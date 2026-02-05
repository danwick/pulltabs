import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SlidersHorizontal, X, MapPin } from 'lucide-react';

interface MobileFilterDemoProps {
  isJackpot?: boolean;
  activeFilterCount?: number;
  isOpen?: boolean;
  useLocation?: boolean;
  selectedTabTypes?: string[];
  selectedPrices?: number[];
  selectedEtab?: string;
}

function FilterButton({ isJackpot = true, activeFilterCount = 0, isOpen = false }: MobileFilterDemoProps) {
  return (
    <button
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg text-sm font-semibold transition-colors ${
        isOpen || activeFilterCount > 0
          ? isJackpot
            ? 'bg-yellow-500 text-gray-900'
            : 'bg-blue-500 text-white'
          : isJackpot
            ? 'bg-gray-900 border border-gray-700 text-gray-300'
            : 'bg-white border border-gray-200 text-gray-700'
      }`}
    >
      <SlidersHorizontal className="w-5 h-5" />
      <span>Filters</span>
      {activeFilterCount > 0 && (
        <span className={`ml-1 px-1.5 py-0.5 rounded text-xs ${
          isJackpot ? 'bg-gray-900/50 text-yellow-300' : 'bg-blue-600 text-white'
        }`}>
          {activeFilterCount}
        </span>
      )}
    </button>
  );
}

function FilterDropdown({
  isJackpot = true,
  useLocation = false,
  selectedTabTypes = [],
  selectedPrices = [],
  selectedEtab = '',
}: MobileFilterDemoProps) {
  const activeFilterCount = [
    selectedTabTypes.length > 0,
    selectedPrices.length > 0,
    selectedEtab,
    useLocation,
  ].filter(Boolean).length;

  return (
    <div
      className={`rounded-xl shadow-xl overflow-hidden ${
        isJackpot ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${
        isJackpot ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <h3 className={`font-semibold ${isJackpot ? 'text-white' : 'text-gray-900'}`}>
          Filters
        </h3>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button className={`text-sm ${isJackpot ? 'text-red-400' : 'text-red-600'}`}>
              Clear all
            </button>
          )}
          <button
            aria-label="Close filters"
            className={`p-1 rounded-lg ${isJackpot ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <X className={`w-5 h-5 ${isJackpot ? 'text-gray-400' : 'text-gray-500'}`} />
          </button>
        </div>
      </div>

      {/* Filter content */}
      <div className="p-3 space-y-3">
        {/* Seller Type */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-medium w-20 flex-shrink-0 ${isJackpot ? 'text-gray-400' : 'text-gray-500'}`}>
            Seller Type
          </span>
          {['Booth', 'Behind Bar', 'Machine'].map((type) => (
            <button
              key={type}
              className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                selectedTabTypes.includes(type)
                  ? isJackpot
                    ? 'bg-yellow-500 text-gray-900'
                    : 'bg-blue-500 text-white'
                  : isJackpot
                    ? 'bg-gray-800 text-gray-300'
                    : 'bg-gray-100 text-gray-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Prices */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-medium w-20 flex-shrink-0 ${isJackpot ? 'text-gray-400' : 'text-gray-500'}`}>
            Prices
          </span>
          {[5, 4, 3, 2, 1].map((price) => (
            <button
              key={price}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedPrices.includes(price)
                  ? 'bg-green-500 text-white'
                  : isJackpot
                    ? 'bg-gray-800 text-gray-300'
                    : 'bg-gray-100 text-gray-700'
              }`}
            >
              ${price}
            </button>
          ))}
        </div>

        {/* E-Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-medium w-20 flex-shrink-0 ${isJackpot ? 'text-gray-400' : 'text-gray-500'}`}>
            E-Tabs
          </span>
          {['Pilot', '3 Diamonds'].map((system) => (
            <button
              key={system}
              className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                selectedEtab === system
                  ? 'bg-purple-500 text-white'
                  : isJackpot
                    ? 'bg-gray-800 text-gray-300'
                    : 'bg-gray-100 text-gray-700'
              }`}
            >
              {system}
            </button>
          ))}
        </div>

        {/* Location */}
        <div className={`flex items-center gap-2 flex-wrap pt-2 border-t ${isJackpot ? 'border-gray-700' : 'border-gray-200'}`}>
          <span className={`text-xs font-medium w-20 flex-shrink-0 ${isJackpot ? 'text-gray-400' : 'text-gray-500'}`}>
            Location
          </span>
          <button
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-colors ${
              useLocation
                ? isJackpot
                  ? 'bg-yellow-500 text-gray-900'
                  : 'bg-blue-500 text-white'
                : isJackpot
                  ? 'bg-gray-800 text-gray-300'
                  : 'bg-gray-100 text-gray-700'
            }`}
          >
            <MapPin className="w-3 h-3" />
            Near Me
          </button>
        </div>

        {/* Distance (when location is active) */}
        {useLocation && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-medium w-20 flex-shrink-0 ${isJackpot ? 'text-gray-400' : 'text-gray-500'}`}>
              Distance
            </span>
            {[5, 10, 25, 50, 100].map((d) => (
              <button
                key={d}
                className={`px-2 py-1 rounded-full text-xs transition-colors ${
                  d === 25
                    ? isJackpot
                      ? 'bg-yellow-500 text-gray-900'
                      : 'bg-blue-500 text-white'
                    : isJackpot
                      ? 'bg-gray-800 text-gray-300'
                      : 'bg-gray-100 text-gray-700'
                }`}
              >
                {d}mi
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Apply button */}
      <div className={`px-4 py-3 border-t ${isJackpot ? 'border-gray-700' : 'border-gray-200'}`}>
        <button
          className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
            isJackpot
              ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Show Results
        </button>
      </div>
    </div>
  );
}

function MobileFilterShowcase() {
  return (
    <div className="p-6 max-w-md">
      <h1 className="text-3xl font-bold text-white mb-2">Mobile Filter Bar</h1>
      <p className="text-gray-400 mb-8">
        Floating filter button and dropdown panel for mobile map view.
      </p>

      <div className="space-y-10">
        {/* Button States */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            Button States
          </h2>
          <div className="space-y-4 bg-gray-800/50 p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <FilterButton isJackpot={true} activeFilterCount={0} />
              <span className="text-sm text-gray-400">No filters active</span>
            </div>
            <div className="flex items-center gap-4">
              <FilterButton isJackpot={true} activeFilterCount={2} />
              <span className="text-sm text-gray-400">2 filters active</span>
            </div>
            <div className="flex items-center gap-4">
              <FilterButton isJackpot={true} activeFilterCount={0} isOpen={true} />
              <span className="text-sm text-gray-400">Dropdown open</span>
            </div>
          </div>
        </section>

        {/* Light Mode Buttons */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            Button States (Light Mode)
          </h2>
          <div className="space-y-4 bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <FilterButton isJackpot={false} activeFilterCount={0} />
              <span className="text-sm text-gray-600">No filters active</span>
            </div>
            <div className="flex items-center gap-4">
              <FilterButton isJackpot={false} activeFilterCount={3} />
              <span className="text-sm text-gray-600">3 filters active</span>
            </div>
          </div>
        </section>

        {/* Dropdown - No Filters */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            Dropdown (No Filters)
          </h2>
          <FilterDropdown isJackpot={true} />
        </section>

        {/* Dropdown - With Filters */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            Dropdown (With Filters)
          </h2>
          <FilterDropdown
            isJackpot={true}
            selectedTabTypes={['Booth']}
            selectedPrices={[5, 3]}
            selectedEtab="Pilot"
          />
        </section>

        {/* Dropdown - With Location */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            Dropdown (With Location)
          </h2>
          <FilterDropdown
            isJackpot={true}
            useLocation={true}
          />
        </section>

        {/* Dropdown - Light Mode */}
        <section>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
            Dropdown (Light Mode)
          </h2>
          <FilterDropdown
            isJackpot={false}
            selectedTabTypes={['Behind Bar']}
            selectedPrices={[2, 1]}
          />
        </section>
      </div>

      {/* Implementation Notes */}
      <section className="mt-10 bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Implementation Notes</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Button positioned absolute: <code className="text-yellow-400">top-3 left-3</code> over map</li>
          <li>• Uses safe area padding: <code className="text-yellow-400">pt-[env(safe-area-inset-top)]</code></li>
          <li>• Backdrop uses <code className="text-yellow-400">role="presentation"</code></li>
          <li>• Close button has <code className="text-yellow-400">aria-label="Close filters"</code></li>
          <li>• Filters apply on dropdown close (not on each selection)</li>
          <li>• Badge shows count of active filter categories</li>
        </ul>
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Components/MobileFilterBar',
  component: MobileFilterShowcase,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {};

export const ButtonDefault: Story = {
  render: () => (
    <div className="p-6">
      <FilterButton isJackpot={true} activeFilterCount={0} />
    </div>
  ),
};

export const ButtonWithFilters: Story = {
  render: () => (
    <div className="p-6">
      <FilterButton isJackpot={true} activeFilterCount={3} />
    </div>
  ),
};

export const DropdownDefault: Story = {
  render: () => (
    <div className="p-6 max-w-sm">
      <FilterDropdown isJackpot={true} />
    </div>
  ),
};

export const DropdownWithFilters: Story = {
  render: () => (
    <div className="p-6 max-w-sm">
      <FilterDropdown
        isJackpot={true}
        selectedTabTypes={['Booth', 'Machine']}
        selectedPrices={[5, 3, 1]}
        selectedEtab="Pilot"
        useLocation={true}
      />
    </div>
  ),
};

export const LightMode: Story = {
  render: () => (
    <div className="p-6 max-w-sm bg-gray-100">
      <div className="mb-4">
        <FilterButton isJackpot={false} activeFilterCount={2} />
      </div>
      <FilterDropdown
        isJackpot={false}
        selectedTabTypes={['Booth']}
        selectedPrices={[5]}
      />
    </div>
  ),
};
