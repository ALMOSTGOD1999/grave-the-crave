"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { menuItems } from "@/data/menu-items";
import FadeIn from "@/components/animations/fade-in";
import StaggerChildren from "@/components/animations/stagger-children";
import FloatAnimation from "@/components/animations/float-animation";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/cart-context";
import { ShoppingBag } from "lucide-react";
import AddToCartButton from "@/components/add-to-cart-button";

export default function MenuPage() {
  const { addItem } = useCart();

  // Group menu items by category
  const categories = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  return (
    <main className="pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative h-[300px] mb-12">
        <Image
          src="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2036&q=80"
          alt="Menu Banner"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <FadeIn direction="up" className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Menu
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto px-4">
              Explore our delicious selection of freshly baked goods
            </p>
          </FadeIn>
        </div>

        {/* Floating decorative elements */}
        <FloatAnimation
          className="absolute bottom-10 right-10 opacity-30 hidden md:block"
          amplitude={15}
          duration={5}
        >
          <div className="w-24 h-24 rounded-full bg-amber-300/50" />
        </FloatAnimation>
      </section>

      <div className="container mx-auto px-4">
        {/* Category Navigation */}
        <FadeIn direction="up" className="mb-12">
          <div className="flex flex-wrap gap-4 justify-center">
            {Object.keys(categories).map((category, index) => (
              <motion.a
                key={category}
                href={`#${category.toLowerCase().replace(/\s+/g, "-")}`}
                className="bg-amber-100 hover:bg-amber-200 text-primary px-4 py-2 rounded-full transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.a>
            ))}
          </div>
        </FadeIn>

        {/* Menu Categories */}
        {Object.entries(categories).map(([category, items], categoryIndex) => (
          <FadeIn
            key={category}
            direction="up"
            delay={categoryIndex * 0.1}
            className="mb-16"
          >
            <div id={category.toLowerCase().replace(/\s+/g, "-")}>
              <h2 className="text-3xl font-bold text-primary mb-8 text-center">
                {category}
              </h2>
            </div>

            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <motion.div
                  key={item.id}
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
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-110"
                      />
                      {item.isPopular && (
                        <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Popular
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-primary">
                          {item.name}
                        </h3>
                        <span className="text-lg font-semibold text-amber-600">
                          ₹{item.price}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      <div className="flex gap-2">
                        <Button
                          asChild
                          className="flex-1 bg-primary hover:bg-primary/90 text-white group"
                        >
                          <Link
                            href={`/order?item=${item.id}`}
                            className="flex items-center justify-center"
                          >
                            Order Now
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
                        <AddToCartButton
                          productId={item.id}
                          className="bg-amber-500 hover:bg-amber-600 text-white px-3"
                          size="default"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </StaggerChildren>
          </FadeIn>
        ))}

        {/* Full Menu Image */}
        {/* <FadeIn
          direction="up"
          className="mb-12 relative rounded-lg overflow-hidden shadow-xl"
        >
          <Image
            src="/menu.jpg"
            alt="Full Menu"
            width={1200}
            height={800}
            className="w-full h-auto"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Our Complete Menu</h3>
              <p className="mb-4">
                Check out our full selection of delicious treats
              </p>
              <Button
                asChild
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                <a href="/menu.jpg" target="_blank" rel="noopener noreferrer">
                  Download Menu
                </a>
              </Button>
            </div>
          </div>
        </FadeIn> */}

        {/* Custom Orders */}
        <FadeIn direction="up" className="bg-amber-50 rounded-xl p-8 mb-12">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Custom Orders
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Looking for something special? We can create custom cakes and
              treats for your special occasions.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-6 mt-8">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <Link href="/custom-order">Request Custom Order</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              <Link href="/about#faq">Read FAQ</Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
