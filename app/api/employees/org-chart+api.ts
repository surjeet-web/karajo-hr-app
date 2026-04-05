import { requireAuth, jsonResponse, errorResponse, corsHeaders } from '../../utils/auth';
import { getDB } from '../../utils/db';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const database = await getDB();

    const orgChart = {
      name: 'CEO',
      role: 'Chief Executive Officer',
      children: [
        {
          name: 'CTO',
          role: 'Chief Technology Officer',
          children: [
            { name: 'James Wilson', role: 'Engineering Manager', children: [
              { name: 'Sarah Miller', role: 'Senior Software Engineer' },
              { name: 'David Miller', role: 'QA Lead' },
              { name: 'Rachel Green', role: 'Junior Developer' },
              { name: 'Tom Brown', role: 'DevOps Engineer' },
            ]},
            { name: 'Michael Chen', role: 'UX Designer' },
          ],
        },
        {
          name: 'COO',
          role: 'Chief Operating Officer',
          children: [
            { name: 'Hanna Jenkins', role: 'Senior Project Manager' },
          ],
        },
        {
          name: 'CFO',
          role: 'Chief Financial Officer',
          children: [
            { name: 'Alex Johnson', role: 'Finance Analyst' },
          ],
        },
        {
          name: 'Marketing Director',
          role: 'Director of Marketing',
          children: [
            { name: 'Emma Wilson', role: 'Product Marketing' },
          ],
        },
        {
          name: 'HR Director',
          role: 'Director of Human Resources',
          children: [
            { name: 'Lisa Park', role: 'HR Specialist' },
          ],
        },
      ],
    };

    return jsonResponse({ orgChart });
  } catch (error) {
    if (error instanceof Response) throw error;
    return errorResponse('Failed to fetch org chart', 500);
  }
}
