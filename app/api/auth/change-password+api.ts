import { requireAuth, jsonResponse, errorResponse, corsHeaders, parseBody } from '../../../utils/auth';
import { getDB, saveDB } from '../../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function POST(request: Request) {
  try {
    const { userId } = await requireAuth(request);
    const body = await parseBody(request);

    const { currentPassword, newPassword } = body;
    if (!currentPassword) return errorResponse('Current password is required', 400);
    if (!newPassword) return errorResponse('New password is required', 400);
    if (newPassword.length < 6) return errorResponse('Password must be at least 6 characters', 400);

    const database = await getDB();
    const user = database.users.find((u: { id: string }) => u.id === userId);
    if (!user) return errorResponse('User not found', 404);
    if (user.password !== currentPassword) return errorResponse('Current password is incorrect', 401);

    user.password = newPassword;
    await saveDB(database);

    return jsonResponse({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to change password', 500);
  }
}
