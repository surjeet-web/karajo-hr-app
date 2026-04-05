import { requireAuth, jsonResponse, errorResponse, corsHeaders, getQueryParams, parseBody } from '../utils/auth';
import { getDB, saveDB, generateId } from '../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const database = await getDB();
    const params = getQueryParams(request);

    const page = parseInt(params.get('page') || '1');
    const limit = parseInt(params.get('limit') || '20');
    const search = params.get('search') || '';
    const department = params.get('department') || '';
    const status = params.get('status') || '';
    const sortBy = params.get('sortBy') || 'name';
    const sortOrder = params.get('sortOrder') || 'asc';

    let employees = [...database.employees];

    if (search) {
      const q = search.toLowerCase();
      employees = employees.filter((e: { name: string; role: string; department: string; email: string }) =>
        e.name.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q)
      );
    }

    if (department) {
      employees = employees.filter((e: { department: string }) => e.department === department);
    }

    if (status) {
      employees = employees.filter((e: { status: string }) => e.status === status);
    }

    employees.sort((a: Record<string, any>, b: Record<string, any>) => {
      const aVal = String(a[sortBy] || '');
      const bVal = String(b[sortBy] || '');
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    const total = employees.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedEmployees = employees.slice(offset, offset + limit);

    const departments = [...new Set(database.employees.map((e: { department: string }) => e.department))];

    return jsonResponse({
      data: paginatedEmployees,
      pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
      departments,
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch employees', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);

    if (!body.name) return errorResponse('Name is required', 400);
    if (!body.role) return errorResponse('Role is required', 400);
    if (!body.department) return errorResponse('Department is required', 400);

    const database = await getDB();
    const newEmployee = {
      id: generateId(),
      name: body.name,
      role: body.role,
      department: body.department,
      manager: body.manager || 'HR Manager',
      email: body.email || `${body.name.toLowerCase().replace(/\s/g, '.')}@karajo.com`,
      phone: body.phone || '',
      avatar: body.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
      joinDate: body.joinDate || new Date().toISOString().split('T')[0],
      status: body.status || 'onboarding',
      location: body.location || 'Remote',
      employmentType: body.employmentType || 'Full-time',
      rating: 0,
      kpiScore: 0,
      pendingReviews: 0,
      salary: body.salary || { basic: 5000, hra: 2000, allowances: 1500, deductions: 800, tax: 450 },
    };

    database.employees.push(newEmployee);
    await saveDB(database);

    return jsonResponse({ employee: newEmployee }, 201);
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to create employee', 500);
  }
}
