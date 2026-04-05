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
    const status = params.get('status') || '';
    const type = params.get('type') || '';
    const department = params.get('department') || '';
    const sortBy = params.get('sortBy') || 'id';
    const sortOrder = params.get('sortOrder') || 'desc';

    let approvals = [...(database.approvals || [])];

    if (status) approvals = approvals.filter((a: { status: string }) => a.status === status);
    if (type) approvals = approvals.filter((a: { type: string }) => a.type === type);
    if (department) approvals = approvals.filter((a: { department: string }) => a.department === department);

    approvals.sort((a: Record<string, any>, b: Record<string, any>) => {
      const aVal = a[sortBy] || 0;
      const bVal = b[sortBy] || 0;
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    const total = approvals.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedApprovals = approvals.slice(offset, offset + limit);

    const stats = {
      total,
      pending: approvals.filter((a: { status: string }) => a.status === 'pending').length,
      approved: approvals.filter((a: { status: string }) => a.status === 'approved').length,
      rejected: approvals.filter((a: { status: string }) => a.status === 'rejected').length,
    };

    return jsonResponse({
      data: paginatedApprovals,
      pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
      stats,
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch approvals', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);

    if (!body.type) return errorResponse('Type is required', 400);
    if (!body.requesterId) return errorResponse('Requester ID is required', 400);

    const database = await getDB();
    const newApproval = {
      id: generateId(),
      type: body.type,
      requesterId: body.requesterId,
      approverId: body.approverId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      data: body.data || {},
      escalationLevel: 0,
    };

    if (!database.approvals) database.approvals = [];
    database.approvals.unshift(newApproval);
    await saveDB(database);

    return jsonResponse({ approval: newApproval }, 201);
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to create approval', 500);
  }
}

export async function PUT(request: Request) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);

    if (!body.id) return errorResponse('Approval ID is required', 400);

    const database = await getDB();
    const index = (database.approvals || []).findIndex((a: { id: number }) => a.id === body.id);

    if (index === -1) return errorResponse('Approval not found', 404);

    const existing = database.approvals[index];

    if (existing.status !== 'pending') {
      return errorResponse('Cannot update an approval that is not pending', 400);
    }

    database.approvals[index] = {
      ...existing,
      type: body.type || existing.type,
      requesterId: body.requesterId || existing.requesterId,
      approverId: body.approverId || existing.approverId,
      status: body.status || existing.status,
      comment: body.comment || existing.comment,
      escalationLevel: body.escalationLevel !== undefined ? body.escalationLevel : existing.escalationLevel,
      data: body.data || existing.data,
    };

    await saveDB(database);
    return jsonResponse({ approval: database.approvals[index] });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to update approval', 500);
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAuth(request);
    const params = getQueryParams(request);
    const id = parseInt(params.get('id') || '0');

    if (!id) return errorResponse('Approval ID is required', 400);

    const database = await getDB();
    const index = (database.approvals || []).findIndex((a: { id: number }) => a.id === id);

    if (index === -1) return errorResponse('Approval not found', 404);

    const deleted = database.approvals.splice(index, 1)[0];
    await saveDB(database);

    return jsonResponse({ message: 'Approval deleted', approval: deleted });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to delete approval', 500);
  }
}
