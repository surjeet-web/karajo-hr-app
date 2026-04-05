import { requireAuth, jsonResponse, errorResponse, corsHeaders, parseBody } from '../utils/auth';
import { getDB, saveDB, generateId } from '../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    const { user } = await requireAuth(request);
    const database = await getDB();

    const onboarding = database.onboarding?.find((o: any) => o.userId === user.id);

    if (!onboarding) {
      return jsonResponse({
        completed: false,
        step: 0,
        data: {},
      });
    }

    return jsonResponse({
      completed: onboarding.completed || false,
      step: onboarding.step || 0,
      data: onboarding.data || {},
      completedAt: onboarding.completedAt || null,
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch onboarding status', 500);
  }
}

export async function POST(request: Request) {
  try {
    const { user } = await requireAuth(request);
    const body = await parseBody(request);

    const database = await getDB();

    if (!database.onboarding) database.onboarding = [];

    const existing = database.onboarding.find((o: any) => o.userId === user.id);

    if (existing) {
      existing.step = body.step !== undefined ? body.step : existing.step + 1;
      existing.data = { ...existing.data, ...(body.data || {}) };
      if (body.completed) {
        existing.completed = true;
        existing.completedAt = new Date().toISOString();
      }
      await saveDB(database);
      return jsonResponse({ onboarding: existing });
    }

    const newOnboarding = {
      id: generateId(),
      userId: user.id,
      step: body.step || 0,
      data: body.data || {},
      completed: body.completed || false,
      startedAt: new Date().toISOString(),
      completedAt: null,
    };

    database.onboarding.push(newOnboarding);
    await saveDB(database);

    return jsonResponse({ onboarding: newOnboarding }, 201);
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to update onboarding', 500);
  }
}

export async function PUT(request: Request) {
  try {
    const { user } = await requireAuth(request);
    const body = await parseBody(request);

    const database = await getDB();
    const index = (database.onboarding || []).findIndex((o: any) => o.userId === user.id);

    if (index === -1) return errorResponse('Onboarding record not found', 404);

    database.onboarding[index] = {
      ...database.onboarding[index],
      step: body.step !== undefined ? body.step : database.onboarding[index].step,
      data: { ...database.onboarding[index].data, ...(body.data || {}) },
      completed: body.completed !== undefined ? body.completed : database.onboarding[index].completed,
      completedAt: body.completed ? new Date().toISOString() : database.onboarding[index].completedAt,
    };

    await saveDB(database);
    return jsonResponse({ onboarding: database.onboarding[index] });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to update onboarding', 500);
  }
}

export async function DELETE(request: Request) {
  try {
    const { user } = await requireAuth(request);
    const database = await getDB();
    database.onboarding = (database.onboarding || []).filter((o: any) => o.userId !== user.id);
    await saveDB(database);
    return jsonResponse({ message: 'Onboarding record deleted' });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to delete onboarding record', 500);
  }
}
