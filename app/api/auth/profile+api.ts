import { requireAuth, jsonResponse, errorResponse, corsHeaders, parseBody, validateField } from '../../../utils/auth';
import { getDB, saveDB } from '../../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    const { user } = await requireAuth(request);
    const { password, ...userWithoutPassword } = user;
    return jsonResponse({ user: userWithoutPassword });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch profile', 500);
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = await requireAuth(request);
    const updates = await parseBody(request);

    const database = await getDB();
    const userIndex = database.users.findIndex((u: { id: string }) => u.id === userId);

    if (userIndex === -1) {
      return errorResponse('User not found', 404);
    }

    const allowedFields = ['name', 'phone', 'avatar', 'department'];
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        const err = validateField(updates[field], field);
        if (err) return errorResponse(err, 400);
        database.users[userIndex][field] = updates[field];
      }
    });

    await saveDB(database);
    const { password, ...updatedUser } = database.users[userIndex];

    return jsonResponse({ user: updatedUser });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to update profile', 500);
  }
}
