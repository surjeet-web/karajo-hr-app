import { getDB } from './db';

export async function requireAuth(request: Request): Promise<{ userId: string; user: Record<string, any> }> {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Response(JSON.stringify({ error: 'Unauthorized. Missing token.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = authHeader.replace('Bearer ', '');
  const database = await getDB();
  const tokenEntry = database.tokens.find((t: any) => t.token === token && t.expiresAt > Date.now());

  if (!tokenEntry) {
    throw new Response(JSON.stringify({ error: 'Unauthorized. Invalid or expired token.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const user = database.users.find((u: any) => u.id === tokenEntry.userId);
  if (!user) {
    throw new Response(JSON.stringify({ error: 'User not found.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return { userId: user.id, user };
}

export function jsonResponse(data: any, status = 200) {
  return Response.json(data, {
    status,
    headers: corsHeaders(),
  });
}

export function errorResponse(message: string, status = 400) {
  return Response.json({ error: message }, {
    status,
    headers: corsHeaders(),
  });
}

export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };
}

export async function parseBody(request: Request): Promise<Record<string, any>> {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await request.json();
    }
    return {};
  } catch {
    return {};
  }
}

export function getQueryParams(request: Request): URLSearchParams {
  const url = new URL(request.url);
  return url.searchParams;
}

export function validateField(value: any, fieldName: string, required = true) {
  if (required && (value === undefined || value === null || value === '')) {
    return `${fieldName} is required`;
  }
  return null;
}
