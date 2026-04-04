import { requireAuth, jsonResponse, errorResponse, corsHeaders, getQueryParams } from '../../../utils/auth';
import { getDB, saveDB, generateId } from '../../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const database = await getDB();
    const params = getQueryParams(request);
    const date = params.get('date');

    if (date) {
      const items = database.activities.items.filter((a: { date: string }) => a.date === date);
      return jsonResponse({ items, date });
    }

    return jsonResponse({ items: database.activities.items });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch activities', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(request);
    const body = await request.json();

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
