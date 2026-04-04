import { requireAuth, jsonResponse, errorResponse, corsHeaders } from '../../../utils/auth';
import { getDB } from '../../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const database = await getDB();
    return jsonResponse({
      projects: [
        { id: 1, name: 'Karajo HRIS Internal Tools' },
        { id: 2, name: 'Project Alpha' },
        { id: 3, name: 'All Hands' },
        { id: 4, name: 'Internal Tools' },
        { id: 5, name: 'Project Y' },
        { id: 6, name: 'Dirga Corp - Mobile App Redesign' },
      ],
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch projects', 500);
  }
}
