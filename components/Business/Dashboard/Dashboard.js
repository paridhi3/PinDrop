"use client";
import { useEffect, useState, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import worldCities from "@/data/worldcities.json";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import Loader from "../../Loader";
import DeleteAccount from "./DeleteAccount";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
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

const categories = ["Electronics", "Food", "Fashion", "Books"];

const categoryOptions = categories.map((cat) => ({
  value: cat,
  label: cat,
}));

const BusinessDashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState(null);
  const [initialForm, setInitialForm] = useState(null);
  const [selectedCities, setSelectedCities] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
  });

  // Fetch business data
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await fetch(
          `/api/business/check?email=${session.user.email}`
        );
        const data = await res.json();
        console.log("(Dashboard.js) data.business: ", data.business);
        if (data.business) {
          const defaultForm = {
            name: data.business.name,
            category: data.business.category,
            description: data.business.description,
          };

          const cityOptions = data.business.deliveryZones.map((zone) => ({
            id: zone.id,           
            label: zone.cityName,
            value: zone.cityName,
            lat: zone.lat,
            lng: zone.lng,
          }));
          
          setForm(defaultForm);
          setInitialForm(defaultForm);
          setSelectedCities(cityOptions);
          setBusiness(data.business);
        } else {
          const emptyForm = {
            name: "",
            category: "",
            description: "",
          };

          setForm(emptyForm);
          setInitialForm(emptyForm);
          setSelectedCities([]);
          setBusiness({ deliveryZones: [] });
        }
      } catch (err) {
        console.error("Failed to fetch business info:", err);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.email) fetchBusiness();
  }, [session]);

  const loadCityOptions = (inputValue, callback) => {
    if (!inputValue || inputValue.length < 2) {
      return callback([]);
    }

    const filtered = worldCities
      .filter((city) =>
        `${city.city}, ${city.country}`
          .toLowerCase()
          .includes(inputValue.toLowerCase())
      )
      .slice(0, 20)
      .map((city) => ({
        label: `${city.city}, ${city.country}`,
        value: city.city,
        lat: city.lat,
        lng: city.lng,
      }));

    callback(filtered);
  };

  const handleCityChange = (cities) => {
    setSelectedCities(cities || []);
  };

  const isDeliveryZoneChanged = () => {
    if (!initialForm || !business?.deliveryZones) return false;

    const initialCities = business.deliveryZones.map((z) => z.cityName).sort();
    const currentCities = selectedCities.map((c) => c.value).sort();

    return JSON.stringify(initialCities) !== JSON.stringify(currentCities);
  };

  const isFormChanged = () => {
    return (
      initialForm &&
      (form.name !== initialForm.name ||
        form.category !== initialForm.category ||
        form.description !== initialForm.description ||
        isDeliveryZoneChanged())
    );
  };

  // Handle update
  const handleUpdate = async () => {
    try {
      const updatedDeliveryZones = selectedCities.map((city) => ({
        id: city.id,                     // 🟢 Include ID if it exists
        cityName: city.value,
        lat: city.lat,
        lng: city.lng,
      }));

      const res = await fetch("/api/business/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          ...form,
          deliveryZones: updatedDeliveryZones,
        }),
      });

      if (res.ok) {
        alert("Business info updated");

        const updatedBusiness = {
          ...business,
          name: form.name,
          category: form.category,
          description: form.description,
          deliveryZones: updatedDeliveryZones,
        };

        setBusiness(updatedBusiness); // <-- triggers map rerender

        setInitialForm(form);
        setMapBounds(null); // <-- triggers recalculation on next map load
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating business");
    }
  };

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

  if (loading || !isLoaded) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto my-10 bg-white/70 backdrop-blur-md p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Business Dashboard</h2>

      {/* Update Form */}
      <div className="space-y-4 mb-8">
        <input
          type="text"
          className="w-full px-4 py-2 border rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Business Name"
        />
        <Select
          className="w-full"
          value={categoryOptions.find(
            (option) => option.value === form.category
          )}
          options={categoryOptions}
          onChange={(selectedOption) =>
            setForm({ ...form, category: selectedOption?.value || "" })
          }
          placeholder="Category"
        />

        <textarea
          className="w-full px-4 py-2 border rounded"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
        />

        <AsyncSelect
          cacheOptions
          loadOptions={loadCityOptions}
          isMulti
          defaultOptions={false}
          onChange={handleCityChange}
          value={selectedCities}
        />

        <button
          className={`px-4 py-2 rounded text-white cursor-pointer ${
            isFormChanged()
              ? "bg-pink-600 hover:bg-pink-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleUpdate}
          disabled={!isFormChanged()}
        >
          Update Info
        </button>
      </div>

      {/* Google Map */}
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
          className="mt-4 px-4 py-2 bg-pink-600 cursor-pointer text-white rounded hover:bg-pink-700"
        >
          Reset View
        </button>
      </div>

      {/* Delete Button */}
      <DeleteAccount />
    </div>
  );
};

export default BusinessDashboard;
