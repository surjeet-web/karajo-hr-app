import { requireAuth, jsonResponse, errorResponse, corsHeaders, getQueryParams } from '../utils/auth';
import { getDB, saveDB, generateId } from '../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const database = await getDB();
    const params = getQueryParams(request);
    const status = params.get('status');

    let requests = database.expenses.requests;
    if (status) {
      requests = requests.filter((r: { status: string }) => r.status === status);
    }

    return jsonResponse({ requests });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch expenses', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(request);
    const body = await request.json();

    const { title, category, amount, date } = body;
    if (!title) return errorResponse('Title is required', 400);
    if (!category) return errorResponse('Category is required', 400);
    if (!amount) return errorResponse('Amount is required', 400);

    const database = await getDB();
    const newExpense = {
      id: database.expenses.nextId,
      title,
      category,
      amount: parseFloat(amount),
      date: date || new Date().toISOString().split('T')[0],
      description: body.description || '',
      status: 'pending',
      receipt: null,
      appliedOn: new Date().toISOString().split('T')[0],
    };

    database.expenses.requests.unshift(newExpense);
    database.expenses.nextId += 1;

    database.notifications.unshift({
      id: generateId(),
      title: 'Expense Submitted',
      message: `$${amount} expense for ${category}`,
      time: new Date().toISOString(),
      type: 'info',
      read: false,
    });

    await saveDB(database);
    return jsonResponse({ expense: newExpense }, 201);
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to create expense', 500);
  }
}
