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

    const page = parseInt(params.get('page') || '1');
    const limit = parseInt(params.get('limit') || '20');
    const startDate = params.get('startDate') || '';
    const endDate = params.get('endDate') || '';
    const status = params.get('status') || '';

    let history = [...database.attendance.history];

    if (startDate) history = history.filter((r: { date: string }) => r.date >= startDate);
    if (endDate) history = history.filter((r: { date: string }) => r.date <= endDate);
    if (status) history = history.filter((r: { status: string }) => r.status === status);

    history.sort((a: { date: string }, b: { date: string }) => b.date.localeCompare(a.date));

    const total = history.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedHistory = history.slice(offset, offset + limit);

    const stats = {
      totalDays: history.length,
      onTime: history.filter((r: { status: string }) => r.status === 'on-time').length,
      late: history.filter((r: { status: string }) => r.status === 'late').length,
      absent: history.filter((r: { status: string }) => r.status === 'absent').length,
      overtime: history.filter((r: { status: string }) => r.status === 'overtime').length,
      avgHours: history.length > 0
        ? Math.round((history.reduce((sum: number, r: { totalHours: number }) => sum + r.totalHours, 0) / history.length) * 100) / 100
        : 0,
    };

    return jsonResponse({
      data: paginatedHistory,
      pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
      stats,
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch attendance history', 500);
  }
}
