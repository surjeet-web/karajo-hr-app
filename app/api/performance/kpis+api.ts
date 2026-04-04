import { requireAuth, jsonResponse, errorResponse, corsHeaders, getQueryParams } from '../../utils/auth';
import { getDB } from '../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const database = await getDB();
    const params = getQueryParams(request);
    const category = params.get('category');
    let kpis = database.performance.kpis;
    if (category) kpis = kpis.filter((k: any) => k.category === category);
    return jsonResponse({ kpis });
  } catch (error: any) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch KPIs', 500);
  }
}
