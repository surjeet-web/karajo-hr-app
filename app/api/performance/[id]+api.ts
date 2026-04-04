import { requireAuth, jsonResponse, errorResponse, corsHeaders } from '../../utils/auth';
import { parseBody } from '../../utils/auth';
import { getDB, saveDB } from '../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function PUT(request: Request, { id }: { id: string }) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);

    const database = await getDB();
    const index = database.performance.goals.findIndex((g: any) => g.id === parseInt(id));

    if (index === -1) return errorResponse('Goal not found', 404);

    if (body.progress !== undefined) {
      database.performance.goals[index].progress = body.progress;
      database.performance.goals[index].status =
        body.progress >= 100 ? 'completed' : body.progress < 30 ? 'behind' : 'on-track';
    }

    await saveDB(database);
    return jsonResponse({ goal: database.performance.goals[index] });
  } catch (error: any) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to update goal', 500);
  }
}
