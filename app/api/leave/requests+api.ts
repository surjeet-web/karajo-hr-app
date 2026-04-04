import { requireAuth, jsonResponse, errorResponse, corsHeaders, getQueryParams } from '../../utils/auth';
import { getDB, saveDB, generateId } from '../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const database = await getDB();
    const params = getQueryParams(request);
    const status = params.get('status');

    let requests = database.leave.requests;
    if (status) {
      requests = requests.filter((r: any) => r.status === status);
    }

    return jsonResponse({
      balances: database.leave.balances,
      requests,
      total: requests.length,
    });
  } catch (error: any) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch leave data', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(request);
    const body = await request.json();

    const { type, startDate, endDate, reason } = body;
    if (!type) return errorResponse('Leave type is required', 400);
    if (!startDate) return errorResponse('Start date is required', 400);
    if (!endDate) return errorResponse('End date is required', 400);

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const database = await getDB();
    const balance = database.leave.balances.find((b: any) => b.type === type);

    if (balance && balance.remaining !== null && balance.remaining < days) {
      return errorResponse(`Insufficient ${type} leave balance. Only ${balance.remaining} days remaining.`, 400);
    }

    const newRequest = {
      id: database.leave.nextId,
      type,
      startDate,
      endDate,
      days,
      reason: reason || '',
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
      message: `${days} day(s) of ${type} leave requested`,
      time: new Date().toISOString(),
      type: 'info',
      read: false,
    });

    await saveDB(database);
    return jsonResponse({ request: newRequest }, 201);
  } catch (error: any) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to create leave request', 500);
  }
}
