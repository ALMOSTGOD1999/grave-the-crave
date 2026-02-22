import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { featuredProducts } from "@/data/products";
import FadeIn from "@/components/animations/fade-in";
import StaggerChildren from "@/components/animations/stagger-children";
import FloatAnimation from "@/components/animations/float-animation";
import { motion } from "framer-motion";
import { ChevronRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import AddToCartButton from "@/components/add-to-cart-button";

export default function FeaturedProducts() {
  const { addItem } = useCart();

  return (
    <section className="py-20 bg-amber-50 relative overflow-hidden">
      {/* Floating decorative elements */}
      <FloatAnimation
        className="absolute -top-10 -left-10 opacity-30"
        amplitude={20}
        duration={6}
      >
        <div className="w-40 h-40 rounded-full bg-amber-300" />
      </FloatAnimation>

      <FloatAnimation
        className="absolute -bottom-20 -right-20 opacity-30"
        amplitude={15}
        duration={7}
        delay={1}
      >
        <div className="w-60 h-60 rounded-full bg-primary/30" />
      </FloatAnimation>

      <div className="container mx-auto px-4 relative z-10">
        <FadeIn direction="up" className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Our Popular Treats
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most loved baked goods that keep our customers coming
            back for more.
          </p>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: "easeOut" },
                },
              }}
            >
              <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative h-64">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-primary">
                      {product.name}
                    </h3>
                    <span className="text-lg font-semibold text-amber-600">
                      ₹{product.price}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex gap-2">
                    <Button
                      asChild
                      className="flex-1 bg-primary hover:bg-primary/90 text-white group"
                    >
                      <Link
                        href={`/order?item=${product.id}`}
                        className="flex items-center justify-center"
                      >
                        View Details
                        <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    <AddToCartButton
                      productId={product.id}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-3"
                      size="default"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </StaggerChildren>

        <FadeIn direction="up" delay={0.6} className="text-center mt-12">
          <Button
            asChild
            size="lg"
            className="bg-amber-500 hover:bg-amber-600 text-white rounded-full"
          >
            <Link href="/menu">View Full Menu</Link>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
