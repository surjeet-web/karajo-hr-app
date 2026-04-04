import { requireAuth, jsonResponse, errorResponse, corsHeaders } from '../../utils/auth';
import { getDB } from '../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request, { id }: { id: string }) {
  try {
    await requireAuth(request);
    const database = await getDB();
    const expense = database.expenses.requests.find((e: any) => e.id === parseInt(id));

    if (!expense) return errorResponse('Expense not found', 404);

    const timeline = [
      { status: 'Submitted', date: expense.appliedOn || 'Recently', by: 'You' },
      ...(expense.status === 'approved' ? [{ status: 'Approved', date: 'Recently', by: 'Finance Team' }] : []),
      ...(expense.status === 'rejected' ? [{ status: 'Rejected', date: 'Recently', by: 'Finance Team' }] : []),
      ...(expense.status === 'pending' ? [{ status: 'Pending Review', date: 'In Progress', by: 'Finance Team', active: true }] : []),
    ];

    return jsonResponse({ expense, timeline });
  } catch (error: any) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch expense', 500);
  }
}
