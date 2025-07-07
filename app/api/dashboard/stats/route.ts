import { NextResponse } from 'next/server';
const { Settings, Device } = require('@/models');

export async function GET() {
  try {
    const settings = await Settings.findOne();
    const deviceCount = await Device.count({ where: { status: 'Connected' } });

    if (!settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 });
    }

    const stats = {
      wifiStatus: settings.wifiEnabled,
      firewallStatus: settings.firewallEnabled,
      ssid: settings.ssid,
      connectedDevices: deviceCount,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 