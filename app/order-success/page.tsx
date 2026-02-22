"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  Home,
  ShoppingBag,
  Download,
  Phone,
  Mail,
} from "lucide-react";
import confetti from "canvas-confetti";

interface OrderDetails {
  items: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
  }>;
  total: number;
  orderNumber: string;
  orderDate: string;
  estimatedDelivery: string;
}

export default function OrderSuccessPage() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    // Load order details from localStorage
    const savedOrder = localStorage.getItem("lastOrder");
    if (savedOrder) {
      try {
        const orderData = JSON.parse(savedOrder);
        setOrderDetails(orderData);
      } catch (error) {
        console.error("Error loading order details:", error);
      }
    }

    // Trigger confetti animation when component mounts
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: NodeJS.Timeout = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="pt-24 pb-20 min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="flex justify-center mb-6"
          >
            <div className="bg-green-100 rounded-full p-6">
              <CheckCircle className="h-24 w-24 text-green-500" />
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-bold text-primary mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Order Placed Successfully! 🎉
          </motion.h1>

          <motion.p
            className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            Thank you for your order! We've received your request and our bakers
            are already getting started on your delicious treats. You'll receive
            a confirmation email shortly.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card className="shadow-xl">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl text-primary mb-6 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Order Details
                </h3>

                {orderDetails && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Order Number:</span>
                        <p className="font-semibold text-lg">
                          {orderDetails.orderNumber}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Order Date:</span>
                        <p className="font-semibold">
                          {new Date(
                            orderDetails.orderDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          Estimated Delivery:
                        </span>
                        <p className="font-semibold text-green-600">
                          {new Date(
                            orderDetails.estimatedDelivery
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Amount:</span>
                        <p className="font-bold text-xl text-primary">
                          ₹{orderDetails.total}
                        </p>
                      </div>
                    </div>

                    {/* Ordered Items */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3">Items Ordered:</h4>
                      <div className="space-y-3">
                        {orderDetails.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 bg-amber-50 p-3 rounded-lg"
                          >
                            <div className="relative w-12 h-12 rounded-md overflow-hidden">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold">
                              ₹{item.price * item.quantity}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1 }}
            className="space-y-6"
          >
            <Card className="shadow-xl">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl text-primary mb-4">
                  What's Next?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Order Confirmation</p>
                      <p className="text-sm text-gray-600">
                        You'll receive an email confirmation within 5 minutes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Preparation</p>
                      <p className="text-sm text-gray-600">
                        Our bakers will start preparing your fresh treats
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Delivery</p>
                      <p className="text-sm text-gray-600">
                        Your order will be delivered fresh to your doorstep
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl bg-gradient-to-r from-amber-50 to-orange-50">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl text-primary mb-4">
                  Need Help?
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="font-medium">Call Us</p>
                      <p className="text-sm text-gray-600">+91 7001480849</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="font-medium">Email Us</p>
                      <p className="text-sm text-gray-600">
                        gravethecrave@gmail.com
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
          >
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Return to Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 px-8 py-3"
          >
            <Link href="/menu">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Continue Shopping
            </Link>
          </Button>
          {orderDetails && (
            <Button
              variant="outline"
              className="border-amber-500 text-amber-600 hover:bg-amber-50 px-8 py-3"
              onClick={() => {
                const orderText = `Order #${
                  orderDetails.orderNumber
                }\nDate: ${new Date(
                  orderDetails.orderDate
                ).toLocaleDateString()}\nTotal: ₹${
                  orderDetails.total
                }\n\nItems:\n${orderDetails.items
                  .map(
                    (item) =>
                      `${item.name} x${item.quantity} - ₹${
                        item.price * item.quantity
                      }`
                  )
                  .join("\n")}`;
                navigator.clipboard.writeText(orderText);
                alert("Order details copied to clipboard!");
              }}
            >
              <Download className="mr-2 h-5 w-5" />
              Copy Order Details
            </Button>
          )}
        </motion.div>
      </div>
    </main>
  );
}
