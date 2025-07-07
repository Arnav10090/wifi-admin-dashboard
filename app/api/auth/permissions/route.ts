import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route';
import PermissionManager from '@/lib/permissions';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !('id' in session.user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { permissions, attributes } = await PermissionManager.getUserPermissions(session.user.id as number);
    
    // Fetch user role
    const db = require('@/models');
    const user = await db.User.findOne({
      where: { id: session.user.id },
      include: [{ model: db.Role }]
    });
    const role = user && user.Role ? user.Role.name : null;

    return NextResponse.json({
      permissions: permissions.map((p: any) => ({
        name: p.name,
        resource: p.resource,
        action: p.action,
        description: p.description
      })),
      attributes,
      role
    });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 