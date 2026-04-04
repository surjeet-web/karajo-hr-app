import { requireAuth, jsonResponse, errorResponse, corsHeaders } from '../../../utils/auth';
import { getDB } from '../../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request);
    const database = await getDB();
    const employee = database.employees.find((e: { id: number }) => e.id === parseInt(params.id));

    if (!employee) return errorResponse('Employee not found', 404);
    return jsonResponse({ employee });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch employee', 500);
  }
}
