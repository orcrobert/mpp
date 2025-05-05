import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    const hashedPassword = await hashPassword('admin123');
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {
        role: 'ADMIN',
        password: hashedPassword,
      },
      create: {
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('Admin user created:', admin.email);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser(); 