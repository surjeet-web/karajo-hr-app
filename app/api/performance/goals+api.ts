import { requireAuth, jsonResponse, errorResponse, corsHeaders, getQueryParams } from '../../utils/auth';
import { parseBody } from '../../utils/auth';
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
    if (category) goals = goals.filter((g: any) => g.category === category);
    return jsonResponse({ goals });
  } catch (error: any) {
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
  } catch (error: any) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to create goal', 500);
  }
}
