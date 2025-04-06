"use client";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

function Login() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log("session:", session);
    if (session?.user) {
      router.push("/");
    }
  }, [router, session]);

  return (
    <div className="flex flex-col justify-center items-center mt-[10%] gap-10">
      <div className="px-6 sm:px-0 max-w-sm w-full">
        <button
          type="button"
          onClick={() => signIn("google")}
          className="text-white w-full bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 
          font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center 
          dark:focus:ring-[#4285F4]/55"
        >
          Sign up with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
