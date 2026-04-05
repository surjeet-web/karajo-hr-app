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
    const category = params.get('category');
    let goals = database.performance.goals;
    if (category) goals = goals.filter((g: { category: string }) => g.category === category);
    return jsonResponse({ goals });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch goals', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);
    if (!body.title) return errorResponse('Title is required', 400);
    const database = await getDB();
    const newGoal = {
      id: generateId(),
      title: body.title,
      progress: 0,
      deadline: body.deadline || '',
      status: 'on-track',
      priority: body.priority || 'medium',
      category: body.category || 'General',
    };
    database.performance.goals.unshift(newGoal);
    await saveDB(database);
    return jsonResponse({ goal: newGoal }, 201);
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to create goal', 500);
  }
}

export async function PUT(request: Request) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);

    if (!body.id) return errorResponse('Goal ID is required', 400);

    const database = await getDB();
    const index = database.performance.goals.findIndex((g: { id: number }) => g.id === body.id);

    if (index === -1) return errorResponse('Goal not found', 404);

    const existing = database.performance.goals[index];

    database.performance.goals[index] = {
      ...existing,
      title: body.title || existing.title,
      progress: body.progress !== undefined ? body.progress : existing.progress,
      deadline: body.deadline || existing.deadline,
      status: body.status || existing.status,
      priority: body.priority || existing.priority,
      category: body.category || existing.category,
    };

    await saveDB(database);
    return jsonResponse({ goal: database.performance.goals[index] });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to update goal', 500);
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAuth(request);
    const params = getQueryParams(request);
    const id = parseInt(params.get('id') || '0');

    if (!id) return errorResponse('Goal ID is required', 400);

    const database = await getDB();
    const index = database.performance.goals.findIndex((g: { id: number }) => g.id === id);

    if (index === -1) return errorResponse('Goal not found', 404);

    const deleted = database.performance.goals.splice(index, 1)[0];
    await saveDB(database);

    return jsonResponse({ message: 'Goal deleted', goal: deleted });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to delete goal', 500);
  }
}
