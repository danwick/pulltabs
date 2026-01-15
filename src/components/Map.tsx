'use client';

import { useEffect, useRef, useState, memo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Site } from '@/types/site';

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface MapProps {
  sites: Site[];
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  onSiteClick?: (site: Site) => void;
  selectedSiteId?: number | null;
  onBoundsChange?: (bounds: MapBounds, zoom: number) => void;
}

interface MarkerData {
  marker: mapboxgl.Marker;
  dot: HTMLDivElement;
  siteId: number;
}

function MapComponent({
  sites,
  center = [-94.6859, 46.7296], // Minnesota center
  zoom = 6,
  onSiteClick,
  selectedSiteId,
  onBoundsChange,
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersData = useRef<MarkerData[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const onSiteClickRef = useRef(onSiteClick);
  const selectedSiteIdRef = useRef(selectedSiteId);
  const onBoundsChangeRef = useRef(onBoundsChange);
  const isFlying = useRef(false); // Prevent bounds updates during flyTo

  // Keep refs updated
  useEffect(() => {
    onSiteClickRef.current = onSiteClick;
  }, [onSiteClick]);

  useEffect(() => {
    selectedSiteIdRef.current = selectedSiteId;
  }, [selectedSiteId]);

  useEffect(() => {
    onBoundsChangeRef.current = onBoundsChange;
  }, [onBoundsChange]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.warn('Mapbox token not configured. Map will not display.');
      return;
    }

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: zoom,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Helper to emit current bounds and zoom
    const emitBounds = () => {
      if (!map.current || isFlying.current) return; // Skip during flyTo
      const bounds = map.current.getBounds();
      if (!bounds) return;
      const zoom = map.current.getZoom();
      onBoundsChangeRef.current?.(
        {
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        },
        zoom
      );
    };

    map.current.on('load', () => {
      setMapLoaded(true);
      // Emit initial bounds
      emitBounds();
    });

    // Emit bounds when map stops moving
    map.current.on('moveend', emitBounds);

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Add/update markers when sites change (but NOT when selectedSiteId changes)
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markersData.current.forEach((m) => m.marker.remove());
    markersData.current = [];

    // Add new markers
    sites.forEach((site) => {
      if (!site.longitude || !site.latitude) return;

      // Outer container - Mapbox transforms this, so we don't animate it
      const el = document.createElement('div');
      el.className = 'site-marker';
      el.dataset.siteId = site.site_id.toString();
      el.style.cssText = `
        width: 24px;
        height: 24px;
        cursor: pointer;
      `;

      // Inner dot - we animate this instead
      const dot = document.createElement('div');
      dot.style.cssText = `
        width: 100%;
        height: 100%;
        background-color: #3b82f6;
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        transition: transform 0.15s ease-out, box-shadow 0.15s ease-out, background-color 0.15s ease-out;
      `;
      el.appendChild(dot);

      // Hover handlers check selection state via ref
      el.addEventListener('mouseenter', () => {
        dot.style.transform = 'scale(1.3)';
        dot.style.boxShadow = '0 3px 8px rgba(0,0,0,0.4)';
      });
      el.addEventListener('mouseleave', () => {
        // Only reset scale if not selected
        if (selectedSiteIdRef.current !== site.site_id) {
          dot.style.transform = 'scale(1)';
        }
        dot.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      });

      el.addEventListener('click', () => {
        onSiteClickRef.current?.(site);
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([site.longitude, site.latitude])
        .addTo(map.current!);

      markersData.current.push({ marker, dot, siteId: site.site_id });
    });
  }, [sites, mapLoaded]);

  // Update marker colors when selection changes (without recreating markers)
  useEffect(() => {
    markersData.current.forEach(({ dot, siteId }) => {
      if (siteId === selectedSiteId) {
        dot.style.backgroundColor = '#ef4444';
        dot.style.transform = 'scale(1.3)';
      } else {
        dot.style.backgroundColor = '#3b82f6';
        dot.style.transform = 'scale(1)';
      }
    });
  }, [selectedSiteId]);

  // Pan to selected site
  useEffect(() => {
    if (!map.current || !selectedSiteId) return;

    const site = sites.find((s) => s.site_id === selectedSiteId);
    if (site?.longitude && site?.latitude) {
      // Set flying flag to prevent bounds updates during animation
      isFlying.current = true;

      map.current.flyTo({
        center: [site.longitude, site.latitude],
        zoom: 14,
        duration: 1000,
      });

      // After animation completes, update URL with new position
      map.current.once('moveend', () => {
        isFlying.current = false;
        // Emit final bounds so URL gets updated with zoomed-in position
        if (map.current) {
          const bounds = map.current.getBounds();
          if (bounds) {
            const zoom = map.current.getZoom();
            onBoundsChangeRef.current?.(
              {
                north: bounds.getNorth(),
                south: bounds.getSouth(),
                east: bounds.getEast(),
                west: bounds.getWest(),
              },
              zoom
            );
          }
        }
      });
    }
  }, [selectedSiteId, sites]);

  // Show placeholder if no Mapbox token
  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">Map Preview</p>
          <p className="text-sm">Configure NEXT_PUBLIC_MAPBOX_TOKEN to enable</p>
          <p className="text-sm mt-2">{sites.length} sites loaded</p>
        </div>
      </div>
    );
  }

  return <div ref={mapContainer} className="w-full h-full" />;
}

// Memoize to prevent unnecessary re-renders
const Map = memo(MapComponent);
export default Map;
