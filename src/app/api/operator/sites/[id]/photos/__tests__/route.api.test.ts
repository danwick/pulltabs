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

// Mock neon
const sqlMock = vi.fn();
vi.mock('@neondatabase/serverless', () => ({
  neon: () => sqlMock,
}));

// Mock @vercel/blob
vi.mock('@vercel/blob', () => ({
  del: vi.fn().mockResolvedValue(undefined),
}));

// Mock auth options
vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

const { GET, POST, DELETE: DELETE_HANDLER } = await import('../route');

describe('GET /api/operator/sites/[id]/photos', () => {
  const auth = setupAuthMock(getServerSessionMock);

  beforeEach(() => {
    vi.clearAllMocks();
    auth.asUnauthenticated();
  });

  it('returns 401 without session', async () => {
    const req = createRequest('/api/operator/sites/1/photos');
    const params = Promise.resolve({ id: '1' });
    const res = await GET(req, { params });
    const { status, body } = await parseResponse(res);

    expect(status).toBe(401);
    expect(body.error).toBe('Unauthorized');
  });

  it('returns 400 for non-numeric id', async () => {
    auth.asOperator();
    const req = createRequest('/api/operator/sites/abc/photos');
    const params = Promise.resolve({ id: 'abc' });
    const res = await GET(req, { params });
    const { status } = await parseResponse(res);

    expect(status).toBe(400);
  });

  it('returns 403 when user has no permission', async () => {
    auth.asOperator();
    // canEditSite check — no approved claims
    sqlMock.mockResolvedValueOnce([]);

    const req = createRequest('/api/operator/sites/1/photos');
    const params = Promise.resolve({ id: '1' });
    const res = await GET(req, { params });
    const { status } = await parseResponse(res);

    expect(status).toBe(403);
  });

  it('returns photos for authorized user', async () => {
    auth.asOperator();
    // canEditSite check
    sqlMock.mockResolvedValueOnce([{ status: 'approved' }]);
    // Photos query
    sqlMock.mockResolvedValueOnce([{ photos: ['photo1.jpg', 'photo2.jpg'] }]);

    const req = createRequest('/api/operator/sites/1/photos');
    const params = Promise.resolve({ id: '1' });
    const res = await GET(req, { params });
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.photos).toEqual(['photo1.jpg', 'photo2.jpg']);
  });

  it('returns empty array when site has no photos', async () => {
    auth.asSuperAdmin();
    // Photos query (super_admin skips claim check in canEditSite)
    sqlMock.mockResolvedValueOnce([{ photos: null }]);

    const req = createRequest('/api/operator/sites/1/photos');
    const params = Promise.resolve({ id: '1' });
    const res = await GET(req, { params });
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.photos).toEqual([]);
  });

  it('returns 404 when site not found', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValueOnce([]); // No site

    const req = createRequest('/api/operator/sites/999/photos');
    const params = Promise.resolve({ id: '999' });
    const res = await GET(req, { params });
    const { status } = await parseResponse(res);

    expect(status).toBe(404);
  });
});

describe('POST /api/operator/sites/[id]/photos', () => {
  const auth = setupAuthMock(getServerSessionMock);

  beforeEach(() => {
    vi.clearAllMocks();
    auth.asUnauthenticated();
  });

  it('returns 401 without session', async () => {
    const req = createRequest('/api/operator/sites/1/photos', {
      method: 'POST',
      body: { url: 'photo.jpg' },
    });
    const params = Promise.resolve({ id: '1' });
    const res = await POST(req, { params });
    const { status } = await parseResponse(res);

    expect(status).toBe(401);
  });

  it('returns 400 when no url provided', async () => {
    auth.asSuperAdmin();
    // canEditSite — super_admin
    // No claims query for super_admin

    const req = createRequest('/api/operator/sites/1/photos', {
      method: 'POST',
      body: {},
    });
    const params = Promise.resolve({ id: '1' });
    const res = await POST(req, { params });
    const { status, body } = await parseResponse(res);

    expect(status).toBe(400);
    expect(body.error).toContain('No photo URL');
  });

  it('adds photo to site', async () => {
    auth.asSuperAdmin();
    // Get current photos
    sqlMock.mockResolvedValueOnce([{ photos: ['existing.jpg'] }]);
    // UPDATE
    sqlMock.mockResolvedValueOnce([]);

    const req = createRequest('/api/operator/sites/1/photos', {
      method: 'POST',
      body: { url: 'new.jpg' },
    });
    const params = Promise.resolve({ id: '1' });
    const res = await POST(req, { params });
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.photos).toEqual(['existing.jpg', 'new.jpg']);
  });

  it('returns 400 when site already has 5 photos', async () => {
    auth.asSuperAdmin();
    // Get current photos — already at max
    sqlMock.mockResolvedValueOnce([{
      photos: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'],
    }]);

    const req = createRequest('/api/operator/sites/1/photos', {
      method: 'POST',
      body: { url: 'new.jpg' },
    });
    const params = Promise.resolve({ id: '1' });
    const res = await POST(req, { params });
    const { status, body } = await parseResponse(res);

    expect(status).toBe(400);
    expect(body.error).toContain('Maximum 5');
  });

  it('uses column "id" not "site_id" in SQL queries', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValueOnce([{ photos: [] }]);
    sqlMock.mockResolvedValueOnce([]);

    const req = createRequest('/api/operator/sites/42/photos', {
      method: 'POST',
      body: { url: 'test.jpg' },
    });
    const params = Promise.resolve({ id: '42' });
    await POST(req, { params });

    // First call: SELECT photos FROM sites WHERE id = ...
    const selectCall = sqlMock.mock.calls[0];
    const selectQuery = selectCall[0].join('');
    expect(selectQuery).toContain('WHERE id =');
    expect(selectQuery).not.toContain('site_id');

    // Second call: UPDATE sites SET ... WHERE id = ...
    const updateCall = sqlMock.mock.calls[1];
    const updateQuery = updateCall[0].join('');
    expect(updateQuery).toContain('WHERE id =');
  });
});

describe('DELETE /api/operator/sites/[id]/photos', () => {
  const auth = setupAuthMock(getServerSessionMock);

  beforeEach(() => {
    vi.clearAllMocks();
    auth.asUnauthenticated();
  });

  it('returns 401 without session', async () => {
    const req = createRequest('/api/operator/sites/1/photos', {
      method: 'DELETE',
      body: { url: 'photo.jpg' },
    });
    const params = Promise.resolve({ id: '1' });
    const res = await DELETE_HANDLER(req, { params });
    const { status } = await parseResponse(res);

    expect(status).toBe(401);
  });

  it('removes photo from site', async () => {
    auth.asSuperAdmin();
    // Get current photos
    sqlMock.mockResolvedValueOnce([{
      photos: ['keep.jpg', 'remove.jpg'],
    }]);
    // UPDATE
    sqlMock.mockResolvedValueOnce([]);

    const req = createRequest('/api/operator/sites/1/photos', {
      method: 'DELETE',
      body: { url: 'remove.jpg' },
    });
    const params = Promise.resolve({ id: '1' });
    const res = await DELETE_HANDLER(req, { params });
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.photos).toEqual(['keep.jpg']);
  });
});
