"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Header() {
  const { data: session } = useSession();
  const [profileClick, setProfileClick] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("session:", session);
    if (session?.user) {
      router.push("/");
    }
  }, [router, session]);

  useEffect(() => {
    if (profileClick === true) {
      const timeout = setTimeout(() => {
        setProfileClick(false);
      }, 6000);

      return () => clearTimeout(timeout); // cleanup
    }
  }, [profileClick]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo + Title */}
        <Link href="/" className="flex items-center space-x-2 cursor-pointer">
          <Image src="/images/logo.png" alt="logo" width={50} height={50} />
          <span className="text-2xl font-black text-gray-800">PinDrop</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link
            href="/"
            className="text-gray-700 font-medium hover:text-yellow-300 transition"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-gray-700 font-medium hover:text-yellow-300 transition"
          >
            About
          </Link>
          <Link
            href="/features"
            className="text-gray-700 font-medium hover:text-yellow-300 transition"
          >
            Features
          </Link>
          <Link
            href="/contact"
            className="text-gray-700 font-medium hover:text-yellow-300 transition"
          >
            Contact Us
          </Link>
        </nav>

        {/* Desktop Auth / Profile */}
        <div className="hidden md:flex items-center space-x-4 relative">
          {session?.user ? (
            <>
              <Image
                src={session.user.image}
                alt="user"
                width={40}
                height={40}
                onClick={() => setProfileClick(!profileClick)}
                className="rounded-full cursor-pointer hover:border-[2px] border-yellow-300"
              />
              {profileClick && (
                <div className="absolute top-12 right-0 bg-white border shadow-lg rounded-md w-32 z-50">
                  <Link href="/dashboard">
                    <button className="block w-full text-left px-4 py-2 text-sm cursor-pointer font-bold text-gray-700 hover:text-yellow-300">
                      Dashboard
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      setProfileClick(false); // Optional: close dropdown on click
                      signOut();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm cursor-pointer font-bold text-gray-700 hover:text-yellow-300"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-yellow-300 hover:bg-yellow-500 hover:text-white text-black px-4 py-2 rounded-md font-bold cursor-pointer transition"
            >
              For Businesses
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-800 cursor-pointer"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-4 bg-white">
          {session?.user ? (
            <>
              <div className="flex items-center space-x-2 mt-2">
                <Image
                  src={session.user.image}
                  alt="user"
                  width={36}
                  height={36}
                  className="rounded-full"
                />
                <Link href="/dashboard">
                  <span className="text-gray-700 font-bold transition hover:text-pink-600">
                    {session.user.name}
                  </span>
                </Link>
              </div>
            </>
          ) : null}

          <Link
            href="/"
            className="block text-gray-700 font-medium hover:text-yellow-300 cursor-pointer transition"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="block text-gray-700 font-medium hover:text-yellow-300 cursor-pointer transition"
          >
            About
          </Link>
          <Link
            href="/features"
            className="block text-gray-700 font-medium hover:text-yellow-300 cursor-pointer transition"
          >
            Features
          </Link>
          <Link
            href="/contact"
            className="block text-gray-700 font-medium hover:text-yellow-300 cursor-pointer transition"
          >
            Contact Us
          </Link>

          {session?.user ? (
            <div>
              <button
                onClick={() => signOut()}
                className="text-left font-medium cursor-pointer w-full text-red-500 hover:underline mt-2"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-yellow-300 hover:bg-yellow-500 hover:text-white text-black px-4 py-2 rounded-md font-bold cursor-pointer transition"
              >
                For Businesses
              </button>
            </>
          )}
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl font-bold cursor-pointer"
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-4">Business Login</h2>
            <button
              onClick={() => {
                setShowLoginModal(false);
                signIn("google");
              }}
              className="w-full py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md cursor-pointer transition"
            >
              Login with Google
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
