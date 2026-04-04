import { requireAuth, jsonResponse, errorResponse, corsHeaders } from '../../utils/auth';
import { getDB } from '../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const database = await getDB();
    const departments = [...new Set(database.employees.map((e: any) => e.department))].map(name => {
      const members = database.employees.filter((e: any) => e.department === name);
      return { name, head: members[0]?.manager || '', count: members.length };
    });
    return jsonResponse({ departments });
  } catch (error: any) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch departments', 500);
  }
}
