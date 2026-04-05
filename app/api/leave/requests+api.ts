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

export async function PUT(request: Request) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);

    if (!body.id) return errorResponse('Leave request ID is required', 400);

    const database = await getDB();
    const index = database.leave.requests.findIndex((r: { id: number }) => r.id === body.id);

    if (index === -1) return errorResponse('Leave request not found', 404);

    const existing = database.leave.requests[index];

    if (existing.status !== 'pending') {
      return errorResponse('Cannot update a leave request that is not pending', 400);
    }

    if (body.type && body.type !== existing.type) {
      const oldBalance = database.leave.balances.find((b: { type: string }) => b.type === existing.type);
      if (oldBalance && oldBalance.remaining !== null) {
        oldBalance.used -= existing.days;
        oldBalance.remaining += existing.days;
      }

      const newBalance = database.leave.balances.find((b: { type: string }) => b.type === body.type);
      if (newBalance && newBalance.remaining !== null && newBalance.remaining < existing.days) {
        oldBalance.used += existing.days;
        oldBalance.remaining -= existing.days;
        return errorResponse(`Insufficient ${body.type} leave balance`, 400);
      }
      if (newBalance && newBalance.remaining !== null) {
        newBalance.used += existing.days;
        newBalance.remaining -= existing.days;
      }
    }

    if (body.startDate && body.endDate) {
      const start = new Date(body.startDate);
      const end = new Date(body.endDate);
      const newDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const balance = database.leave.balances.find((b: { type: string }) => b.type === (body.type || existing.type));
      if (balance && balance.remaining !== null) {
        balance.used -= existing.days;
        balance.remaining += existing.days;
        if (balance.remaining < newDays) {
          balance.used += existing.days;
          balance.remaining -= existing.days;
          return errorResponse('Insufficient leave balance for new dates', 400);
        }
        balance.used += newDays;
        balance.remaining -= newDays;
        database.leave.requests[index].days = newDays;
      }
    }

    database.leave.requests[index] = {
      ...database.leave.requests[index],
      type: body.type || existing.type,
      startDate: body.startDate || existing.startDate,
      endDate: body.endDate || existing.endDate,
      reason: body.reason !== undefined ? body.reason : existing.reason,
      delegate: body.delegate !== undefined ? body.delegate : existing.delegate,
      documents: body.documents !== undefined ? body.documents : existing.documents,
    };

    await saveDB(database);
    return jsonResponse({ request: database.leave.requests[index] });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to update leave request', 500);
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAuth(request);
    const params = getQueryParams(request);
    const id = parseInt(params.get('id') || '0');

    if (!id) return errorResponse('Leave request ID is required', 400);

    const database = await getDB();
    const index = database.leave.requests.findIndex((r: { id: number }) => r.id === id);

    if (index === -1) return errorResponse('Leave request not found', 404);

    const deleted = database.leave.requests[index];

    if (deleted.status === 'approved' || deleted.status === 'pending') {
      const balance = database.leave.balances.find((b: { type: string }) => b.type === deleted.type);
      if (balance && balance.remaining !== null) {
        balance.used -= deleted.days;
        balance.remaining += deleted.days;
      }
    }

    database.leave.requests.splice(index, 1);
    await saveDB(database);

    return jsonResponse({ message: 'Leave request deleted', request: deleted });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to delete leave request', 500);
  }
}
