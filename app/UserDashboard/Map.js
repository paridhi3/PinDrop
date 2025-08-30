// app/UserDashboard/Map.js
"use client";
import { useState, useRef, useEffect } from "react";
import React from "react";
import Loader from "../../components/Loader";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const mapOptions = {
  styles: [
    { featureType: "all", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "administrative.country", elementType: "labels.text", stylers: [{ visibility: "on" }] },
    { featureType: "administrative.locality", elementType: "labels.text", stylers: [{ visibility: "on" }] },
  ],
};

const Map = ({ businesses }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const mapRef = useRef(null);
  const [activeZone, setActiveZone] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);

  const handleMapLoad = (map) => {
    mapRef.current = map;
    fitBoundsToAllZones(businesses);
  };

  const fitBoundsToAllZones = (allBusinesses) => {
    const bounds = new window.google.maps.LatLngBounds();

    allBusinesses.forEach((biz) => {
      biz.deliveryZones.forEach((zone) => {
        bounds.extend({ lat: Number(zone.lat), lng: Number(zone.lng) });
      });
    });

    if (!bounds.isEmpty()) {
      setMapBounds(bounds);
      mapRef.current?.fitBounds(bounds);
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      fitBoundsToAllZones(businesses);
    }
  }, [businesses]);

  const resetView = () => {
    if (mapRef.current && mapBounds) {
      mapRef.current.fitBounds(mapBounds);
    }
  };

  if (!isLoaded) return <Loader />;

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Businesses and their Service Areas</h3>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        options={mapOptions}
        onLoad={handleMapLoad}
      >
        {businesses.map((biz) =>
          biz.deliveryZones.map((zone, index) => (
            <Marker
              key={biz.id + "-" + index}
              position={{
                lat: Number(zone.lat),
                lng: Number(zone.lng),
              }}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: biz.color,
                fillOpacity: 1,
                strokeWeight: 1,
                strokeColor: "#fff",
              }}
              onClick={() => setActiveZone({ biz, zone })}
            />
          ))
        )}

        {activeZone && (
          <InfoWindow
            position={{
              lat: Number(activeZone.zone.lat),
              lng: Number(activeZone.zone.lng),
            }}
            onCloseClick={() => setActiveZone(null)}
          >
            <div className="text-sm">
              <span
                className="font-bold"
                style={{ color: activeZone.biz.color }}
              >
                {activeZone.biz.name}
              </span>
              <div>{activeZone.zone.cityName}</div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      <button
        onClick={resetView}
        className="mt-4 bg-yellow-300 hover:bg-yellow-500 hover:text-white text-black px-4 py-2 rounded-md font-bold transition"
      >
        Reset View
      </button>
    </div>
  );
};

export default Map;
