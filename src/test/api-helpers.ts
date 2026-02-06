import { vi } from 'vitest';
import { NextRequest } from 'next/server';

// --- Session Mocks ---

interface MockUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface MockSession {
  user: MockUser;
  expires: string;
}

export function mockSession(
  role: 'operator' | 'super_admin' = 'operator'
): MockSession {
  return {
    user: {
      id: '1',
      email: role === 'super_admin' ? 'admin@test.com' : 'user@test.com',
      name: role === 'super_admin' ? 'Admin User' : 'Test User',
      role: role === 'super_admin' ? 'super_admin' : 'operator',
    },
    expires: new Date(Date.now() + 86400000).toISOString(),
  };
}

// --- SQL Mock ---

export interface CapturedQuery {
  strings: string[];
  values: unknown[];
}

export function createMockSql(returnValue: Record<string, unknown>[] = []) {
  const queries: CapturedQuery[] = [];

  const sqlFn = (strings: TemplateStringsArray, ...values: unknown[]) => {
    queries.push({ strings: [...strings], values });
    return Promise.resolve(returnValue);
  };

  // Make it callable as both tagged template and function
  return { sql: sqlFn, queries };
}

// --- Request Helpers ---

export function createRequest(
  url: string,
  options: {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
  } = {}
): NextRequest {
  const { method = 'GET', body, headers = {} } = options;
  const hdrs: Record<string, string> = { ...headers };
  let reqBody: string | undefined;
  if (body) {
    reqBody = JSON.stringify(body);
    hdrs['content-type'] = 'application/json';
  }
  return new NextRequest(new URL(url, 'http://localhost:3000'), {
    method,
    headers: hdrs,
    body: reqBody,
  });
}

export function createFormDataRequest(
  url: string,
  formData: FormData
): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost:3000'), {
    method: 'POST',
    body: formData,
  });
}

// --- Response Helpers ---

export async function parseResponse(response: Response) {
  const json = await response.json();
  return { status: response.status, body: json };
}

// --- Common Mock Setup ---

/**
 * Sets up getServerSession mock. Call in beforeEach.
 * Returns a function to change the session during a test.
 */
export function setupAuthMock(
  getServerSessionMock: ReturnType<typeof vi.fn>
) {
  let currentSession: MockSession | null = null;

  getServerSessionMock.mockImplementation(() =>
    Promise.resolve(currentSession)
  );

  return {
    setSession: (session: MockSession | null) => {
      currentSession = session;
      getServerSessionMock.mockImplementation(() =>
        Promise.resolve(currentSession)
      );
    },
    asOperator: () => {
      currentSession = mockSession('operator');
      getServerSessionMock.mockImplementation(() =>
        Promise.resolve(currentSession)
      );
    },
    asSuperAdmin: () => {
      currentSession = mockSession('super_admin');
      getServerSessionMock.mockImplementation(() =>
        Promise.resolve(currentSession)
      );
    },
    asUnauthenticated: () => {
      currentSession = null;
      getServerSessionMock.mockImplementation(() =>
        Promise.resolve(null)
      );
    },
  };
}
