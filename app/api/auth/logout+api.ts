import { requireAuth, jsonResponse, errorResponse, corsHeaders } from '../../utils/auth';
import { getDB, saveDB } from '../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function POST(request: Request) {
  try {
    const { userId } = await requireAuth(request);
    const database = await getDB();

    database.tokens = database.tokens.filter((t: any) => t.userId !== userId);
    await saveDB(database);

    return jsonResponse({ success: true });
  } catch (error: any) {
    if (error instanceof Response) throw error;
    return errorResponse('Logout failed', 500);
  }
}
