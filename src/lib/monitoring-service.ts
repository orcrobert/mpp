import { PrismaClient } from '@prisma/client';
import { checkUserActivity } from './monitoring';

const prisma = new PrismaClient();
const CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes

export class MonitoringService {
  private intervalId: NodeJS.Timeout | null = null;

  start() {
    if (this.intervalId) return;

    this.intervalId = setInterval(async () => {
      try {
        const users = await prisma.user.findMany({
          select: { id: true },
        });

        for (const user of users) {
          await checkUserActivity(user.id);
        }
      } catch (error) {
        console.error('Error in monitoring service:', error);
      }
    }, CHECK_INTERVAL);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

// Create and export a singleton instance
export const monitoringService = new MonitoringService(); 