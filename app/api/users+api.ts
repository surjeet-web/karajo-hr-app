import { requireAuth, jsonResponse, errorResponse, corsHeaders, getQueryParams, parseBody } from '../utils/auth';
import { getDB, saveDB, generateId } from '../utils/db';

const ADMIN_ROLES = ['ceo', 'hr_manager', 'hr_specialist'];

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    const { user } = await requireAuth(request);
    const database = await getDB();
    const params = getQueryParams(request);

    const page = parseInt(params.get('page') || '1');
    const limit = parseInt(params.get('limit') || '20');
    const search = params.get('search') || '';
    const department = params.get('department') || '';
    const status = params.get('status') || '';
    const role = params.get('role') || '';
    const sortBy = params.get('sortBy') || 'name';
    const sortOrder = params.get('sortOrder') || 'asc';

    let users = [...database.users];

    if (!ADMIN_ROLES.includes(user.role)) {
      users = users.filter((u: { id: string }) => u.id === user.id);
    }

    if (search) {
      const q = search.toLowerCase();
      users = users.filter((u: { name: string; email: string; role: string; department: string }) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q)
      );
    }

    if (department) users = users.filter((u: { department: string }) => u.department === department);
    if (status) users = users.filter((u: { status: string }) => u.status === status);
    if (role) users = users.filter((u: { role: string }) => u.role === role);

    users.sort((a: Record<string, any>, b: Record<string, any>) => {
      const aVal = String(a[sortBy] || '');
      const bVal = String(b[sortBy] || '');
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    const total = users.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedUsers = users.slice(offset, offset + limit).map(({ password, ...rest }) => rest);

    const roles = [...new Set(database.users.map((u: { role: string }) => u.role))];
    const departments = [...new Set(database.users.map((u: { department: string }) => u.department))];

    return jsonResponse({
      data: paginatedUsers,
      pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
      roles,
      departments,
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch users', 500);
  }
}

export async function POST(request: Request) {
  try {
    const { user } = await requireAuth(request);

    if (!ADMIN_ROLES.includes(user.role)) {
      return errorResponse('Unauthorized. Admin role required.', 403);
    }

    const body = await parseBody(request);

    if (!body.name) return errorResponse('Name is required', 400);
    if (!body.email) return errorResponse('Email is required', 400);
    if (!body.role) return errorResponse('Role is required', 400);

    const database = await getDB();

    const existing = database.users.find((u: { email: string }) => u.email === body.email);
    if (existing) return errorResponse('User with this email already exists', 400);

    const newUser = {
      id: `EMP-${String(database.users.length + 1).padStart(3, '0')}`,
      name: body.name,
      email: body.email,
      password: body.password || 'password123',
      role: body.role,
      department: body.department || 'General',
      phone: body.phone || '',
      joinDate: body.joinDate || new Date().toISOString().split('T')[0],
      manager: body.manager || '',
      status: body.status || 'active',
      avatar: body.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
      salary: body.salary || { basic: 5000, hra: 2000, allowances: 1500, deductions: 800, tax: 450 },
    };

    database.users.push(newUser);
    await saveDB(database);

    const { password, ...userWithoutPassword } = newUser;
    return jsonResponse({ user: userWithoutPassword }, 201);
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to create user', 500);
  }
}

export async function PUT(request: Request) {
  try {
    const { user: currentUser } = await requireAuth(request);
    const body = await parseBody(request);

    if (!body.id) return errorResponse('User ID is required', 400);

    const database = await getDB();
    const index = database.users.findIndex((u: { id: string }) => u.id === body.id);

    if (index === -1) return errorResponse('User not found', 404);

    if (!ADMIN_ROLES.includes(currentUser.role) && currentUser.id !== body.id) {
      return errorResponse('Unauthorized. Can only update own profile.', 403);
    }

    const existing = database.users[index];

    const updates: Record<string, any> = {
      name: body.name || existing.name,
      email: body.email || existing.email,
      role: body.role || existing.role,
      department: body.department || existing.department,
      phone: body.phone !== undefined ? body.phone : existing.phone,
      manager: body.manager !== undefined ? body.manager : existing.manager,
      status: body.status || existing.status,
      avatar: body.avatar || existing.avatar,
    };

    if (body.salary) {
      updates.salary = { ...existing.salary, ...body.salary };
    }

    if (body.password && ADMIN_ROLES.includes(currentUser.role)) {
      updates.password = body.password;
    }

    database.users[index] = { ...existing, ...updates };
    await saveDB(database);

    const { password, ...userWithoutPassword } = database.users[index];
    return jsonResponse({ user: userWithoutPassword });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to update user', 500);
  }
}

export async function DELETE(request: Request) {
  try {
    const { user: currentUser } = await requireAuth(request);

    if (!ADMIN_ROLES.includes(currentUser.role)) {
      return errorResponse('Unauthorized. Admin role required.', 403);
    }

    const params = getQueryParams(request);
    const id = params.get('id');

    if (!id) return errorResponse('User ID is required', 400);
    if (id === currentUser.id) return errorResponse('Cannot delete your own account', 400);

    const database = await getDB();
    const index = database.users.findIndex((u: { id: string }) => u.id === id);

    if (index === -1) return errorResponse('User not found', 404);

    const deleted = database.users.splice(index, 1)[0];
    database.tokens = database.tokens.filter((t: { userId: string }) => t.userId !== id);
    await saveDB(database);

    const { password, ...userWithoutPassword } = deleted;
    return jsonResponse({ message: 'User deleted', user: userWithoutPassword });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to delete user', 500);
  }
}
