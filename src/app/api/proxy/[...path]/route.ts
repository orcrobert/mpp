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
        // Forward authentication header if present
        ...(request.headers.get('Authorization') 
          ? { 'Authorization': request.headers.get('Authorization') as string } 
          : {})
      },
    });
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      // Handle binary data or other content types (like file downloads)
      const blob = await response.blob();
      return new NextResponse(blob, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': response.headers.get('Content-Disposition') || '',
        }
      });
    }
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
    // Check if the request is a form data upload
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file uploads by forwarding the FormData
      const formData = await request.formData();
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          // Don't set content-type for FormData, browser will set it with boundary
          ...(request.headers.get('Authorization') 
            ? { 'Authorization': request.headers.get('Authorization') as string } 
            : {})
        },
        body: formData,
      });
      
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      // Regular JSON API call
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
    }
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