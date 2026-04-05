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
    const type = params.get('type');
    let feedback = database.performance.feedback;
    if (type) feedback = feedback.filter((f: { type: string }) => f.type === type);
    return jsonResponse({ feedback });
  } catch (error) {
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
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to submit feedback', 500);
  }
}

export async function PUT(request: Request) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);

    if (!body.id) return errorResponse('Feedback ID is required', 400);

    const database = await getDB();
    const index = database.performance.feedback.findIndex((f: { id: number }) => f.id === body.id);

    if (index === -1) return errorResponse('Feedback not found', 404);

    const existing = database.performance.feedback[index];

    database.performance.feedback[index] = {
      ...existing,
      from: body.from || existing.from,
      to: body.to || existing.to,
      type: body.type || existing.type,
      date: body.date || existing.date,
      text: body.text || existing.text,
      category: body.category || existing.category,
    };

    await saveDB(database);
    return jsonResponse({ feedback: database.performance.feedback[index] });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to update feedback', 500);
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAuth(request);
    const params = getQueryParams(request);
    const id = parseInt(params.get('id') || '0');

    if (!id) return errorResponse('Feedback ID is required', 400);

    const database = await getDB();
    const index = database.performance.feedback.findIndex((f: { id: number }) => f.id === id);

    if (index === -1) return errorResponse('Feedback not found', 404);

    const deleted = database.performance.feedback.splice(index, 1)[0];
    await saveDB(database);

    return jsonResponse({ message: 'Feedback deleted', feedback: deleted });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to delete feedback', 500);
  }
}
