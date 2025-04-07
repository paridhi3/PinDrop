import React from "react";
import { Sparkles, MapPin, Smartphone, Users } from "lucide-react";

const Features = () => {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 lg:mb-16 justify-center text-center gap-x-0 gap-y-6 lg:gap-y-0 lg:flex-row lg:justify-between max-md:max-w-lg max-md:mx-auto">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
            Features
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Discover what makes{" "}
            <span className="text-yellow-500 font-semibold">PinDrop</span> your
            go-to platform for local convenience.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="flex justify-center items-center gap-x-5 gap-y-8 lg:gap-y-0 flex-wrap md:flex-wrap lg:flex-nowrap lg:flex-row lg:justify-between lg:gap-x-8">

          {/* Card 1 */}
          <div className="group relative w-full bg-gray-100 rounded-2xl p-4 transition-all duration-500 max-md:max-w-md max-md:mx-auto md:w-2/5 md:h-64 xl:p-7 xl:w-1/4 hover:bg-pink-600">
            <div className="bg-white rounded-full flex justify-center items-center mb-5 w-14 h-14">
              <MapPin className="h-8 w-8 text-yellow-400 mb-4 mx-auto" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3 capitalize transition-all duration-500 group-hover:text-white">
              Location-Based Discovery
            </h4>
            <p className="text-sm font-normal text-gray-500 transition-all duration-500 leading-5 group-hover:text-white">
              Instantly find nearby businesses that deliver or offer home services — tailored to your exact location.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group relative w-full bg-gray-100 rounded-2xl p-4 transition-all duration-500 max-md:max-w-md max-md:mx-auto md:w-2/5 md:h-64 xl:p-7 xl:w-1/4 hover:bg-cyan-500">
            <div className="bg-white rounded-full flex justify-center items-center mb-5 w-14 h-14">
              <Smartphone className="h-8 w-8 text-yellow-400 mb-4 mx-auto" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3 capitalize transition-all duration-500 group-hover:text-white">
              Mobile-Friendly
            </h4>
            <p className="text-sm font-normal text-gray-500 transition-all duration-500 leading-5 group-hover:text-white">
              Designed with mobile users in mind, our interface is intuitive, fast, and easy to use on the go.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group relative w-full bg-gray-100 rounded-2xl p-4 transition-all duration-500 max-md:max-w-md max-md:mx-auto md:w-2/5 md:h-64 xl:p-7 xl:w-1/4 hover:bg-green-600">
            <div className="bg-white rounded-full flex justify-center items-center mb-5 w-14 h-14">
              <Users className="h-8 w-8 text-yellow-400 mb-4 mx-auto" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3 capitalize transition-all duration-500 group-hover:text-white">
              Verified Listings
            </h4>
            <p className="text-sm font-normal text-gray-500 transition-all duration-500 leading-5 group-hover:text-white">
              We carefully verify and update business info so you only see reliable, up-to-date services.
            </p>
          </div>

          {/* Card 4 */}
          <div className="group relative w-full bg-gray-100 rounded-2xl p-4 transition-all duration-500 max-md:max-w-md max-md:mx-auto md:w-2/5 md:h-64 xl:p-7 xl:w-1/4 hover:bg-blue-700">
            <div className="bg-white rounded-full flex justify-center items-center mb-5 w-14 h-14">
              <Sparkles className="h-8 w-8 text-yellow-400 mb-4 mx-auto" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3 capitalize transition-all duration-500 group-hover:text-white">
              Curated Experience
            </h4>
            <p className="text-sm font-normal text-gray-500 transition-all duration-500 leading-5 group-hover:text-white">
              From groceries to grooming, PinDrop curates a personalized experience based on your needs.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;
