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

const { GET } = await import('../route');

describe('GET /api/operator/sites', () => {
  const auth = setupAuthMock(getServerSessionMock);

  beforeEach(() => {
    vi.clearAllMocks();
    auth.asUnauthenticated();
  });

  it('returns 401 without session', async () => {
    const res = await GET();
    const { status, body } = await parseResponse(res);

    expect(status).toBe(401);
    expect(body.error).toBe('Unauthorized');
  });

  it('returns claimed sites for authenticated operator', async () => {
    auth.asOperator();
    sqlMock.mockResolvedValueOnce([
      {
        site_id: 1,
        site_name: 'Test Bar',
        city: 'Minneapolis',
        listing_status: 'standard',
        claim_status: 'approved',
        requested_at: '2026-01-01',
        reviewed_at: '2026-01-02',
      },
    ]);

    const res = await GET();
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.sites).toHaveLength(1);
    expect(body.sites[0].site_name).toBe('Test Bar');
  });

  it('returns empty array when no claims', async () => {
    auth.asOperator();
    sqlMock.mockResolvedValueOnce([]);

    const res = await GET();
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.sites).toEqual([]);
  });

  it('uses correct column name (s.id not s.site_id) in JOIN', async () => {
    auth.asOperator();
    sqlMock.mockResolvedValueOnce([]);

    await GET();

    expect(sqlMock).toHaveBeenCalledTimes(1);
    const call = sqlMock.mock.calls[0];
    const query = call[0].join('');
    // Should use s.id in the JOIN and SELECT
    expect(query).toContain('s.id as site_id');
    expect(query).toContain('JOIN sites s ON sc.site_id = s.id');
    // Should NOT reference s.site_id
    expect(query).not.toContain('s.site_id');
  });
});
