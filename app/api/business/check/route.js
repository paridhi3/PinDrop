// app/api/business/check/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const business = await prisma.business.findUnique({
      where: { email },
    });

    return NextResponse.json({ exists: !!business });
  } catch (error) {
    console.error('Error checking business:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
