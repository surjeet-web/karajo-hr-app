import { requireAuth, jsonResponse, errorResponse, corsHeaders, parseBody } from '../../utils/auth';
import { getDB, saveDB, generateId } from '../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const database = await getDB();
    return jsonResponse({
      newHires: [
        { id: 1, name: 'Rachel Green', role: 'Junior Developer', department: 'Engineering', startDate: 'Jan 09, 2024', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop', progress: 65, buddy: 'Sarah Miller', status: 'in-progress' },
        { id: 2, name: 'Tom Brown', role: 'DevOps Engineer', department: 'Engineering', startDate: 'Aug 30, 2023', avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=200&h=200&fit=crop', progress: 100, buddy: 'James Wilson', status: 'completed' },
      ],
      checklist: [
        { id: 1, title: 'IT Setup', items: [{ task: 'Email account created', done: true }, { task: 'Laptop configured', done: true }, { task: 'Software licenses assigned', done: true }, { task: 'Slack/Teams access', done: true }] },
        { id: 2, title: 'HR Paperwork', items: [{ task: 'Employment contract signed', done: true }, { task: 'Tax forms submitted', done: true }, { task: 'Direct deposit setup', done: false }, { task: 'Benefits enrollment', done: false }] },
        { id: 3, title: 'Orientation', items: [{ task: 'Company overview session', done: true }, { task: 'Office tour', done: true }, { task: 'Team introductions', done: true }, { task: 'Policy handbook review', done: false }] },
        { id: 4, title: 'Training', items: [{ task: 'Security training', done: false }, { task: 'Compliance training', done: false }, { task: 'Product knowledge session', done: false }] },
      ],
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch onboarding data', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);

    if (!body.name) return errorResponse('Name is required', 400);
    if (!body.role) return errorResponse('Role is required', 400);
    if (!body.department) return errorResponse('Department is required', 400);

    const newHire = {
      id: generateId(),
      name: body.name,
      role: body.role,
      department: body.department,
      startDate: body.startDate || new Date().toISOString().split('T')[0],
      avatar: body.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
      progress: 0,
      buddy: body.buddy || '',
      status: 'in-progress',
    };

    return jsonResponse({ newHire }, 201);
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to create new hire', 500);
  }
}

export async function PUT(request: Request) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);

    if (!body.taskId) return errorResponse('Task ID is required', 400);

    return jsonResponse({ success: true, taskId: body.taskId, done: body.done });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to update task', 500);
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAuth(request);

    return jsonResponse({ message: 'Onboarding record deleted' });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to delete onboarding record', 500);
  }
}
