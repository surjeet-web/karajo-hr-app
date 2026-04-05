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
    const status = params.get('status');
    const type = params.get('type');

    let records = [...database.penalties.records];
    if (status) records = records.filter((r: { status: string }) => r.status === status);
    if (type) records = records.filter((r: { type: string }) => r.type.toLowerCase().includes(type.toLowerCase()));

    return jsonResponse({
      records,
      appeals: database.penalties.appeals,
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch penalties', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);

    const { type, date, severity, description, fine } = body;
    if (!type) return errorResponse('Type is required', 400);
    if (!date) return errorResponse('Date is required', 400);

    const database = await getDB();
    const newPenalty = {
      id: database.penalties.nextId,
      type,
      date,
      severity: severity || 'warning',
      status: 'active',
      description: description || '',
      fine: fine || 0,
      issuedBy: body.issuedBy || 'HR Department',
      reference: `PEN-${new Date().getFullYear()}-${String(database.penalties.nextId).padStart(3, '0')}`,
      appealDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    database.penalties.records.unshift(newPenalty);
    database.penalties.nextId += 1;

    await saveDB(database);
    return jsonResponse({ penalty: newPenalty }, 201);
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to create penalty', 500);
  }
}

export async function PUT(request: Request) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);

    if (!body.id) return errorResponse('Penalty ID is required', 400);

    const database = await getDB();
    const index = database.penalties.records.findIndex((r: { id: number }) => r.id === body.id);

    if (index === -1) return errorResponse('Penalty not found', 404);

    const existing = database.penalties.records[index];

    database.penalties.records[index] = {
      ...existing,
      type: body.type || existing.type,
      date: body.date || existing.date,
      severity: body.severity || existing.severity,
      status: body.status || existing.status,
      description: body.description !== undefined ? body.description : existing.description,
      fine: body.fine !== undefined ? body.fine : existing.fine,
      issuedBy: body.issuedBy || existing.issuedBy,
      appealDeadline: body.appealDeadline || existing.appealDeadline,
    };

    await saveDB(database);
    return jsonResponse({ penalty: database.penalties.records[index] });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to update penalty', 500);
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAuth(request);
    const params = getQueryParams(request);
    const id = parseInt(params.get('id') || '0');

    if (!id) return errorResponse('Penalty ID is required', 400);

    const database = await getDB();
    const index = database.penalties.records.findIndex((r: { id: number }) => r.id === id);

    if (index === -1) return errorResponse('Penalty not found', 404);

    const deleted = database.penalties.records.splice(index, 1)[0];
    await saveDB(database);

    return jsonResponse({ message: 'Penalty deleted', penalty: deleted });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to delete penalty', 500);
  }
}
