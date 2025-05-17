import { NextRequest, NextResponse } from 'next/server';

// Get the backend URL from environment variables or use a default
const BACKEND_URL = process.env.BACKEND_URL || 'http://production.eba-g7dytnbr.eu-north-1.elasticbeanstalk.com';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const url = new URL(request.url);
  const backendUrl = `${BACKEND_URL}/${path}${url.search}`;
  
  try {
    const response = await fetch(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
        // Forward authentication header if present
        ...(request.headers.get('Authorization') 
          ? { 'Authorization': request.headers.get('Authorization') as string } 
          : {})
      },
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error proxying request to ${backendUrl}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch data from backend' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const backendUrl = `${BACKEND_URL}/${path}`;
  
  try {
    const body = await request.json();
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.get('Authorization') 
          ? { 'Authorization': request.headers.get('Authorization') as string } 
          : {})
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error proxying POST request to ${backendUrl}:`, error);
    return NextResponse.json(
      { error: 'Failed to post data to backend' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const backendUrl = `${BACKEND_URL}/${path}`;
  
  try {
    const body = await request.json();
    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.get('Authorization') 
          ? { 'Authorization': request.headers.get('Authorization') as string } 
          : {})
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error proxying PUT request to ${backendUrl}:`, error);
    return NextResponse.json(
      { error: 'Failed to update data in backend' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const backendUrl = `${BACKEND_URL}/${path}`;
  
  try {
    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.get('Authorization') 
          ? { 'Authorization': request.headers.get('Authorization') as string } 
          : {})
      },
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error proxying DELETE request to ${backendUrl}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete data from backend' },
      { status: 500 }
    );
  }
} 