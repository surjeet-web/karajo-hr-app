import { requireAuth, jsonResponse, errorResponse, corsHeaders } from '../../../utils/auth';
import { getDB } from '../../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function POST(request: Request) {
  try {
    await requireAuth(request);
    const body = await request.json();
    return jsonResponse({ verified: true, location: body });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Location verification failed', 500);
  }
}
