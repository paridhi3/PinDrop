"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import StaticMap from "./StaticMap";
// import AsyncSelect from "react-select/async";
import {
  categoryOptions,
  loadCityOptions,
  handleCityChange,
} from "../../utility";

const Map = dynamic(() => import("./Map"), { ssr: false });
const AsyncSelect = dynamic(() => import("react-select/async"), { ssr: false });

export default function Hero() {
  const [selectedCities, setSelectedCities] = useState([]);

  return (
    <section className="relative w-full h-[calc(100vh-5rem)] overflow-hidden">
      {/* Map as background */}
      <div className="absolute inset-0 z-0">
        {/* <Map /> */}
        <StaticMap />
      </div>

      {/* Overlay for darkening map */}
      <div className="absolute inset-0 bg-black/20 z-10" />

      {/* Foreground content */}
      <div className="relative z-20 flex items-center justify-center h-full px-6 md:px-12 lg:px-24">
        <div className="max-w-xl text-center bg-white/60 backdrop-blur-md p-8 rounded-xl shadow-lg">
          <h1 className="text-4xl sm:text-4xl font-extrabold text-gray-800 leading-tight mb-4 px-6 pt-4">
            Explore businesses that bring convenience home with{" "}
            <span className="text-yellow-400 text-outline">PinDrop</span>
          </h1>
          <p className="text-gray-700 font-semibold text-lg mb-6">
            Your one-stop platform to explore top-rated businesses that deliver
            to you.
          </p>

          <form className="flex flex-col sm:flex-row items-center justify-center gap-4 px-6">
            <AsyncSelect
              cacheOptions
              loadOptions={loadCityOptions}
              // isMulti
              defaultOptions={false}
              onChange={handleCityChange(setSelectedCities)}
              value={selectedCities}
              className="w-full sm:w-64 cursor-pointer"
              placeholder="Enter your city"
              priority
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 hover:text-white text-black font-bold py-3 px-6 rounded-lg cursor-pointer transition"
            >
              Check Availability
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
