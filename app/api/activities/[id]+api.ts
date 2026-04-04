import { requireAuth, jsonResponse, errorResponse, corsHeaders, parseBody } from '../../../utils/auth';
import { getDB, saveDB } from '../../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request);
    const database = await getDB();
    const activity = database.activities.items.find((a: { id: number }) => a.id === parseInt(params.id));

    if (!activity) return errorResponse('Activity not found', 404);
    return jsonResponse({ activity });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch activity', 500);
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request);
    const updates = await parseBody(request);

    const database = await getDB();
    const index = database.activities.items.findIndex((a: { id: number }) => a.id === parseInt(params.id));

    if (index === -1) return errorResponse('Activity not found', 404);

    database.activities.items[index] = { ...database.activities.items[index], ...updates };
    await saveDB(database);

    return jsonResponse({ activity: database.activities.items[index] });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to update activity', 500);
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request);
    const database = await getDB();

    const index = database.activities.items.findIndex((a: { id: number }) => a.id === parseInt(params.id));
    if (index === -1) return errorResponse('Activity not found', 404);

    database.activities.items.splice(index, 1);
    await saveDB(database);

    return new Response(null, { status: 204, headers: corsHeaders() });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to delete activity', 500);
  }
}
