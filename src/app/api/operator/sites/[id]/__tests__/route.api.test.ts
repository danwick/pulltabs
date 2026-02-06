import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  mockSession,
  createRequest,
  parseResponse,
  setupAuthMock,
} from '@/test/api-helpers';

// Mock next-auth
const getServerSessionMock = vi.fn();
vi.mock('next-auth', () => ({
  getServerSession: (...args: unknown[]) => getServerSessionMock(...args),
}));

// Mock neon — capture SQL calls
const sqlMock = vi.fn();
vi.mock('@neondatabase/serverless', () => ({
  neon: () => sqlMock,
}));

// Mock auth options
vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

// Import route handlers after mocks
const { GET, PATCH } = await import('../route');

describe('GET /api/operator/sites/[id]', () => {
  const auth = setupAuthMock(getServerSessionMock);

  beforeEach(() => {
    vi.clearAllMocks();
    auth.asUnauthenticated();
  });

  it('returns 401 without session', async () => {
    const req = createRequest('/api/operator/sites/1');
    const params = Promise.resolve({ id: '1' });
    const res = await GET(req, { params });
    const { status, body } = await parseResponse(res);

    expect(status).toBe(401);
    expect(body.error).toBe('Unauthorized');
  });

  it('returns 400 for non-numeric id', async () => {
    auth.asOperator();
    const req = createRequest('/api/operator/sites/abc');
    const params = Promise.resolve({ id: 'abc' });
    const res = await GET(req, { params });
    const { status, body } = await parseResponse(res);

    expect(status).toBe(400);
    expect(body.error).toBe('Invalid site ID');
  });

  it('returns 403 when operator has no claim', async () => {
    auth.asOperator();
    // No claims found
    sqlMock.mockResolvedValueOnce([]);

    const req = createRequest('/api/operator/sites/1');
    const params = Promise.resolve({ id: '1' });
    const res = await GET(req, { params });
    const { status, body } = await parseResponse(res);

    expect(status).toBe(403);
    expect(body.error).toContain('permission');
  });

  it('returns site details when operator has claim', async () => {
    auth.asOperator();
    // Claims check passes
    sqlMock.mockResolvedValueOnce([{ claim_status: 'approved' }]);
    // Site data
    sqlMock.mockResolvedValueOnce([{
      site_id: 1,
      site_name: 'Test Bar',
      city: 'Minneapolis',
      listing_status: 'standard',
    }]);
    // Hours query
    sqlMock.mockResolvedValueOnce([]);

    const req = createRequest('/api/operator/sites/1');
    const params = Promise.resolve({ id: '1' });
    const res = await GET(req, { params });
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.site.site_name).toBe('Test Bar');
  });

  it('returns site details with hours', async () => {
    auth.asOperator();
    sqlMock.mockResolvedValueOnce([{ claim_status: 'approved' }]);
    sqlMock.mockResolvedValueOnce([{
      site_id: 1,
      site_name: 'Test Bar',
      city: 'Minneapolis',
      listing_status: 'premium',
    }]);
    // Hours data from site_hours table
    sqlMock.mockResolvedValueOnce([
      { day_of_week: 1, open_time: '11:00:00', close_time: '23:00:00' },
      { day_of_week: 5, open_time: '11:00:00', close_time: '00:00:00' },
    ]);

    const req = createRequest('/api/operator/sites/1');
    const params = Promise.resolve({ id: '1' });
    const res = await GET(req, { params });
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.site.hours).toEqual({
      monday: { open: '11:00', close: '23:00' },
      friday: { open: '11:00', close: '00:00' },
    });
  });

  it('super_admin skips claim check', async () => {
    auth.asSuperAdmin();
    // Only site query, no claims query
    sqlMock.mockResolvedValueOnce([{
      site_id: 1,
      site_name: 'Test Bar',
      city: 'Minneapolis',
    }]);
    // Hours query
    sqlMock.mockResolvedValueOnce([]);

    const req = createRequest('/api/operator/sites/1');
    const params = Promise.resolve({ id: '1' });
    const res = await GET(req, { params });
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.site.site_name).toBe('Test Bar');
    // Should have been called twice (site query + hours query), not three times (claims + site + hours)
    expect(sqlMock).toHaveBeenCalledTimes(2);
  });

  it('returns 404 when site does not exist', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValueOnce([]);

    const req = createRequest('/api/operator/sites/999');
    const params = Promise.resolve({ id: '999' });
    const res = await GET(req, { params });
    const { status, body } = await parseResponse(res);

    expect(status).toBe(404);
    expect(body.error).toBe('Site not found');
  });
});

describe('PATCH /api/operator/sites/[id]', () => {
  const auth = setupAuthMock(getServerSessionMock);

  beforeEach(() => {
    vi.clearAllMocks();
    auth.asUnauthenticated();
  });

  it('returns 401 without session', async () => {
    const req = createRequest('/api/operator/sites/1', {
      method: 'PATCH',
      body: { phone: '555-1234' },
    });
    const params = Promise.resolve({ id: '1' });
    const res = await PATCH(req, { params });
    const { status } = await parseResponse(res);

    expect(status).toBe(401);
  });

  it('returns 403 when operator has no approved claim', async () => {
    auth.asOperator();
    sqlMock.mockResolvedValueOnce([]); // No claims

    const req = createRequest('/api/operator/sites/1', {
      method: 'PATCH',
      body: { phone: '555-1234' },
    });
    const params = Promise.resolve({ id: '1' });
    const res = await PATCH(req, { params });
    const { status, body } = await parseResponse(res);

    expect(status).toBe(403);
    expect(body.error).toContain('pending');
  });

  it('updates site for operator with approved claim', async () => {
    auth.asOperator();
    sqlMock.mockResolvedValueOnce([{ claim_status: 'approved' }]); // Claims check
    sqlMock.mockResolvedValue([]); // UPDATE, DELETE hours, etc.

    const req = createRequest('/api/operator/sites/1', {
      method: 'PATCH',
      body: { phone: '555-1234', website: 'https://test.com' },
    });
    const params = Promise.resolve({ id: '1' });
    const res = await PATCH(req, { params });
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
  });

  it('saves hours to site_hours table', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValue([]);

    const req = createRequest('/api/operator/sites/1', {
      method: 'PATCH',
      body: {
        phone: '555-1234',
        hours: {
          monday: { open: '11:00', close: '23:00' },
          friday: { open: '11:00', close: '00:00' },
        },
      },
    });
    const params = Promise.resolve({ id: '1' });
    const res = await PATCH(req, { params });
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    // UPDATE sites + DELETE site_hours + 2x INSERT site_hours = 4 calls
    expect(sqlMock).toHaveBeenCalledTimes(4);
  });

  it('super_admin can update any site', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValue([]); // UPDATE + DELETE hours

    const req = createRequest('/api/operator/sites/1', {
      method: 'PATCH',
      body: { phone: '555-1234' },
    });
    const params = Promise.resolve({ id: '1' });
    const res = await PATCH(req, { params });
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
  });

  it('returns 400 for non-numeric id', async () => {
    auth.asSuperAdmin();
    const req = createRequest('/api/operator/sites/abc', {
      method: 'PATCH',
      body: { phone: '555-1234' },
    });
    const params = Promise.resolve({ id: 'abc' });
    const res = await PATCH(req, { params });
    const { status, body } = await parseResponse(res);

    expect(status).toBe(400);
    expect(body.error).toBe('Invalid site ID');
  });

  it('succeeds with empty body (no fields to update)', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValue([]);

    const req = createRequest('/api/operator/sites/1', {
      method: 'PATCH',
      body: {},
    });
    const params = Promise.resolve({ id: '1' });
    const res = await PATCH(req, { params });
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
  });

  it('saves empty string website as null (not empty string)', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValue([]);

    const req = createRequest('/api/operator/sites/1', {
      method: 'PATCH',
      body: { website: '', phone: '' },
    });
    const params = Promise.resolve({ id: '1' });
    const res = await PATCH(req, { params });
    const { status } = await parseResponse(res);

    expect(status).toBe(200);
    // Verify the UPDATE query received null, not empty string
    const updateCall = sqlMock.mock.calls[0];
    const templateStr = updateCall[0].join('');
    expect(templateStr).toContain('UPDATE sites');
    // phone and website params should be null (falsy values coerced via || null)
    const values = updateCall.slice(1);
    expect(values[0]).toBeNull(); // phone = ${phone || null}
    expect(values[1]).toBeNull(); // website = ${website || null}
  });

  it('saves website without requiring URL format', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValue([]);

    // This is the bug Jay hit — the edit page had type="url" which blocked saving
    // plain text like "www.mybar.com". The API should accept any string.
    const req = createRequest('/api/operator/sites/1', {
      method: 'PATCH',
      body: { website: 'www.mybar.com' },
    });
    const params = Promise.resolve({ id: '1' });
    const res = await PATCH(req, { params });
    const { status } = await parseResponse(res);

    expect(status).toBe(200);
  });

  it('saves tab_type as array', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValue([]);

    const req = createRequest('/api/operator/sites/1', {
      method: 'PATCH',
      body: { tab_type: ['booth', 'machine'] },
    });
    const params = Promise.resolve({ id: '1' });
    const res = await PATCH(req, { params });
    const { status } = await parseResponse(res);

    expect(status).toBe(200);
    // Verify tab_type was passed as array
    const updateCall = sqlMock.mock.calls[0];
    const values = updateCall.slice(1);
    expect(values[2]).toEqual(['booth', 'machine']); // tab_type param
  });

  it('saves empty tab_type array as null', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValue([]);

    const req = createRequest('/api/operator/sites/1', {
      method: 'PATCH',
      body: { tab_type: [] },
    });
    const params = Promise.resolve({ id: '1' });
    const res = await PATCH(req, { params });
    const { status } = await parseResponse(res);

    expect(status).toBe(200);
    // Empty array should be stored as null
    const updateCall = sqlMock.mock.calls[0];
    const values = updateCall.slice(1);
    expect(values[2]).toBeNull(); // tab_type when empty array
  });

  it('saves single tab_type in array', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValue([]);

    const req = createRequest('/api/operator/sites/1', {
      method: 'PATCH',
      body: { tab_type: ['behind_bar'] },
    });
    const params = Promise.resolve({ id: '1' });
    const res = await PATCH(req, { params });
    const { status } = await parseResponse(res);

    expect(status).toBe(200);
    const updateCall = sqlMock.mock.calls[0];
    const values = updateCall.slice(1);
    expect(values[2]).toEqual(['behind_bar']);
  });

  it('saves pull_tab_prices as array', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValue([]);

    const req = createRequest('/api/operator/sites/1', {
      method: 'PATCH',
      body: { pull_tab_prices: [1, 2, 5] },
    });
    const params = Promise.resolve({ id: '1' });
    const res = await PATCH(req, { params });
    const { status } = await parseResponse(res);

    expect(status).toBe(200);
    const updateCall = sqlMock.mock.calls[0];
    const values = updateCall.slice(1);
    expect(values[3]).toEqual([1, 2, 5]); // pull_tab_prices param
  });

  it('saves empty pull_tab_prices as null', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValue([]);

    const req = createRequest('/api/operator/sites/1', {
      method: 'PATCH',
      body: { pull_tab_prices: [] },
    });
    const params = Promise.resolve({ id: '1' });
    const res = await PATCH(req, { params });
    const { status } = await parseResponse(res);

    expect(status).toBe(200);
    const updateCall = sqlMock.mock.calls[0];
    const values = updateCall.slice(1);
    expect(values[3]).toBeNull(); // pull_tab_prices when empty
  });

  it('does not touch hours when hours field is missing', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValue([]);

    const req = createRequest('/api/operator/sites/1', {
      method: 'PATCH',
      body: { phone: '555-1234' },
    });
    const params = Promise.resolve({ id: '1' });
    const res = await PATCH(req, { params });
    const { status } = await parseResponse(res);

    expect(status).toBe(200);
    // Only UPDATE sites, no DELETE/INSERT site_hours
    expect(sqlMock).toHaveBeenCalledTimes(1);
  });

  it('does not delete hours when hours is null', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValue([]);

    const req = createRequest('/api/operator/sites/1', {
      method: 'PATCH',
      body: { phone: '555-1234', hours: null },
    });
    const params = Promise.resolve({ id: '1' });
    const res = await PATCH(req, { params });
    const { status } = await parseResponse(res);

    expect(status).toBe(200);
    // hours is null → falsy → if block skipped, only UPDATE sites
    expect(sqlMock).toHaveBeenCalledTimes(1);
  });

  it('clears existing hours when saving empty hours object', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValue([]);

    const req = createRequest('/api/operator/sites/1', {
      method: 'PATCH',
      body: { phone: '555-1234', hours: {} },
    });
    const params = Promise.resolve({ id: '1' });
    const res = await PATCH(req, { params });
    const { status } = await parseResponse(res);

    expect(status).toBe(200);
    // UPDATE sites + DELETE site_hours (but no INSERTs since empty)
    expect(sqlMock).toHaveBeenCalledTimes(2);
  });

  it('saves all 7 days of hours', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValue([]);

    const req = createRequest('/api/operator/sites/1', {
      method: 'PATCH',
      body: {
        hours: {
          sunday: { open: '10:00', close: '22:00' },
          monday: { open: '11:00', close: '23:00' },
          tuesday: { open: '11:00', close: '23:00' },
          wednesday: { open: '11:00', close: '23:00' },
          thursday: { open: '11:00', close: '23:00' },
          friday: { open: '11:00', close: '00:00' },
          saturday: { open: '10:00', close: '00:00' },
        },
      },
    });
    const params = Promise.resolve({ id: '1' });
    const res = await PATCH(req, { params });
    const { status } = await parseResponse(res);

    expect(status).toBe(200);
    // UPDATE sites + DELETE site_hours + 7x INSERT site_hours = 9 calls
    expect(sqlMock).toHaveBeenCalledTimes(9);
  });

  it('skips hours entries with missing open or close', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValue([]);

    const req = createRequest('/api/operator/sites/1', {
      method: 'PATCH',
      body: {
        hours: {
          monday: { open: '11:00', close: '23:00' },
          tuesday: { open: '', close: '23:00' },     // empty open
          wednesday: { open: '11:00', close: '' },    // empty close
          thursday: null,                             // null entry
          friday: { open: '11:00' },                  // missing close
        },
      },
    });
    const params = Promise.resolve({ id: '1' });
    const res = await PATCH(req, { params });
    const { status } = await parseResponse(res);

    expect(status).toBe(200);
    // UPDATE sites + DELETE site_hours + 1x INSERT (only monday is valid) = 3 calls
    expect(sqlMock).toHaveBeenCalledTimes(3);
  });

  it('ignores invalid day names in hours', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValue([]);

    const req = createRequest('/api/operator/sites/1', {
      method: 'PATCH',
      body: {
        hours: {
          monday: { open: '11:00', close: '23:00' },
          notaday: { open: '11:00', close: '23:00' },
          MONDAY: { open: '11:00', close: '23:00' },  // wrong case
        },
      },
    });
    const params = Promise.resolve({ id: '1' });
    const res = await PATCH(req, { params });
    const { status } = await parseResponse(res);

    expect(status).toBe(200);
    // UPDATE sites + DELETE site_hours + 1x INSERT (only lowercase monday valid) = 3 calls
    expect(sqlMock).toHaveBeenCalledTimes(3);
  });

  it('saves etab_system value', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValue([]);

    const req = createRequest('/api/operator/sites/1', {
      method: 'PATCH',
      body: { etab_system: 'pilot' },
    });
    const params = Promise.resolve({ id: '1' });
    const res = await PATCH(req, { params });
    const { status } = await parseResponse(res);

    expect(status).toBe(200);
    const updateCall = sqlMock.mock.calls[0];
    const values = updateCall.slice(1);
    expect(values[4]).toBe('pilot'); // etab_system param
  });

  it('clears etab_system when empty string', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValue([]);

    const req = createRequest('/api/operator/sites/1', {
      method: 'PATCH',
      body: { etab_system: '' },
    });
    const params = Promise.resolve({ id: '1' });
    const res = await PATCH(req, { params });
    const { status } = await parseResponse(res);

    expect(status).toBe(200);
    const updateCall = sqlMock.mock.calls[0];
    const values = updateCall.slice(1);
    expect(values[4]).toBeNull(); // etab_system || null
  });

  it('uses WHERE id = (not site_id) in UPDATE query', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValue([]);

    const req = createRequest('/api/operator/sites/42', {
      method: 'PATCH',
      body: { phone: '555-1234' },
    });
    const params = Promise.resolve({ id: '42' });
    await PATCH(req, { params });

    const updateCall = sqlMock.mock.calls[0];
    const templateStr = updateCall[0].join('');
    expect(templateStr).toContain('WHERE id =');
    expect(templateStr).not.toContain('WHERE site_id =');
  });
});

describe('GET /api/operator/sites/[id] - edge cases', () => {
  const auth = setupAuthMock(getServerSessionMock);

  beforeEach(() => {
    vi.clearAllMocks();
    auth.asUnauthenticated();
  });

  it('returns null hours when site_hours table has no rows', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValueOnce([{
      site_id: 1,
      site_name: 'Test Bar',
      city: 'Minneapolis',
      tab_type: null,
      pull_tab_prices: null,
      etab_system: null,
      photos: null,
    }]);
    sqlMock.mockResolvedValueOnce([]); // No hours rows

    const req = createRequest('/api/operator/sites/1');
    const params = Promise.resolve({ id: '1' });
    const res = await GET(req, { params });
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.site.hours).toBeNull();
  });

  it('returns all 7 days of hours', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValueOnce([{
      site_id: 1,
      site_name: 'Full Hours Bar',
      city: 'St Paul',
    }]);
    sqlMock.mockResolvedValueOnce([
      { day_of_week: 0, open_time: '10:00:00', close_time: '22:00:00' },
      { day_of_week: 1, open_time: '11:00:00', close_time: '23:00:00' },
      { day_of_week: 2, open_time: '11:00:00', close_time: '23:00:00' },
      { day_of_week: 3, open_time: '11:00:00', close_time: '23:00:00' },
      { day_of_week: 4, open_time: '11:00:00', close_time: '23:00:00' },
      { day_of_week: 5, open_time: '11:00:00', close_time: '01:00:00' },
      { day_of_week: 6, open_time: '10:00:00', close_time: '01:00:00' },
    ]);

    const req = createRequest('/api/operator/sites/1');
    const params = Promise.resolve({ id: '1' });
    const res = await GET(req, { params });
    const { body } = await parseResponse(res);

    expect(Object.keys(body.site.hours)).toHaveLength(7);
    expect(body.site.hours.sunday).toEqual({ open: '10:00', close: '22:00' });
    expect(body.site.hours.saturday).toEqual({ open: '10:00', close: '01:00' });
  });

  it('returns tab_type as array', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValueOnce([{
      site_id: 1,
      site_name: 'Multi-Type Bar',
      city: 'Duluth',
      tab_type: ['booth', 'machine'],
    }]);
    sqlMock.mockResolvedValueOnce([]);

    const req = createRequest('/api/operator/sites/1');
    const params = Promise.resolve({ id: '1' });
    const res = await GET(req, { params });
    const { body } = await parseResponse(res);

    expect(body.site.tab_type).toEqual(['booth', 'machine']);
  });

  it('returns photos as array', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValueOnce([{
      site_id: 1,
      site_name: 'Photo Bar',
      city: 'Rochester',
      photos: ['https://blob.vercel-storage.com/photo1.jpg', 'https://blob.vercel-storage.com/photo2.jpg'],
    }]);
    sqlMock.mockResolvedValueOnce([]);

    const req = createRequest('/api/operator/sites/1');
    const params = Promise.resolve({ id: '1' });
    const res = await GET(req, { params });
    const { body } = await parseResponse(res);

    expect(body.site.photos).toEqual([
      'https://blob.vercel-storage.com/photo1.jpg',
      'https://blob.vercel-storage.com/photo2.jpg',
    ]);
  });

  it('uses WHERE id = (not site_id) in SELECT query', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValueOnce([{
      site_id: 42,
      site_name: 'Test',
      city: 'Test',
    }]);
    sqlMock.mockResolvedValueOnce([]);

    const req = createRequest('/api/operator/sites/42');
    const params = Promise.resolve({ id: '42' });
    await GET(req, { params });

    // First call is the site SELECT
    const siteQuery = sqlMock.mock.calls[0];
    const templateStr = siteQuery[0].join('');
    expect(templateStr).toContain('WHERE id =');
    expect(templateStr).not.toContain('WHERE site_id =');
  });

  it('operator with pending claim can still view site', async () => {
    auth.asOperator();
    // Claims check — pending status is allowed for GET
    sqlMock.mockResolvedValueOnce([{ claim_status: 'pending' }]);
    sqlMock.mockResolvedValueOnce([{
      site_id: 1,
      site_name: 'Pending Bar',
      city: 'Mankato',
    }]);
    sqlMock.mockResolvedValueOnce([]);

    const req = createRequest('/api/operator/sites/1');
    const params = Promise.resolve({ id: '1' });
    const res = await GET(req, { params });
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.site.site_name).toBe('Pending Bar');
  });
});
