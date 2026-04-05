import { requireAuth, jsonResponse, errorResponse, corsHeaders, getQueryParams, parseBody } from '../utils/auth';
import { getDB, saveDB, generateId } from '../utils/db';

const FINANCE_ROLES = ['ceo', 'finance_mgr'];

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const database = await getDB();

    const departments = [...new Set(database.employees.map((e: { department: string }) => e.department))].map((name: string) => {
      const members = database.employees.filter((e: { department: string }) => e.department === name);
      return {
        id: name.toLowerCase().replace(/\s/g, '_'),
        name,
        budget: 50000 + members.length * 10000,
        spent: Math.floor(Math.random() * 30000),
        allocated: 50000 + members.length * 10000,
      };
    });

    const totalBudget = departments.reduce((sum: number, d: any) => sum + d.budget, 0);
    const totalSpent = departments.reduce((sum: number, d: any) => sum + d.spent, 0);

    return jsonResponse({
      departments,
      summary: { totalBudget, totalSpent, remaining: totalBudget - totalSpent },
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch budgets', 500);
  }
}

export async function POST(request: Request) {
  try {
    const { user } = await requireAuth(request);

    if (!FINANCE_ROLES.includes(user.role)) {
      return errorResponse('Unauthorized. Finance role required.', 403);
    }

    const body = await parseBody(request);

    if (!body.departmentId) return errorResponse('Department ID is required', 400);
    if (body.budget === undefined) return errorResponse('Budget is required', 400);

    const database = await getDB();

    if (!database.budgets) database.budgets = [];

    const newBudget = {
      id: generateId(),
      departmentId: body.departmentId,
      department: body.department || body.departmentId,
      budget: parseFloat(body.budget),
      spent: 0,
      allocated: parseFloat(body.budget),
      createdAt: new Date().toISOString(),
    };

    database.budgets.push(newBudget);
    await saveDB(database);

    return jsonResponse({ budget: newBudget }, 201);
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to create budget', 500);
  }
}

export async function PUT(request: Request) {
  try {
    const { user } = await requireAuth(request);

    if (!FINANCE_ROLES.includes(user.role)) {
      return errorResponse('Unauthorized. Finance role required.', 403);
    }

    const body = await parseBody(request);

    if (!body.id) return errorResponse('Budget ID is required', 400);

    const database = await getDB();

    if (!database.budgets) database.budgets = [];

    const index = database.budgets.findIndex((b: { id: number }) => b.id === body.id);

    if (index === -1) return errorResponse('Budget not found', 404);

    database.budgets[index] = {
      ...database.budgets[index],
      budget: body.budget !== undefined ? parseFloat(body.budget) : database.budgets[index].budget,
      spent: body.spent !== undefined ? parseFloat(body.spent) : database.budgets[index].spent,
      allocated: body.allocated !== undefined ? parseFloat(body.allocated) : database.budgets[index].allocated,
      department: body.department || database.budgets[index].department,
    };

    await saveDB(database);
    return jsonResponse({ budget: database.budgets[index] });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to update budget', 500);
  }
}

export async function DELETE(request: Request) {
  try {
    const { user } = await requireAuth(request);

    if (!FINANCE_ROLES.includes(user.role)) {
      return errorResponse('Unauthorized. Finance role required.', 403);
    }

    const params = getQueryParams(request);
    const id = parseInt(params.get('id') || '0');

    if (!id) return errorResponse('Budget ID is required', 400);

    const database = await getDB();

    if (!database.budgets) return errorResponse('No budgets found', 404);

    const index = database.budgets.findIndex((b: { id: number }) => b.id === id);

    if (index === -1) return errorResponse('Budget not found', 404);

    const deleted = database.budgets.splice(index, 1)[0];
    await saveDB(database);

    return jsonResponse({ message: 'Budget deleted', budget: deleted });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to delete budget', 500);
  }
}
