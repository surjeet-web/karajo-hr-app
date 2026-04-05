import { getDB, saveDB } from '../../utils/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role = 'employee', department = 'Engineering' } = body;

    if (!name || !email || !password) {
      return Response.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return Response.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const db = await getDB();

    const existingUser = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return Response.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password,
      role,
      department,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    saveDB(db);

    const { password: _, ...userWithoutPassword } = newUser;

    const token = `token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const refreshToken = `refresh_${Date.now()}_${Math.random().toString(36).substring(2)}`;

    if (!db.tokens) db.tokens = [];
    db.tokens.push({ userId: newUser.id, token, refreshToken, createdAt: Date.now() });

    return Response.json({
      user: userWithoutPassword,
      token,
      refreshToken,
      message: 'Account created successfully',
    });
  } catch (error: any) {
    return Response.json({ error: error.message || 'Registration failed' }, { status: 500 });
  }
}
