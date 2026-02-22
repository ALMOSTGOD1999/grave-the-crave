"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Tag, Percent } from "lucide-react";
import { currentOffers } from "@/data/offers";
import FadeIn from "@/components/animations/fade-in";
import StaggerChildren from "@/components/animations/stagger-children";
import FloatAnimation from "@/components/animations/float-animation";
import { motion } from "framer-motion";

export default function OffersSection() {
  return (
    <section className="py-20 bg-primary text-white relative overflow-hidden">
      {/* Floating decorative elements */}
      <FloatAnimation
        className="absolute top-10 left-10 opacity-10"
        amplitude={15}
        duration={6}
      >
        <div className="w-40 h-40 rounded-full bg-amber-300" />
      </FloatAnimation>

      <FloatAnimation
        className="absolute bottom-20 right-20 opacity-10"
        amplitude={20}
        duration={7}
        delay={1}
      >
        <div className="w-60 h-60 rounded-full bg-white" />
      </FloatAnimation>

      <div className="container mx-auto px-4 relative z-10">
        <FadeIn direction="up" className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Special <span className="text-amber-400">Offers</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Take advantage of our limited-time deals and seasonal specials.
          </p>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentOffers.map((offer) => (
            <motion.div
              key={offer.id}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: "easeOut" },
                },
              }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-none overflow-hidden hover:bg-white/15 transition-all duration-300 hover:-translate-y-2">
                <div className="relative h-48">
                  <Image
                    src={offer.image}
                    alt={offer.title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-110"
                  />
                  {offer.badge && (
                    <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {offer.badge}
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                  <p className="text-gray-300 mb-4">{offer.description}</p>

                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="h-4 w-4 text-amber-400" />
                    <span className="text-amber-400 font-medium">
                      {offer.discount}
                    </span>
                  </div>

                  {offer.validUntil && (
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="h-4 w-4 text-gray-300" />
                      <span className="text-gray-300 text-sm">
                        Valid until {offer.validUntil}
                      </span>
                    </div>
                  )}

                  <Button
                    asChild
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white group"
                  >
                    <Link
                      href={offer.link}
                      className="flex items-center justify-center"
                    >
                      Claim Offer
                      <motion.span
                        initial={{ x: 0 }}
                        animate={{ x: [0, 5, 0] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          repeatDelay: 2,
                        }}
                        className="ml-2"
                      >
                        →
                      </motion.span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
