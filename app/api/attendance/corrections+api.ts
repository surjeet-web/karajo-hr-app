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
    const status = params.get('status');

    let corrections = [...database.attendance.corrections];
    if (status) corrections = corrections.filter((c: { status: string }) => c.status === status);

    return jsonResponse({
      data: corrections,
      total: corrections.length,
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch corrections', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);

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

export async function PUT(request: Request) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);

    if (!body.id) return errorResponse('Correction ID is required', 400);

    const database = await getDB();
    const index = database.attendance.corrections.findIndex((c: { id: number }) => c.id === body.id);

    if (index === -1) return errorResponse('Correction not found', 404);

    const existing = database.attendance.corrections[index];

    if (existing.status !== 'pending') {
      return errorResponse('Cannot update a correction that is not pending', 400);
    }

    database.attendance.corrections[index] = {
      ...existing,
      date: body.date || existing.date,
      reason: body.reason !== undefined ? body.reason : existing.reason,
      correctedCheckIn: body.correctedCheckIn !== undefined ? body.correctedCheckIn : existing.correctedCheckIn,
      correctedCheckOut: body.correctedCheckOut !== undefined ? body.correctedCheckOut : existing.correctedCheckOut,
      status: body.status || existing.status,
    };

    await saveDB(database);
    return jsonResponse({ correction: database.attendance.corrections[index] });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to update correction', 500);
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAuth(request);
    const params = getQueryParams(request);
    const id = parseInt(params.get('id') || '0');

    if (!id) return errorResponse('Correction ID is required', 400);

    const database = await getDB();
    const index = database.attendance.corrections.findIndex((c: { id: number }) => c.id === id);

    if (index === -1) return errorResponse('Correction not found', 404);

    const deleted = database.attendance.corrections.splice(index, 1)[0];
    await saveDB(database);

    return jsonResponse({ message: 'Correction deleted', correction: deleted });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to delete correction', 500);
  }
}
