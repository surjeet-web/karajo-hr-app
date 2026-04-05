import { requireAuth, jsonResponse, errorResponse, corsHeaders, parseBody } from '../utils/auth';
import { getDB, saveDB, generateId } from '../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    const { user } = await requireAuth(request);
    const database = await getDB();

    const offboarding = database.offboarding?.find((o: any) => o.userId === user.id);

    if (!offboarding) {
      return jsonResponse({
        initiated: false,
        step: 0,
        data: {},
      });
    }

    return jsonResponse({
      initiated: true,
      step: offboarding.step || 0,
      data: offboarding.data || {},
      status: offboarding.status || 'in-progress',
      lastDay: offboarding.lastDay || null,
      completedAt: offboarding.completedAt || null,
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch offboarding status', 500);
  }
}

export async function POST(request: Request) {
  try {
    const { user } = await requireAuth(request);
    const body = await parseBody(request);

    const database = await getDB();

    if (!database.offboarding) database.offboarding = [];

    const existing = database.offboarding.find((o: any) => o.userId === user.id);

    if (existing) {
      existing.step = body.step !== undefined ? body.step : existing.step + 1;
      existing.data = { ...existing.data, ...(body.data || {}) };
      if (body.completed) {
        existing.status = 'completed';
        existing.completedAt = new Date().toISOString();
      }
      if (body.lastDay) existing.lastDay = body.lastDay;
      await saveDB(database);
      return jsonResponse({ offboarding: existing });
    }

    const newOffboarding = {
      id: generateId(),
      userId: user.id,
      step: body.step || 0,
      data: body.data || {},
      status: 'in-progress',
      lastDay: body.lastDay || null,
      initiatedAt: new Date().toISOString(),
      completedAt: null,
    };

    database.offboarding.push(newOffboarding);
    await saveDB(database);

    return jsonResponse({ offboarding: newOffboarding }, 201);
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to initiate offboarding', 500);
  }
}

export async function PUT(request: Request) {
  try {
    const { user } = await requireAuth(request);
    const body = await parseBody(request);

    const database = await getDB();
    const index = (database.offboarding || []).findIndex((o: any) => o.userId === user.id);

    if (index === -1) return errorResponse('Offboarding record not found', 404);

    database.offboarding[index] = {
      ...database.offboarding[index],
      step: body.step !== undefined ? body.step : database.offboarding[index].step,
      data: { ...database.offboarding[index].data, ...(body.data || {}) },
      status: body.status || database.offboarding[index].status,
      lastDay: body.lastDay || database.offboarding[index].lastDay,
      completedAt: body.status === 'completed' ? new Date().toISOString() : database.offboarding[index].completedAt,
    };

    await saveDB(database);
    return jsonResponse({ offboarding: database.offboarding[index] });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to update offboarding', 500);
  }
}

export async function DELETE(request: Request) {
  try {
    const { user } = await requireAuth(request);
    const database = await getDB();
    database.offboarding = (database.offboarding || []).filter((o: any) => o.userId !== user.id);
    await saveDB(database);
    return jsonResponse({ message: 'Offboarding record deleted' });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to delete offboarding record', 500);
  }
}
