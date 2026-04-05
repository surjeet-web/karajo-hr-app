import { requireAuth, jsonResponse, errorResponse, corsHeaders, parseBody } from '../../utils/auth';
import { getDB, saveDB } from '../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request);
    const database = await getDB();
    const employee = database.employees.find((e: { id: number }) => e.id === parseInt(params.id));

    if (!employee) return errorResponse('Employee not found', 404);
    return jsonResponse({ employee });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch employee', 500);
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request);
    const updates = await parseBody(request);
    const database = await getDB();
    const index = database.employees.findIndex((e: { id: number }) => e.id === parseInt(params.id));

    if (index === -1) return errorResponse('Employee not found', 404);

    database.employees[index] = { ...database.employees[index], ...updates };
    await saveDB(database);

    return jsonResponse({ employee: database.employees[index] });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to update employee', 500);
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request);
    const database = await getDB();
    const index = database.employees.findIndex((e: { id: number }) => e.id === parseInt(params.id));

    if (index === -1) return errorResponse('Employee not found', 404);

    const deleted = database.employees.splice(index, 1)[0];
    await saveDB(database);

    return jsonResponse({ message: 'Employee deleted', employee: deleted });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to delete employee', 500);
  }
}
