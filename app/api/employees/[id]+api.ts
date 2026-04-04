import { requireAuth, jsonResponse, errorResponse, corsHeaders } from '../../utils/auth';
import { getDB } from '../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request, { id }: { id: string }) {
  try {
    await requireAuth(request);
    const database = await getDB();
    const employee = database.employees.find((e: any) => e.id === parseInt(id));

    if (!employee) return errorResponse('Employee not found', 404);
    return jsonResponse({ employee });
  } catch (error: any) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch employee', 500);
  }
}
