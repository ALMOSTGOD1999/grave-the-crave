"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import FadeIn from "@/components/animations/fade-in";
import RevealText from "@/components/animations/reveal-text";
import FloatAnimation from "@/components/animations/float-animation";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1486427944299-d1955d23e34d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Bakery background"
          fill
          className="object-cover brightness-50"
          priority
        />
      </div>

      <div className="container mx-auto px-4 z-10 py-20">
        <div className="max-w-2xl">
          <FadeIn direction="up" delay={0.2}>
            <RevealText className="text-4xl md:text-6xl font-bold text-white mb-4">
              Delicious <span className="text-amber-400">Homemade</span> Baked
              Goods
            </RevealText>
          </FadeIn>

          <FadeIn direction="up" delay={0.4}>
            <p className="text-xl text-gray-200 mb-8">
              Indulge in our freshly baked cakes, pastries, and treats made with
              premium ingredients and love.
            </p>
          </FadeIn>

          <FadeIn direction="up" delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-white rounded-full group"
              >
                <Link href="/menu" className="flex items-center">
                  View Our Menu
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white bg-transparent text-white hover:bg-primary rounded-full"
              >
                <Link href="/order">Order Now</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Floating decorative elements */}
      <FloatAnimation
        className="absolute bottom-20 right-20 hidden md:block"
        amplitude={15}
        duration={5}
      >
        <div className="w-24 h-24 bg-amber-500/20 backdrop-blur-sm rounded-full" />
      </FloatAnimation>

      <FloatAnimation
        className="absolute top-40 right-40 hidden md:block"
        amplitude={10}
        duration={4}
        delay={1}
      >
        <div className="w-16 h-16 bg-primary/20 backdrop-blur-sm rounded-full" />
      </FloatAnimation>
    </section>
  );
}
