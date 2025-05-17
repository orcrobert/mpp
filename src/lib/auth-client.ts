// Client-side auth utilities (safe for Edge Runtime)
// This file doesn't use any Node.js specific APIs

interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

interface RegisterResponse {
  id: number;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export async function registerUser(email: string, password: string): Promise<RegisterResponse> {
  const response = await fetch(`/api/proxy/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  }

  return response.json();
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`/api/proxy/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  return response.json();
}

export function getAuthToken(): string | null {
  // Use localStorage on client side
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
}

export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
}

export function getUserFromToken(): { userId: number; email: string; role: string } | null {
  const token = getAuthToken();
  if (!token) return null;
  
  // Instead of decoding JWT on client, we'll just make an API call to verify
  // This is a safer approach that works with Edge Runtime
  return null; // The actual user data will be fetched from the API when needed
}

export async function verifyToken(): Promise<{ userId: number; email: string; role: string } | null> {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const response = await fetch(`/api/proxy/api/auth/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    return null;
  }
} 