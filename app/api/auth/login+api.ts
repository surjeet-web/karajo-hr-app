import { getDB, saveDB, generateToken } from '../../utils/db';
import { parseBody, jsonResponse, errorResponse, validateField, corsHeaders } from '../../utils/auth';

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function POST(request: Request) {
  try {
    const { email, password } = await parseBody(request);

    const emailError = validateField(email, 'Email');
    if (emailError) return errorResponse(emailError, 400);
    const passwordError = validateField(password, 'Password');
    if (passwordError) return errorResponse(passwordError, 400);

    const database = await getDB();
    const user = database.users.find((u: any) => u.email === email);

    if (!user || user.password !== password) {
      return errorResponse('Invalid email or password', 401);
    }

    const token = generateToken();
    const refreshToken = generateToken();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    const refreshExpiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

    database.tokens.push({
      token,
      refreshToken,
      userId: user.id,
      expiresAt,
      refreshExpiresAt,
    });

    await saveDB(database);

    const { password: _, ...userWithoutPassword } = user;

    return jsonResponse({
      token,
      refreshToken,
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return errorResponse('Login failed', 500);
  }
}
