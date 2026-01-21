'use client';

import { useState, useEffect, useCallback, useMemo, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Site } from '@/types/site';
import Map, { MapBounds } from '@/components/Map';
import SiteList from '@/components/SiteList';
import SearchFilters, { FilterState } from '@/components/SearchFilters';
import SiteDetailModal from '@/components/SiteDetailModal';
import MobileFilterBar from '@/components/MobileFilterBar';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';

// Wrap the main content in a component that can use searchParams
function HomeContent() {
  const searchParams = useSearchParams();
  const { isJackpot } = useTheme();

  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const hasSetInitialSidebar = useRef(false);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    city: '',
    types: [],
    useLocation: false,
    distance: 25,
    tabTypes: [],
    pullTabPrices: [],
    etabSystem: '',
    openNow: false,
  });

  // Debounce timer ref for bounds changes
  const boundsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasLoadedOnce = useRef(false); // Track if we've done initial load

  // Parse initial map state from URL
  const initialMapState = useMemo(() => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const z = searchParams.get('z');

    if (lat && lng) {
      return {
        center: [parseFloat(lng), parseFloat(lat)] as [number, number],
        zoom: z ? parseFloat(z) : 12,
      };
    }
    return null;
  }, [searchParams]);

  // Fetch sites based on filters and map bounds
  const fetchSites = useCallback(async () => {
    // Don't fetch until we have bounds
    if (!mapBounds) return;

    // Only show skeleton on initial load, not on refreshes
    if (!hasLoadedOnce.current) {
      setLoading(true);
    }

    const params = new URLSearchParams();

    if (filters.search) params.set('search', filters.search);
    if (filters.city) params.set('city', filters.city);
    if (filters.types.length > 0) params.set('types', filters.types.join(','));
    // New filters from Jay/Tim feedback
    if (filters.tabTypes.length > 0) params.set('tabTypes', filters.tabTypes.join(','));
    if (filters.pullTabPrices.length > 0) params.set('pullTabPrices', filters.pullTabPrices.join(','));
    if (filters.etabSystem) params.set('etabSystem', filters.etabSystem);
    if (filters.openNow) params.set('openNow', 'true');

    if (filters.useLocation && userLocation) {
      params.set('lat', userLocation.lat.toString());
      params.set('lng', userLocation.lng.toString());
      params.set('distance', filters.distance.toString());
    } else {
      // Use viewport bounds for dynamic loading
      params.set('north', mapBounds.north.toString());
      params.set('south', mapBounds.south.toString());
      params.set('east', mapBounds.east.toString());
      params.set('west', mapBounds.west.toString());
    }

    try {
      const res = await fetch(`/api/sites?${params}`);
      const data = await res.json();
      setSites(data.sites || []);
      hasLoadedOnce.current = true;
    } catch (error) {
      console.error('Error fetching sites:', error);
      setSites([]);
    } finally {
      setLoading(false);
    }
  }, [filters, userLocation, mapBounds]);

  // Initial load and filter changes
  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  // Set initial sidebar state based on screen width (mobile = map first)
  useEffect(() => {
    if (!hasSetInitialSidebar.current) {
      hasSetInitialSidebar.current = true;
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      }
    }
  }, []);

  // Request user location - memoized
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please check your browser settings.');
      }
    );
  }, []);

  const handleSearch = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    if (newFilters.useLocation) {
      requestLocation();
    }
  }, [requestLocation]);

  // Handle map bounds changes with debouncing
  const handleBoundsChange = useCallback((bounds: MapBounds, zoom?: number) => {
    // Clear any pending timer
    if (boundsTimerRef.current) {
      clearTimeout(boundsTimerRef.current);
    }

    // Debounce the bounds update to avoid excessive API calls while panning
    boundsTimerRef.current = setTimeout(() => {
      setMapBounds(bounds);

      // Update URL with map position (for back button support)
      const centerLat = (bounds.north + bounds.south) / 2;
      const centerLng = (bounds.east + bounds.west) / 2;
      const params = new URLSearchParams();
      params.set('lat', centerLat.toFixed(5));
      params.set('lng', centerLng.toFixed(5));
      if (zoom) params.set('z', zoom.toFixed(1));

      // Replace URL without navigation (shallow update)
      window.history.replaceState(null, '', `?${params.toString()}`);
    }, 300);
  }, []); // No dependencies - doesn't need to recreate

  // Memoize site click handler to prevent recreation on every render
  const handleSiteClick = useCallback((site: Site) => {
    setSelectedSiteId(site.site_id);
    // On mobile, show the sidebar when a site is selected
    if (window.innerWidth < 768) {
      setShowSidebar(true);
    }
  }, []);

  // Memoize map center to prevent unnecessary recalculations
  const mapCenter = useMemo<[number, number]>(() => {
    // Priority: URL params > user location > default
    if (initialMapState) {
      return initialMapState.center;
    }
    if (userLocation) {
      return [userLocation.lng, userLocation.lat];
    }
    return [-94.6859, 46.7296]; // Minnesota center
  }, [initialMapState, userLocation]);

  const mapZoom = useMemo(() => {
    if (initialMapState) {
      return initialMapState.zoom;
    }
    if (userLocation) {
      return 10;
    }
    return 6;
  }, [initialMapState, userLocation]);

  // Find the selected site object
  const selectedSite = useMemo(() => {
    if (!selectedSiteId) return null;
    return sites.find(s => s.site_id === selectedSiteId) || null;
  }, [selectedSiteId, sites]);

  // Close the detail panel
  const handleClosePanel = useCallback(() => {
    setSelectedSiteId(null);
  }, []);

  return (
    <div className="h-screen flex flex-col" style={{ background: 'var(--theme-bg)' }}>
      {/* Header */}
      <header
        className={`px-4 py-3 flex items-center justify-between z-10 transition-all duration-300 ${
          isJackpot
            ? 'border-b border-transparent'
            : 'bg-white border-b'
        }`}
        style={isJackpot ? { background: 'var(--theme-header-bg)' } : {}}
      >
        <div className="flex items-center gap-3">
          <h1
            className={`text-xl font-bold transition-colors ${
              isJackpot ? 'text-yellow-400' : 'text-gray-900'
            }`}
          >
            Pulltab Magic
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className={`text-sm ${isJackpot ? 'text-yellow-400/70' : 'text-gray-500'}`}>
            {sites.length} locations
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <div
          className={`absolute md:relative z-10 h-full transition-all duration-300 ${
            showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } w-full md:w-96 flex flex-col ${
            isJackpot
              ? 'border-r border-gray-800'
              : 'border-r'
          }`}
          style={{ background: 'var(--theme-surface)' }}
        >
          <SearchFilters onSearch={handleSearch} onLocationRequest={requestLocation} />
          <div className="flex-1 overflow-y-auto">
            <SiteList
              sites={sites}
              selectedSiteId={selectedSiteId}
              onSiteSelect={handleSiteClick}
              loading={loading}
            />
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <Map
            sites={sites}
            center={mapCenter}
            zoom={mapZoom}
            selectedSiteId={selectedSiteId}
            onSiteClick={handleSiteClick}
            onBoundsChange={handleBoundsChange}
            isJackpot={isJackpot}
          />

          {/* Mobile filter bar (search + filters dropdown) */}
          <div className="md:hidden">
            <MobileFilterBar
              onSearch={handleSearch}
              onLocationRequest={requestLocation}
              filters={filters}
            />
          </div>

          {/* Mobile toggle button for list view */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className={`absolute bottom-4 left-4 md:hidden px-4 py-2 rounded-full shadow-lg font-medium text-sm transition-all ${
              isJackpot
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900'
                : 'bg-white text-gray-900'
            }`}
          >
            {showSidebar ? 'Show Map' : `View List (${sites.length})`}
          </button>
        </div>
      </div>

      {/* Site Detail Modal - Desktop: right panel, Mobile: bottom sheet */}
      <SiteDetailModal site={selectedSite} onClose={handleClosePanel} />
    </div>
  );
}

// Loading fallback for Suspense
function HomeLoading() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  );
}

// Export with Suspense boundary for useSearchParams
export default function Home() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent />
    </Suspense>
  );
}
