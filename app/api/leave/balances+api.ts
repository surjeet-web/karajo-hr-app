import { requireAuth, jsonResponse, errorResponse, corsHeaders, getQueryParams, parseBody } from '../../utils/auth';
import { getDB, saveDB } from '../../utils/db';

const HR_ROLES = ['ceo', 'hr_manager', 'hr_specialist'];

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const database = await getDB();
    return jsonResponse({ balances: database.leave.balances });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch balances', 500);
  }
}

export async function PUT(request: Request) {
  try {
    const { user } = await requireAuth(request);

    if (!HR_ROLES.includes(user.role)) {
      return errorResponse('Unauthorized. HR role required.', 403);
    }

    const body = await parseBody(request);

    if (!body.type) return errorResponse('Leave type is required', 400);

    const database = await getDB();
    const index = database.leave.balances.findIndex((b: { type: string }) => b.type === body.type);

    if (index === -1) {
      const newBalance = {
        type: body.type,
        total: body.total || 0,
        used: body.used || 0,
        remaining: body.remaining !== undefined ? body.remaining : body.total || 0,
        icon: body.icon || 'calendar',
        color: body.color || '#3B82F6',
      };
      database.leave.balances.push(newBalance);
      await saveDB(database);
      return jsonResponse({ balance: newBalance }, 201);
    }

    const existing = database.leave.balances[index];

    database.leave.balances[index] = {
      ...existing,
      total: body.total !== undefined ? body.total : existing.total,
      used: body.used !== undefined ? body.used : existing.used,
      remaining: body.remaining !== undefined ? body.remaining : existing.remaining,
      icon: body.icon || existing.icon,
      color: body.color || existing.color,
    };

    await saveDB(database);
    return jsonResponse({ balance: database.leave.balances[index] });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to update balance', 500);
  }
}
