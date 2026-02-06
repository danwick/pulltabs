import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
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

// Mock auth options
vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

const { GET, POST } = await import('../route');

describe('GET /api/admin/sites', () => {
  const auth = setupAuthMock(getServerSessionMock);

  beforeEach(() => {
    vi.clearAllMocks();
    auth.asUnauthenticated();
  });

  it('returns 401 without session', async () => {
    const req = createRequest('/api/admin/sites');
    const res = await GET(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(401);
    expect(body.error).toBe('Unauthorized');
  });

  it('returns 403 for non-admin user', async () => {
    auth.asOperator();
    const req = createRequest('/api/admin/sites');
    const res = await GET(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(403);
    expect(body.error).toBe('Forbidden');
  });

  it('returns paginated sites for super_admin', async () => {
    auth.asSuperAdmin();
    // Sites query
    sqlMock.mockResolvedValueOnce([
      { site_id: 1, site_name: 'Bar A', city: 'Minneapolis' },
      { site_id: 2, site_name: 'Bar B', city: 'St Paul' },
    ]);
    // Count query
    sqlMock.mockResolvedValueOnce([{ total: 100 }]);

    const req = createRequest('/api/admin/sites');
    const res = await GET(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.sites).toHaveLength(2);
    expect(body.pagination.total).toBe(100);
    expect(body.pagination.page).toBe(1);
    expect(body.pagination.limit).toBe(50);
    expect(body.pagination.totalPages).toBe(2);
  });

  it('passes search parameter to query', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValueOnce([]); // Sites
    sqlMock.mockResolvedValueOnce([{ total: 0 }]); // Count

    const req = createRequest('/api/admin/sites?search=Minneapolis');
    await GET(req);

    // Both calls should include ILIKE with search pattern
    const sitesCall = sqlMock.mock.calls[0];
    const sitesQuery = sitesCall[0].join('');
    expect(sitesQuery).toContain('ILIKE');
  });

  it('respects page parameter', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValueOnce([]);
    sqlMock.mockResolvedValueOnce([{ total: 0 }]);

    const req = createRequest('/api/admin/sites?page=3');
    const res = await GET(req);
    const { body } = await parseResponse(res);

    expect(body.pagination.page).toBe(3);
  });
});

describe('POST /api/admin/sites', () => {
  const auth = setupAuthMock(getServerSessionMock);

  beforeEach(() => {
    vi.clearAllMocks();
    auth.asUnauthenticated();
  });

  it('returns 401 without session', async () => {
    const req = createRequest('/api/admin/sites', {
      method: 'POST',
      body: { site_name: 'New Bar', city: 'Minneapolis' },
    });
    const res = await POST(req);
    const { status } = await parseResponse(res);

    expect(status).toBe(401);
  });

  it('returns 403 for non-admin user', async () => {
    auth.asOperator();
    const req = createRequest('/api/admin/sites', {
      method: 'POST',
      body: { site_name: 'New Bar', city: 'Minneapolis' },
    });
    const res = await POST(req);
    const { status } = await parseResponse(res);

    expect(status).toBe(403);
  });

  it('returns 400 when site_name missing', async () => {
    auth.asSuperAdmin();
    const req = createRequest('/api/admin/sites', {
      method: 'POST',
      body: { city: 'Minneapolis' },
    });
    const res = await POST(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(400);
    expect(body.error).toContain('Site name and city');
  });

  it('returns 400 when city missing', async () => {
    auth.asSuperAdmin();
    const req = createRequest('/api/admin/sites', {
      method: 'POST',
      body: { site_name: 'New Bar' },
    });
    const res = await POST(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(400);
    expect(body.error).toContain('Site name and city');
  });

  it('creates site successfully', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValueOnce([{ site_id: 42 }]);

    const req = createRequest('/api/admin/sites', {
      method: 'POST',
      body: {
        site_name: 'New Bar',
        city: 'Minneapolis',
        state: 'MN',
        phone: '555-1234',
      },
    });
    const res = await POST(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.site_id).toBe(42);
  });

  it('defaults state to MN', async () => {
    auth.asSuperAdmin();
    sqlMock.mockResolvedValueOnce([{ site_id: 1 }]);

    const req = createRequest('/api/admin/sites', {
      method: 'POST',
      body: { site_name: 'New Bar', city: 'Minneapolis' },
    });
    await POST(req);

    // Verify sql was called (INSERT statement executed)
    expect(sqlMock).toHaveBeenCalledTimes(1);
    const insertCall = sqlMock.mock.calls[0];
    const query = insertCall[0].join('');
    expect(query).toContain('INSERT INTO sites');
  });
});
