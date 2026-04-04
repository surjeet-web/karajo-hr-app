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
    const type = params.get('type');
    let feedback = database.performance.feedback;
    if (type) feedback = feedback.filter((f: any) => f.type === type);
    return jsonResponse({ feedback });
  } catch (error: any) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch feedback', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);
    if (!body.text) return errorResponse('Feedback text is required', 400);
    const database = await getDB();
    const newFeedback = {
      id: generateId(),
      from: body.from || 'You',
      to: body.to || '',
      type: body.type || 'positive',
      date: new Date().toISOString().split('T')[0],
      text: body.text,
      category: body.category || 'General',
    };
    database.performance.feedback.unshift(newFeedback);
    await saveDB(database);
    return jsonResponse({ feedback: newFeedback }, 201);
  } catch (error: any) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to submit feedback', 500);
  }
}
