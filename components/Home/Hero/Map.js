// "use client";
// import { useEffect, useRef } from "react";

// export default function Map() {
//   const mapRef = useRef(null);

//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap`;
//     script.async = true;
//     script.defer = true;
//     document.head.appendChild(script);

//     window.initMap = function () {
//       new window.google.maps.Map(mapRef.current, {
//         center: { lat: 28.6139, lng: 77.2090 }, // Delhi by default
//         zoom: 12,
//       });
//     };

//     return () => {
//       delete window.initMap;
//     };
//   }, []);

//   return (
//     <div
//       ref={mapRef}
//       className="w-full h-[400px] rounded-xl shadow-md"
//     />
//   );
// }


"use client";
import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const Map = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places"], // optional, depending on what you need
    });

    loader.load().then(() => {
      if (mapRef.current) {
        new google.maps.Map(mapRef.current, {
          center: { lat: 28.6139, lng: 77.2090 }, // New Delhi
          // center: { lat: 47.6062, lng: -122.3321 }, // Seattle
          // center: { lat: 51.5074, lng: -0.1278 }, // London
          // center: { lat: 40.7128, lng: -74.0060 }, // New York City
          // center: { lat: 40.7580, lng: -73.9855 }, // Times Square, NYC
          zoom: 10,
        });
      }
    });
  }, []);

  return (
    <div
      id="map"
      ref={mapRef}
      className="w-full h-full shadow-md"
    />
  );
};

export default Map;
