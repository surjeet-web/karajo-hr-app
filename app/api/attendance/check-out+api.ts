import { requireAuth, jsonResponse, errorResponse, corsHeaders } from '../../../utils/auth';
import { getDB, saveDB, generateId } from '../../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function POST(request: Request) {
  try {
    await requireAuth(request);
    const database = await getDB();
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 5);
    const checkInTime = database.attendance.today.checkIn;

    let totalHours = 0;
    if (checkInTime) {
      const [inH, inM] = checkInTime.split(':').map(Number);
      const diff = (now.getHours() * 60 + now.getMinutes()) - (inH * 60 + inM);
      totalHours = Math.round((diff / 60) * 100) / 100;
    }

    const todayRecord = {
      date: database.attendance.today.date,
      checkIn: database.attendance.today.checkIn,
      checkOut: timeStr,
      totalHours,
      status: totalHours > 9 ? 'overtime' : database.attendance.today.status,
      location: database.attendance.today.location,
    };

    database.attendance.today = {
      ...database.attendance.today,
      checkOut: timeStr,
      totalHours,
      status: todayRecord.status,
    };
    database.attendance.history.unshift(todayRecord);

    database.notifications.unshift({
      id: generateId(),
      title: 'Checked Out',
      message: `You checked out at ${timeStr}. Total: ${totalHours}h`,
      time: now.toISOString(),
      type: 'info',
      read: false,
    });

    await saveDB(database);
    return jsonResponse({ attendance: database.attendance.today });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to check out', 500);
  }
}
