import { PrismaClient } from '@prisma/client';
import { logUserAction, checkUserActivity } from '../lib/monitoring';

const prisma = new PrismaClient();

async function simulateSuspiciousActivity() {
  try {
    // Create a test user if it doesn't exist
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example2.com' },
      update: {},
      create: {
        email: 'test@example2.com',
        password: 'password123',
        role: 'USER',
      },
    });

    console.log('Simulating suspicious activity for user:', testUser.email);

    // Simulate a large number of CREATE operations
    for (let i = 0; i < 100; i++) {
      await logUserAction(
        testUser.id,
        'CREATE',
        'Band',
        i,
        `Created band ${i}`
      );
    }

    // Simulate a large number of READ operations
    for (let i = 0; i < 1500; i++) {
      await logUserAction(
        testUser.id,
        'READ',
        'Band',
        i % 100,
        `Read band ${i % 100}`
      );
    }

    // Simulate a large number of UPDATE operations
    for (let i = 0; i < 150; i++) {
      await logUserAction(
        testUser.id,
        'UPDATE',
        'Band',
        i % 100,
        `Updated band ${i % 100}`
      );
    }

    // Simulate a large number of DELETE operations
    for (let i = 0; i < 30; i++) {
      await logUserAction(
        testUser.id,
        'DELETE',
        'Band',
        i % 100,
        `Deleted band ${i % 100}`
      );
    }

    // Check user activity immediately after simulation
    const isMonitored = await checkUserActivity(testUser.id);
    console.log('User monitoring status:', isMonitored ? 'Added to monitored users' : 'Not monitored');

    console.log('Suspicious activity simulation completed');
  } catch (error) {
    console.error('Error simulating suspicious activity:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the simulation
simulateSuspiciousActivity();