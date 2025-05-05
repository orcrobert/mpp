import { NextResponse } from 'next/server';
import { monitoringService } from '@/lib/monitoring-service';

export async function POST() {
  try {
    monitoringService.start();
    return NextResponse.json({ message: 'Monitoring service started' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to start monitoring service' },
      { status: 500 }
    );
  }
} 