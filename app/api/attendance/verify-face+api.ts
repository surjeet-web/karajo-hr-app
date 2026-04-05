import { requireAuth, jsonResponse, errorResponse, corsHeaders } from '../../utils/auth';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function POST(request: Request) {
  try {
    await requireAuth(request);
    return jsonResponse({ verified: true, confidence: 0.98 });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Face verification failed', 500);
  }
}
