'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/lib/auth-client';

interface MonitoredUser {
  id: number;
  userId: number;
  reason: string;
  createdAt: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

export default function MonitoredUsersPage() {
  const [monitoredUsers, setMonitoredUsers] = useState<MonitoredUser[]>([]);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchMonitoredUsers = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/monitoring`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch monitored users');
        }

        const data = await response.json();
        setMonitoredUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    fetchMonitoredUsers();
  }, [router]);

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Monitored Users</h1>
      {monitoredUsers.length === 0 ? (
        <p>No users are currently being monitored.</p>
      ) : (
        <div className="grid gap-4">
          {monitoredUsers.map((monitoredUser) => (
            <div
              key={monitoredUser.id}
              className="border p-4 rounded-lg shadow"
            >
              <h2 className="text-xl font-semibold">
                {monitoredUser.user.email}
              </h2>
              <p className="text-gray-600">Role: {monitoredUser.user.role}</p>
              <p className="text-red-500 mt-2">Reason: {monitoredUser.reason}</p>
              <p className="text-sm text-gray-500 mt-2">
                Monitored since:{' '}
                {new Date(monitoredUser.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 