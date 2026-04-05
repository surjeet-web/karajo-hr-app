import { requireAuth, jsonResponse, errorResponse, corsHeaders, getQueryParams, parseBody } from '../utils/auth';
import { getDB, saveDB, generateId } from '../utils/db';

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
    const startDate = params.get('startDate') || '';
    const endDate = params.get('endDate') || '';

    let history = [...database.attendance.history];
    if (status) history = history.filter((r: { status: string }) => r.status === status);
    if (date) history = history.filter((r: { date: string }) => r.date === date);
    if (startDate) history = history.filter((r: { date: string }) => r.date >= startDate);
    if (endDate) history = history.filter((r: { date: string }) => r.date <= endDate);
    history.sort((a: { date: string }, b: { date: string }) => b.date.localeCompare(a.date));

    const total = history.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedHistory = history.slice(offset, offset + limit);

    return jsonResponse({
      today: database.attendance.today,
      data: paginatedHistory,
      pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
      corrections: database.attendance.corrections || [],
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch attendance', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);
    const database = await getDB();
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 5);
    const hour = now.getHours();
    const minute = now.getMinutes();
    let status = 'on-time';
    if (hour > 9 || (hour === 9 && minute > 15)) status = 'late';

    database.attendance.today = {
      date: now.toISOString().split('T')[0],
      checkIn: timeStr,
      checkOut: null,
      status,
      location: body.location || 'Office',
      totalHours: 0,
    };

    database.notifications.unshift({
      id: generateId(),
      title: 'Checked In',
      message: `You checked in at ${timeStr} from ${body.location || 'Office'}`,
      time: now.toISOString(),
      type: 'success',
      read: false,
    });

    await saveDB(database);
    return jsonResponse({ attendance: database.attendance.today });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to check in', 500);
  }
}
