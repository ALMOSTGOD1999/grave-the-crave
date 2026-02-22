"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check } from "lucide-react";
import { faqItems } from "@/data/faq-items";
import FadeIn from "@/components/animations/fade-in";
import StaggerChildren from "@/components/animations/stagger-children";
import FloatAnimation from "@/components/animations/float-animation";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className="pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative h-[300px] mb-12">
        <Image
          src="https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80"
          alt="About Us Banner"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <FadeIn direction="up" className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Who We Are
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto px-4">
              The story behind Grave the Crave Bakery
            </p>
          </FadeIn>
        </div>

        {/* Floating decorative elements */}
        <FloatAnimation
          className="absolute bottom-10 left-10 opacity-30 hidden md:block"
          amplitude={15}
          duration={5}
        >
          <div className="w-24 h-24 rounded-full bg-amber-300/50" />
        </FloatAnimation>
      </section>

      <div className="container mx-auto px-4">
        {/* Our Story */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left">
              <h2 className="text-3xl font-bold text-primary mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 mb-4">
                Grave the Crave Bakery was born out of a passion for creating
                delicious, homemade baked goods that bring joy to people's
                lives. Established in 2023, our journey began in a small home
                kitchen with a handful of family recipes and a dream to share
                our love for baking with the world.
              </p>
              <p className="text-gray-600 mb-4">
                What started as a hobby quickly turned into a beloved local
                business as word spread about our delectable treats. We take
                pride in using only the finest ingredients, traditional
                techniques, and adding our special touch to every creation.
              </p>
              <p className="text-gray-600">
                Today, we continue to grow while maintaining the same dedication
                to quality and taste that has been our foundation from day one.
                Every cake, pastry, and sweet treat is crafted with care,
                ensuring that each bite is a memorable experience.
              </p>
            </FadeIn>
            <FadeIn
              direction="right"
              className="relative h-[400px] rounded-lg overflow-hidden shadow-xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2187&q=80"
                alt="Bakery story"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </FadeIn>
          </div>
        </section>

        {/* Our Values */}
        <FadeIn direction="up" className="mb-20">
          <section className="bg-amber-50 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">
              Our Values
            </h2>
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Quality Ingredients",
                  description:
                    "We source the finest ingredients to ensure exceptional taste and quality in every bite. No artificial preservatives or flavors.",
                },
                {
                  title: "Handcrafted with Love",
                  description:
                    "Each item is made by hand with attention to detail and the care that only comes from a passion for baking.",
                },
                {
                  title: "Customer Satisfaction",
                  description:
                    "Your happiness is our priority. We strive to exceed expectations and create memorable experiences through our baked goods.",
                },
              ].map((value, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: "easeOut" },
                    },
                  }}
                >
                  <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Check className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </StaggerChildren>
          </section>
        </FadeIn>

        {/* Meet the Baker */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn
              direction="left"
              className="order-2 lg:order-1 relative h-[400px] rounded-lg overflow-hidden shadow-xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Baker in kitchen"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </FadeIn>
            <FadeIn direction="right" className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-primary mb-6">
                Meet the Baker
              </h2>
              <p className="text-gray-600 mb-4">
                Behind every delicious treat at Grave the Crave is our
                passionate head baker Soumi, who brings years of experience and
                a genuine love for the craft. With formal training and a natural
                talent for creating exceptional flavors, our baker transforms
                simple ingredients into extraordinary desserts.
              </p>
              <p className="text-gray-600 mb-4">
                The journey began with family recipes passed down through
                generations, which have been perfected and expanded with
                creative new ideas and techniques. Each recipe has been tested
                and refined countless times to ensure it meets our high
                standards.
              </p>
              <p className="text-gray-600">
                What truly sets our baking apart is the personal touch and
                attention to detail that goes into every creation. It's not just
                about following recipes—it's about understanding the art and
                science of baking and infusing each item with care and passion.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* FAQ Section */}
        <FadeIn direction="up" className="mb-20">
          <div id="faq">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <AccordionItem value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-medium text-primary">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </div>
        </FadeIn>

        {/* CTA Section */}
        <FadeIn
          direction="up"
          className="bg-primary text-white rounded-xl p-8 text-center"
        >
          <FloatAnimation
            className="absolute -top-5 -right-5 opacity-10"
            amplitude={15}
            duration={6}
          >
            <div className="w-32 h-32 rounded-full bg-amber-300" />
          </FloatAnimation>

          <h2 className="text-3xl font-bold mb-4">
            Ready to Satisfy Your Cravings?
          </h2>
          <p className="text-gray-200 max-w-2xl mx-auto mb-8">
            Explore our menu and place an order today to experience our
            delicious homemade treats.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              <Link href="/menu">View Our Menu</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white bg-transparent text-white hover:bg-brown/10"
            >
              <Link href="/order">Place an Order</Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
