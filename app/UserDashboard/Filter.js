// app/UserDashboard/Filter.js
"use client";
import { useId } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { categoryOptions, loadCityOptions } from "../../components/utility";

export default function Filter({ filters, onFilter }) {
  const selectId = useId();

  return (
    <div className="flex flex-col w-7xl md:flex-row gap-4 p-4 bg-gray-100 rounded-xl shadow-md">
      {/* Category Filter */}
      <Select
        instanceId={selectId}
        isMulti
        options={categoryOptions}
        value={filters.category.map((c) => ({ value: c, label: c }))}
        onChange={(categories) =>
          onFilter({
            ...filters,
            category: categories.map((c) => c.value),
          })
        }
        className="w-full"
        placeholder="Select categories..."
      />

      {/* City Filter */}
      <AsyncSelect
        instanceId={selectId + "-city"}
        cacheOptions
        loadOptions={loadCityOptions}
        isMulti
        defaultOptions={false}
        value={filters.city.map((c) => ({ value: c, label: c }))}
        onChange={(cities) =>
          onFilter({
            ...filters,
            city: cities.map((c) => c.value),
          })
        }
        className="w-full"
        placeholder="Select cities..."
      />
    </div>
  );
}
