import { NextResponse } from 'next/server';
const { Settings } = require('@/models');

export async function GET() {
  try {
    const settings = await Settings.findOne();

    if (!settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 