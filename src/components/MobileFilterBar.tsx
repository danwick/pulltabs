'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, X, MapPin, ChevronDown } from 'lucide-react';
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
  const [search, setSearch] = useState(filters.search);
  const [tabType, setTabType] = useState<TabType | ''>(filters.tabType);
  const [pullTabPrices, setPullTabPrices] = useState<PullTabPrice[]>(filters.pullTabPrices);
  const [etabSystem, setEtabSystem] = useState<EtabSystem | ''>(filters.etabSystem);
  const [useLocation, setUseLocation] = useState(filters.useLocation);
  const [distance, setDistance] = useState(filters.distance);
  const [city, setCity] = useState(filters.city);
  const [cities, setCities] = useState<string[]>([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const cityInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch cities
  useEffect(() => {
    fetch('/api/cities')
      .then((res) => res.json())
      .then((data) => setCities(data.cities || []))
      .catch(console.error);
  }, []);

  // Count active filters
  const activeFilterCount = [
    tabType,
    pullTabPrices.length > 0,
    etabSystem,
    useLocation,
    city,
  ].filter(Boolean).length;

  // Apply filters
  const applyFilters = () => {
    onSearch({
      search,
      city,
      types: [], // Not using gambling types filter in mobile for now
      useLocation,
      distance,
      tabType,
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
    setShowCityDropdown(false);
    applyFilters();
  };

  const handleLocationToggle = () => {
    if (!useLocation) {
      onLocationRequest?.();
    }
    setUseLocation(!useLocation);
  };

  const togglePrice = (price: PullTabPrice) => {
    setPullTabPrices((prev) =>
      prev.includes(price) ? prev.filter((p) => p !== price) : [...prev, price]
    );
  };

  const clearFilters = () => {
    setTabType('');
    setPullTabPrices([]);
    setEtabSystem('');
    setUseLocation(false);
    setCity('');
    setDistance(25);
  };

  return (
    <>
      {/* Floating filter bar - positioned to avoid map controls on right */}
      <div className="absolute top-3 left-3 right-16 z-20 flex gap-2">
        {/* Filters button - primary action */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg text-sm font-semibold transition-colors ${
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

        {/* Search input - secondary, smaller */}
        <div className="flex-1 relative min-w-0">
          <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isJackpot ? 'text-gray-400' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-8 pr-2 py-2.5 rounded-lg shadow-lg text-sm transition-colors ${
              isJackpot
                ? 'bg-gray-900 border border-gray-700 text-white placeholder-gray-500'
                : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>
      </div>

      {/* Filter dropdown panel */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="absolute inset-0 z-20 bg-black/30"
            onClick={handleClose}
          />

          {/* Dropdown */}
          <div
            ref={dropdownRef}
            className={`absolute top-16 left-3 right-16 z-30 rounded-xl shadow-xl overflow-hidden ${
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
                  <button
                    onClick={clearFilters}
                    className={`text-sm ${isJackpot ? 'text-red-400' : 'text-red-600'}`}
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className={`p-1 rounded-lg ${isJackpot ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                >
                  <X className={`w-5 h-5 ${isJackpot ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>
              </div>
            </div>

            {/* Filter content - compact layout */}
            <div className="p-3 space-y-3">
              {/* Row 1: Where to Buy */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-medium w-20 flex-shrink-0 ${isJackpot ? 'text-gray-400' : 'text-gray-500'}`}>
                  Where to Buy
                </span>
                {TAB_TYPES.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setTabType(tabType === value ? '' : value)}
                    className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                      tabType === value
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
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      pullTabPrices.includes(price)
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

              {/* Row 3: E-Tabs */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-medium w-20 flex-shrink-0 ${isJackpot ? 'text-gray-400' : 'text-gray-500'}`}>
                  E-Tabs
                </span>
                {ETAB_SYSTEMS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setEtabSystem(etabSystem === value ? '' : value)}
                    className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                      etabSystem === value
                        ? 'bg-purple-500 text-white'
                        : isJackpot
                          ? 'bg-gray-800 text-gray-300'
                          : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Row 4: Location */}
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

                {/* City dropdown */}
                <div className="relative flex-1 min-w-[100px]">
                  <button
                    onClick={() => {
                      setShowCityDropdown(!showCityDropdown);
                      if (!showCityDropdown) {
                        setCitySearch('');
                        setTimeout(() => cityInputRef.current?.focus(), 10);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1 rounded-full text-xs transition-colors ${
                      city
                        ? isJackpot
                          ? 'bg-yellow-500 text-gray-900'
                          : 'bg-blue-500 text-white'
                        : isJackpot
                          ? 'bg-gray-800 text-gray-300'
                          : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="truncate">{city || 'All Cities'}</span>
                    <ChevronDown className="w-3 h-3 ml-1 flex-shrink-0" />
                  </button>
                  {showCityDropdown && (
                    <div className={`absolute bottom-full left-0 right-0 mb-1 rounded-lg shadow-lg z-10 overflow-hidden ${
                      isJackpot ? 'bg-gray-800 border border-gray-600' : 'bg-white border border-gray-200'
                    }`}>
                      <div className="max-h-32 overflow-y-auto">
                        {!citySearch && (
                          <button
                            onClick={() => { setCity(''); setShowCityDropdown(false); }}
                            className={`w-full text-left px-3 py-1.5 text-xs ${
                              !city
                                ? isJackpot ? 'bg-gray-700 text-white' : 'bg-gray-100'
                                : isJackpot ? 'text-gray-300 hover:bg-gray-700' : 'hover:bg-gray-50'
                            }`}
                          >
                            All Cities
                          </button>
                        )}
                        {cities
                          .filter(c => c.toLowerCase().includes(citySearch.toLowerCase()))
                          .slice(0, 20)
                          .map((c) => (
                            <button
                              key={c}
                              onClick={() => { setCity(c); setShowCityDropdown(false); }}
                              className={`w-full text-left px-3 py-1.5 text-xs ${
                                city === c
                                  ? isJackpot ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-50 text-blue-700'
                                  : isJackpot ? 'text-gray-300 hover:bg-gray-700' : 'hover:bg-gray-50'
                              }`}
                            >
                              {c}
                            </button>
                          ))}
                      </div>
                      <div className={`p-1.5 border-t ${isJackpot ? 'border-gray-600' : 'border-gray-200'}`}>
                        <input
                          ref={cityInputRef}
                          type="text"
                          placeholder="Type to search..."
                          value={citySearch}
                          onChange={(e) => setCitySearch(e.target.value)}
                          className={`w-full px-2 py-1 text-xs rounded ${
                            isJackpot
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                              : 'border border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>
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
