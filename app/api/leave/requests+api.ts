import { requireAuth, jsonResponse, errorResponse, corsHeaders, getQueryParams, parseBody } from '../../../utils/auth';
import { getDB, saveDB, generateId } from '../../../utils/db';

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
    const sortBy = params.get('sortBy') || 'id';
    const sortOrder = params.get('sortOrder') || 'desc';

    let requests = [...database.leave.requests];

    if (status) requests = requests.filter((r: { status: string }) => r.status === status);
    if (type) requests = requests.filter((r: { type: string }) => r.type === type);
    if (startDate) requests = requests.filter((r: { startDate: string }) => r.startDate >= startDate);
    if (endDate) requests = requests.filter((r: { endDate: string }) => r.endDate <= endDate);

    requests.sort((a: Record<string, any>, b: Record<string, any>) => {
      const aVal = a[sortBy] || 0;
      const bVal = b[sortBy] || 0;
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    const total = requests.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedRequests = requests.slice(offset, offset + limit);

    return jsonResponse({
      data: paginatedRequests,
      pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
      balances: database.leave.balances,
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch leave requests', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);

    if (!body.type) return errorResponse('Leave type is required', 400);
    if (!body.startDate) return errorResponse('Start date is required', 400);
    if (!body.endDate) return errorResponse('End date is required', 400);

    const database = await getDB();
    const start = new Date(body.startDate);
    const end = new Date(body.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const balance = database.leave.balances.find((b: { type: string }) => b.type === body.type);
    if (balance && balance.remaining !== null && balance.remaining < days) {
      return errorResponse(`Insufficient ${body.type} leave balance. Only ${balance.remaining} days remaining.`, 400);
    }

    const newRequest = {
      id: database.leave.nextId,
      type: body.type,
      startDate: body.startDate,
      endDate: body.endDate,
      days,
      reason: body.reason || '',
      status: 'pending',
      appliedOn: new Date().toISOString().split('T')[0],
      delegate: body.delegate || null,
      documents: body.documents || [],
    };

    if (balance && balance.remaining !== null) {
      balance.used += days;
      balance.remaining -= days;
    }

    database.leave.requests.unshift(newRequest);
    database.leave.nextId += 1;

    database.notifications.unshift({
      id: generateId(),
      title: 'Leave Request Submitted',
      message: `${days} day(s) of ${body.type} leave requested`,
      time: new Date().toISOString(),
      type: 'info',
      read: false,
    });

    await saveDB(database);
    return jsonResponse({ request: newRequest }, 201);
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to create leave request', 500);
  }
}
