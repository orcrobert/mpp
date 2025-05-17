// This file is for server-side use only and should not be imported in frontend code
// It contains Node.js specific dependencies not supported in Edge Runtime

import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createUser(email: string, password: string, role: 'USER' | 'ADMIN' = 'USER'): Promise<User> {
  const hashedPassword = await hashPassword(password);
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
    },
  });
}

export async function loginUser(email: string, password: string): Promise<{ token: string; user: Omit<User, 'password'> } | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) return null;

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  const { password: _, ...userWithoutPassword } = user;
  return { token, user: userWithoutPassword };
}

export function verifyToken(token: string): { userId: number; email: string; role: 'USER' | 'ADMIN' } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; email: string; role: 'USER' | 'ADMIN' };
  } catch {
    return null;
  }
} 