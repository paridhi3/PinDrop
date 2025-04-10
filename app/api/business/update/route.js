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

    // Only update delivery zones if deliveryZones is explicitly present in the request
    if (deliveryZones !== undefined) {
      // First, delete all old zones for this business
      await prisma.deliveryZone.deleteMany({
        where: { businessId: existingBusiness.id },
      });

      if (deliveryZones.length > 0) {
        const newZones = deliveryZones
          .filter(zone => zone?.lat && zone?.lng && zone?.value)
          .map(zone => ({
            businessId: existingBusiness.id,
            cityName: zone.value,
            lat: parseFloat(zone.lat),
            lng: parseFloat(zone.lng),
          }));

        await prisma.deliveryZone.createMany({ data: newZones });
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
