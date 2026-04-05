import { requireAuth, jsonResponse, errorResponse, corsHeaders, getQueryParams, parseBody } from '../../utils/auth';
import { getDB, saveDB, generateId } from '../../utils/db';

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

    let requests = [...database.overtime.requests];
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
        totalApproved: database.overtime.totalApproved,
        totalPending: database.overtime.totalPending,
      },
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch overtime', 500);
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
    const newRequest = {
      id: database.overtime.nextId,
      date: body.date,
      startTime: body.startTime,
      endTime: body.endTime,
      duration,
      reason: body.reason || '',
      status: 'pending',
      appliedOn: new Date().toISOString().split('T')[0],
    };

    database.overtime.requests.unshift(newRequest);
    database.overtime.totalPending += duration;
    database.overtime.nextId += 1;
    await saveDB(database);

    return jsonResponse({ request: newRequest }, 201);
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to create overtime request', 500);
  }
}

export async function PUT(request: Request) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);

    if (!body.id) return errorResponse('Overtime request ID is required', 400);

    const database = await getDB();
    const index = database.overtime.requests.findIndex((r: { id: number }) => r.id === body.id);

    if (index === -1) return errorResponse('Overtime request not found', 404);

    const existing = database.overtime.requests[index];

    if (existing.status !== 'pending') {
      return errorResponse('Cannot update an overtime request that is not pending', 400);
    }

    let newDuration = existing.duration;
    if (body.startTime && body.endTime) {
      const [sh, sm] = body.startTime.split(':').map(Number);
      const [eh, em] = body.endTime.split(':').map(Number);
      newDuration = Math.round(((eh * 60 + em) - (sh * 60 + sm)) / 60 * 10) / 10;
      if (newDuration <= 0) return errorResponse('End time must be after start time', 400);

      const diff = newDuration - existing.duration;
      database.overtime.totalPending += diff;
    }

    database.overtime.requests[index] = {
      ...existing,
      date: body.date || existing.date,
      startTime: body.startTime || existing.startTime,
      endTime: body.endTime || existing.endTime,
      duration: newDuration,
      reason: body.reason !== undefined ? body.reason : existing.reason,
    };

    await saveDB(database);
    return jsonResponse({ request: database.overtime.requests[index] });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to update overtime request', 500);
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAuth(request);
    const params = getQueryParams(request);
    const id = parseInt(params.get('id') || '0');

    if (!id) return errorResponse('Overtime request ID is required', 400);

    const database = await getDB();
    const index = database.overtime.requests.findIndex((r: { id: number }) => r.id === id);

    if (index === -1) return errorResponse('Overtime request not found', 404);

    const deleted = database.overtime.requests[index];

    if (deleted.status === 'pending') {
      database.overtime.totalPending = Math.max(0, database.overtime.totalPending - deleted.duration);
    } else if (deleted.status === 'approved') {
      database.overtime.totalApproved = Math.max(0, database.overtime.totalApproved - deleted.duration);
    }

    database.overtime.requests.splice(index, 1);
    await saveDB(database);

    return jsonResponse({ message: 'Overtime request deleted', request: deleted });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to delete overtime request', 500);
  }
}
