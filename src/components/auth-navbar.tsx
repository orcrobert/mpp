'use client';

import { useEffect, useState } from 'react';
import { Link } from "@chakra-ui/react";
import { verifyToken, removeAuthToken } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const AuthNavbar = () => {
    const [user, setUser] = useState<{ userId: number; email: string; role: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userData = await verifyToken();
                setUser(userData);
            } catch (error) {
                console.error('Auth check error:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogout = () => {
        removeAuthToken();
        setUser(null);
        router.push('/login');
    };

    return (
        <header className="h-16 flex items-center justify-between top-0 px-4">
            <div className="dark:bg-green-500 blur-3xl h-10 w-50 absolute z-0 opacity-70"></div>
            <ul className="flex gap-4 z-10">
                <li><Link href="/" fontSize="sm" fontWeight="bold">Home</Link></li>
                <li><Link href="#table-view-section" fontSize="sm" fontWeight="bold">View</Link></li>
                <li><Link href="/add-band" fontSize="sm" fontWeight="bold">Add band</Link></li>
                <li><Link href="/chart-page" fontSize="sm" fontWeight="bold">Charts Page</Link></li>
                <li><Link href="/file-page" fontSize="sm" fontWeight="bold">File Page</Link></li>
            </ul>

            <div className="flex items-center gap-4 z-10">
                {!loading && (
                    user ? (
                        <>
                            <span className="text-sm font-medium">{user.email}</span>
                            {user.role === 'ADMIN' && (
                                <Link href="/admin" fontSize="sm" fontWeight="bold" className="px-3 py-1 bg-purple-600 text-white rounded">
                                    Admin
                                </Link>
                            )}
                            <button 
                                onClick={handleLogout}
                                className="px-3 py-1 bg-red-600 text-white rounded text-sm font-bold"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" fontSize="sm" fontWeight="bold" className="px-3 py-1 bg-blue-600 text-white rounded">
                                Login
                            </Link>
                            <Link href="/register" fontSize="sm" fontWeight="bold" className="px-3 py-1 bg-green-600 text-white rounded">
                                Register
                            </Link>
                        </>
                    )
                )}
            </div>
        </header>
    );
};

export default AuthNavbar; 