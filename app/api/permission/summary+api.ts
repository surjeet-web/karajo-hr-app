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
      monthlyAllowance: database.permission.monthlyAllowance,
      totalHoursUsed: database.permission.totalHoursUsed,
      remaining: Math.max(0, database.permission.monthlyAllowance - database.permission.totalHoursUsed),
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch permission summary', 500);
  }
}
