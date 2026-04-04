import { requireAuth, jsonResponse, errorResponse, corsHeaders } from '../../utils/auth';
import { parseBody, validateField } from '../../utils/auth';
import { getDB, saveDB, generateId } from '../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function POST(request: Request, { id }: { id: string }) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);

    const { type, explanation } = body;
    if (!type) return errorResponse('Appeal type is required', 400);
    if (!explanation) return errorResponse('Explanation is required', 400);

    const database = await getDB();
    const penalty = database.penalties.records.find((p: any) => p.id === parseInt(id));

    if (!penalty) return errorResponse('Penalty not found', 404);
    if (penalty.status === 'resolved') return errorResponse('Cannot appeal a resolved penalty', 400);

    const appeal = {
      id: generateId(),
      penaltyId: parseInt(id),
      penaltyType: penalty.type,
      type,
      explanation,
      status: 'submitted',
      submittedOn: new Date().toISOString().split('T')[0],
      supportingDoc: body.supportingDoc || null,
    };

    database.penalties.appeals.unshift(appeal);

    database.notifications.unshift({
      id: generateId(),
      title: 'Penalty Appeal Filed',
      message: `Appeal for ${penalty.type} has been submitted`,
      time: new Date().toISOString(),
      type: 'info',
      read: false,
    });

    await saveDB(database);
    return jsonResponse({ appeal }, 201);
  } catch (error: any) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to submit appeal', 500);
  }
}
