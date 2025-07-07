import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import PermissionManager from '@/lib/permissions';
const { Settings } = require('@/models');

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !('id' in session.user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user can update settings
    const canUpdate = await PermissionManager.hasPermission(session.user.id as number, 'settings', 'update');
    if (!canUpdate) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const [key, value] = Object.entries(body)[0];

    const settings = await Settings.findOne();
    if (!settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 });
    }

    // Check for wifiPassword update and prevent same password
    if (key === 'wifiPassword') {
      const isAdmin = await PermissionManager.isAdmin(session.user.id);
      if (!isAdmin) {
        return NextResponse.json({ error: 'Forbidden: Only admins can update the WiFi password.' }, { status: 403 });
      }
      if (settings.wifiPassword === value) {
        return NextResponse.json({ error: 'New password cannot be the same as the old password.' }, { status: 400 });
      }
    }

    (settings as any)[key] = value;
    await settings.save();

    return NextResponse.json(settings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 