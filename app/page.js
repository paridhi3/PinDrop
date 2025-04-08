"use client";
import About from "@/components/Home/About";
import Contact from "@/components/Home/Contact";
import Features from "@/components/Home/Features";
import Hero from "@/components/Home/Hero/Hero";

export default function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <About />
      <Contact />
    </div>
  );
}
