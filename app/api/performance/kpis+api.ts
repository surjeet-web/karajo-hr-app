import { requireAuth, jsonResponse, errorResponse, corsHeaders, getQueryParams, parseBody } from '../../utils/auth';
import { getDB, saveDB, generateId } from '../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const database = await getDB();
    const params = getQueryParams(request);
    const category = params.get('category');
    let kpis = [...database.performance.kpis];
    if (category) kpis = kpis.filter((k: { category: string }) => k.category === category);
    return jsonResponse({ kpis });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch KPIs', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);

    if (!body.name) return errorResponse('Name is required', 400);
    if (!body.target) return errorResponse('Target is required', 400);

    const database = await getDB();
    const newKpi = {
      id: generateId(),
      name: body.name,
      target: body.target,
      current: body.current || '0%',
      status: body.status || 'on-track',
      trend: body.trend || 'stable',
      category: body.category || 'General',
    };

    database.performance.kpis.unshift(newKpi);
    await saveDB(database);

    return jsonResponse({ kpi: newKpi }, 201);
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to create KPI', 500);
  }
}

export async function PUT(request: Request) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);

    if (!body.id) return errorResponse('KPI ID is required', 400);

    const database = await getDB();
    const index = database.performance.kpis.findIndex((k: { id: number }) => k.id === body.id);

    if (index === -1) return errorResponse('KPI not found', 404);

    const existing = database.performance.kpis[index];

    database.performance.kpis[index] = {
      ...existing,
      name: body.name || existing.name,
      target: body.target || existing.target,
      current: body.current !== undefined ? body.current : existing.current,
      status: body.status || existing.status,
      trend: body.trend || existing.trend,
      category: body.category || existing.category,
    };

    await saveDB(database);
    return jsonResponse({ kpi: database.performance.kpis[index] });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to update KPI', 500);
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAuth(request);
    const params = getQueryParams(request);
    const id = parseInt(params.get('id') || '0');

    if (!id) return errorResponse('KPI ID is required', 400);

    const database = await getDB();
    const index = database.performance.kpis.findIndex((k: { id: number }) => k.id === id);

    if (index === -1) return errorResponse('KPI not found', 404);

    const deleted = database.performance.kpis.splice(index, 1)[0];
    await saveDB(database);

    return jsonResponse({ message: 'KPI deleted', kpi: deleted });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to delete KPI', 500);
  }
}
