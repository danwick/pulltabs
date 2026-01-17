'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ChevronDown, X } from 'lucide-react';
import { TabType, EtabSystem, PullTabPrice } from '@/types/site';

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
  tabType: TabType | '';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [useLocation, setUseLocation] = useState(false);
  const [distance, setDistance] = useState(25);
  const [cities, setCities] = useState<string[]>([]);

  // Primary filters (always visible)
  const [tabType, setTabType] = useState<TabType | ''>('');
  const [pullTabPrices, setPullTabPrices] = useState<PullTabPrice[]>([]);
  const [etabSystem, setEtabSystem] = useState<EtabSystem | ''>('');

  // Dropdown states
  const [showTabTypeDropdown, setShowTabTypeDropdown] = useState(false);
  const [showPricesDropdown, setShowPricesDropdown] = useState(false);
  const [showEtabDropdown, setShowEtabDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const cityInputRef = useRef<HTMLInputElement>(null);

  // Fetch cities for dropdown
  useEffect(() => {
    fetch('/api/cities')
      .then((res) => res.json())
      .then((data) => setCities(data.cities || []))
      .catch(console.error);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch({
        search,
        city,
        types: selectedTypes,
        useLocation,
        distance,
        tabType,
        pullTabPrices,
        etabSystem,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [search, city, selectedTypes, useLocation, distance, tabType, pullTabPrices, etabSystem, onSearch]);

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
    setTabType('');
    setPullTabPrices([]);
    setEtabSystem('');
  };

  const hasActiveFilters = search || city || selectedTypes.length > 0 || useLocation || tabType || pullTabPrices.length > 0 || etabSystem;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Only close if click is outside the filter container
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowTabTypeDropdown(false);
        setShowPricesDropdown(false);
        setShowEtabDropdown(false);
        setShowCityDropdown(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div ref={containerRef} className="bg-white border-b">
      {/* Search Bar */}
      <div className="p-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Primary Filters - Always Visible */}
      <div className="px-4 pb-3 space-y-2">
        {/* Row 1: Tab Type Dropdown */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => {
              setShowTabTypeDropdown(!showTabTypeDropdown);
              setShowPricesDropdown(false);
              setShowEtabDropdown(false);
              setShowCityDropdown(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg text-sm ${
              tabType ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-700'
            }`}
          >
            <span>{tabType ? TAB_TYPES.find(t => t.value === tabType)?.label : 'Where to Buy (Booth / Bar / Machine)'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showTabTypeDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showTabTypeDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              <button
                onClick={() => { setTabType(''); setShowTabTypeDropdown(false); }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${!tabType ? 'bg-gray-100 font-medium' : ''}`}
              >
                All Types
              </button>
              {TAB_TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => { setTabType(value); setShowTabTypeDropdown(false); }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${tabType === value ? 'bg-blue-50 text-blue-700 font-medium' : ''}`}
                >
                  {label}
                </button>
              ))}
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
              setShowCityDropdown(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg text-sm ${
              pullTabPrices.length > 0 ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300 text-gray-700'
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
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-3">
              <p className="text-xs text-gray-500 mb-2">Select price points:</p>
              <div className="flex flex-wrap gap-2">
                {PULL_TAB_PRICE_OPTIONS.map((price) => (
                  <button
                    key={price}
                    onClick={() => togglePrice(price)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pullTabPrices.includes(price)
                        ? 'bg-green-500 text-white'
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
                  className="mt-2 text-xs text-gray-500 hover:text-gray-700"
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
              setShowCityDropdown(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg text-sm ${
              etabSystem ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-300 text-gray-700'
            }`}
          >
            <span>{etabSystem ? `E-Tabs: ${ETAB_SYSTEMS.find(e => e.value === etabSystem)?.label}` : 'E-Tabs (Pilot / 3 Diamonds)'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showEtabDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showEtabDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              <button
                onClick={() => { setEtabSystem(''); setShowEtabDropdown(false); }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${!etabSystem ? 'bg-gray-100 font-medium' : ''}`}
              >
                All E-Tab Systems
              </button>
              {ETAB_SYSTEMS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => { setEtabSystem(value); setShowEtabDropdown(false); }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${etabSystem === value ? 'bg-purple-50 text-purple-700 font-medium' : ''}`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Secondary Actions */}
      <div className="px-4 pb-3 flex items-center gap-2 border-t pt-3">
        <button
          onClick={handleLocationToggle}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors ${
            useLocation
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Near Me
        </button>

        {/* City dropdown with typeahead */}
        <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => {
              const opening = !showCityDropdown;
              setShowCityDropdown(opening);
              setShowTabTypeDropdown(false);
              setShowPricesDropdown(false);
              setShowEtabDropdown(false);
              if (opening) {
                setCitySearch('');
                setTimeout(() => cityInputRef.current?.focus(), 10);
              }
            }}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-full text-sm transition-colors ${
              city
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="truncate">{city || 'All Cities'}</span>
            <ChevronDown className="w-4 h-4 ml-1 flex-shrink-0" />
          </button>
          {showCityDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
              {/* Search input */}
              <div className="p-2 border-b">
                <input
                  ref={cityInputRef}
                  type="text"
                  placeholder="Type to search cities..."
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              {/* City list */}
              <div className="max-h-48 overflow-y-auto">
                {!citySearch && (
                  <button
                    onClick={() => { setCity(''); setShowCityDropdown(false); setCitySearch(''); }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${!city ? 'bg-gray-100 font-medium' : ''}`}
                  >
                    All Cities
                  </button>
                )}
                {cities
                  .filter(c => c.toLowerCase().includes(citySearch.toLowerCase()))
                  .slice(0, 50)
                  .map((c) => (
                    <button
                      key={c}
                      onClick={() => { setCity(c); setShowCityDropdown(false); setCitySearch(''); }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${city === c ? 'bg-blue-50 text-blue-700 font-medium' : ''}`}
                    >
                      {c}
                    </button>
                  ))}
                {citySearch && cities.filter(c => c.toLowerCase().includes(citySearch.toLowerCase())).length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-500">No cities found</div>
                )}
              </div>
            </div>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Distance slider (only if using location) */}
      {useLocation && (
        <div className="px-4 pb-3 border-t pt-3">
          <label className="block text-sm text-gray-600 mb-2">
            Distance: {distance} miles
          </label>
          <div className="flex gap-2">
            {DISTANCES.map((d) => (
              <button
                key={d}
                onClick={() => setDistance(d)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  distance === d
                    ? 'bg-blue-500 text-white'
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
