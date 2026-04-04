import { requireAuth, jsonResponse, errorResponse, corsHeaders } from '../../../utils/auth';
import { getDB } from '../../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const database = await getDB();
    return jsonResponse({ documents: database.payroll.taxDocuments });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch tax documents', 500);
  }
}
