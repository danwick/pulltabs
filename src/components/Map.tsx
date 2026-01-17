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
  isJackpot?: boolean;
}

// Map styles for different themes
const MAP_STYLES = {
  default: 'mapbox://styles/mapbox/streets-v12',
  jackpot: 'mapbox://styles/mapbox/dark-v11',
};

// Theme-specific colors
const THEME_COLORS = {
  default: {
    clusterSmall: '#3b82f6',
    clusterMedium: '#2563eb',
    clusterLarge: '#1d4ed8',
    point: '#3b82f6',
    selected: '#ef4444',
    stroke: '#ffffff',
    text: '#ffffff',
  },
  jackpot: {
    clusterSmall: '#ffd700',
    clusterMedium: '#f59e0b',
    clusterLarge: '#d97706',
    point: '#ffd700',
    selected: '#ef4444',
    stroke: '#000000',
    text: '#000000',
  },
};

// Convert sites to GeoJSON for Mapbox clustering
function sitesToGeoJSON(sites: Site[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: sites
      .filter((site) => site.longitude && site.latitude)
      .map((site) => ({
        type: 'Feature' as const,
        properties: {
          id: site.site_id,
          name: site.site_name,
          organization: site.organization_name,
          city: site.city,
          address: site.street_address,
          types: site.gambling_types_inferred,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [site.longitude!, site.latitude!],
        },
      })),
  };
}

function MapComponent({
  sites,
  center = [-94.6859, 46.7296], // Minnesota center
  zoom = 6,
  onSiteClick,
  selectedSiteId,
  onBoundsChange,
  isJackpot = false,
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const onSiteClickRef = useRef(onSiteClick);
  const onBoundsChangeRef = useRef(onBoundsChange);
  const sitesRef = useRef(sites);
  const isFlying = useRef(false);
  const lastFlyToSiteId = useRef<number | null>(null); // Track which site we've flown to
  const currentThemeRef = useRef<'default' | 'jackpot'>('default'); // Track current theme

  // Keep refs updated
  useEffect(() => {
    onSiteClickRef.current = onSiteClick;
  }, [onSiteClick]);

  useEffect(() => {
    onBoundsChangeRef.current = onBoundsChange;
  }, [onBoundsChange]);

  useEffect(() => {
    sitesRef.current = sites;
  }, [sites]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.warn('Mapbox token not configured.');
      return;
    }

    mapboxgl.accessToken = token;

    const initialTheme = isJackpot ? 'jackpot' : 'default';
    currentThemeRef.current = initialTheme;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAP_STYLES[initialTheme],
      center: center,
      zoom: zoom,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Helper to emit bounds
    const emitBounds = () => {
      if (!map.current || isFlying.current) return;
      const bounds = map.current.getBounds();
      if (!bounds) return;
      const currentZoom = map.current.getZoom();
      onBoundsChangeRef.current?.(
        {
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        },
        currentZoom
      );
    };

    map.current.on('load', () => {
      if (!map.current) return;

      // Add clustered source
      map.current.addSource('sites', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      const colors = THEME_COLORS[initialTheme];

      // Cluster circles
      map.current.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'sites',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            colors.clusterSmall,
            10,
            colors.clusterMedium,
            50,
            colors.clusterLarge,
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20, // small clusters
            10,
            25, // medium clusters
            50,
            35, // large clusters
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': colors.stroke,
        },
      });

      // Cluster count labels
      map.current.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'sites',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
        paint: {
          'text-color': colors.text,
        },
      });

      // Individual points (unclustered)
      map.current.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'sites',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': colors.point,
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': colors.stroke,
        },
      });

      // Click on cluster to zoom in
      map.current.on('click', 'clusters', (e) => {
        if (!map.current) return;
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ['clusters'],
        });
        if (!features.length) return;

        const clusterId = features[0].properties?.cluster_id;
        const source = map.current.getSource('sites') as mapboxgl.GeoJSONSource;

        source.getClusterExpansionZoom(clusterId, (err, expansionZoom) => {
          if (err || !map.current || expansionZoom == null) return;
          const geometry = features[0].geometry;
          if (geometry.type === 'Point') {
            map.current.easeTo({
              center: geometry.coordinates as [number, number],
              zoom: expansionZoom,
            });
          }
        });
      });

      // Click on individual point
      map.current.on('click', 'unclustered-point', (e) => {
        if (!e.features?.length) return;
        const feature = e.features[0];
        const siteId = feature.properties?.id;

        // Find the full site data
        const site = sitesRef.current.find((s) => s.site_id === siteId);
        if (site) {
          onSiteClickRef.current?.(site);
        }
      });

      // Change cursor on hover
      map.current.on('mouseenter', 'clusters', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'clusters', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });
      map.current.on('mouseenter', 'unclustered-point', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'unclustered-point', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });

      setMapLoaded(true);
      emitBounds();
    });

    map.current.on('moveend', emitBounds);

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update GeoJSON data when sites change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const source = map.current.getSource('sites') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData(sitesToGeoJSON(sites));
    }
  }, [sites, mapLoaded]);

  // Handle theme changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const newTheme = isJackpot ? 'jackpot' : 'default';
    if (currentThemeRef.current === newTheme) return;

    currentThemeRef.current = newTheme;
    const colors = THEME_COLORS[newTheme];

    // Save current view state
    const currentCenter = map.current.getCenter();
    const currentZoom = map.current.getZoom();
    const currentData = sitesToGeoJSON(sitesRef.current);

    // Change the style
    map.current.setStyle(MAP_STYLES[newTheme]);

    // Re-add layers after style loads
    map.current.once('style.load', () => {
      if (!map.current) return;

      // Re-add source
      map.current.addSource('sites', {
        type: 'geojson',
        data: currentData,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      // Re-add cluster layer
      map.current.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'sites',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            colors.clusterSmall,
            10,
            colors.clusterMedium,
            50,
            colors.clusterLarge,
          ],
          'circle-radius': ['step', ['get', 'point_count'], 20, 10, 25, 50, 35],
          'circle-stroke-width': 2,
          'circle-stroke-color': colors.stroke,
        },
      });

      // Re-add cluster count
      map.current.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'sites',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
        paint: { 'text-color': colors.text },
      });

      // Re-add unclustered points
      map.current.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'sites',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': colors.point,
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': colors.stroke,
        },
      });

      // Restore view
      map.current.setCenter(currentCenter);
      map.current.setZoom(currentZoom);
    });
  }, [isJackpot, mapLoaded]);

  // Highlight selected point
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const colors = THEME_COLORS[isJackpot ? 'jackpot' : 'default'];

    // Update paint property for selected state
    map.current.setPaintProperty('unclustered-point', 'circle-color', [
      'case',
      ['==', ['get', 'id'], selectedSiteId || -1],
      colors.selected, // red for selected
      colors.point, // theme color for others
    ]);

    map.current.setPaintProperty('unclustered-point', 'circle-radius', [
      'case',
      ['==', ['get', 'id'], selectedSiteId || -1],
      12, // larger for selected
      8, // normal for others
    ]);
  }, [selectedSiteId, mapLoaded, isJackpot]);

  // Fly to selected site (only when selection changes, not on every sites update)
  useEffect(() => {
    if (!map.current || !selectedSiteId) {
      lastFlyToSiteId.current = null;
      return;
    }

    // Don't fly again if we already flew to this site
    if (lastFlyToSiteId.current === selectedSiteId) return;

    const site = sitesRef.current.find((s) => s.site_id === selectedSiteId);
    if (site?.longitude && site?.latitude) {
      lastFlyToSiteId.current = selectedSiteId;
      isFlying.current = true;

      map.current.flyTo({
        center: [site.longitude, site.latitude],
        zoom: 14,
        duration: 1000,
      });

      map.current.once('moveend', () => {
        isFlying.current = false;
        if (map.current) {
          const bounds = map.current.getBounds();
          if (bounds) {
            const currentZoom = map.current.getZoom();
            onBoundsChangeRef.current?.(
              {
                north: bounds.getNorth(),
                south: bounds.getSouth(),
                east: bounds.getEast(),
                west: bounds.getWest(),
              },
              currentZoom
            );
          }
        }
      });
    }
  }, [selectedSiteId]); // Only depend on selectedSiteId, use ref for sites

  // Placeholder if no token
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

const Map = memo(MapComponent);
export default Map;
