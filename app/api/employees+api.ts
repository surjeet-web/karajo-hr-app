import { requireAuth, jsonResponse, errorResponse, corsHeaders, getQueryParams } from '../../utils/auth';
import { getDB } from '../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const database = await getDB();
    const params = getQueryParams(request);
    const search = params.get('search');
    const department = params.get('department');

    let employees = database.employees;

    if (search) {
      const q = search.toLowerCase();
      employees = employees.filter(
        (e: any) =>
          e.name.toLowerCase().includes(q) ||
          e.role.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q)
      );
    }

    if (department) {
      employees = employees.filter((e: any) => e.department === department);
    }

    const departments = [...new Set(database.employees.map((e: any) => e.department))];

    return jsonResponse({
      employees,
      departments,
      total: employees.length,
    });
  } catch (error: any) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch employees', 500);
  }
}
