import { requireAuth, jsonResponse, errorResponse, corsHeaders } from '../../utils/auth';
import { getDB, saveDB } from '../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function PUT(request: Request) {
  try {
    await requireAuth(request);
    const database = await getDB();
    database.notifications = database.notifications.map((n: any) => ({ ...n, read: true }));
    await saveDB(database);
    return jsonResponse({ success: true });
  } catch (error: any) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to mark all read', 500);
  }
}
