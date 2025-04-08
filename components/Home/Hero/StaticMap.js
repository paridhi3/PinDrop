"use client";
import Image from "next/image";

const StaticMap = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
//   const center = "28.6139,77.2090"; // Delhi
  const center = "51.5074, -0.1278"; // London

  // Use high-resolution size (if billing is enabled)
  const width = 2048;
  const height = 1024;

  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=12&size=${width}x${height}&scale=2&key=${apiKey}`;

  return (
    <div
      className="relative w-full"
      style={{ minHeight: "calc(100vh - 5rem)" }}
    >
      <Image
        src={mapUrl}
        alt="Static map showing Delhi"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
    </div>
  );
};

export default StaticMap;
