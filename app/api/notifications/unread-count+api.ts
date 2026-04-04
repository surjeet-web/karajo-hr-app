import { requireAuth, jsonResponse, errorResponse, corsHeaders } from '../../utils/auth';
import { getDB } from '../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const database = await getDB();
    return jsonResponse({ count: database.notifications.filter((n: any) => !n.read).length });
  } catch (error: any) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch unread count', 500);
  }
}
