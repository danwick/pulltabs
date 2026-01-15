'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Filter, X } from 'lucide-react';

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
}

const GAMBLING_TYPES = [
  'Pull-Tabs',
  'Bingo',
  'Raffles',
  'Paddlewheels',
  'Tipboards',
];

const DISTANCES = [5, 10, 25, 50, 100];

export default function SearchFilters({ onSearch, onLocationRequest }: SearchFiltersProps) {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [useLocation, setUseLocation] = useState(false);
  const [distance, setDistance] = useState(25);
  const [cities, setCities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

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
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [search, city, selectedTypes, useLocation, distance, onSearch]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
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
  };

  const hasActiveFilters = search || city || selectedTypes.length > 0 || useLocation;

  return (
    <div className="bg-white border-b">
      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, organization, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-3">
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

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && !showFilters && (
              <span className="ml-1 px-1.5 py-0.5 bg-white text-blue-500 text-xs rounded-full">
                {(city ? 1 : 0) + selectedTypes.length + (useLocation ? 1 : 0)}
              </span>
            )}
          </button>

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
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="px-4 pb-4 border-t pt-4 space-y-4">
          {/* City Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Gambling Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gambling Types
            </label>
            <div className="flex flex-wrap gap-2">
              {GAMBLING_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    selectedTypes.includes(type)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Distance (only if using location) */}
          {useLocation && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distance
              </label>
              <div className="flex gap-2">
                {DISTANCES.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDistance(d)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
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
      )}
    </div>
  );
}
