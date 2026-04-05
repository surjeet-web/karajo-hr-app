import { requireAuth, jsonResponse, errorResponse, corsHeaders, getQueryParams, parseBody } from '../../utils/auth';
import { getDB, saveDB, generateId } from '../../utils/db';

const HR_ROLES = ['ceo', 'hr_manager', 'hr_specialist'];

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const database = await getDB();
    const params = getQueryParams(request);

    const status = params.get('status');
    let taxDocs = [...database.payroll.taxDocuments];

    if (status) taxDocs = taxDocs.filter((t: { status: string }) => t.status === status);

    return jsonResponse({ taxDocuments: taxDocs });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch tax documents', 500);
  }
}

export async function POST(request: Request) {
  try {
    const { user } = await requireAuth(request);

    if (!HR_ROLES.includes(user.role)) {
      return errorResponse('Unauthorized. HR role required.', 403);
    }

    const body = await parseBody(request);

    if (!body.name) return errorResponse('Name is required', 400);
    if (!body.year) return errorResponse('Year is required', 400);
    if (!body.type) return errorResponse('Type is required', 400);

    const database = await getDB();
    const newDoc = {
      id: generateId(),
      name: body.name,
      year: body.year,
      type: body.type,
      status: body.status || 'pending',
    };

    database.payroll.taxDocuments.push(newDoc);
    await saveDB(database);

    return jsonResponse({ taxDocument: newDoc }, 201);
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to create tax document', 500);
  }
}

export async function PUT(request: Request) {
  try {
    const { user } = await requireAuth(request);

    if (!HR_ROLES.includes(user.role)) {
      return errorResponse('Unauthorized. HR role required.', 403);
    }

    const body = await parseBody(request);

    if (!body.id) return errorResponse('Tax document ID is required', 400);

    const database = await getDB();
    const index = database.payroll.taxDocuments.findIndex((t: { id: number }) => t.id === body.id);

    if (index === -1) return errorResponse('Tax document not found', 404);

    database.payroll.taxDocuments[index] = {
      ...database.payroll.taxDocuments[index],
      name: body.name || database.payroll.taxDocuments[index].name,
      year: body.year || database.payroll.taxDocuments[index].year,
      type: body.type || database.payroll.taxDocuments[index].type,
      status: body.status || database.payroll.taxDocuments[index].status,
    };

    await saveDB(database);
    return jsonResponse({ taxDocument: database.payroll.taxDocuments[index] });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to update tax document', 500);
  }
}

export async function DELETE(request: Request) {
  try {
    const { user } = await requireAuth(request);

    if (!HR_ROLES.includes(user.role)) {
      return errorResponse('Unauthorized. HR role required.', 403);
    }

    const params = getQueryParams(request);
    const id = parseInt(params.get('id') || '0');

    if (!id) return errorResponse('Tax document ID is required', 400);

    const database = await getDB();
    const index = database.payroll.taxDocuments.findIndex((t: { id: number }) => t.id === id);

    if (index === -1) return errorResponse('Tax document not found', 404);

    const deleted = database.payroll.taxDocuments.splice(index, 1)[0];
    await saveDB(database);

    return jsonResponse({ message: 'Tax document deleted', taxDocument: deleted });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to delete tax document', 500);
  }
}
