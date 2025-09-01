// // app/api/user/route.js
// import { NextResponse } from "next/server";
// import { prisma } from "../../../lib/prisma";

// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);

//     // Collect filters
//     const cities = searchParams
//       .getAll("city")
//       .filter((c) => c && c.trim() !== ""); // 👈 remove empty
//     const categories = searchParams
//       .getAll("category")
//       .filter((cat) => cat && cat.trim() !== "");

//     // Build Prisma where clause dynamically
//     const where = {};

//     if (cities.length > 0) {
//       where.deliveryZones = {
//         some: {
//           OR: cities.map((c) => ({
//             cityName: {
//               equals: c.trim(),
//               mode: "insensitive",
//             },
//           })),
//         },
//       };
//     }

//     if (categories.length > 0) {
//       where.OR = categories.map((cat) => ({
//         category: {
//           equals: cat.trim(),
//           mode: "insensitive",
//         },
//       }));
//     }

//     // If no filter, just return everything
//     const businesses = await prisma.business.findMany({
//       where: Object.keys(where).length > 0 ? where : undefined,
//       include: {
//         deliveryZones: true,
//       },
//     });

//     return NextResponse.json(businesses);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
// app/api/user/route.js
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    // Collect filters
    const cities = searchParams
      .getAll("city")
      .filter((c) => c && c.trim() !== "");
    const categories = searchParams
      .getAll("category")
      .filter((cat) => cat && cat.trim() !== "");

    // Build Prisma where clause
    const where = { AND: [] };

    if (cities.length > 0) {
      where.AND.push({
        deliveryZones: {
          some: {
            OR: cities.map((c) => ({
              cityName: {
                contains: c.trim(),
                mode: "insensitive",
              },
            })),
          },
        },
      });
    }

    if (categories.length > 0) {
      where.AND.push({
        OR: categories.map((cat) => ({
          category: {
            equals: cat.trim(),
            mode: "insensitive",
          },
        })),
      });
    }

    // If no filters applied → undefined (return all businesses)
    const businesses = await prisma.business.findMany({
      where: where.AND.length > 0 ? where : undefined,
      include: {
        deliveryZones: true,
      },
    });

    console.log("Applied filters:", JSON.stringify(where, null, 2));

    return NextResponse.json(businesses);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
