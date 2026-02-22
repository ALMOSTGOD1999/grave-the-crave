"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { menuItems } from "@/data/menu-items";
import { Calendar, Clock, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import AddToCartButton from "@/components/add-to-cart-button";

// Loading component for Suspense fallback
function OrderPageLoading() {
  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
      </div>
    </main>
  );
}

// Main order component that uses useSearchParams
function OrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemId = searchParams.get("item");

  const [selectedItem, setSelectedItem] = useState(itemId || "");
  const [quantity, setQuantity] = useState(1);
  const [orderDate, setOrderDate] = useState("");
  const [orderTime, setOrderTime] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  const selectedProduct = menuItems.find((item) => item.id === selectedItem);

  const { addItem } = useCart();

  // Calculate total
  const subtotal = selectedProduct ? selectedProduct.price * quantity : 0;
  const deliveryFee = 50;
  const total = subtotal + deliveryFee;

  // Set min date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split("T")[0];
    setOrderDate(formattedDate);
  }, []);

  const handlePlaceOrder = () => {
    router.push("/order-success");
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      addItem(selectedProduct.id, quantity);
      alert(`${selectedProduct.name} added to cart!`);
    } else {
      alert("Please select a product first!");
    }
  };

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">
          Place Your Order
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>
                  Fill in the details below to place your order
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Product Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Product
                  </label>
                  <Select value={selectedItem} onValueChange={setSelectedItem}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {menuItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name} - ₹{item.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Product Preview */}
                {selectedProduct && (
                  <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-lg">
                    <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-primary">
                        {selectedProduct.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedProduct.description}
                      </p>
                      <p className="text-amber-600 font-medium mt-1">
                        ₹{selectedProduct.price}
                      </p>
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(parseInt(e.target.value) || 1)
                      }
                      className="w-20 mx-2 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    {selectedProduct && (
                      <AddToCartButton
                        productId={selectedProduct.id}
                        quantity={quantity}
                        className="ml-4 bg-amber-500 hover:bg-amber-600 text-white"
                      />
                    )}
                  </div>
                </div>

                {/* Delivery Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Delivery Date
                    </label>
                    <Input
                      type="date"
                      value={orderDate}
                      onChange={(e) => setOrderDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="h-4 w-4 inline mr-1" />
                      Preferred Time
                    </label>
                    <Select value={orderTime} onValueChange={setOrderTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">
                          Morning (9AM - 12PM)
                        </SelectItem>
                        <SelectItem value="afternoon">
                          Afternoon (12PM - 4PM)
                        </SelectItem>
                        <SelectItem value="evening">
                          Evening (4PM - 7PM)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions (Optional)
                  </label>
                  <Textarea
                    placeholder="Any special requests or dietary requirements?"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Contact Information */}
                <div className="border-t pt-6">
                  <h3 className="font-medium text-lg mb-4">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <Input placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <Input placeholder="+91 9876543210" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <Input type="email" placeholder="john@example.com" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Address
                      </label>
                      <Textarea
                        placeholder="Enter your full delivery address"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {selectedProduct ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {selectedProduct.name} x {quantity}
                      </span>
                      <span className="font-medium">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-medium">₹{deliveryFee}</span>
                    </div>
                    <div className="border-t pt-4 mt-4 flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-primary text-xl">
                        ₹{total}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-gray-500">
                    Select a product to see the summary.
                  </p>
                )}
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white text-lg py-6"
                  onClick={handlePlaceOrder}
                  disabled={!selectedProduct || !orderDate || !orderTime}
                >
                  Place Order
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

// Main page component with proper Suspense boundary
export default function OrderPage() {
  return (
    <Suspense fallback={<OrderPageLoading />}>
      <OrderContent />
    </Suspense>
  );
}
