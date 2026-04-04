import { requireAuth, jsonResponse, errorResponse, corsHeaders } from '../../../utils/auth';
import { getDB, saveDB, generateId } from '../../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function POST(request: Request) {
  try {
    await requireAuth(request);
    const body = await request.json();

    if (!body.date) return errorResponse('Date is required', 400);

    const database = await getDB();
    const correction = {
      id: generateId(),
      date: body.date,
      reason: body.reason || '',
      correctedCheckIn: body.correctedCheckIn || null,
      correctedCheckOut: body.correctedCheckOut || null,
      status: 'pending',
      submittedOn: new Date().toISOString().split('T')[0],
    };

    database.attendance.corrections.unshift(correction);

    database.notifications.unshift({
      id: generateId(),
      title: 'Correction Requested',
      message: `Attendance correction for ${body.date}`,
      time: new Date().toISOString(),
      type: 'info',
      read: false,
    });

    await saveDB(database);
    return jsonResponse({ correction }, 201);
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to submit correction', 500);
  }
}
