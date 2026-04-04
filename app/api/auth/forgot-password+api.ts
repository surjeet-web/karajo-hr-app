import { jsonResponse, errorResponse, corsHeaders } from '../../utils/auth';
import { getDB } from '../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.email) return errorResponse('Email is required', 400);

    const database = await getDB();
    const user = database.users.find((u: any) => u.email === body.email);
    if (!user) return errorResponse('No account found with that email', 404);

    return jsonResponse({ success: true, message: 'Password reset link sent to your email' });
  } catch (error: any) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to process request', 500);
  }
}
