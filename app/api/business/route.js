import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, category, description, deliveryZones } = body;

    // Create business
    const business = await prisma.business.create({
      data: {
        name,
        email,
        category,
        description,
      },
    });

    // Create delivery zones
    if (deliveryZones && deliveryZones.length > 0) {
      await prisma.deliveryZone.createMany({
        data: deliveryZones.map((zone) => ({
          cityName: zone.cityName,
          lat: zone.lat,
          lng: zone.lng,
          businessId: business.id,
        })),
      });
    }

    return NextResponse.json({ success: true, business });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
