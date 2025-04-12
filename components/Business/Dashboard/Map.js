"use client";
import { useState, useRef } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import React from "react";
import Loader from "@/components/Loader";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const mapOptions = {
  styles: [
    // Hide all labels
    {
      featureType: "all",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    // Show country name
    {
      featureType: "administrative.country",
      elementType: "labels.text",
      stylers: [{ visibility: "on" }],
    },
    // Show city names
    {
      featureType: "administrative.locality",
      elementType: "labels.text",
      stylers: [{ visibility: "on" }],
    },
  ],
};

const Map = ({ business }) => {
  // Handle Map Load
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });
  const mapRef = useRef(null);
  const [mapBounds, setMapBounds] = useState(null);
  const [activeZoneIndex, setActiveZoneIndex] = useState(null);

  const handleMapLoad = (map) => {
    mapRef.current = map;
    const bounds = new window.google.maps.LatLngBounds();

    business.deliveryZones.forEach((zone) => {
      bounds.extend({ lat: zone.lat, lng: zone.lng });
    });

    setMapBounds(bounds);
    map.fitBounds(bounds);
  };

  const resetView = () => {
    if (mapRef.current && mapBounds) {
      mapRef.current.fitBounds(mapBounds);
    }
  };

  if(!isLoaded) return <Loader />

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2">Delivery Zones</h3>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        options={mapOptions}
        onLoad={handleMapLoad}
      >
        {business.deliveryZones.map((zone, index) => (
          <div key={index}>
            <Marker
              key={index}
              position={{
                lat: Number(zone.lat),
                lng: Number(zone.lng),
              }}
              onMouseOver={() => setActiveZoneIndex(index)}
              onMouseOut={() => setActiveZoneIndex(null)}
              onClick={() => setActiveZoneIndex(index)}
              className="cursor-pointer"
            ></Marker>

            {activeZoneIndex === index && (
              <InfoWindow position={{ lat: zone.lat, lng: zone.lng }}>
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
