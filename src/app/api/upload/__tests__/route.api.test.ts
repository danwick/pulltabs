import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseResponse, setupAuthMock } from '@/test/api-helpers';
import { NextRequest } from 'next/server';

// Mock next-auth
const getServerSessionMock = vi.fn();
vi.mock('next-auth', () => ({
  getServerSession: (...args: unknown[]) => getServerSessionMock(...args),
}));

// Mock @vercel/blob
const putMock = vi.fn();
vi.mock('@vercel/blob', () => ({
  put: (...args: unknown[]) => putMock(...args),
}));

// Mock auth options
vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

const { POST } = await import('../route');

function createUploadRequest(options: {
  file?: File;
  siteId?: string;
}): NextRequest {
  const formData = new FormData();
  if (options.file) {
    formData.append('file', options.file);
  }
  if (options.siteId) {
    formData.append('siteId', options.siteId);
  }
  return new NextRequest(new URL('/api/upload', 'http://localhost:3000'), {
    method: 'POST',
    body: formData,
  });
}

function makeFile(
  name: string,
  type: string,
  sizeBytes: number
): File {
  // Create a blob of exactly the right size
  const content = new Uint8Array(sizeBytes);
  return new File([content], name, { type });
}

describe('POST /api/upload', () => {
  const auth = setupAuthMock(getServerSessionMock);

  beforeEach(() => {
    vi.clearAllMocks();
    auth.asUnauthenticated();
    putMock.mockResolvedValue({
      url: 'https://blob.vercel-storage.com/test.jpg',
      pathname: 'sites/1/test.jpg',
    });
  });

  it('returns 401 without session', async () => {
    const req = createUploadRequest({
      file: makeFile('test.jpg', 'image/jpeg', 100),
      siteId: '1',
    });
    const res = await POST(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(401);
    expect(body.error).toBe('Unauthorized');
  });

  it('returns 400 when no file provided', async () => {
    auth.asOperator();
    const req = createUploadRequest({ siteId: '1' });
    const res = await POST(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(400);
    expect(body.error).toContain('No file');
  });

  it('returns 400 when no siteId provided', async () => {
    auth.asOperator();
    const req = createUploadRequest({
      file: makeFile('test.jpg', 'image/jpeg', 100),
    });
    const res = await POST(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(400);
    expect(body.error).toContain('No siteId');
  });

  it('returns 400 for invalid file type', async () => {
    auth.asOperator();
    const req = createUploadRequest({
      file: makeFile('doc.pdf', 'application/pdf', 100),
      siteId: '1',
    });
    const res = await POST(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(400);
    expect(body.error).toContain('Invalid file type');
  });

  it('returns 400 for file over 5MB', async () => {
    auth.asOperator();
    const req = createUploadRequest({
      file: makeFile('big.jpg', 'image/jpeg', 6 * 1024 * 1024),
      siteId: '1',
    });
    const res = await POST(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(400);
    expect(body.error).toContain('too large');
  });

  it('uploads JPEG successfully', async () => {
    auth.asOperator();
    const req = createUploadRequest({
      file: makeFile('photo.jpg', 'image/jpeg', 1000),
      siteId: '42',
    });
    const res = await POST(req);
    const { status, body } = await parseResponse(res);

    expect(status).toBe(200);
    expect(body.url).toBeDefined();
    expect(body.pathname).toBeDefined();
    expect(putMock).toHaveBeenCalledTimes(1);
    const [filename, , options] = putMock.mock.calls[0];
    expect(filename).toContain('sites/42/');
    expect(options.access).toBe('public');
  });

  it('uploads PNG successfully', async () => {
    auth.asOperator();
    const req = createUploadRequest({
      file: makeFile('img.png', 'image/png', 1000),
      siteId: '1',
    });
    const res = await POST(req);
    const { status } = await parseResponse(res);

    expect(status).toBe(200);
  });

  it('uploads WebP successfully', async () => {
    auth.asOperator();
    const req = createUploadRequest({
      file: makeFile('img.webp', 'image/webp', 1000),
      siteId: '1',
    });
    const res = await POST(req);
    const { status } = await parseResponse(res);

    expect(status).toBe(200);
  });
});
