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
    const date = params.get('date');
    const category = params.get('category');

    let items = [...database.activities.items];
    if (date) items = items.filter((a: { date: string }) => a.date === date);
    if (category) items = items.filter((a: { category: string }) => a.category === category);

    return jsonResponse({ items, date });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch activities', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);

    const { title, project, category, date } = body;
    if (!title) return errorResponse('Title is required', 400);
    if (!project) return errorResponse('Project is required', 400);

    const database = await getDB();
    const newActivity = {
      id: database.activities.nextId,
      title,
      project,
      category: category || 'General',
      date: date || new Date().toISOString().split('T')[0],
      duration: body.duration || '0h 0m',
      time: body.time || '',
      description: body.description || '',
    };

    database.activities.items.unshift(newActivity);
    database.activities.nextId += 1;

    await saveDB(database);
    return jsonResponse({ activity: newActivity }, 201);
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to create activity', 500);
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAuth(request);
    const params = getQueryParams(request);
    const id = parseInt(params.get('id') || '0');

    if (!id) return errorResponse('Activity ID is required', 400);

    const database = await getDB();
    const index = database.activities.items.findIndex((a: { id: number }) => a.id === id);

    if (index === -1) return errorResponse('Activity not found', 404);

    const deleted = database.activities.items.splice(index, 1)[0];
    await saveDB(database);

    return jsonResponse({ message: 'Activity deleted', activity: deleted });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to delete activity', 500);
  }
}
