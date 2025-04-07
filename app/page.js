"use client";
import Hero from "@/components/Home/Hero/Hero";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div>
      <Hero />
    </div>
  );
}
