//components/Business/Form.js
"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import worldCities from "@/data/worldcities.json"; // adjust path as needed

// ✅ Prepare options for react-select
const cityOptions = worldCities.map((city) => ({
  label: `${city.city}, ${city.country}`,
  value: city.city,
  lat: city.lat,
  lng: city.lng,
}));

const categories = ["Electronics", "Food", "Fashion", "Books"];

const categoryOptions = categories.map((cat) => ({
  value: cat,
  label: cat,
}));

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "transparent", 
    border: "1px solid black", 
    boxShadow: state.isFocused ? "0 0 0 2px #d81b60" : "none",
    padding: "2px 6px",
    borderRadius: "0.375rem",
    color: "#111827", // text-gray-900
    "&:hover": {
      borderColor: "#d81b60", // pink-600
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#374151",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#f9fafb", // gray-50 (or use 'transparent' or dark)
    zIndex: 10,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#F3CFC6" : "transparent", // light pink on hover
    color: "#111827", // gray-900
    cursor: "pointer",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#e5e7eb", // gray-200
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#374151", // gray-700
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#6b7280", // gray-500
    ":hover": {
      backgroundColor: "#ef4444", // red-500
      color: "white",
    },
  }),
};

export default function BusinessForm({ onSuccess }) {
  const { data: session } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);

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
      .slice(0, 20) // 👈 Only take top 50 results

      .map((city) => ({
        label: `${city.city}, ${city.country}`,
        value: city.city,
        lat: city.lat,
        lng: city.lng,
      }));

    callback(filtered);
  };

  const handleCityChange = (selected) => {
    setSelectedCities(selected || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/business/register", {
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
        throw new Error(
          `Request failed: ${res.status} ${res.statusText} - ${errorText}`
        );
      }

      const data = await res.json();

      if (data.success) {
        alert("Business Created!");
        setName("");
        setCategory("");
        setDescription("");
        setSelectedCities([]);

        if (onSuccess) onSuccess(data.business);

        // router.push("/business");
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
        backgroundImage: "url('images/register-bg.jpg')",
      }}
    >
      <div className="w-full my-16 max-w-xl bg-white/35 backdrop-blur-2xl p-8 rounded-lg shadow-lg">
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
              className="w-full px-3 py-2 border rounded placeholder-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-600"
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
            <Select
              options={categoryOptions}
              onChange={(selected) => setCategory(selected.value)}
              placeholder="Select Category"
              styles={customSelectStyles}
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3 py-2 border placeholder-gray-700 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-600"
              placeholder="Brief description..."
              rows={1}
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-700 mb-1">
              Delivery Cities
            </label>
            {/* <select
              onChange={handleCityChange}
              required
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-600"
            >
              <option value="">Add Delivery City</option>
              {cityOptions.map((city) => (
                <option key={city.label} value={city.label}>
                  {city.label}
                </option>
              ))}
            </select> */}
            <AsyncSelect
              cacheOptions
              loadOptions={loadCityOptions}
              isMulti
              defaultOptions={false}
              onChange={handleCityChange}
              value={selectedCities}
              styles={customSelectStyles}
              placeholder="Type city name to select city"
            />

            {/* <div className="flex flex-wrap gap-2 mt-2">
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
            </div> */}
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white cursor-pointer font-semibold py-2 px-4 rounded transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
