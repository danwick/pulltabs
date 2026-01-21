import { NextRequest, NextResponse } from 'next/server';
import { getSites } from '@/lib/sites';
import { SiteFilters, TabType, EtabSystem, PullTabPrice } from '@/types/site';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const filters: SiteFilters = {};

  // Parse query parameters
  const search = searchParams.get('search');
  if (search) filters.search = search;

  const city = searchParams.get('city');
  if (city) filters.city = city;

  const types = searchParams.get('types');
  if (types) filters.gambling_types = types.split(',');

  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  if (lat && lng) {
    filters.lat = parseFloat(lat);
    filters.lng = parseFloat(lng);
  }

  const distance = searchParams.get('distance');
  if (distance) filters.distance = parseFloat(distance);

  // New filters from Jay/Tim feedback
  const tabTypes = searchParams.get('tabTypes');
  if (tabTypes) {
    filters.tab_types = tabTypes.split(',') as TabType[];
  }

  const pullTabPrices = searchParams.get('pullTabPrices');
  if (pullTabPrices) {
    filters.pull_tab_prices = pullTabPrices.split(',').map(p => parseInt(p) as PullTabPrice);
  }

  const etabSystem = searchParams.get('etabSystem');
  if (etabSystem) filters.etab_system = etabSystem as EtabSystem;

  // Viewport bounds for dynamic loading
  const north = searchParams.get('north');
  const south = searchParams.get('south');
  const east = searchParams.get('east');
  const west = searchParams.get('west');
  if (north && south && east && west) {
    filters.bounds = {
      north: parseFloat(north),
      south: parseFloat(south),
      east: parseFloat(east),
      west: parseFloat(west),
    };
  }

  try {
    const sites = await getSites(filters);

    // When using viewport bounds, return all sites in view (no limit)
    // Otherwise apply pagination for other queries
    if (filters.bounds) {
      return NextResponse.json({
        sites,
        total: sites.length,
      });
    }

    // Limit response size for non-bounds queries
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    return NextResponse.json({
      sites: sites.slice(offset, offset + limit),
      total: sites.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching sites:', error);
    return NextResponse.json({ error: 'Failed to fetch sites' }, { status: 500 });
  }
}
