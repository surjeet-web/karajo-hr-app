import { requireAuth, jsonResponse, errorResponse, corsHeaders, parseBody } from '../../utils/auth';
import { getDB, saveDB, generateId } from '../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request);
    const database = await getDB();
    const expense = database.expenses.requests.find((e: { id: number }) => e.id === parseInt(params.id));

    if (!expense) return errorResponse('Expense not found', 404);

    const timeline = [
      { status: 'Submitted', date: expense.appliedOn || 'Recently', by: 'You' },
      ...(expense.status === 'approved' ? [{ status: 'Approved', date: 'Recently', by: 'Finance Team' }] : []),
      ...(expense.status === 'rejected' ? [{ status: 'Rejected', date: 'Recently', by: 'Finance Team' }] : []),
      ...(expense.status === 'pending' ? [{ status: 'Pending Review', date: 'In Progress', by: 'Finance Team', active: true }] : []),
    ];

    return jsonResponse({ expense, timeline });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch expense', 500);
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request);
    const updates = await parseBody(request);
    const database = await getDB();
    const index = database.expenses.requests.findIndex((e: { id: number }) => e.id === parseInt(params.id));

    if (index === -1) return errorResponse('Expense not found', 404);

    const existing = database.expenses.requests[index];

    if (existing.status !== 'pending') {
      return errorResponse('Cannot update an expense that is not pending', 400);
    }

    database.expenses.requests[index] = {
      ...existing,
      title: updates.title || existing.title,
      category: updates.category || existing.category,
      amount: updates.amount !== undefined ? parseFloat(updates.amount) : existing.amount,
      date: updates.date || existing.date,
      description: updates.description !== undefined ? updates.description : existing.description,
      receipt: updates.receipt !== undefined ? updates.receipt : existing.receipt,
    };

    await saveDB(database);
    return jsonResponse({ expense: database.expenses.requests[index] });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to update expense', 500);
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request);
    const database = await getDB();
    const index = database.expenses.requests.findIndex((e: { id: number }) => e.id === parseInt(params.id));

    if (index === -1) return errorResponse('Expense not found', 404);

    const deleted = database.expenses.requests.splice(index, 1)[0];
    await saveDB(database);

    return jsonResponse({ message: 'Expense deleted', expense: deleted });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to delete expense', 500);
  }
}
