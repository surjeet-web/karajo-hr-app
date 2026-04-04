import { getDB, saveDB } from '../../../utils/db';
import { parseBody, jsonResponse, errorResponse, corsHeaders } from '../../../utils/auth';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function POST(request: Request) {
  try {
    const { refreshToken } = await parseBody(request);

    if (!refreshToken) {
      return errorResponse('Refresh token required', 400);
    }

    const database = await getDB();
    const tokenEntry = database.tokens.find(
      (t: { refreshToken: string; refreshExpiresAt: number }) => t.refreshToken === refreshToken && t.refreshExpiresAt > Date.now()
    );

    if (!tokenEntry) {
      return errorResponse('Invalid or expired refresh token', 401);
    }

    const newToken = 'tok_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    const newRefreshToken = 'tok_' + Math.random().toString(36).substring(2) + Date.now().toString(36);

    tokenEntry.token = newToken;
    tokenEntry.refreshToken = newRefreshToken;
    tokenEntry.expiresAt = Date.now() + 24 * 60 * 60 * 1000;

    await saveDB(database);

    return jsonResponse({ token: newToken, refreshToken: newRefreshToken });
  } catch (error) {
    return errorResponse('Token refresh failed', 500);
  }
}
