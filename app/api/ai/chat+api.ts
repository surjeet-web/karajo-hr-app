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
    const category = params.get('category');

    let actions = [
      { id: 1, title: 'Remaining leave', subtitle: 'Check remaining days', icon: 'calendar-check', category: 'my-hr' },
      { id: 2, title: 'Last payslip', subtitle: 'Last 3 months info', icon: 'file-text', category: 'my-hr' },
      { id: 3, title: 'Remote policy', subtitle: 'Direct reporting line', icon: 'monitor', category: 'policies' },
      { id: 4, title: 'Insurance details', subtitle: 'Update deposit info', icon: 'shield', category: 'benefits' },
      { id: 5, title: 'Holiday calendar', subtitle: 'Year-to-date total', icon: 'calendar', category: 'policies' },
      { id: 6, title: '2026 Tax docs', subtitle: 'Check next review', icon: 'file', category: 'benefits' },
    ];

    if (category) {
      actions = actions.filter((a: { category: string }) => a.category === category);
    }

    return jsonResponse({ actions });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch quick actions', 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth(request);
    const body = await parseBody(request);

    if (!body.message) return errorResponse('Message is required', 400);

    const responses: Record<string, string> = {
      leave: "Your current leave balance:\n\nAnnual Leave: 12 days remaining\nSick Leave: 5 days remaining\nPersonal Leave: 2 days remaining\n\nWould you like to apply for leave?",
      payslip: "Your latest payslip for February 2026 shows a net pay of $7,700.00. Basic: $5,000, HRA: $2,000, Allowances: $1,500.",
      policy: "According to company policy, all leave requests must be submitted at least 14 days in advance. Last-minute requests require manager approval.",
      default: `I understand you're asking about "${body.message}". Let me look into that for you. Is there anything specific you'd like to know?`,
    };

    let response = responses.default;
    const msg = body.message.toLowerCase();
    if (msg.includes('leave') || msg.includes('vacation')) response = responses.leave;
    else if (msg.includes('pay') || msg.includes('salary')) response = responses.payslip;
    else if (msg.includes('policy') || msg.includes('rule')) response = responses.policy;

    return jsonResponse({
      response,
      suggestions: ['Leave Request Policy', 'Apply for Leave', 'View History'],
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to process AI request', 500);
  }
}
