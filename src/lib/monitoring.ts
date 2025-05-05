import { PrismaClient, UserLog } from '@prisma/client';

const prisma = new PrismaClient();

export async function logUserAction(
  userId: number,
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE',
  entity: string,
  entityId: number,
  details?: string
) {
  return prisma.userLog.create({
    data: {
      userId,
      action,
      entity,
      entityId,
      details,
    },
  });
}

export async function checkUserActivity(userId: number, timeWindow: number = 24 * 60 * 60 * 1000) {
  const now = new Date();
  const timeAgo = new Date(now.getTime() - timeWindow);

  const logs = await prisma.userLog.findMany({
    where: {
      userId,
      createdAt: {
        gte: timeAgo,
      },
    },
  });

  // Define thresholds for suspicious activity
  const thresholds = {
    CREATE: 50,  // 50 creates per day
    READ: 1000,  // 1000 reads per day
    UPDATE: 100, // 100 updates per day
    DELETE: 20,  // 20 deletes per day
  };

  const actionCounts = logs.reduce((acc: Record<string, number>, log: UserLog) => {
    acc[log.action] = (acc[log.action] || 0) + 1;
    return acc;
  }, {});

  const suspiciousActions = Object.entries(actionCounts).filter(
    ([action, count]) => count > thresholds[action as keyof typeof thresholds]
  );

  if (suspiciousActions.length > 0) {
    const reason = suspiciousActions
      .map(([action, count]) => `${action}: ${count} actions`)
      .join(', ');

    await prisma.monitoredUser.upsert({
      where: { userId },
      update: { reason },
      create: {
        userId,
        reason,
      },
    });

    return true;
  }

  return false;
}

export async function getMonitoredUsers() {
  return prisma.monitoredUser.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
  });
} 