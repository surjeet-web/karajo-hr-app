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

    let records = database.penalties.records;
    if (status) {
      records = records.filter((r: any) => r.status === status);
    }

    return jsonResponse({
      records,
      appeals: database.penalties.appeals,
    });
  } catch (error: any) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch penalties', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(request);
    const body = await request.json();

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
      issuedBy: 'HR Department',
      reference: `PEN-${new Date().getFullYear()}-${String(database.penalties.nextId).padStart(3, '0')}`,
      appealDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    database.penalties.records.unshift(newPenalty);
    database.penalties.nextId += 1;

    await saveDB(database);
    return jsonResponse({ penalty: newPenalty }, 201);
  } catch (error: any) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to create penalty', 500);
  }
}
