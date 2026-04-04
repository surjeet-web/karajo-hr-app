import { requireAuth, jsonResponse, errorResponse, corsHeaders } from '../../../utils/auth';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function POST(request: Request) {
  try {
    await requireAuth(request);
    return jsonResponse({ verified: true, qrValid: true });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('QR verification failed', 500);
  }
}
