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

    let requests = database.overtime.requests;
    if (status) {
      requests = requests.filter((r: any) => r.status === status);
    }

    return jsonResponse({
      summary: {
        totalApproved: database.overtime.totalApproved,
        totalPending: database.overtime.totalPending,
      },
      requests,
    });
  } catch (error: any) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch overtime', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(request);
    const body = await request.json();

    const { date, startTime, endTime, reason } = body;
    if (!date) return errorResponse('Date is required', 400);
    if (!startTime) return errorResponse('Start time is required', 400);
    if (!endTime) return errorResponse('End time is required', 400);

    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const duration = Math.round(((eh * 60 + em) - (sh * 60 + sm)) / 60 * 10) / 10;

    if (duration <= 0) return errorResponse('End time must be after start time', 400);

    const database = await getDB();
    const newRequest = {
      id: database.overtime.nextId,
      date,
      startTime,
      endTime,
      duration,
      reason: reason || '',
      status: 'pending',
      appliedOn: new Date().toISOString().split('T')[0],
    };

    database.overtime.requests.unshift(newRequest);
    database.overtime.totalPending += duration;
    database.overtime.nextId += 1;

    database.notifications.unshift({
      id: generateId(),
      title: 'Overtime Requested',
      message: `${duration}h overtime requested for ${date}`,
      time: new Date().toISOString(),
      type: 'info',
      read: false,
    });

    await saveDB(database);
    return jsonResponse({ request: newRequest }, 201);
  } catch (error: any) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to create overtime request', 500);
  }
}
