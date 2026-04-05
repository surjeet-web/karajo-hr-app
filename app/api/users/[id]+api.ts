import { requireAuth, jsonResponse, errorResponse, corsHeaders } from '../../utils/auth';
import { getDB } from '../../utils/db';

const ADMIN_ROLES = ['ceo', 'hr_manager', 'hr_specialist'];

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { user: currentUser } = await requireAuth(request);
    const database = await getDB();
    const user = database.users.find((u: { id: string }) => u.id === params.id);

    if (!user) return errorResponse('User not found', 404);

    if (!ADMIN_ROLES.includes(currentUser.role) && currentUser.id !== params.id) {
      return errorResponse('Unauthorized', 403);
    }

    const { password, ...userWithoutPassword } = user;
    return jsonResponse({ user: userWithoutPassword });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch user', 500);
  }
}
