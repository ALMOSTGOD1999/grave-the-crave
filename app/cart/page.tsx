"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "../../contexts/cart-context";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Heart,
  CreditCard,
  Truck,
} from "lucide-react";
import FadeIn from "@/components/animations/fade-in";
import FloatAnimation from "@/components/animations/float-animation";

export default function CartPage() {
  const router = useRouter();
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isOrdering, setIsOrdering] = useState(false);

  const deliveryFee = state.total > 500 ? 0 : 20;
  const finalTotal = state.total + deliveryFee - discount;

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "welcome10") {
      setDiscount(state.total * 0.1);
      alert("10% discount applied!");
    } else if (promoCode.toLowerCase() === "save50") {
      setDiscount(50);
      alert("₹50 discount applied!");
    } else if (promoCode.toLowerCase() === "first20") {
      setDiscount(state.total * 0.2);
      alert("20% first-time customer discount applied!");
    } else {
      alert("Invalid promo code. Try: WELCOME10, SAVE50, or FIRST20");
    }
  };

  const handleOrderNow = async () => {
    setIsOrdering(true);

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Store order details for success page
    const orderDetails = {
      items: state.items,
      total: finalTotal,
      orderNumber: `GTC${Math.floor(10000 + Math.random() * 90000)}`,
      orderDate: new Date().toISOString(),
      estimatedDelivery: new Date(
        Date.now() + 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
    };

    localStorage.setItem("lastOrder", JSON.stringify(orderDetails));

    // Clear cart and navigate to success page
    clearCart();
    router.push("/order-success");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.2 },
    },
  };

  if (state.items.length === 0) {
    return (
      <main className="pt-24 pb-20 min-h-screen">
        <div className="container mx-auto px-4">
          <FadeIn direction="up" className="text-center">
            <div className="max-w-md mx-auto">
              <FloatAnimation amplitude={10} duration={3}>
                <div className="bg-amber-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8">
                  <ShoppingBag className="h-16 w-16 text-amber-600" />
                </div>
              </FloatAnimation>

              <h1 className="text-3xl font-bold text-primary mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any delicious treats to your cart
                yet. Explore our menu and find something sweet!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <Link href="/menu">
                    <Heart className="mr-2 h-4 w-4" />
                    Browse Menu
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-20 relative overflow-hidden">
      {/* Floating decorative elements */}
      <FloatAnimation
        className="absolute top-20 right-10 opacity-20 hidden md:block"
        amplitude={15}
        duration={6}
      >
        <div className="w-32 h-32 rounded-full bg-amber-300" />
      </FloatAnimation>

      <FloatAnimation
        className="absolute bottom-20 left-10 opacity-20 hidden md:block"
        amplitude={12}
        duration={5}
        delay={1}
      >
        <div className="w-24 h-24 rounded-full bg-primary/30" />
      </FloatAnimation>

      <div className="container mx-auto px-4 relative z-10">
        <FadeIn direction="up" className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary">
                Your Cart
              </h1>
              <p className="text-gray-600 mt-2">
                {state.itemCount} {state.itemCount === 1 ? "item" : "items"} in
                your cart
              </p>
            </div>
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Cart
            </Button>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <AnimatePresence>
                {state.items.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover transition-transform duration-300 hover:scale-110"
                            />
                          </div>

                          <div className="flex-1">
                            <h3 className="font-semibold text-primary text-lg">
                              {item.name}
                            </h3>
                            <p className="text-amber-600 font-medium text-lg">
                              ₹{item.price}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Fresh & Delicious
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="h-10 w-10 rounded-full"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>

                            <div className="bg-amber-50 px-4 py-2 rounded-lg min-w-[60px] text-center">
                              <span className="font-semibold text-lg">
                                {item.quantity}
                              </span>
                            </div>

                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="h-10 w-10 rounded-full"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-xl text-primary">
                              ₹{item.price * item.quantity}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-2"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Continue Shopping */}
            <FadeIn direction="up" delay={0.4} className="mt-6">
              <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-primary mb-2">
                        Want to add more items?
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Explore our delicious menu for more treats
                      </p>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary/10"
                    >
                      <Link href="/menu">
                        <Heart className="mr-2 h-4 w-4" />
                        Browse Menu
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>

          {/* Order Summary */}
          <div>
            <FadeIn direction="right" delay={0.3}>
              <Card className="sticky top-24 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-primary to-amber-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* Order Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-lg">
                      <span className="text-gray-600">
                        Subtotal ({state.itemCount} items)
                      </span>
                      <span className="font-semibold">₹{state.total}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-green-600 text-lg">
                        <span>Discount Applied</span>
                        <span className="font-semibold">-₹{discount}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-lg">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Delivery Fee
                      </span>
                      <span className="font-semibold">
                        {deliveryFee === 0 ? (
                          <span className="text-green-600">Free!</span>
                        ) : (
                          `₹${deliveryFee}`
                        )}
                      </span>
                    </div>

                    {state.total < 500 && (
                      <div className="bg-amber-50 p-3 rounded-lg">
                        <p className="text-sm text-amber-700 font-medium">
                          🎉 Add ₹{500 - state.total} more for free delivery!
                        </p>
                      </div>
                    )}

                    <div className="border-t-2 border-gray-200 pt-4">
                      <div className="flex justify-between text-2xl font-bold">
                        <span>Total</span>
                        <span className="text-primary">₹{finalTotal}</span>
                      </div>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3 text-primary">
                      Have a Promo Code?
                    </h4>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={handleApplyPromo}
                        className="border-primary text-primary hover:bg-primary/10"
                      >
                        Apply
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                        WELCOME10
                      </span>
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                        SAVE50
                      </span>
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                        FIRST20
                      </span>
                    </div>
                  </div>

                  {/* Order Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleOrderNow}
                      disabled={isOrdering}
                      className="w-full bg-gradient-to-r from-primary to-amber-600 hover:from-primary/90 hover:to-amber-600/90 text-white text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isOrdering ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Processing Order...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          Order Now - ₹{finalTotal}
                        </div>
                      )}
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary/10 py-3"
                    >
                      <Link href="/checkout">
                        <Truck className="mr-2 h-4 w-4" />
                        Detailed Checkout
                      </Link>
                    </Button>
                  </div>

                  {/* Security & Trust */}
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Secure Payment</span>
                    </div>
                    <p className="text-green-600 text-xs mt-1">
                      Your payment information is encrypted and secure
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Delivery Info */}
            <FadeIn direction="right" delay={0.5} className="mt-6">
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Delivery Information
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      Free delivery for orders above ₹500
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      Delivery within 24-48 hours
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      Fresh baked goods guaranteed
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      Contact us for same-day delivery
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </div>
    </main>
  );
}
