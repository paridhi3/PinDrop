// components/Business/Dashboard/Map.js
"use client";
import { useState, useRef, useEffect } from "react";
import React from "react";
import Loader from "../../Loader";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const mapOptions = {
  styles: [
    {
      featureType: "all",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "administrative.country",
      elementType: "labels.text",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "administrative.locality",
      elementType: "labels.text",
      stylers: [{ visibility: "on" }],
    },
  ],
};

const Map = ({ business }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const mapRef = useRef(null);
  const [mapBounds, setMapBounds] = useState(null);
  const [activeZoneIndex, setActiveZoneIndex] = useState(null);

  // Store map reference when it first loads
  const handleMapLoad = (map) => {
    mapRef.current = map;
    fitBoundsToZones(business.deliveryZones);
  };

  // Helper to fit map to given zones
  const fitBoundsToZones = (zones) => {
    if (!zones?.length) return;

    const bounds = new window.google.maps.LatLngBounds();

    zones.forEach((zone) => {
      bounds.extend({ lat: Number(zone.lat), lng: Number(zone.lng) });
    });

    // Ensure a minimum span (e.g., ~5 degrees lat/lng ≈ country-level zoom)
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    let latDiff = ne.lat() - sw.lat();
    let lngDiff = ne.lng() - sw.lng();

    const minSpan = 5; // degrees (~500km, adjust as needed)

    if (latDiff < minSpan) {
      const expandBy = (minSpan - latDiff) / 2;
      bounds.extend({ lat: sw.lat() - expandBy, lng: sw.lng() });
      bounds.extend({ lat: ne.lat() + expandBy, lng: ne.lng() });
    }

    if (lngDiff < minSpan) {
      const expandBy = (minSpan - lngDiff) / 2;
      bounds.extend({ lat: sw.lat(), lng: sw.lng() - expandBy });
      bounds.extend({ lat: ne.lat(), lng: ne.lng() + expandBy });
    }

    setMapBounds(bounds);
    mapRef.current?.fitBounds(bounds);
  };

  // Recalculate bounds when delivery zones change
  useEffect(() => {
    if (mapRef.current) {
      fitBoundsToZones(business.deliveryZones);
    }
  }, [business.deliveryZones]);

  const resetView = () => {
    if (mapRef.current && mapBounds) {
      mapRef.current.fitBounds(mapBounds);
    }
  };

  if (!isLoaded) return <Loader />;

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2">Delivery Zones</h3>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        options={mapOptions}
        onLoad={handleMapLoad}
      >
        {business.deliveryZones.map((zone, index) => (
          <div key={zone.cityName + index}>
            <Marker
              position={{
                lat: Number(zone.lat),
                lng: Number(zone.lng),
              }}
              onMouseOver={() => setActiveZoneIndex(index)}
              onMouseOut={() => setActiveZoneIndex(null)}
              onClick={() => setActiveZoneIndex(index)}
            />
            {activeZoneIndex === index && (
              <InfoWindow
                position={{ lat: Number(zone.lat), lng: Number(zone.lng) }}
                onCloseClick={() => setActiveZoneIndex(null)}
              >
                <div className="text-sm font-bold">{zone.cityName}</div>
              </InfoWindow>
            )}
          </div>
        ))}
      </GoogleMap>

      <button
        onClick={resetView}
        className="mt-4 bg-yellow-300 hover:bg-yellow-500 hover:text-white text-black px-4 py-2 rounded-md font-bold cursor-pointer transition"
      >
        Reset View
      </button>
    </div>
  );
};

export default Map;
