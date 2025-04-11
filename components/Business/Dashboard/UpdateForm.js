"use client";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { categoryOptions, loadCityOptions, handleCityChange } from "../utility";

const UpdateForm = ({ business, setBusiness }) => {
  const { data: session } = useSession();
  const [initialForm, setInitialForm] = useState(null);
  const [selectedCities, setSelectedCities] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
  });

  // Fetch business data
  useEffect(() => {
    try {
      if (business) {
        const defaultForm = {
          name: business.name,
          category: business.category,
          description: business.description,
        };
  
        const cityOptions = business.deliveryZones.map((zone) => ({
          id: zone.id,
          label: zone.cityName,
          value: zone.cityName,
          lat: zone.lat,
          lng: zone.lng,
        }));
  
        setForm(defaultForm);
        setInitialForm(defaultForm);
        setSelectedCities(cityOptions);
      } else {
        const emptyForm = {
          name: "",
          category: "",
          description: "",
        };
  
        setForm(emptyForm);
        setInitialForm(emptyForm);
        setSelectedCities([]);
      }
    } catch (err) {
      console.error("Failed to fetch business info:", err);
    }
  }, [business]); // Dependency array

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
        id: city.id, // 🟢 Include ID if it exists
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
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating business");
    }
  };

//   if (loading || !isLoaded) return <Loader />;

  return (
    // update form
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
        value={categoryOptions.find((option) => option.value === form.category)}
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
  );
};

export default UpdateForm;
