import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRequest, parseResponse } from '@/test/api-helpers';

// Mock sites lib
const getSiteByIdMock = vi.fn();
vi.mock('@/lib/sites', () => ({
  getSiteById: (...args: unknown[]) => getSiteByIdMock(...args),
}));

const { GET } = await import('../route');

describe('GET /api/sites/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 for non-numeric id', async () => {
    const req = createRequest('/api/sites/abc');
    const params = Promise.resolve({ id: 'abc' });
    const res = await GET(req, { params });
    const { status, body } = await parseResponse(res);

    expect(status).toBe(400);
    expect(body.error).toBe('Invalid site ID');
  });

  it('returns 404 when site not found', async () => {
    getSiteByIdMock.mockResolvedValue(null);

    const req = createRequest('/api/sites/999');
    const params = Promise.resolve({ id: '999' });
    const res = await GET(req, { params });
    const { status, body } = await parseResponse(res);

    expect(status).toBe(404);
    expect(body.error).toBe('Site not found');
  });

  it('returns site data when found', async () => {
    const siteData = {
      site_id: 1,
      site_name: 'Test Bar',
      city: 'Minneapolis',
      listing_status: 'premium',
    };
    getSiteByIdMock.mockResolvedValue(siteData);

    const req = createRequest('/api/sites/1');
    const params = Promise.resolve({ id: '1' });
    const res = await GET(req, { params });
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.site_name).toBe('Test Bar');
    expect(body.listing_status).toBe('premium');
  });

  it('passes parsed integer id to getSiteById', async () => {
    getSiteByIdMock.mockResolvedValue({ site_id: 42 });

    const req = createRequest('/api/sites/42');
    const params = Promise.resolve({ id: '42' });
    await GET(req, { params });

    expect(getSiteByIdMock).toHaveBeenCalledWith(42);
  });

  it('returns 500 on error', async () => {
    getSiteByIdMock.mockRejectedValue(new Error('DB error'));

    const req = createRequest('/api/sites/1');
    const params = Promise.resolve({ id: '1' });
    const res = await GET(req, { params });
    const { status, body } = await parseResponse(res);

    expect(status).toBe(500);
    expect(body.error).toContain('Failed');
  });
});
