'use client';

import { useState, useEffect, useRef } from 'react';
import { SlidersHorizontal, X, MapPin, Search } from 'lucide-react';
import { TabType, EtabSystem, PullTabPrice } from '@/types/site';
import { useTheme } from '@/contexts/ThemeContext';
import { FilterState } from './SearchFilters';

interface MobileFilterBarProps {
  onSearch: (filters: FilterState) => void;
  onLocationRequest?: () => void;
  filters: FilterState;
}

const TAB_TYPES: { value: TabType; label: string }[] = [
  { value: 'booth', label: 'Booth' },
  { value: 'behind_bar', label: 'Behind Bar' },
  { value: 'machine', label: 'Machine' },
];

const PULL_TAB_PRICE_OPTIONS: PullTabPrice[] = [5, 4, 3, 2, 1];

const ETAB_SYSTEMS: { value: EtabSystem; label: string }[] = [
  { value: 'pilot', label: 'Pilot' },
  { value: '3_diamonds', label: '3 Diamonds' },
];

const DISTANCES = [5, 10, 25, 50, 100];

export default function MobileFilterBar({ onSearch, onLocationRequest, filters }: MobileFilterBarProps) {
  const { isJackpot } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [search, setSearch] = useState(filters.search);
  const [tabTypes, setTabTypes] = useState<TabType[]>(filters.tabTypes);
  const [pullTabPrices, setPullTabPrices] = useState<PullTabPrice[]>(filters.pullTabPrices);
  const [etabSystem, setEtabSystem] = useState<EtabSystem | ''>(filters.etabSystem);
  const [useLocation, setUseLocation] = useState(filters.useLocation);
  const [distance, setDistance] = useState(filters.distance);
  const [city, setCity] = useState(filters.city);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Count active filters
  const activeFilterCount = [
    tabTypes.length > 0,
    pullTabPrices.length > 0,
    etabSystem,
    useLocation,
  ].filter(Boolean).length;

  // Apply filters
  const applyFilters = () => {
    onSearch({
      search,
      city,
      types: [], // Not using gambling types filter in mobile for now
      useLocation,
      distance,
      tabTypes,
      pullTabPrices,
      etabSystem,
    });
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Apply filters when dropdown closes
  const handleClose = () => {
    setShowDropdown(false);
    applyFilters();
  };

  const handleLocationToggle = () => {
    if (!useLocation) {
      onLocationRequest?.();
    }
    setUseLocation(!useLocation);
  };

  const toggleTabType = (type: TabType) => {
    setTabTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const togglePrice = (price: PullTabPrice) => {
    setPullTabPrices((prev) =>
      prev.includes(price) ? prev.filter((p) => p !== price) : [...prev, price]
    );
  };

  const clearFilters = () => {
    setTabTypes([]);
    setPullTabPrices([]);
    setEtabSystem('');
    setUseLocation(false);
    setCity('');
    setDistance(25);
  };

  // Focus search input when search bar opens
  useEffect(() => {
    if (showSearchBar && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearchBar]);

  // Close search bar when clicking outside
  const handleSearchBlur = () => {
    // Only close if search is empty
    if (!search) {
      setTimeout(() => setShowSearchBar(false), 150);
    }
  };

  return (
    <>
      {/* Search bar - expands when active */}
      <div className="absolute top-3 left-3 right-3 pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] z-20">
        <div className="flex items-center gap-2">
          {/* Filters button - on the left */}
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg text-sm font-semibold transition-colors flex-shrink-0 ${
              showDropdown || activeFilterCount > 0
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

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search button / expanded search bar - on the right */}
          {showSearchBar || search ? (
            <div className={`flex-1 max-w-xs flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg transition-all ${
              isJackpot
                ? 'bg-gray-900 border border-gray-700'
                : 'bg-white border border-gray-200'
            }`}>
              <Search className={`w-5 h-5 flex-shrink-0 ${isJackpot ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search bar name or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onBlur={handleSearchBlur}
                className={`flex-1 bg-transparent text-sm outline-none ${
                  isJackpot
                    ? 'text-white placeholder-gray-500'
                    : 'text-gray-900 placeholder-gray-400'
                }`}
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch('');
                    searchInputRef.current?.focus();
                  }}
                  className={`p-0.5 rounded ${isJackpot ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                  aria-label="Clear search"
                >
                  <X className={`w-4 h-4 ${isJackpot ? 'text-gray-500' : 'text-gray-400'}`} />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowSearchBar(true)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg shadow-lg text-sm font-semibold transition-colors ${
                isJackpot
                  ? 'bg-gray-900 border border-gray-700 text-gray-300'
                  : 'bg-white border border-gray-200 text-gray-700'
              }`}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter dropdown panel */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            role="presentation"
            className="absolute inset-0 z-20 bg-black/30"
            onClick={handleClose}
          />

          {/* Dropdown */}
          <div
            ref={dropdownRef}
            className={`absolute top-14 left-0 right-0 mx-3 z-30 rounded-xl shadow-xl overflow-hidden ${
              isJackpot ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
            }`}
            style={{ marginTop: 'calc(env(safe-area-inset-top) + 1rem)' }}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-4 py-3 border-b ${
              isJackpot ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h3 className={`font-semibold text-balance ${isJackpot ? 'text-white' : 'text-gray-900'}`}>
                Filters
              </h3>
              <div className="flex items-center gap-2">
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className={`text-sm ${isJackpot ? 'text-red-400' : 'text-red-600'}`}
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={handleClose}
                  aria-label="Close filters"
                  className={`p-1 rounded-lg ${isJackpot ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                >
                  <X className={`w-5 h-5 ${isJackpot ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>
              </div>
            </div>

            {/* Filter content - compact layout */}
            <div className="p-3 space-y-3">
              {/* Row 1: Seller Type (multi-select) */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-medium w-20 flex-shrink-0 ${isJackpot ? 'text-gray-400' : 'text-gray-500'}`}>
                  Seller Type
                </span>
                {TAB_TYPES.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => toggleTabType(value)}
                    className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                      tabTypes.includes(value)
                        ? isJackpot
                          ? 'bg-yellow-500 text-gray-900'
                          : 'bg-blue-500 text-white'
                        : isJackpot
                          ? 'bg-gray-800 text-gray-300'
                          : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Row 2: Prices */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-medium w-20 flex-shrink-0 ${isJackpot ? 'text-gray-400' : 'text-gray-500'}`}>
                  Prices
                </span>
                {PULL_TAB_PRICE_OPTIONS.map((price) => (
                  <button
                    key={price}
                    onClick={() => togglePrice(price)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      pullTabPrices.includes(price)
                        ? 'bg-green-500 text-white'
                        : isJackpot
                          ? 'bg-gray-800 text-gray-300'
                          : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <img
                      src={`/icons/filters/pulltab-${price}.svg`}
                      alt=""
                      className="w-4 h-5 object-contain"
                    />
                    ${price}
                  </button>
                ))}
              </div>

              {/* Row 4: E-Tabs */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-medium w-20 flex-shrink-0 ${isJackpot ? 'text-gray-400' : 'text-gray-500'}`}>
                  E-Tabs
                </span>
                {ETAB_SYSTEMS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setEtabSystem(etabSystem === value ? '' : value)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-colors ${
                      etabSystem === value
                        ? 'bg-purple-500 text-white'
                        : isJackpot
                          ? 'bg-gray-800 text-gray-300'
                          : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <img
                      src={`/icons/filters/${value === 'pilot' ? 'pilot-games' : '3-diamonds'}.svg`}
                      alt=""
                      className="w-5 h-5 object-contain"
                    />
                    {label}
                  </button>
                ))}
              </div>

              {/* Row 5: Location */}
              <div className={`flex items-center gap-2 flex-wrap pt-2 border-t ${isJackpot ? 'border-gray-700' : 'border-gray-200'}`}>
                <span className={`text-xs font-medium w-20 flex-shrink-0 ${isJackpot ? 'text-gray-400' : 'text-gray-500'}`}>
                  Location
                </span>
                <button
                  onClick={handleLocationToggle}
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

              {/* Distance selector (when using location) */}
              {useLocation && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-medium w-20 flex-shrink-0 ${isJackpot ? 'text-gray-400' : 'text-gray-500'}`}>
                    Distance
                  </span>
                  {DISTANCES.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDistance(d)}
                      className={`px-2 py-1 rounded-full text-xs transition-colors ${
                        distance === d
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
                onClick={handleClose}
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
        </>
      )}
    </>
  );
}
