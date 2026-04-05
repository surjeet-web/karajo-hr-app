import { requireAuth, jsonResponse, errorResponse, corsHeaders, getQueryParams, parseBody } from '../../utils/auth';
import { getDB, saveDB, generateId } from '../../utils/db';

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
    const month = params.get('month') || '';
    const status = params.get('status') || '';

    let payslips = [...database.payroll.payslips];

    if (month) payslips = payslips.filter((p: { month: string }) => p.month.toLowerCase().includes(month.toLowerCase()));
    if (status) payslips = payslips.filter((p: { status: string }) => p.status === status);

    const total = payslips.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedPayslips = payslips.slice(offset, offset + limit);

    return jsonResponse({
      data: paginatedPayslips,
      pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch payslips', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);

    if (!body.month) return errorResponse('Month is required', 400);

    const database = await getDB();
    const basic = body.basic || 5000;
    const hra = body.hra || 2000;
    const allowances = body.allowances || 1500;
    const overtime = body.overtime || 0;
    const bonus = body.bonus || 0;
    const deductions = body.deductions || 800;
    const tax = body.tax || 450;
    const netPay = basic + hra + allowances + overtime + bonus - deductions - tax;

    const newPayslip = {
      id: database.payroll.payslips.length + 1,
      month: body.month,
      period: body.period || body.month,
      basic,
      hra,
      allowances,
      overtime,
      bonus,
      deductions,
      tax,
      netPay,
      status: body.status || 'draft',
      paidOn: body.paidOn || null,
    };

    database.payroll.payslips.unshift(newPayslip);
    await saveDB(database);

    return jsonResponse({ payslip: newPayslip }, 201);
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to create payslip', 500);
  }
}

export async function PUT(request: Request) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);

    if (!body.id) return errorResponse('Payslip ID is required', 400);

    const database = await getDB();
    const index = database.payroll.payslips.findIndex((p: { id: number }) => p.id === body.id);

    if (index === -1) return errorResponse('Payslip not found', 404);

    const existing = database.payroll.payslips[index];

    if (existing.status === 'paid') {
      return errorResponse('Cannot update a paid payslip', 400);
    }

    const basic = body.basic !== undefined ? body.basic : existing.basic;
    const hra = body.hra !== undefined ? body.hra : existing.hra;
    const allowances = body.allowances !== undefined ? body.allowances : existing.allowances;
    const overtime = body.overtime !== undefined ? body.overtime : existing.overtime;
    const bonus = body.bonus !== undefined ? body.bonus : existing.bonus;
    const deductions = body.deductions !== undefined ? body.deductions : existing.deductions;
    const tax = body.tax !== undefined ? body.tax : existing.tax;
    const netPay = basic + hra + allowances + overtime + bonus - deductions - tax;

    database.payroll.payslips[index] = {
      ...existing,
      month: body.month || existing.month,
      period: body.period || existing.period,
      basic,
      hra,
      allowances,
      overtime,
      bonus,
      deductions,
      tax,
      netPay,
      status: body.status || existing.status,
      paidOn: body.paidOn !== undefined ? body.paidOn : existing.paidOn,
    };

    await saveDB(database);
    return jsonResponse({ payslip: database.payroll.payslips[index] });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to update payslip', 500);
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAuth(request);
    const params = getQueryParams(request);
    const id = parseInt(params.get('id') || '0');

    if (!id) return errorResponse('Payslip ID is required', 400);

    const database = await getDB();
    const index = database.payroll.payslips.findIndex((p: { id: number }) => p.id === id);

    if (index === -1) return errorResponse('Payslip not found', 404);

    const existing = database.payroll.payslips[index];

    if (existing.status === 'paid') {
      return errorResponse('Cannot delete a paid payslip', 400);
    }

    const deleted = database.payroll.payslips.splice(index, 1)[0];
    await saveDB(database);

    return jsonResponse({ message: 'Payslip deleted', payslip: deleted });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to delete payslip', 500);
  }
}
