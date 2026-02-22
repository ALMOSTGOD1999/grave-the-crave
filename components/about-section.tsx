"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import FadeIn from "@/components/animations/fade-in";
import StaggerChildren from "@/components/animations/stagger-children";
import FloatAnimation from "@/components/animations/float-animation";
import { motion } from "framer-motion";

export default function AboutSection() {
  const highlights = [
    "Premium quality ingredients",
    "Homemade with love since 2023",
    "Custom orders available",
    "Fresh baked daily",
  ];

  return (
    <section className="py-20 bg-white relative" id="about">
      {/* Floating decorative elements */}
      <FloatAnimation
        className="absolute top-20 right-10 opacity-20 hidden md:block"
        amplitude={12}
        duration={5}
      >
        <div className="w-32 h-32 rounded-full bg-amber-300" />
      </FloatAnimation>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeIn
            direction="left"
            className="relative h-[500px] rounded-lg overflow-hidden shadow-xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Bakery kitchen"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </FadeIn>

          <div>
            <FadeIn direction="right">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                Who We Are
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                Grave the Crave is a passionate home bakery established in 2023,
                dedicated to creating delicious, handcrafted baked goods that
                satisfy your sweet cravings. Our journey began with a simple
                love for baking and has grown into a beloved local bakery known
                for quality and taste.
              </p>
              <p className="text-gray-600 mb-8 text-lg">
                Every item is made fresh daily using premium ingredients,
                traditional techniques, and a lot of love. We take pride in our
                attention to detail and commitment to excellence.
              </p>
            </FadeIn>

            <StaggerChildren className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.3, ease: "easeOut" },
                    },
                  }}
                >
                  <div className="bg-amber-100 rounded-full p-1">
                    <Check className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </motion.div>
              ))}
            </StaggerChildren>

            <FadeIn direction="up">
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-white rounded-full"
              >
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
