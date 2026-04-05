import { requireAuth, jsonResponse, errorResponse, corsHeaders, getQueryParams, parseBody } from '../../utils/db';
import { getDB, saveDB, generateId } from '../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const database = await getDB();
    const params = getQueryParams(request);

    const page = parseInt(params.get('page') || '1');
    const limit = parseInt(params.get('limit') || '20');
    const status = params.get('status') || '';

    let submissions = [...(database.activities.submissions || [])];

    if (status) submissions = submissions.filter((s: { status: string }) => s.status === status);

    submissions.sort((a: { id: number }, b: { id: number }) => b.id - a.id);

    const total = submissions.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedSubmissions = submissions.slice(offset, offset + limit);

    return jsonResponse({
      data: paginatedSubmissions,
      pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch submissions', 500);
  }
}

export async function PUT(request: Request) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);

    if (!body.id) return errorResponse('Submission ID is required', 400);

    const database = await getDB();
    const index = (database.activities.submissions || []).findIndex((s: { id: number }) => s.id === body.id);

    if (index === -1) return errorResponse('Submission not found', 404);

    const existing = database.activities.submissions[index];

    database.activities.submissions[index] = {
      ...existing,
      status: body.status || existing.status,
      hours: body.hours || existing.hours,
      period: body.period || existing.period,
    };

    await saveDB(database);
    return jsonResponse({ submission: database.activities.submissions[index] });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to update submission', 500);
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAuth(request);
    const params = getQueryParams(request);
    const id = parseInt(params.get('id') || '0');

    if (!id) return errorResponse('Submission ID is required', 400);

    const database = await getDB();
    const index = (database.activities.submissions || []).findIndex((s: { id: number }) => s.id === id);

    if (index === -1) return errorResponse('Submission not found', 404);

    const deleted = database.activities.submissions.splice(index, 1)[0];
    await saveDB(database);

    return jsonResponse({ message: 'Submission deleted', submission: deleted });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to delete submission', 500);
  }
}
