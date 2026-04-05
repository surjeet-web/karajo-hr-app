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

    const page = parseInt(params.get('page') || '1');
    const limit = parseInt(params.get('limit') || '20');
    const status = params.get('status') || '';
    const type = params.get('type') || '';
    const startDate = params.get('startDate') || '';
    const endDate = params.get('endDate') || '';

    let requests = [...database.leave.requests];

    if (status) requests = requests.filter((r: { status: string }) => r.status === status);
    if (type) requests = requests.filter((r: { type: string }) => r.type === type);
    if (startDate) requests = requests.filter((r: { startDate: string }) => r.startDate >= startDate);
    if (endDate) requests = requests.filter((r: { endDate: string }) => r.endDate <= endDate);

    requests.sort((a: { id: number }, b: { id: number }) => b.id - a.id);

    const total = requests.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedRequests = requests.slice(offset, offset + limit);

    return jsonResponse({
      data: paginatedRequests,
      pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch leave history', 500);
  }
}
