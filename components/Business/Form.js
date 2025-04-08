"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

const cityOptions = [
  { label: "New York", lat: 40.7128, lng: -74.006 },
  { label: "London", lat: 51.5074, lng: -0.1278 },
  { label: "Tokyo", lat: 35.6895, lng: 139.6917 },
  { label: "Delhi", lat: 28.6139, lng: 77.209 },
];

const categories = ["Electronics", "Food", "Fashion", "Books"];

export default function BusinessForm() {
  const { data: session } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);

  const handleCityChange = (e) => {
    const value = e.target.value;
    if (!selectedCities.find((c) => c.label === value)) {
      const selected = cityOptions.find((c) => c.label === value);
      if (selected) setSelectedCities([...selectedCities, selected]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch("/api/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: session?.user?.email, // ensure email is passed
          category,
          description,
          deliveryZones: selectedCities.map((city) => ({
            cityName: city.label,
            lat: city.lat,
            lng: city.lng,
          })),
        }),
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Request failed: ${res.status} ${res.statusText} - ${errorText}`);
      }
  
      const data = await res.json();
  
      if (data.success) {
        alert("Business Created!");
        setName("");
        setCategory("");
        setDescription("");
        setSelectedCities([]);

        router.push('/');
      }
    } catch (err) {
      console.error("Error submitting form:", err.message);
      alert("There was a problem creating the business.");
    }
  };  

  return (
    <div
      className="h-fit bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('images/bg-pink2.jpg')",
      }}
    >
      <div className="w-full my-16 max-w-xl bg-white/35 backdrop-blur-md p-8 rounded-lg shadow-lg">
        <h3 className="text-3xl text-center text-gray-800 mb-6 font-extrabold">
          Register Your Business
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Business Name"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={session?.user?.email || ""}
              readOnly
              required
              className="w-full px-3 py-2 border rounded shadow-sm cursor-not-allowed text-gray-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description..."
              rows={1}
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-700 mb-1">
              Delivery Cities
            </label>
            <select
              onChange={handleCityChange}
              required
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Add Delivery City</option>
              {cityOptions.map((city) => (
                <option key={city.label} value={city.label}>
                  {city.label}
                </option>
              ))}
            </select>

            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCities.map((city) => (
                <span
                  key={city.label}
                  className="flex items-center bg-lime-200 text-sm font-medium px-3 py-1 rounded-full"
                >
                  {city.label}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedCities(
                        selectedCities.filter((c) => c.label !== city.label)
                      )
                    }
                    className="ml-2 cursor-pointer text-red-500 hover:text-red-700 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-semibold py-2 px-4 rounded transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
