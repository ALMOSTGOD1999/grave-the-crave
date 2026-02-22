"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import HeroSection from "@/components/hero-section";
import FeaturedProducts from "@/components/featured-products";
import AboutSection from "@/components/about-section";
import OffersSection from "@/components/offers-section";
import TestimonialsSection from "@/components/testimonials-section";
import ContactSection from "@/components/contact-section";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <FeaturedProducts />
      <AboutSection />
      <OffersSection />
      <TestimonialsSection />
      <ContactSection />
    </main>
  );
}
