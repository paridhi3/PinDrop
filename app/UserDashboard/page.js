// app/UserDashboard/page.js
"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import Filter from "./Filter.js";
import Map from "./Map.js";
import Loader from "../../components/Loader.js";
import { useSearchParams } from "next/navigation";

function DashboardContent() {
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

      if (filters.city?.length > 0) {
        filters.city.forEach(
          (c) => c.trim() && params.append("city", c.trim())
        );
      } else if (cityQuery?.trim()) {
        params.append("city", cityQuery.trim());
      }

      if (filters.category?.length > 0) {
        filters.category.forEach(
          (cat) => cat.trim() && params.append("category", cat.trim())
        );
      }

      const url = params.toString() ? `/api/user?${params}` : `/api/user`;
      console.log("Fetching businesses from:", url);
      const res = await fetch(url);
      const data = await res.json();

      const coloredData = data.map((biz) => ({
        ...biz,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));

      setResults(coloredData);
    } catch (err) {
      console.error("Error fetching businesses:", err);
    } finally {
      setLoading(false);
    }
  }, [cityQuery, filters]);

  useEffect(() => {
    if (cityFromUrl) setCityQuery(cityFromUrl);
  }, [cityFromUrl]);

  useEffect(() => {
    searchBusinesses();
  }, [cityQuery, filters, searchBusinesses]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-center gap-2 mb-6">
        <Filter filters={filters} onFilter={setFilters} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {!loading && results.length > 0 && (
            <div className="space-y-4">
              <p className="text-gray-600">Found {results.length} businesses</p>
              {results.map((biz) => (
                <div
                  key={biz.id}
                  className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
                  style={{ borderLeft: `6px solid ${biz.color}` }}
                >
                  <h5
                    className="mb-2 text-2xl font-semibold"
                    style={{ color: biz.color }}
                  >
                    {biz.name}
                  </h5>
                  <p className="mb-3 text-gray-500">{biz.description}</p>
                  <p className="text-blue-600 hover:underline">
                    {biz.category}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {biz.deliveryZones?.length > 0 ? (
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
            // (cityQuery || filters.city.length > 0 || filters.category) && (
            (cityQuery || filters.city.length > 0 || filters.category.length > 0) && (
              <p className="text-center text-gray-500 mt-10">
                No businesses found.
              </p>
            )}
        </div>
        <div className="sticky top-6">
          <Map businesses={results} />
        </div>
      </div>
    </div>
  );
}

const COLORS = [
  "#ef4444",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
];

export default function BusinessesPage() {
  return (
    <Suspense fallback={<Loader />}>
      <DashboardContent />
    </Suspense>
  );
}
