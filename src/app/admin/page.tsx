'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { verifyToken } from '@/lib/auth-client';

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const userData = await verifyToken();
      
      if (!userData) {
        router.push('/login');
        return;
      }

      if (userData.role !== 'ADMIN') {
        router.push('/');
        return;
      }

      setIsAdmin(true);
    };

    checkAdmin();
  }, [router]);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid gap-4">
        <Link
          href="/admin/monitored"
          className="p-4 border rounded-lg shadow hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold">View Monitored Users</h2>
          <p className="text-gray-600">Check users with suspicious activity</p>
        </Link>
      </div>
    </div>
  );
} 