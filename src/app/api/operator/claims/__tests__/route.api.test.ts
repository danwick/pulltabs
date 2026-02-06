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

// Mock db module — this route uses `sql` from @/lib/db
const sqlMock = vi.fn();
vi.mock('@/lib/db', () => ({
  sql: sqlMock,
}));

// Mock auth options
vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

const { POST, GET } = await import('../route');

describe('POST /api/operator/claims', () => {
  const auth = setupAuthMock(getServerSessionMock);

  beforeEach(() => {
    vi.clearAllMocks();
    auth.asUnauthenticated();
  });

  it('returns 401 without session', async () => {
    const req = createRequest('/api/operator/claims', {
      method: 'POST',
      body: { siteId: 1 },
    });
    const res = await POST(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(401);
    expect(body.error).toContain('Unauthorized');
  });

  it('returns 400 for invalid tier', async () => {
    auth.asOperator();
    const req = createRequest('/api/operator/claims', {
      method: 'POST',
      body: { siteId: 1, tier: 'gold' },
    });
    const res = await POST(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(400);
    expect(body.error).toContain('Invalid tier');
  });

  it('returns 400 when siteId missing', async () => {
    auth.asOperator();
    const req = createRequest('/api/operator/claims', {
      method: 'POST',
      body: { tier: 'standard' },
    });
    const res = await POST(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(400);
    expect(body.error).toContain('Site ID');
  });

  it('returns 404 when site does not exist', async () => {
    auth.asOperator();
    sqlMock.mockResolvedValueOnce([]); // Site lookup

    const req = createRequest('/api/operator/claims', {
      method: 'POST',
      body: { siteId: 999 },
    });
    const res = await POST(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(404);
    expect(body.error).toBe('Site not found');
  });

  it('returns 409 when operator already has pending claim', async () => {
    auth.asOperator();
    // Site exists
    sqlMock.mockResolvedValueOnce([{
      id: 1,
      site_name: 'Test Bar',
      gambling_manager: 'Someone Else',
    }]);
    // Existing claims
    sqlMock.mockResolvedValueOnce([{ id: 1, status: 'pending' }]);

    const req = createRequest('/api/operator/claims', {
      method: 'POST',
      body: { siteId: 1 },
    });
    const res = await POST(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(409);
    expect(body.error).toContain('pending claim');
  });

  it('returns 409 when site already claimed by another user', async () => {
    auth.asOperator();
    // Site exists
    sqlMock.mockResolvedValueOnce([{
      id: 1,
      site_name: 'Test Bar',
      gambling_manager: 'Someone Else',
    }]);
    // No existing claims by this user
    sqlMock.mockResolvedValueOnce([]);
    // Approved claim by another user
    sqlMock.mockResolvedValueOnce([{ id: 2 }]);

    const req = createRequest('/api/operator/claims', {
      method: 'POST',
      body: { siteId: 1 },
    });
    const res = await POST(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(409);
    expect(body.error).toContain('already been claimed');
  });

  it('creates claim with manual review for regular operator', async () => {
    auth.asOperator();
    // Site exists
    sqlMock.mockResolvedValueOnce([{
      id: 1,
      site_name: 'Test Bar',
      gambling_manager: 'Someone Else',
    }]);
    // No existing claims
    sqlMock.mockResolvedValueOnce([]);
    // No approved claims by others
    sqlMock.mockResolvedValueOnce([]);
    // INSERT claim
    sqlMock.mockResolvedValueOnce([{
      id: 1,
      status: 'pending',
      tier: 'standard',
    }]);

    const req = createRequest('/api/operator/claims', {
      method: 'POST',
      body: { siteId: 1, tier: 'standard' },
    });
    const res = await POST(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(201);
    expect(body.claim.status).toBe('pending');
    expect(body.claim.autoApproved).toBe(false);
  });

  it('auto-approves for super_admin', async () => {
    auth.asSuperAdmin();
    // Site exists
    sqlMock.mockResolvedValueOnce([{
      id: 1,
      site_name: 'Test Bar',
      gambling_manager: 'Someone',
    }]);
    // INSERT claim (super_admin skips existing claims checks)
    sqlMock.mockResolvedValueOnce([{
      id: 1,
      status: 'approved',
      tier: 'premium',
    }]);
    // UPDATE site listing_status
    sqlMock.mockResolvedValueOnce([]);

    const req = createRequest('/api/operator/claims', {
      method: 'POST',
      body: { siteId: 1, tier: 'premium' },
    });
    const res = await POST(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(201);
    expect(body.claim.status).toBe('approved');
    expect(body.claim.autoApproved).toBe(true);
  });
});

describe('GET /api/operator/claims', () => {
  const auth = setupAuthMock(getServerSessionMock);

  beforeEach(() => {
    vi.clearAllMocks();
    auth.asUnauthenticated();
  });

  it('returns 401 without session', async () => {
    const res = await GET();
    const { status } = await parseResponse(res);

    expect(status).toBe(401);
  });

  it('returns claims for authenticated user', async () => {
    auth.asOperator();
    sqlMock.mockResolvedValueOnce([
      {
        id: 1,
        site_id: 10,
        status: 'approved',
        site_name: 'Test Bar',
        city: 'Minneapolis',
      },
    ]);

    const res = await GET();
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.claims).toHaveLength(1);
    expect(body.claims[0].site_name).toBe('Test Bar');
  });
});
