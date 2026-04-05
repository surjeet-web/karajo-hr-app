import { jsonResponse, errorResponse, corsHeaders } from '../../utils/auth';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.token) return errorResponse('Token is required', 400);
    if (!body.newPassword) return errorResponse('New password is required', 400);

    return jsonResponse({ success: true, message: 'Password has been reset successfully' });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to reset password', 500);
  }
}
