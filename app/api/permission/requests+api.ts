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
    const date = params.get('date') || '';

    let requests = [...database.permission.requests];
    if (status) requests = requests.filter((r: { status: string }) => r.status === status);
    if (date) requests = requests.filter((r: { date: string }) => r.date === date);
    requests.sort((a: { id: number }, b: { id: number }) => b.id - a.id);

    const total = requests.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedRequests = requests.slice(offset, offset + limit);

    return jsonResponse({
      data: paginatedRequests,
      pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
      summary: {
        monthlyAllowance: database.permission.monthlyAllowance,
        totalHoursUsed: database.permission.totalHoursUsed,
        remaining: Math.max(0, database.permission.monthlyAllowance - database.permission.totalHoursUsed),
      },
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch permissions', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);
    if (!body.date) return errorResponse('Date is required', 400);
    if (!body.startTime) return errorResponse('Start time is required', 400);
    if (!body.endTime) return errorResponse('End time is required', 400);

    const [sh, sm] = body.startTime.split(':').map(Number);
    const [eh, em] = body.endTime.split(':').map(Number);
    const duration = Math.round(((eh * 60 + em) - (sh * 60 + sm)) / 60 * 10) / 10;
    if (duration <= 0) return errorResponse('End time must be after start time', 400);

    const database = await getDB();
    const remaining = database.permission.monthlyAllowance - database.permission.totalHoursUsed;
    if (duration > remaining) return errorResponse(`Insufficient permission hours. Only ${remaining}h remaining.`, 400);

    const newRequest = {
      id: database.permission.nextId,
      date: body.date,
      startTime: body.startTime,
      endTime: body.endTime,
      duration,
      reason: body.reason || '',
      status: 'pending',
      appliedOn: new Date().toISOString().split('T')[0],
    };

    database.permission.requests.unshift(newRequest);
    database.permission.totalHoursUsed += duration;
    database.permission.nextId += 1;
    await saveDB(database);

    return jsonResponse({ request: newRequest }, 201);
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to create permission request', 500);
  }
}
