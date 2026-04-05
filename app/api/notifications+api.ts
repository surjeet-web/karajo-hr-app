import { requireAuth, jsonResponse, errorResponse, corsHeaders, getQueryParams } from '../utils/auth';
import { getDB, saveDB } from '../utils/db';

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
    const type = params.get('type') || '';
    const unreadOnly = params.get('unreadOnly') === 'true';

    let notifications = [...database.notifications];
    if (type) notifications = notifications.filter((n: { type: string }) => n.type === type);
    if (unreadOnly) notifications = notifications.filter((n: { read: boolean }) => !n.read);

    const total = notifications.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedNotifications = notifications.slice(offset, offset + limit);

    return jsonResponse({
      data: paginatedNotifications,
      pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
      unreadCount: database.notifications.filter((n: { read: boolean }) => !n.read).length,
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch notifications', 500);
  }
}

export async function PUT(request: Request) {
  try {
    await requireAuth(request);
    const url = new URL(request.url);
    const database = await getDB();

    if (url.pathname.includes('read-all')) {
      database.notifications = database.notifications.map((n: Record<string, any>) => ({ ...n, read: true }));
      await saveDB(database);
      return jsonResponse({ success: true });
    }

    const id = parseInt(url.pathname.split('/').pop() || '0');
    const notification = database.notifications.find((n: { id: number }) => n.id === id);
    if (!notification) return errorResponse('Notification not found', 404);
    notification.read = true;
    await saveDB(database);
    return jsonResponse({ notification });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to update notification', 500);
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAuth(request);
    const url = new URL(request.url);
    const id = parseInt(url.pathname.split('/').pop() || '0');
    const database = await getDB();
    database.notifications = database.notifications.filter((n: { id: number }) => n.id !== id);
    await saveDB(database);
    return new Response(null, { status: 204, headers: corsHeaders() });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to delete notification', 500);
  }
}
