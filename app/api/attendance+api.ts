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

    let records = database.attendance.history;
    if (status) {
      records = records.filter((r: any) => r.status === status);
    }

    return jsonResponse({
      today: database.attendance.today,
      history: records,
      corrections: database.attendance.corrections,
    });
  } catch (error: any) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch attendance', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(request);
    const body = await request.json();

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
  } catch (error: any) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to check in', 500);
  }
}
