import { requireAuth, jsonResponse, errorResponse, corsHeaders } from '../../utils/auth';
import { getDB } from '../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const database = await getDB();
    return jsonResponse({
      categories: [
        { id: 'development', name: 'Development', icon: 'code' },
        { id: 'meeting', name: 'Meeting', icon: 'users' },
        { id: 'admin', name: 'Admin', icon: 'clipboard' },
        { id: 'design', name: 'Design', icon: 'pen-tool' },
        { id: 'qa', name: 'QA', icon: 'search' },
      ],
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch categories', 500);
  }
}
