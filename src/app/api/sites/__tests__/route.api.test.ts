import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRequest, parseResponse } from '@/test/api-helpers';

// Mock the sites lib
const getSitesMock = vi.fn();
vi.mock('@/lib/sites', () => ({
  getSites: (...args: unknown[]) => getSitesMock(...args),
}));

const { GET } = await import('../route');

const makeSite = (overrides = {}) => ({
  site_id: 1,
  site_name: 'Test Bar',
  city: 'Minneapolis',
  latitude: 44.9778,
  longitude: -93.2650,
  listing_status: 'unclaimed',
  ...overrides,
});

describe('GET /api/sites', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSitesMock.mockResolvedValue([]);
  });

  it('returns sites with default pagination', async () => {
    const sites = Array.from({ length: 3 }, (_, i) =>
      makeSite({ site_id: i + 1, site_name: `Bar ${i + 1}` })
    );
    getSitesMock.mockResolvedValue(sites);

    const req = createRequest('/api/sites');
    const res = await GET(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.sites).toHaveLength(3);
    expect(body.total).toBe(3);
    expect(body.limit).toBe(100);
    expect(body.offset).toBe(0);
  });

  it('respects limit and offset params', async () => {
    const sites = Array.from({ length: 10 }, (_, i) =>
      makeSite({ site_id: i + 1 })
    );
    getSitesMock.mockResolvedValue(sites);

    const req = createRequest('/api/sites?limit=3&offset=2');
    const res = await GET(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.sites).toHaveLength(3);
    expect(body.total).toBe(10);
    expect(body.limit).toBe(3);
    expect(body.offset).toBe(2);
  });

  it('passes search filter through', async () => {
    getSitesMock.mockResolvedValue([]);

    const req = createRequest('/api/sites?search=Minneapolis');
    await GET(req);

    expect(getSitesMock).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'Minneapolis' })
    );
  });

  it('passes tabTypes filter as array', async () => {
    getSitesMock.mockResolvedValue([]);

    const req = createRequest('/api/sites?tabTypes=booth,behind_bar');
    await GET(req);

    expect(getSitesMock).toHaveBeenCalledWith(
      expect.objectContaining({
        tab_types: ['booth', 'behind_bar'],
      })
    );
  });

  it('passes pullTabPrices filter as number array', async () => {
    getSitesMock.mockResolvedValue([]);

    const req = createRequest('/api/sites?pullTabPrices=1,2,5');
    await GET(req);

    expect(getSitesMock).toHaveBeenCalledWith(
      expect.objectContaining({
        pull_tab_prices: [1, 2, 5],
      })
    );
  });

  it('passes etabSystem filter', async () => {
    getSitesMock.mockResolvedValue([]);

    const req = createRequest('/api/sites?etabSystem=pilot');
    await GET(req);

    expect(getSitesMock).toHaveBeenCalledWith(
      expect.objectContaining({ etab_system: 'pilot' })
    );
  });

  it('passes location filters', async () => {
    getSitesMock.mockResolvedValue([]);

    const req = createRequest('/api/sites?lat=44.97&lng=-93.26&distance=10');
    await GET(req);

    expect(getSitesMock).toHaveBeenCalledWith(
      expect.objectContaining({
        lat: 44.97,
        lng: -93.26,
        distance: 10,
      })
    );
  });

  it('returns all sites without pagination for bounds queries', async () => {
    const sites = Array.from({ length: 200 }, (_, i) =>
      makeSite({ site_id: i + 1 })
    );
    getSitesMock.mockResolvedValue(sites);

    const req = createRequest(
      '/api/sites?north=45&south=44&east=-93&west=-94'
    );
    const res = await GET(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.sites).toHaveLength(200);
    expect(body.total).toBe(200);
    // No limit/offset in bounds response
    expect(body.limit).toBeUndefined();
  });

  it('returns 500 on error', async () => {
    getSitesMock.mockRejectedValue(new Error('DB error'));

    const req = createRequest('/api/sites');
    const res = await GET(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(500);
    expect(body.error).toContain('Failed');
  });
});
