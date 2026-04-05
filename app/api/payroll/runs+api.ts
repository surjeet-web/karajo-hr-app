import { requireAuth, jsonResponse, errorResponse, corsHeaders, getQueryParams, parseBody } from '../../utils/auth';
import { getDB, saveDB, generateId } from '../../utils/db';

const FINANCE_ROLES = ['ceo', 'finance_mgr', 'accountant'];

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    const { user } = await requireAuth(request);

    if (!FINANCE_ROLES.includes(user.role)) {
      return errorResponse('Unauthorized. Finance role required.', 403);
    }

    const database = await getDB();
    const params = getQueryParams(request);

    const page = parseInt(params.get('page') || '1');
    const limit = parseInt(params.get('limit') || '20');
    const status = params.get('status') || '';
    const month = params.get('month') || '';

    let runs = [...(database.payrollRuns || [])];

    if (status) runs = runs.filter((r: { status: string }) => r.status === status);
    if (month) runs = runs.filter((r: { month: string }) => r.month.toLowerCase().includes(month.toLowerCase()));

    const total = runs.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedRuns = runs.slice(offset, offset + limit);

    return jsonResponse({
      data: paginatedRuns,
      pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch payroll runs', 500);
  }
}

export async function POST(request: Request) {
  try {
    const { user } = await requireAuth(request);

    if (!FINANCE_ROLES.includes(user.role)) {
      return errorResponse('Unauthorized. Finance role required.', 403);
    }

    const body = await parseBody(request);

    if (!body.month) return errorResponse('Month is required', 400);
    if (!body.year) return errorResponse('Year is required', 400);

    const database = await getDB();
    const employees = database.users.map((u: { id: string; name: string; salary: any }) => ({
      id: u.id,
      name: u.name,
      basic: u.salary?.basic || 5000,
      hra: u.salary?.hra || 2000,
      allowances: u.salary?.allowances || 1500,
      deductions: u.salary?.deductions || 800,
      tax: u.salary?.tax || 450,
      netPay: (u.salary?.basic || 5000) + (u.salary?.hra || 2000) + (u.salary?.allowances || 1500) - (u.salary?.deductions || 800) - (u.salary?.tax || 450),
    }));

    const totalPayroll = employees.reduce((sum: number, e: any) => sum + e.netPay, 0);
    const totalTax = employees.reduce((sum: number, e: any) => sum + e.tax, 0);
    const totalDeductions = employees.reduce((sum: number, e: any) => sum + e.deductions, 0);
    const totalGross = employees.reduce((sum: number, e: any) => sum + e.basic + e.hra + e.allowances, 0);

    const newRun = {
      id: generateId(),
      month: body.month,
      year: body.year,
      status: body.status || 'draft',
      employeeCount: employees.length,
      totalPayroll,
      totalTax,
      totalDeductions,
      totalOvertimePay: 0,
      totalGross,
      employees,
      createdAt: new Date().toISOString(),
      processedAt: null,
      approvedAt: null,
      processedBy: user.id,
      approvedBy: null,
    };

    if (!database.payrollRuns) database.payrollRuns = [];
    database.payrollRuns.unshift(newRun);
    await saveDB(database);

    return jsonResponse({ payrollRun: newRun }, 201);
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to create payroll run', 500);
  }
}

export async function PUT(request: Request) {
  try {
    const { user } = await requireAuth(request);

    if (!FINANCE_ROLES.includes(user.role)) {
      return errorResponse('Unauthorized. Finance role required.', 403);
    }

    const body = await parseBody(request);

    if (!body.id) return errorResponse('Payroll run ID is required', 400);

    const database = await getDB();
    const index = (database.payrollRuns || []).findIndex((r: { id: number }) => r.id === body.id);

    if (index === -1) return errorResponse('Payroll run not found', 404);

    const existing = database.payrollRuns[index];

    if (existing.status === 'approved') {
      return errorResponse('Cannot update an approved payroll run', 400);
    }

    database.payrollRuns[index] = {
      ...existing,
      status: body.status || existing.status,
      processedAt: body.status === 'processed' ? new Date().toISOString() : existing.processedAt,
      approvedAt: body.status === 'approved' ? new Date().toISOString() : existing.approvedAt,
      approvedBy: body.status === 'approved' ? user.id : existing.approvedBy,
    };

    await saveDB(database);
    return jsonResponse({ payrollRun: database.payrollRuns[index] });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to update payroll run', 500);
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

    if (!id) return errorResponse('Payroll run ID is required', 400);

    const database = await getDB();
    const index = (database.payrollRuns || []).findIndex((r: { id: number }) => r.id === id);

    if (index === -1) return errorResponse('Payroll run not found', 404);

    const existing = database.payrollRuns[index];

    if (existing.status === 'approved') {
      return errorResponse('Cannot delete an approved payroll run', 400);
    }

    const deleted = database.payrollRuns.splice(index, 1)[0];
    await saveDB(database);

    return jsonResponse({ message: 'Payroll run deleted', payrollRun: deleted });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to delete payroll run', 500);
  }
}
