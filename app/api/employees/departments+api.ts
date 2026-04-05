import { requireAuth, jsonResponse, errorResponse, corsHeaders, getQueryParams, parseBody } from '../../utils/auth';
import { getDB, saveDB, generateId } from '../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const database = await getDB();
    const departments = [...new Set(database.employees.map((e: { department: string }) => e.department))].map((name: string) => {
      const members = database.employees.filter((e: { department: string }) => e.department === name);
      return { id: name.toLowerCase().replace(/\s/g, '_'), name, head: members[0]?.manager || '', count: members.length };
    });
    return jsonResponse({ departments });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch departments', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);

    if (!body.name) return errorResponse('Department name is required', 400);

    const database = await getDB();
    const existing = database.employees.find((e: { department: string }) => e.department === body.name);

    if (existing) return errorResponse('Department already exists', 400);

    const newDepartment = {
      id: body.name.toLowerCase().replace(/\s/g, '_'),
      name: body.name,
      head: body.head || '',
      count: 0,
      budget: body.budget || 0,
      spent: 0,
      allocated: 0,
      color: body.color || '#3B82F6',
    };

    if (!database.departments) database.departments = [];
    database.departments.push(newDepartment);
    await saveDB(database);

    return jsonResponse({ department: newDepartment }, 201);
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to create department', 500);
  }
}

export async function PUT(request: Request) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);

    if (!body.id) return errorResponse('Department ID is required', 400);

    const database = await getDB();

    if (!database.departments) database.departments = [];

    const index = database.departments.findIndex((d: { id: string }) => d.id === body.id);

    if (index === -1) {
      const newDepartment = {
        id: body.id,
        name: body.name || body.id,
        head: body.head || '',
        count: body.count || 0,
        budget: body.budget || 0,
        spent: body.spent || 0,
        allocated: body.allocated || 0,
        color: body.color || '#3B82F6',
      };
      database.departments.push(newDepartment);
      await saveDB(database);
      return jsonResponse({ department: newDepartment }, 201);
    }

    database.departments[index] = {
      ...database.departments[index],
      name: body.name || database.departments[index].name,
      head: body.head !== undefined ? body.head : database.departments[index].head,
      count: body.count !== undefined ? body.count : database.departments[index].count,
      budget: body.budget !== undefined ? body.budget : database.departments[index].budget,
      spent: body.spent !== undefined ? body.spent : database.departments[index].spent,
      allocated: body.allocated !== undefined ? body.allocated : database.departments[index].allocated,
      color: body.color || database.departments[index].color,
    };

    await saveDB(database);
    return jsonResponse({ department: database.departments[index] });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to update department', 500);
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAuth(request);
    const params = getQueryParams(request);
    const id = params.get('id');

    if (!id) return errorResponse('Department ID is required', 400);

    const database = await getDB();

    if (!database.departments) return errorResponse('No departments found', 404);

    const index = database.departments.findIndex((d: { id: string }) => d.id === id);

    if (index === -1) return errorResponse('Department not found', 404);

    const deleted = database.departments.splice(index, 1)[0];
    await saveDB(database);

    return jsonResponse({ message: 'Department deleted', department: deleted });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to delete department', 500);
  }
}
