import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request) {
  try {
    const body = await request.json();
    const { email, name, category, description, deliveryZones } = body;

    if (!email || !name) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 });
    }

    const existingBusiness = await prisma.business.findUnique({
      where: { email },
    });

    if (!existingBusiness) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    // update delivery zones
    if (Array.isArray(deliveryZones)) {
      const existingZones = await prisma.deliveryZone.findMany({
        where: { businessId: existingBusiness.id },
      });
    
      const incomingZoneIds = deliveryZones.map(z => z.id).filter(Boolean); // for existing zones
      const zonesToDelete = existingZones.filter(z => !incomingZoneIds.includes(z.id));
    
      // Delete removed zones
      await prisma.deliveryZone.deleteMany({
        where: {
          id: { in: zonesToDelete.map(z => z.id) },
        },
      });
    
      // Upsert or create zones
      for (const zone of deliveryZones) {
        if (zone.id) {
          // Existing zone — update it
          await prisma.deliveryZone.update({
            where: { id: zone.id },
            data: {
              cityName: zone.cityName,
              lat: parseFloat(zone.lat),
              lng: parseFloat(zone.lng),
            },
          });
        } else {
          // New zone — create it
          await prisma.deliveryZone.create({
            data: {
              businessId: existingBusiness.id,
              cityName: zone.cityName,
              lat: parseFloat(zone.lat),
              lng: parseFloat(zone.lng),
            },
          });
        }
      }
    }    

    // Update business info
    const updatedBusiness = await prisma.business.update({
      where: { email },
      data: { name, category, description },
      include: { deliveryZones: true },
    });

    return NextResponse.json({ business: updatedBusiness }, { status: 200 });

  } catch (error) {
    console.error("[UPDATE_BUSINESS_ERROR]", error);
    return NextResponse.json({ error: "Failed to update business" }, { status: 500 });
  }
}
