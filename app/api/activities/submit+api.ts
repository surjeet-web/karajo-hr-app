import { requireAuth, jsonResponse, errorResponse, corsHeaders, parseBody } from '../../../utils/auth';
import { getDB, saveDB, generateId } from '../../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function POST(request: Request) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);

    if (!body.period) return errorResponse('Period is required', 400);
    if (!body.hours) return errorResponse('Hours is required', 400);

    const database = await getDB();
    const submission = {
      id: generateId(),
      period: body.period,
      hours: body.hours,
      activityCount: body.activityCount || 0,
      status: 'pending',
      submittedOn: new Date().toISOString().split('T')[0],
    };

    database.activities.submissions.unshift(submission);

    database.notifications.unshift({
      id: generateId(),
      title: 'Timesheet Submitted',
      message: `${body.hours}h for ${body.period}`,
      time: new Date().toISOString(),
      type: 'info',
      read: false,
    });

    await saveDB(database);
    return jsonResponse({ submission }, 201);
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to submit timesheet', 500);
  }
}
