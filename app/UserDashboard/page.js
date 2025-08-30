// app/UserDashboard/page.js
"use client";
import { useState, useEffect, useCallback } from "react";
import Filter from "./Filter.js";
import Map from "./Map.js";
import Loader from "../../components/Loader.js";
import { useSearchParams } from "next/navigation";

// 🎨 Color palette (nice Tailwind-inspired colors)
const COLORS = [
  "#ef4444", // red
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // pink
];

// Helper: pick random color from palette
function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export default function BusinessesPage() {
  const searchParams = useSearchParams();
  const cityFromUrl = searchParams.get("city");

  const [cityQuery, setCityQuery] = useState(cityFromUrl || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: cityFromUrl ? [cityFromUrl] : [],
    category: [],
  });

  const searchBusinesses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      // City filter
      if (filters.city?.length > 0) {
        filters.city.forEach((c) => {
          if (c.trim()) params.append("city", c.trim());
        });
      } else if (cityQuery?.trim()) {
        params.append("city", cityQuery.trim());
      }

      // Category filter
      if (filters.category?.length > 0) {
        filters.category.forEach((cat) => {
          if (cat.trim()) params.append("category", cat.trim());
        });
      }

      const url = params.toString()
        ? `/api/user?${params.toString()}`
        : `/api/user`;

      const res = await fetch(url);
      const data = await res.json();

      // ✅ Assign random colors once per business
      const coloredData = data.map((biz) => ({
        ...biz,
        color: getRandomColor(),
      }));

      setResults(coloredData);
    } catch (err) {
      console.error("Error fetching businesses:", err);
    } finally {
      setLoading(false);
    }
  }, [cityQuery, filters]);

  // Keep cityQuery in sync with ?city param
  useEffect(() => {
    if (cityFromUrl) {
      setCityQuery(cityFromUrl);
    }
  }, [cityFromUrl]);

  // Run search whenever cityQuery OR filters change
  useEffect(() => {
    searchBusinesses();
  }, [cityQuery, filters, searchBusinesses]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Filters */}
      <div className="flex justify-center gap-2 mb-6">
        <Filter filters={filters} onFilter={setFilters} />
      </div>

      {/* Grid layout: Results (left) + Map (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Results */}
        <div>
          {!loading && results.length > 0 && (
            <div className="space-y-4">
              <p className="text-gray-600">
                Found {results.length} businesses
              </p>
              {results.map((biz) => (
                <div
                  key={biz.id}
                  className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
                  style={{ borderLeft: `6px solid ${biz.color}` }} // 👈 unique color indicator
                >
                  <h5
                    className="mb-2 text-2xl font-semibold tracking-tight"
                    style={{ color: biz.color }}
                  >
                    {biz.name}
                  </h5>
                  <p className="mb-3 font-normal text-gray-500">
                    {biz.description}
                  </p>
                  <p className="inline-flex font-medium items-center text-blue-600 hover:underline">
                    {biz.category}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {biz.deliveryZones && biz.deliveryZones.length > 0 ? (
                      biz.deliveryZones.map((zone, idx) => (
                        <span
                          key={zone.id || idx}
                          className="px-2 py-1 rounded text-white text-sm"
                          style={{ backgroundColor: biz.color }}
                        >
                          {zone.cityName}
                        </span>
                      ))
                    ) : (
                      <span>None</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading &&
            results.length === 0 &&
            (cityQuery || filters.city.length > 0 || filters.category) && (
              <p className="text-center text-gray-500 mt-10">
                No businesses found.
              </p>
            )}
        </div>

        {/* Map */}
        <div className="sticky top-6">
          <Map businesses={results} />
        </div>
      </div>
    </div>
  );
}
