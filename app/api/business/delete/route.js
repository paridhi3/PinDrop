import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required to delete business" },
        { status: 400 }
      );
    }

    // Find business by user email
    const business = await prisma.business.findUnique({
      where: { email },
      include: { deliveryZones: true }, // optional, in case you need it
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    // Delete the business
    await prisma.business.delete({
      where: { id: business.id },
    });

    return NextResponse.json(
      { message: "Business deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DELETE_BUSINESS_ERROR]", error);
    return NextResponse.json(
      { error: "Error deleting business" },
      { status: 500 }
    );
  }
}
