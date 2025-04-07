"use client";
import About from "@/components/Home/About";
import Contact from "@/components/Home/Contact";
import Features from "@/components/Home/Features";
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
      <Features />
      <About />
      <Contact />
    </div>
  );
}
