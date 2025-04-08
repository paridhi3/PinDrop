import React from "react";
import { Sparkles, MapPin, Smartphone, Users } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="md:flex gap-x-24 clear-left md:my-16 mb-10">
          <div className=" md:mb-0 mb-4">
            <h2 className="text-black font-manrope text-4xl font-semibold leading-10 mb-5 md:text-left text-center">
              Get In Touch
            </h2>
            <p className="text-gray-600 text-lg font-normal leading-7 mb-7 md:text-left text-center">
              Whether you have a concern or simply want to say hello, We are
              here to facilitate communication with you.
            </p>
            <div className="flex md:items-center md:justify-start justify-center">
              <button className="bg-yellow-300 hover:bg-yellow-500 hover:text-white text-black px-4 py-2 rounded-md font-bold cursor-pointer transition">
                Contact Us
              </button>
            </div>
          </div>
          <div className="border-l-2 md:border-yellow-300 border-white px-10 py-6">
            <div className="mb-8">
              <h6 className="text-gray-500 text-sm font-medium leading-5 pb-3 md:text-start text-center">
                Email Address
              </h6>
              <h3 className="text-black text-xl font-semibold leading-8 md:text-start text-center">
                pindrop@example.com
              </h3>
            </div>
            <div>
              <h6 className="text-gray-500 text-sm font-medium leading-5 pb-3 md:text-start text-center">
                Phone Number
              </h6>
              <h3 className="text-black text-xl font-semibold leading-8 md:text-start text-center">
                123-456-7890
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
