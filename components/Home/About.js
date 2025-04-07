"use client";
import React from "react";
import Image from "next/image";

export default function About() {
  return (
    <section
      id="about"
      className="pb-15 relative bg-[url('/images/bg-pink2.jpg')] bg-cover bg-center bg-no-repeat"
    >
      {/* Heading */}
      <h2 className="text-4xl font-extrabold text-gray-800 text-center pt-10 pb-10">
        Who We Are
      </h2>

      <div className="max-w-7xl mx-auto px-4 md:px-5 lg:px-5 grid lg:grid-cols-2 grid-cols-1 gap-12">
        {/* Image Section */}
        <div className="w-full grid sm:grid-cols-2 grid-cols-1 order-last lg:order-first gap-6">
          <div className="pt-24 flex justify-start sm:justify-end lg:justify-center">
            <Image
              className="rounded-xl object-cover"
              src="/images/about3.jpg"
              alt="About Us 1"
              width={400}
              height={400}
            />
          </div>
          <Image
            className="rounded-xl object-cover"
            src="/images/about1.jpg"
            alt="About Us 2"
            width={400}
            height={400}
          />
        </div>

        {/* Text Section */}
        <div className="flex flex-col items-center lg:items-start gap-10">
          <div className="flex flex-col items-center lg:items-start gap-8 w-full">
            <div className="flex flex-col items-center lg:items-start gap-3 w-full">
              <p className="text-black text-base font-semibold leading-relaxed text-center lg:text-start">
                At <span className="font-bold">PinDrop</span>,
                we are on a mission to bring you closer to convenience. Whether
                you are looking for a local grocery store, a trusted repair
                service, or a café that delivers, we make it easy to find
                businesses that come to you.
              </p>
              <p className="text-black text-base font-semibold leading-relaxed text-center lg:text-start">
                With our location-based search and user-friendly platform, we
                connect you with top-rated services delivering to your area — no
                more endless scrolling or unreliable recommendations. Just drop
                your pin, and let us show you what is available.
              </p>
              <p className="text-black text-base font-semibold leading-relaxed text-center lg:text-start">
                We believe in empowering local businesses and making your life
                easier at the same time. It is not just about finding a service
                — it is about discovering one that fits your lifestyle.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-5 sm:gap-10 w-full">
              <div className="flex flex-col items-start">
                <h3 className="text-gray-900 text-4xl font-bold font-manrope">
                  33+
                </h3>
                <p className="text-black text-base font-normal">
                  Years of Experience
                </p>
              </div>
              <div className="flex flex-col items-start">
                <h4 className="text-gray-900 text-4xl font-bold font-manrope">
                  95%
                </h4>
                <p className="text-black text-base font-normal">
                  Satisfaction Rate
                </p>
              </div>
              <div className="flex flex-col items-start">
                <h4 className="text-gray-900 text-4xl font-bold font-manrope">
                  1000+
                </h4>
                <p className="text-black text-base font-normal">
                  Happy Customers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
