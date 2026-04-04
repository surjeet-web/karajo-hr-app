import { requireAuth, jsonResponse, errorResponse, corsHeaders, getQueryParams, parseBody } from '../../../utils/auth';
import { getDB, saveDB, generateId } from '../../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const database = await getDB();
    const params = getQueryParams(request);
    const status = params.get('status');
    let reviews = database.performance.reviews;
    if (status) reviews = reviews.filter((r: { status: string }) => r.status === status);
    return jsonResponse({ reviews });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch reviews', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);
    if (!body.reviewer) return errorResponse('Reviewer is required', 400);
    if (!body.rating) return errorResponse('Rating is required', 400);
    const database = await getDB();
    const newReview = {
      id: generateId(),
      reviewer: body.reviewer,
      type: body.type || 'Peer Review',
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      rating: body.rating,
      summary: body.summary || '',
    };
    database.performance.reviews.unshift(newReview);
    database.performance.overview.completedReviews += 1;
    database.performance.overview.totalReviews += 1;
    await saveDB(database);
    return jsonResponse({ review: newReview }, 201);
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to submit review', 500);
  }
}
