import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRequest, parseResponse } from '@/test/api-helpers';

// Mock auth module
const createUserMock = vi.fn();
const getUserByEmailMock = vi.fn();

vi.mock('@/lib/auth', () => ({
  authOptions: {},
  createUser: (...args: unknown[]) => createUserMock(...args),
  getUserByEmail: (...args: unknown[]) => getUserByEmailMock(...args),
}));

const { POST } = await import('../route');

describe('POST /api/auth/signup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getUserByEmailMock.mockResolvedValue(null);
  });

  it('returns 400 when email missing', async () => {
    const req = createRequest('/api/auth/signup', {
      method: 'POST',
      body: { password: 'password123' },
    });
    const res = await POST(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(400);
    expect(body.error).toContain('Email and password');
  });

  it('returns 400 when password missing', async () => {
    const req = createRequest('/api/auth/signup', {
      method: 'POST',
      body: { email: 'test@test.com' },
    });
    const res = await POST(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(400);
    expect(body.error).toContain('Email and password');
  });

  it('returns 400 for invalid email format', async () => {
    const req = createRequest('/api/auth/signup', {
      method: 'POST',
      body: { email: 'not-an-email', password: 'password123' },
    });
    const res = await POST(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(400);
    expect(body.error).toContain('Invalid email');
  });

  it('returns 400 for short password', async () => {
    const req = createRequest('/api/auth/signup', {
      method: 'POST',
      body: { email: 'test@test.com', password: '1234567' },
    });
    const res = await POST(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(400);
    expect(body.error).toContain('at least 8');
  });

  it('returns 409 when email already exists', async () => {
    getUserByEmailMock.mockResolvedValue({ id: 1, email: 'test@test.com' });

    const req = createRequest('/api/auth/signup', {
      method: 'POST',
      body: { email: 'test@test.com', password: 'password123' },
    });
    const res = await POST(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(409);
    expect(body.error).toContain('already exists');
  });

  it('creates user successfully', async () => {
    createUserMock.mockResolvedValue({ id: 1, email: 'new@test.com' });

    const req = createRequest('/api/auth/signup', {
      method: 'POST',
      body: {
        email: 'new@test.com',
        password: 'password123',
        name: 'New User',
      },
    });
    const res = await POST(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(201);
    expect(body.message).toContain('successfully');
    expect(body.user.email).toBe('new@test.com');
  });

  it('returns 500 when createUser returns null', async () => {
    createUserMock.mockResolvedValue(null);

    const req = createRequest('/api/auth/signup', {
      method: 'POST',
      body: { email: 'fail@test.com', password: 'password123' },
    });
    const res = await POST(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(500);
    expect(body.error).toContain('Failed to create');
  });

  it('passes name and phone to createUser', async () => {
    createUserMock.mockResolvedValue({ id: 1, email: 'new@test.com' });

    const req = createRequest('/api/auth/signup', {
      method: 'POST',
      body: {
        email: 'new@test.com',
        password: 'password123',
        name: 'Test User',
        phone: '555-1234',
      },
    });
    await POST(req);

    expect(createUserMock).toHaveBeenCalledWith(
      'new@test.com',
      'password123',
      'Test User',
      '555-1234'
    );
  });
});
