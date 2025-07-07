import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import PermissionManager from '@/lib/permissions';
const { Device, User } = require('@/models');

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !('id' in session.user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user can read devices
    const canRead = await PermissionManager.hasPermission(session.user.id as number, 'devices', 'read');
    if (!canRead) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get user attributes for ABAC filtering
    const userAttributes = await PermissionManager.getUserAttributes(session.user.id as number);
    // Fetch user and their role
    const user = await User.findByPk(session.user.id, { include: ['Role'] });
    const isAdmin = user?.Role?.name === 'Admin';

    let whereClause: any = {};
    // Only filter by department if NOT admin
    if (!isAdmin && userAttributes.department) {
      whereClause.department = userAttributes.department;
    }

    const devices = await Device.findAll({ where: whereClause });
    return NextResponse.json({ devices: devices || [] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !('id' in session.user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user can update devices
    const canUpdate = await PermissionManager.hasPermission(session.user.id as number, 'devices', 'update');
    if (!canUpdate) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    // For ABAC: Check if user can update this specific device
    const device = await Device.findByPk(id);
    if (!device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    const userAttributes = await PermissionManager.getUserAttributes(session.user.id as number);
    // Fetch user and their role
    const user = await User.findByPk(session.user.id, { include: ['Role'] });
    const isAdmin = user?.Role?.name === 'Admin';
    // Only restrict by department if NOT admin
    if (!isAdmin && userAttributes.department && device.department !== userAttributes.department) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [updated] = await Device.update({ status }, { where: { id } });
    if (updated) {
      const updatedDevice = await Device.findByPk(id);
      return NextResponse.json(updatedDevice);
    } else {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 