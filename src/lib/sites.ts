import { Site, SiteFilters, TabType, EtabSystem, PullTabPrice } from '@/types/site';
import { sql } from './db';
import path from 'path';
import fs from 'fs';

// Format gambling type from snake_case to display name
function formatGamblingType(type: string): string {
  const typeMap: Record<string, string> = {
    pull_tabs: 'Pull-Tabs',
    e_tabs: 'E-Tabs',
    bingo: 'Bingo',
    raffles: 'Raffles',
    paddlewheels: 'Paddlewheels',
    tipboards: 'Tipboards',
  };
  return typeMap[type.trim()] || type;
}

// Format comma-separated gambling types string
function formatGamblingTypes(types: string | null): string {
  if (!types) return '';
  return types.split(',').map(t => formatGamblingType(t.trim())).join(', ');
}

// Database row type (matches Neon schema)
interface SiteRow {
  id: number;
  site_name: string;
  organization_name: string | null;
  gambling_manager: string | null;
  street_address: string | null;
  city: string;
  state: string | null;
  zip_code: string | null;
  latitude: number | null;
  longitude: number | null;
  license_number: string | null;
  gambling_types_inferred: string | null;
  gross_receipts: bigint | null;
  net_receipts: bigint | null;
  fiscal_year: string | null;
  phone: string | null;
  website: string | null;
  listing_status: string | null;
  is_active: boolean | null;
  // New fields from Jay/Tim feedback
  tab_type: string | null;
  pull_tab_prices: number[] | null;
  etab_system: string | null;
}

function rowToSite(row: SiteRow): Site {
  return {
    site_id: row.id,
    site_name: row.site_name,
    organization_name: row.organization_name || '',
    gambling_manager: row.gambling_manager || '',
    street_address: row.street_address || '',
    city: row.city,
    state: row.state || 'MN',
    zip_code: row.zip_code || '',
    full_address: `${row.street_address || ''}, ${row.city}, ${row.state || 'MN'} ${row.zip_code || ''}`.trim(),
    license_number: row.license_number || '',
    gross_receipts: row.gross_receipts ? Number(row.gross_receipts) : null,
    net_receipts: row.net_receipts ? Number(row.net_receipts) : null,
    fiscal_year: row.fiscal_year,
    gambling_types_inferred: formatGamblingTypes(row.gambling_types_inferred),
    latitude: row.latitude ? Number(row.latitude) : null,
    longitude: row.longitude ? Number(row.longitude) : null,
    phone: row.phone,
    website: row.website,
    hours: null,
    photos: [],
    listing_status: (row.listing_status as 'unclaimed' | 'standard' | 'premium') || 'unclaimed',
    is_active: row.is_active ?? true,
    // New fields
    tab_type: row.tab_type as TabType | null,
    pull_tab_prices: row.pull_tab_prices as PullTabPrice[] | undefined,
    etab_system: row.etab_system as EtabSystem | null,
  };
}

// ============================================================================
// Database functions (primary)
// ============================================================================

async function getSitesFromDB(filters?: SiteFilters): Promise<Site[]> {
  if (!sql) return [];

  let rows: SiteRow[];

  // If we have viewport bounds, filter by bounding box
  if (filters?.bounds) {
    const { north, south, east, west } = filters.bounds;

    rows = await sql`
      SELECT * FROM sites
      WHERE is_active = true
        AND latitude IS NOT NULL
        AND longitude IS NOT NULL
        AND latitude BETWEEN ${south} AND ${north}
        AND longitude BETWEEN ${west} AND ${east}
      ORDER BY site_name
    ` as SiteRow[];

    let sites = rows.map(rowToSite);
    return applyNonGeoFilters(sites, filters);
  }

  // If we have location filters (distance-based), use a more complex query
  if (filters?.lat && filters?.lng && filters?.distance) {
    // Calculate bounding box for initial filter (rough approximation)
    const latDelta = filters.distance / 69; // ~69 miles per degree latitude
    const lngDelta = filters.distance / (69 * Math.cos(filters.lat * Math.PI / 180));

    const minLat = filters.lat - latDelta;
    const maxLat = filters.lat + latDelta;
    const minLng = filters.lng - lngDelta;
    const maxLng = filters.lng + lngDelta;

    rows = await sql`
      SELECT * FROM sites
      WHERE is_active = true
        AND latitude IS NOT NULL
        AND longitude IS NOT NULL
        AND latitude BETWEEN ${minLat} AND ${maxLat}
        AND longitude BETWEEN ${minLng} AND ${maxLng}
    ` as SiteRow[];

    // Filter by actual distance and sort
    const userLat = filters.lat;
    const userLng = filters.lng;
    const maxDist = filters.distance;

    let sites = rows.map(rowToSite).filter(s => {
      if (!s.latitude || !s.longitude) return false;
      const dist = getDistanceMiles(userLat, userLng, s.latitude, s.longitude);
      return dist <= maxDist;
    });

    sites.sort((a, b) => {
      const distA = getDistanceMiles(userLat, userLng, a.latitude!, a.longitude!);
      const distB = getDistanceMiles(userLat, userLng, b.latitude!, b.longitude!);
      return distA - distB;
    });

    return applyNonGeoFilters(sites, filters);
  }

  // Simple query without location
  rows = await sql`
    SELECT * FROM sites
    WHERE is_active = true
    ORDER BY site_name
  ` as SiteRow[];

  let sites = rows.map(rowToSite);
  return applyNonGeoFilters(sites, filters);
}

function applyNonGeoFilters(sites: Site[], filters?: SiteFilters): Site[] {
  if (!filters) return sites;

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    sites = sites.filter(
      (s) =>
        s.site_name.toLowerCase().includes(searchLower) ||
        s.organization_name.toLowerCase().includes(searchLower) ||
        s.city.toLowerCase().includes(searchLower)
    );
  }

  // City filter
  if (filters.city) {
    sites = sites.filter((s) => s.city.toLowerCase() === filters.city!.toLowerCase());
  }

  // Gambling types filter
  if (filters.gambling_types && filters.gambling_types.length > 0) {
    sites = sites.filter((s) => {
      const siteTypes = s.gambling_types_inferred.split(', ');
      return filters.gambling_types!.some((t) => siteTypes.includes(t));
    });
  }

  // Tab type filter (new)
  if (filters.tab_type) {
    sites = sites.filter((s) => s.tab_type === filters.tab_type);
  }

  // Pull-tab prices filter (new) - match if site has ANY of the requested prices
  if (filters.pull_tab_prices && filters.pull_tab_prices.length > 0) {
    sites = sites.filter((s) => {
      if (!s.pull_tab_prices || s.pull_tab_prices.length === 0) return false;
      return filters.pull_tab_prices!.some((price) => s.pull_tab_prices!.includes(price));
    });
  }

  // E-tab system filter (new)
  if (filters.etab_system) {
    sites = sites.filter((s) => s.etab_system === filters.etab_system);
  }

  return sites;
}

async function getSiteByIdFromDB(id: number): Promise<Site | null> {
  if (!sql) return null;

  const rows = await sql`
    SELECT * FROM sites WHERE id = ${id} LIMIT 1
  ` as SiteRow[];

  if (rows.length === 0) return null;
  return rowToSite(rows[0]);
}

async function getCitiesFromDB(): Promise<string[]> {
  if (!sql) return [];

  const rows = await sql`
    SELECT DISTINCT city FROM sites
    WHERE is_active = true AND city IS NOT NULL
    ORDER BY city
  ` as { city: string }[];

  return rows.map(r => r.city);
}

// ============================================================================
// JSON fallback (for development without database)
// ============================================================================

interface SeedSite {
  site_name: string;
  organization_name: string;
  gambling_manager: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: number | string;
  };
  location: {
    lat: number | null;
    lng: number | null;
  } | null;
  license_number: number;
  gambling_types: string[];
  financial: {
    gross_receipts: number | null;
    net_receipts: number | null;
    fiscal_year: string | null;
  } | null;
  listing_status: string;
  is_active: boolean;
}

interface SeedData {
  meta: {
    generated_at: string;
    source: string;
    version: string;
  };
  stats: {
    total_sites: number;
    geocoded_sites: number;
    sites_with_financial_data: number;
  };
  sites: SeedSite[];
}

let sitesCache: Site[] | null = null;

function transformSeedSite(seed: SeedSite, index: number): Site {
  return {
    site_id: index + 1,
    site_name: seed.site_name,
    organization_name: seed.organization_name,
    gambling_manager: seed.gambling_manager,
    street_address: seed.address.street,
    city: seed.address.city,
    state: seed.address.state,
    zip_code: String(seed.address.zip),
    full_address: `${seed.address.street}, ${seed.address.city}, ${seed.address.state} ${seed.address.zip}`,
    license_number: String(seed.license_number),
    gross_receipts: seed.financial?.gross_receipts ?? null,
    net_receipts: seed.financial?.net_receipts ?? null,
    fiscal_year: seed.financial?.fiscal_year ?? null,
    gambling_types_inferred: seed.gambling_types.map(formatGamblingType).join(', '),
    latitude: seed.location?.lat ?? null,
    longitude: seed.location?.lng ?? null,
    phone: null,
    website: null,
    hours: null,
    photos: [],
    listing_status: (seed.listing_status as 'unclaimed' | 'standard' | 'premium') || 'unclaimed',
    is_active: seed.is_active ?? true,
  };
}

async function loadSitesFromJSON(): Promise<Site[]> {
  if (sitesCache) return sitesCache;

  const jsonPath = path.join(process.cwd(), '..', 'data', 'seed', 'sites_seed.json');

  try {
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const data: SeedData = JSON.parse(rawData);
    sitesCache = data.sites.map((site, index) => transformSeedSite(site, index));
    return sitesCache;
  } catch (error) {
    console.error('Error loading sites JSON:', error);
    return [];
  }
}

async function getSitesFromJSON(filters?: SiteFilters): Promise<Site[]> {
  let sites = await loadSitesFromJSON();

  // Filter by viewport bounds
  if (filters?.bounds) {
    const { north, south, east, west } = filters.bounds;
    sites = sites.filter((s) => {
      if (!s.latitude || !s.longitude) return false;
      return (
        s.latitude >= south &&
        s.latitude <= north &&
        s.longitude >= west &&
        s.longitude <= east
      );
    });
  }

  if (filters?.lat !== undefined && filters?.lng !== undefined) {
    sites = sites.filter((s) => s.latitude !== null && s.longitude !== null);
  }

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    sites = sites.filter(
      (s) =>
        s.site_name.toLowerCase().includes(searchLower) ||
        s.organization_name.toLowerCase().includes(searchLower) ||
        s.city.toLowerCase().includes(searchLower)
    );
  }

  if (filters?.city) {
    sites = sites.filter((s) => s.city.toLowerCase() === filters.city!.toLowerCase());
  }

  if (filters?.gambling_types && filters.gambling_types.length > 0) {
    sites = sites.filter((s) => {
      const siteTypes = s.gambling_types_inferred.split(', ');
      return filters.gambling_types!.some((t) => siteTypes.includes(t));
    });
  }

  // New filters from Jay/Tim feedback
  if (filters?.tab_type) {
    sites = sites.filter((s) => s.tab_type === filters.tab_type);
  }

  if (filters?.pull_tab_prices && filters.pull_tab_prices.length > 0) {
    sites = sites.filter((s) => {
      if (!s.pull_tab_prices || s.pull_tab_prices.length === 0) return false;
      return filters.pull_tab_prices!.some((price) => s.pull_tab_prices!.includes(price));
    });
  }

  if (filters?.etab_system) {
    sites = sites.filter((s) => s.etab_system === filters.etab_system);
  }

  if (filters?.lat && filters?.lng && filters?.distance) {
    sites = sites.filter((s) => {
      if (!s.latitude || !s.longitude) return false;
      const dist = getDistanceMiles(filters.lat!, filters.lng!, s.latitude, s.longitude);
      return dist <= filters.distance!;
    });

    sites.sort((a, b) => {
      const distA = getDistanceMiles(filters.lat!, filters.lng!, a.latitude!, a.longitude!);
      const distB = getDistanceMiles(filters.lat!, filters.lng!, b.latitude!, b.longitude!);
      return distA - distB;
    });
  }

  return sites;
}

// ============================================================================
// Public API - automatically uses DB or JSON fallback
// ============================================================================

export async function getSites(filters?: SiteFilters): Promise<Site[]> {
  // Use database if available, otherwise fall back to JSON
  if (sql) {
    return getSitesFromDB(filters);
  }
  return getSitesFromJSON(filters);
}

export async function getSiteById(id: number): Promise<Site | null> {
  if (sql) {
    return getSiteByIdFromDB(id);
  }
  const sites = await loadSitesFromJSON();
  return sites.find((s) => s.site_id === id) || null;
}

export async function getCities(): Promise<string[]> {
  if (sql) {
    return getCitiesFromDB();
  }
  const sites = await loadSitesFromJSON();
  const cities = [...new Set(sites.map((s) => s.city))].sort();
  return cities;
}

// ============================================================================
// Utility functions
// ============================================================================

function getDistanceMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
