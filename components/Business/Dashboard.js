"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  GoogleMap,
  Marker,
  Circle,
  useLoadScript,
} from "@react-google-maps/api";
import Loader from "../Loader";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629, // India center
};

const BusinessDashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
  });

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
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
          setBusiness(data.business);
          setForm({
            name: data.business.name,
            category: data.business.category,
            description: data.business.description,
          });
        } else {
          setBusiness({ deliveryZones: [] }); // fallback to avoid crash
          setForm({
            name: "",
            category: "",
            description: "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch business info:", err);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.email) fetchBusiness();
  }, [session]);

  // Handle update
  const handleUpdate = async () => {
    try {
      const res = await fetch("/api/business/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          ...form,
        }),
      });

      if (res.ok) {
        alert("Business info updated");
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating business");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your business account?"))
      return;

    try {
      const res = await fetch("/api/business/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });

      if (res.ok) {
        alert("Business deleted");
        router.push("/");
      } else {
        throw new Error("Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting business");
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
        <input
          type="text"
          className="w-full px-4 py-2 border rounded"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          placeholder="Category"
        />
        <textarea
          className="w-full px-4 py-2 border rounded"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
        />
        <button
          className="px-4 py-2 bg-pink-600 text-white rounded"
          onClick={handleUpdate}
        >
          Update Info
        </button>
      </div>

      {/* Google Map */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Delivery Zones</h3>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={business.deliveryZones[0] || defaultCenter}
          zoom={5}
        >
          {business.deliveryZones.map((zone, index) => (
            <Circle
              key={index}
              center={{ lat: zone.lat, lng: zone.lng }}
              radius={10000} // 10km radius
              options={{
                fillColor: "#ec4899",
                fillOpacity: 0.35,
                strokeColor: "#be185d",
                strokeOpacity: 0.8,
                strokeWeight: 1,
              }}
            />
          ))}
        </GoogleMap>
      </div>

      {/* Delete Button */}
      <div>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded"
          onClick={handleDelete}
        >
          Delete Business Account
        </button>
      </div>
    </div>
  );
};

export default BusinessDashboard;
