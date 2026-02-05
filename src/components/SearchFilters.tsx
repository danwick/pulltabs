'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ChevronDown, X, Check, Store, DollarSign, Tv } from 'lucide-react';
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
  tabTypes: TabType[];
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

  const [tabTypes, setTabTypes] = useState<TabType[]>([]);
  const [pullTabPrices, setPullTabPrices] = useState<PullTabPrice[]>([]);
  const [etabSystem, setEtabSystem] = useState<EtabSystem | ''>('');

  const [showTabTypeDropdown, setShowTabTypeDropdown] = useState(false);
  const [showPricesDropdown, setShowPricesDropdown] = useState(false);
  const [showEtabDropdown, setShowEtabDropdown] = useState(false);

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

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowTabTypeDropdown(false);
        setShowPricesDropdown(false);
        setShowEtabDropdown(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Common styles
  const dropdownPanelClass = isJackpot
    ? 'bg-gray-900/95 backdrop-blur-sm border-gray-700/50 shadow-xl shadow-black/20'
    : 'bg-white border-gray-200 shadow-xl shadow-gray-200/50';

  const chipBaseClass = 'px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150';

  const chipUnselectedClass = isJackpot
    ? 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700/50'
    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200';

  return (
    <div
      ref={containerRef}
      className={`border-b transition-colors ${
        isJackpot ? 'border-gray-800' : 'border-gray-200'
      }`}
      style={{ background: 'var(--theme-surface)' }}
    >
      {/* Search Bar */}
      <div className="p-4 pb-3">
        <div className="relative">
          <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 ${
            isJackpot ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder="Search by name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-0 transition-colors ${
              isJackpot
                ? 'bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-500 focus:border-yellow-500/50 focus:bg-gray-800'
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:bg-white'
            }`}
          />
        </div>
      </div>

      {/* Primary Filters */}
      <div className="px-4 pb-4 space-y-2.5">

        {/* Seller Type Dropdown */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => {
              setShowTabTypeDropdown(!showTabTypeDropdown);
              setShowPricesDropdown(false);
              setShowEtabDropdown(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-3 border-2 rounded-xl text-sm font-medium transition-all duration-150 ${
              tabTypes.length > 0
                ? isJackpot
                  ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400'
                  : 'border-blue-400 bg-blue-50 text-blue-700'
                : isJackpot
                  ? 'border-gray-700/50 bg-gray-800/30 text-gray-300 hover:border-gray-600 hover:bg-gray-800/50'
                  : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <Store className="w-4 h-4 opacity-60" />
              {tabTypes.length > 0
                ? tabTypes.map(t => TAB_TYPES.find(tab => tab.value === t)?.label).join(', ')
                : 'Seller Type'
              }
            </span>
            <ChevronDown className={`w-4 h-4 opacity-60 transition-transform duration-200 ${showTabTypeDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showTabTypeDropdown && (
            <div className={`absolute top-full left-0 right-0 mt-2 border rounded-2xl z-20 p-4 ${dropdownPanelClass}`}>
              <p className={`text-xs font-medium uppercase tracking-wide mb-3 ${isJackpot ? 'text-gray-500' : 'text-gray-400'}`}>
                Select seller types
              </p>
              <div className="flex flex-wrap gap-2">
                {TAB_TYPES.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => toggleTabType(value)}
                    className={`${chipBaseClass} flex items-center gap-2 ${
                      tabTypes.includes(value)
                        ? isJackpot
                          ? 'bg-yellow-500 text-gray-900 border border-yellow-400 shadow-lg shadow-yellow-500/20'
                          : 'bg-blue-500 text-white border border-blue-400 shadow-lg shadow-blue-500/20'
                        : chipUnselectedClass
                    }`}
                  >
                    {tabTypes.includes(value) && <Check className="w-4 h-4" />}
                    {label}
                  </button>
                ))}
              </div>
              {tabTypes.length > 0 && (
                <button
                  onClick={() => setTabTypes([])}
                  className={`mt-3 text-xs font-medium ${isJackpot ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Clear selection
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pull-Tab Prices */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => {
              setShowPricesDropdown(!showPricesDropdown);
              setShowTabTypeDropdown(false);
              setShowEtabDropdown(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-3 border-2 rounded-xl text-sm font-medium transition-all duration-150 ${
              pullTabPrices.length > 0
                ? isJackpot
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                  : 'border-emerald-400 bg-emerald-50 text-emerald-700'
                : isJackpot
                  ? 'border-gray-700/50 bg-gray-800/30 text-gray-300 hover:border-gray-600 hover:bg-gray-800/50'
                  : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 opacity-60" />
              {pullTabPrices.length > 0
                ? pullTabPrices.sort((a,b) => b-a).map(p => `$${p}`).join(', ')
                : 'Pull-Tab Prices'
              }
            </span>
            <ChevronDown className={`w-4 h-4 opacity-60 transition-transform duration-200 ${showPricesDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showPricesDropdown && (
            <div className={`absolute top-full left-0 right-0 mt-2 border rounded-2xl z-20 p-4 ${dropdownPanelClass}`}>
              <p className={`text-xs font-medium uppercase tracking-wide mb-3 ${isJackpot ? 'text-gray-500' : 'text-gray-400'}`}>
                Select price points
              </p>
              <div className="flex flex-wrap gap-2">
                {PULL_TAB_PRICE_OPTIONS.map((price) => (
                  <button
                    key={price}
                    onClick={() => togglePrice(price)}
                    className={`${chipBaseClass} min-w-[60px] flex items-center justify-center gap-1.5 ${
                      pullTabPrices.includes(price)
                        ? 'bg-emerald-500 text-white border border-emerald-400 shadow-lg shadow-emerald-500/20'
                        : chipUnselectedClass
                    }`}
                  >
                    {pullTabPrices.includes(price) && <Check className="w-3.5 h-3.5" />}
                    ${price}
                  </button>
                ))}
              </div>
              {pullTabPrices.length > 0 && (
                <button
                  onClick={() => setPullTabPrices([])}
                  className={`mt-3 text-xs font-medium ${isJackpot ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Clear selection
                </button>
              )}
            </div>
          )}
        </div>

        {/* E-Tabs */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => {
              setShowEtabDropdown(!showEtabDropdown);
              setShowTabTypeDropdown(false);
              setShowPricesDropdown(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-3 border-2 rounded-xl text-sm font-medium transition-all duration-150 ${
              etabSystem
                ? isJackpot
                  ? 'border-purple-500/50 bg-purple-500/10 text-purple-400'
                  : 'border-purple-400 bg-purple-50 text-purple-700'
                : isJackpot
                  ? 'border-gray-700/50 bg-gray-800/30 text-gray-300 hover:border-gray-600 hover:bg-gray-800/50'
                  : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <Tv className="w-4 h-4 opacity-60" />
              {etabSystem ? ETAB_SYSTEMS.find(e => e.value === etabSystem)?.label : 'E-Tab System'}
            </span>
            <ChevronDown className={`w-4 h-4 opacity-60 transition-transform duration-200 ${showEtabDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showEtabDropdown && (
            <div className={`absolute top-full left-0 right-0 mt-2 border rounded-2xl z-20 overflow-hidden ${dropdownPanelClass}`}>
              <button
                onClick={() => { setEtabSystem(''); setShowEtabDropdown(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  !etabSystem
                    ? isJackpot
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-900'
                    : isJackpot
                      ? 'text-gray-300 hover:bg-gray-800/50'
                      : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {!etabSystem && <Check className="w-4 h-4" />}
                <span className={!etabSystem ? '' : 'ml-7'}>All Systems</span>
              </button>
              {ETAB_SYSTEMS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => { setEtabSystem(value); setShowEtabDropdown(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                    etabSystem === value
                      ? isJackpot
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-purple-50 text-purple-700'
                      : isJackpot
                        ? 'text-gray-300 hover:bg-gray-800/50'
                        : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {etabSystem === value && <Check className="w-4 h-4" />}
                  <span className={etabSystem === value ? '' : 'ml-7'}>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Secondary Actions */}
      <div className={`px-4 pb-4 flex items-center gap-2 border-t pt-4 ${
        isJackpot ? 'border-gray-800/50' : 'border-gray-200'
      }`}>
        <button
          onClick={handleLocationToggle}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
            useLocation
              ? isJackpot
                ? 'bg-yellow-500 text-gray-900 shadow-lg shadow-yellow-500/20'
                : 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
              : isJackpot
                ? 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 border border-gray-700/50'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Near Me
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              isJackpot
                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30'
                : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
            }`}
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Distance selector */}
      {useLocation && (
        <div className={`px-4 pb-4 border-t pt-4 ${isJackpot ? 'border-gray-800/50' : 'border-gray-200'}`}>
          <label className={`block text-xs font-medium uppercase tracking-wide mb-3 ${isJackpot ? 'text-gray-500' : 'text-gray-400'}`}>
            Distance: {distance} miles
          </label>
          <div className="flex gap-2">
            {DISTANCES.map((d) => (
              <button
                key={d}
                onClick={() => setDistance(d)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                  distance === d
                    ? isJackpot
                      ? 'bg-yellow-500 text-gray-900 shadow-lg shadow-yellow-500/20'
                      : 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                    : isJackpot
                      ? 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 border border-gray-700/50'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
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
