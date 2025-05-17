import prisma from '../server/db';
import { hashPassword } from '../lib/auth-server';

async function createAdmin() {
  try {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'password123'; // You should change this in production

    // Check if admin exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin);
      return;
    }

    // Create admin user
    const hashedPassword = await hashPassword(adminPassword);
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    console.log('Admin user created:', admin);
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 