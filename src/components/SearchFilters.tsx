'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ChevronDown, X } from 'lucide-react';
import { TabType, EtabSystem, PullTabPrice } from '@/types/site';
import { useTheme } from '@/contexts/ThemeContext';

interface SearchFiltersProps {
  onSearch: (filters: FilterState) => void;
  onLocationRequest?: () => void;
}

export interface FilterState {
  search: string;
  city: string;
  types: string[];
  useLocation: boolean;
  distance: number;
  tabTypes: TabType[]; // Changed to array for multi-select
  pullTabPrices: PullTabPrice[];
  etabSystem: EtabSystem | '';
}

const DISTANCES = [5, 10, 25, 50, 100];

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

export default function SearchFilters({ onSearch, onLocationRequest }: SearchFiltersProps) {
  const { isJackpot } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [useLocation, setUseLocation] = useState(false);
  const [distance, setDistance] = useState(25);

  // Primary filters (always visible)
  const [tabTypes, setTabTypes] = useState<TabType[]>([]); // Changed to array for multi-select
  const [pullTabPrices, setPullTabPrices] = useState<PullTabPrice[]>([]);
  const [etabSystem, setEtabSystem] = useState<EtabSystem | ''>('');

  // Dropdown states
  const [showTabTypeDropdown, setShowTabTypeDropdown] = useState(false);
  const [showPricesDropdown, setShowPricesDropdown] = useState(false);
  const [showEtabDropdown, setShowEtabDropdown] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch({
        search,
        city,
        types: selectedTypes,
        useLocation,
        distance,
        tabTypes,
        pullTabPrices,
        etabSystem,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [search, city, selectedTypes, useLocation, distance, tabTypes, pullTabPrices, etabSystem, onSearch]);

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

  const handleLocationToggle = () => {
    if (!useLocation) {
      onLocationRequest?.();
    }
    setUseLocation(!useLocation);
  };

  const clearFilters = () => {
    setSearch('');
    setCity('');
    setSelectedTypes([]);
    setUseLocation(false);
    setDistance(25);
    setTabTypes([]);
    setPullTabPrices([]);
    setEtabSystem('');
  };

  const hasActiveFilters = search || city || selectedTypes.length > 0 || useLocation || tabTypes.length > 0 || pullTabPrices.length > 0 || etabSystem;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Only close if click is outside the filter container
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowTabTypeDropdown(false);
        setShowPricesDropdown(false);
        setShowEtabDropdown(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`border-b transition-colors ${
        isJackpot ? 'border-gray-800' : 'border-gray-200'
      }`}
      style={{ background: 'var(--theme-surface)' }}
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors ${
              isJackpot
                ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>
      </div>

      {/* Primary Filters - Always Visible */}
      <div className="px-4 pb-3 space-y-2">
        {/* Row 1: Seller Type Dropdown (multi-select) */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => {
              setShowTabTypeDropdown(!showTabTypeDropdown);
              setShowPricesDropdown(false);
              setShowEtabDropdown(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg text-sm transition-colors ${
              tabTypes.length > 0
                ? isJackpot
                  ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400'
                  : 'border-blue-500 bg-blue-50 text-blue-700'
                : isJackpot
                  ? 'border-gray-700 text-gray-300 hover:border-gray-600'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            <span>
              {tabTypes.length > 0
                ? `Seller Type: ${tabTypes.map(t => TAB_TYPES.find(tab => tab.value === t)?.label).join(', ')}`
                : 'Seller Type (Booth / Bar / Machine)'
              }
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showTabTypeDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showTabTypeDropdown && (
            <div className={`absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-lg z-20 p-3 ${
              isJackpot ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <p className={`text-xs mb-2 ${isJackpot ? 'text-gray-400' : 'text-gray-500'}`}>Select seller types:</p>
              <div className="flex flex-wrap gap-2">
                {TAB_TYPES.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => toggleTabType(value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      tabTypes.includes(value)
                        ? isJackpot
                          ? 'bg-yellow-500 text-gray-900'
                          : 'bg-blue-500 text-white'
                        : isJackpot
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {tabTypes.length > 0 && (
                <button
                  onClick={() => setTabTypes([])}
                  className={`mt-2 text-xs ${isJackpot ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Clear selection
                </button>
              )}
            </div>
          )}
        </div>

        {/* Row 2: Pull-Tab Prices */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => {
              setShowPricesDropdown(!showPricesDropdown);
              setShowTabTypeDropdown(false);
              setShowEtabDropdown(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg text-sm transition-colors ${
              pullTabPrices.length > 0
                ? isJackpot
                  ? 'border-green-500 bg-green-500/20 text-green-400'
                  : 'border-green-500 bg-green-50 text-green-700'
                : isJackpot
                  ? 'border-gray-700 text-gray-300 hover:border-gray-600'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            <span>
              {pullTabPrices.length > 0
                ? `Pull-Tabs: ${pullTabPrices.sort((a,b) => b-a).map(p => `$${p}`).join(', ')}`
                : 'Pull-Tab Prices ($5, $4, $3, $2, $1)'
              }
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showPricesDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showPricesDropdown && (
            <div className={`absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-lg z-20 p-3 ${
              isJackpot ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <p className={`text-xs mb-2 ${isJackpot ? 'text-gray-400' : 'text-gray-500'}`}>Select price points:</p>
              <div className="flex flex-wrap gap-2">
                {PULL_TAB_PRICE_OPTIONS.map((price) => (
                  <button
                    key={price}
                    onClick={() => togglePrice(price)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pullTabPrices.includes(price)
                        ? 'bg-green-500 text-white'
                        : isJackpot
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ${price}
                  </button>
                ))}
              </div>
              {pullTabPrices.length > 0 && (
                <button
                  onClick={() => setPullTabPrices([])}
                  className={`mt-2 text-xs ${isJackpot ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Clear selection
                </button>
              )}
            </div>
          )}
        </div>

        {/* Row 3: E-Tabs */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => {
              setShowEtabDropdown(!showEtabDropdown);
              setShowTabTypeDropdown(false);
              setShowPricesDropdown(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg text-sm transition-colors ${
              etabSystem
                ? isJackpot
                  ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                  : 'border-purple-500 bg-purple-50 text-purple-700'
                : isJackpot
                  ? 'border-gray-700 text-gray-300 hover:border-gray-600'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            <span>{etabSystem ? `E-Tabs: ${ETAB_SYSTEMS.find(e => e.value === etabSystem)?.label}` : 'E-Tabs (Pilot / 3 Diamonds)'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showEtabDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showEtabDropdown && (
            <div className={`absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-lg z-20 ${
              isJackpot ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <button
                onClick={() => { setEtabSystem(''); setShowEtabDropdown(false); }}
                className={`w-full text-left px-3 py-2 text-sm ${
                  !etabSystem
                    ? isJackpot ? 'bg-gray-800 font-medium text-white' : 'bg-gray-100 font-medium'
                    : isJackpot ? 'text-gray-300 hover:bg-gray-800' : 'hover:bg-gray-50'
                }`}
              >
                All E-Tab Systems
              </button>
              {ETAB_SYSTEMS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => { setEtabSystem(value); setShowEtabDropdown(false); }}
                  className={`w-full text-left px-3 py-2 text-sm ${
                    etabSystem === value
                      ? isJackpot ? 'bg-purple-500/20 text-purple-400 font-medium' : 'bg-purple-50 text-purple-700 font-medium'
                      : isJackpot ? 'text-gray-300 hover:bg-gray-800' : 'hover:bg-gray-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Secondary Actions */}
      <div className={`px-4 pb-3 flex items-center gap-2 border-t pt-3 ${
        isJackpot ? 'border-gray-800' : 'border-gray-200'
      }`}>
        <button
          onClick={handleLocationToggle}
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

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
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

      {/* Distance slider (only if using location) */}
      {useLocation && (
        <div className={`px-4 pb-3 border-t pt-3 ${isJackpot ? 'border-gray-800' : 'border-gray-200'}`}>
          <label className={`block text-sm mb-2 ${isJackpot ? 'text-gray-400' : 'text-gray-600'}`}>
            Distance: {distance} miles
          </label>
          <div className="flex gap-2">
            {DISTANCES.map((d) => (
              <button
                key={d}
                onClick={() => setDistance(d)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  distance === d
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
