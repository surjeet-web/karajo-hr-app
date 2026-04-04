import { requireAuth, jsonResponse, errorResponse, corsHeaders, getQueryParams } from '../../utils/auth';
import { getDB, saveDB, generateId } from '../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const database = await getDB();
    const params = getQueryParams(request);
    const type = params.get('type');

    let notifications = database.notifications;
    if (type) {
      notifications = notifications.filter((n: any) => n.type === type);
    }

    const unreadCount = notifications.filter((n: any) => !n.read).length;

    return jsonResponse({
      notifications,
      unreadCount,
      total: notifications.length,
    });
  } catch (error: any) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch notifications', 500);
  }
}

export async function PUT(request: Request) {
  try {
    await requireAuth(request);
    const url = new URL(request.url);

    if (url.pathname.includes('read-all')) {
      const database = await getDB();
      database.notifications = database.notifications.map((n: any) => ({ ...n, read: true }));
      await saveDB(database);
      return jsonResponse({ success: true });
    }

    const id = parseInt(url.pathname.split('/').pop() || '0');
    const database = await getDB();
    const notification = database.notifications.find((n: any) => n.id === id);

    if (!notification) return errorResponse('Notification not found', 404);

    notification.read = true;
    await saveDB(database);

    return jsonResponse({ notification });
  } catch (error: any) {
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
    database.notifications = database.notifications.filter((n: any) => n.id !== id);
    await saveDB(database);

    return new Response(null, { status: 204, headers: corsHeaders() });
  } catch (error: any) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to delete notification', 500);
  }
}
