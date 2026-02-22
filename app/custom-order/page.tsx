"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  Minus,
  Plus,
  ShoppingBag,
  Cake,
  Palette,
  Utensils,
} from "lucide-react";
import FadeIn from "@/components/animations/fade-in";

export default function CustomOrderPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("cake-details");
  const [cakeSize, setCakeSize] = useState("");
  const [cakeFlavor, setCakeFlavor] = useState("");
  const [frosting, setFrosting] = useState("");
  const [filling, setFilling] = useState("");
  const [toppings, setToppings] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [orderTime, setOrderTime] = useState("");

  // Calculate total
  const basePrices = {
    small: 499,
    medium: 799,
    large: 1099,
    "extra-large": 1499,
  };

  const basePrice = cakeSize
    ? basePrices[cakeSize as keyof typeof basePrices]
    : 0;
  const toppingsPrice = toppings.length * 50;
  const specialFrostingPrice =
    frosting === "cream-cheese" || frosting === "fondant" ? 100 : 0;
  const specialFillingPrice =
    filling === "fruit-compote" || filling === "chocolate-ganache" ? 75 : 0;

  const subtotal =
    basePrice + toppingsPrice + specialFrostingPrice + specialFillingPrice;
  const deliveryFee = 20;
  const total = subtotal + deliveryFee;

  const handleToppingChange = (topping: string) => {
    setToppings((prev) =>
      prev.includes(topping)
        ? prev.filter((t) => t !== topping)
        : [...prev, topping]
    );
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleNext = () => {
    if (activeTab === "cake-details") {
      setActiveTab("design");
    } else if (activeTab === "design") {
      setActiveTab("delivery");
    }
  };

  const handleBack = () => {
    if (activeTab === "design") {
      setActiveTab("cake-details");
    } else if (activeTab === "delivery") {
      setActiveTab("design");
    }
  };

  const handlePlaceOrder = () => {
    router.push("/order-success");
  };

  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <FadeIn direction="up" className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Custom Cake Order
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Design your perfect cake for any special occasion. Customize every
            detail to create a unique and delicious masterpiece.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger
                  value="cake-details"
                  className="text-sm md:text-base"
                >
                  <Cake className="mr-2 h-4 w-4 hidden md:inline" />
                  Cake Details
                </TabsTrigger>
                <TabsTrigger value="design" className="text-sm md:text-base">
                  <Palette className="mr-2 h-4 w-4 hidden md:inline" />
                  Design & Flavors
                </TabsTrigger>
                <TabsTrigger value="delivery" className="text-sm md:text-base">
                  <Utensils className="mr-2 h-4 w-4 hidden md:inline" />
                  Delivery Info
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cake-details">
                <Card>
                  <CardHeader>
                    <CardTitle>Cake Basics</CardTitle>
                    <CardDescription>
                      Choose the size and type of cake you'd like
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Cake Size */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cake Size
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          {
                            id: "small",
                            name: 'Small (6")',
                            price: 399,
                            serves: "6-8 people",
                          },
                          {
                            id: "medium",
                            name: 'Medium (8")',
                            price: 699,
                            serves: "10-12 people",
                          },
                          {
                            id: "large",
                            name: 'Large (10")',
                            price: 999,
                            serves: "16-20 people",
                          },
                          {
                            id: "extra-large",
                            name: 'Extra Large (12")',
                            price: 1299,
                            serves: "25-30 people",
                          },
                        ].map((size) => (
                          <div
                            key={size.id}
                            className={`border rounded-lg p-4 text-center cursor-pointer transition-all ${
                              cakeSize === size.id
                                ? "border-amber-500 bg-amber-50"
                                : "border-gray-200 hover:border-amber-300"
                            }`}
                            onClick={() => setCakeSize(size.id)}
                          >
                            <p className="font-medium">{size.name}</p>
                            <p className="text-amber-600 font-semibold">
                              ₹{size.price}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {size.serves}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cake Shape */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cake Shape
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { id: "round", name: "Round" },
                          { id: "square", name: "Square" },
                          { id: "rectangle", name: "Rectangle" },
                          { id: "heart", name: "Heart" },
                        ].map((shape) => (
                          <div
                            key={shape.id}
                            className="border rounded-lg p-4 text-center cursor-pointer transition-all hover:border-amber-300"
                          >
                            <p className="font-medium">{shape.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Occasion */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Occasion
                      </label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select occasion" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="birthday">Birthday</SelectItem>
                          <SelectItem value="anniversary">
                            Anniversary
                          </SelectItem>
                          <SelectItem value="wedding">Wedding</SelectItem>
                          <SelectItem value="graduation">Graduation</SelectItem>
                          <SelectItem value="baby-shower">
                            Baby Shower
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Message on Cake */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message on Cake (Optional)
                      </label>
                      <Input
                        placeholder="E.g., Happy Birthday John!"
                        className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Maximum 30 characters
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="flex justify-end">
                    <Button
                      className="bg-primary hover:bg-primary/90 text-white"
                      onClick={handleNext}
                    >
                      Next: Design & Flavors
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="design">
                <Card>
                  <CardHeader>
                    <CardTitle>Design & Flavors</CardTitle>
                    <CardDescription>
                      Customize the flavors and appearance of your cake
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Cake Flavor */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cake Flavor
                      </label>
                      <Select value={cakeFlavor} onValueChange={setCakeFlavor}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cake flavor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vanilla">Vanilla</SelectItem>
                          <SelectItem value="chocolate">Chocolate</SelectItem>
                          <SelectItem value="red-velvet">Red Velvet</SelectItem>
                          <SelectItem value="butterscotch">
                            Butterscotch
                          </SelectItem>
                          <SelectItem value="black-forest">
                            Black Forest
                          </SelectItem>
                          <SelectItem value="fruit-n-nut">
                            Fruit 'n' Nut
                          </SelectItem>
                          <SelectItem value="mango">Mango</SelectItem>
                          <SelectItem value="blueberry">Blueberry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Frosting */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frosting Type
                      </label>
                      <Select value={frosting} onValueChange={setFrosting}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frosting type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="buttercream">
                            Buttercream (Included)
                          </SelectItem>
                          <SelectItem value="whipped-cream">
                            Whipped Cream (Included)
                          </SelectItem>
                          <SelectItem value="cream-cheese">
                            Cream Cheese (+₹50)
                          </SelectItem>
                          <SelectItem value="fondant">
                            Fondant (+₹50)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Filling */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filling (Optional)
                      </label>
                      <Select value={filling} onValueChange={setFilling}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select filling type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="vanilla-custard">
                            Vanilla Custard (Included)
                          </SelectItem>
                          <SelectItem value="chocolate-custard">
                            Chocolate Custard (Included)
                          </SelectItem>
                          <SelectItem value="fruit-compote">
                            Fruit Compote (+₹75)
                          </SelectItem>
                          <SelectItem value="chocolate-ganache">
                            Chocolate Ganache (+₹75)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Toppings */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Toppings (₹50 each)
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { id: "fresh-fruits", name: "Fresh Fruits" },
                          {
                            id: "chocolate-shavings",
                            name: "Chocolate Shavings",
                          },
                          { id: "nuts", name: "Nuts" },
                          { id: "sprinkles", name: "Sprinkles" },
                          { id: "edible-flowers", name: "Edible Flowers" },
                          { id: "chocolate-chips", name: "Chocolate Chips" },
                        ].map((topping) => (
                          <div
                            key={topping.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={topping.id}
                              checked={toppings.includes(topping.id)}
                              onCheckedChange={() =>
                                handleToppingChange(topping.id)
                              }
                            />
                            <label
                              htmlFor={topping.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {topping.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Color Theme */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color Theme
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { color: "bg-pink-500", name: "Pink" },
                          { color: "bg-blue-500", name: "Blue" },
                          { color: "bg-purple-500", name: "Purple" },
                          { color: "bg-green-500", name: "Green" },
                          { color: "bg-yellow-500", name: "Yellow" },
                          { color: "bg-red-500", name: "Red" },
                          { color: "bg-orange-500", name: "Orange" },
                          { color: "bg-teal-500", name: "Teal" },
                        ].map((theme) => (
                          <div
                            key={theme.name}
                            className={`w-8 h-8 rounded-full ${theme.color} cursor-pointer border-2 border-transparent hover:border-gray-400`}
                            title={theme.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Special Instructions */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Design Instructions
                      </label>
                      <Textarea
                        placeholder="Describe any specific design elements or references you'd like us to include..."
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        rows={4}
                        className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                      />
                    </div>

                    {/* Reference Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reference Image (Optional)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <p className="text-gray-500">
                          Drag and drop an image here, or click to select
                        </p>
                        <Button variant="outline" className="mt-2">
                          Upload Image
                        </Button>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleBack}>
                      Back
                    </Button>
                    <Button
                      className="bg-primary hover:bg-primary/90 text-white"
                      onClick={handleNext}
                    >
                      Next: Delivery Info
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="delivery">
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Information</CardTitle>
                    <CardDescription>
                      Provide your contact and delivery details
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Contact Information */}
                    <div className="border-b pb-6">
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
                      </div>
                    </div>

                    {/* Delivery Details */}
                    <div>
                      <h3 className="font-medium text-lg mb-4">
                        Delivery Details
                      </h3>

                      <div className="space-y-4">
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
                            <Select
                              value={orderTime}
                              onValueChange={setOrderTime}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="morning">
                                  Morning (10AM - 12PM)
                                </SelectItem>
                                <SelectItem value="afternoon">
                                  Afternoon (12PM - 4PM)
                                </SelectItem>
                                <SelectItem value="evening">
                                  Evening (4PM - 9PM)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Delivery Method
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border rounded-lg p-4 cursor-pointer hover:border-amber-300">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">Home Delivery</p>
                                  <p className="text-sm text-gray-500">
                                    We'll deliver to your address
                                  </p>
                                </div>
                                <p className="text-amber-600 font-medium">
                                  ₹20
                                </p>
                              </div>
                            </div>
                            <div className="border rounded-lg p-4 cursor-pointer hover:border-amber-300">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">Store Pickup</p>
                                  <p className="text-sm text-gray-500">
                                    Pick up from our bakery
                                  </p>
                                </div>
                                <p className="text-amber-600 font-medium">
                                  Free
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Delivery Address
                          </label>
                          <Textarea
                            placeholder="Enter your full delivery address"
                            rows={3}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Additional Notes
                          </label>
                          <Textarea
                            placeholder="Any special instructions for delivery..."
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleBack}>
                      Back
                    </Button>
                    <Button
                      className="bg-primary hover:bg-primary/90 text-white"
                      onClick={handlePlaceOrder}
                    >
                      Place Order
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="bg-amber-50 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-primary mb-2">
                    Your Custom Cake
                  </h3>

                  {cakeSize && (
                    <div className="flex justify-between text-sm mb-1">
                      <span>Size:</span>
                      <span className="font-medium">
                        {cakeSize.charAt(0).toUpperCase() + cakeSize.slice(1)}
                      </span>
                    </div>
                  )}

                  {cakeFlavor && (
                    <div className="flex justify-between text-sm mb-1">
                      <span>Flavor:</span>
                      <span className="font-medium">
                        {cakeFlavor.charAt(0).toUpperCase() +
                          cakeFlavor.slice(1)}
                      </span>
                    </div>
                  )}

                  {frosting && (
                    <div className="flex justify-between text-sm mb-1">
                      <span>Frosting:</span>
                      <span className="font-medium">
                        {frosting
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </span>
                    </div>
                  )}

                  {filling && filling !== "none" && (
                    <div className="flex justify-between text-sm mb-1">
                      <span>Filling:</span>
                      <span className="font-medium">
                        {filling
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </span>
                    </div>
                  )}

                  {toppings.length > 0 && (
                    <div className="flex justify-between text-sm mb-1">
                      <span>Toppings:</span>
                      <span className="font-medium text-right">
                        {toppings.length} selected
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Price</span>
                    <span className="font-medium">₹{basePrice}</span>
                  </div>

                  {toppings.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Toppings (₹50 each)</span>
                      <span className="font-medium">₹{toppingsPrice}</span>
                    </div>
                  )}

                  {specialFrostingPrice > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Special Frosting</span>
                      <span className="font-medium">
                        ₹{specialFrostingPrice}
                      </span>
                    </div>
                  )}

                  {specialFillingPrice > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Special Filling</span>
                      <span className="font-medium">
                        ₹{specialFillingPrice}
                      </span>
                    </div>
                  )}

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
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  disabled={!cakeSize || !cakeFlavor}
                  onClick={handlePlaceOrder}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Place Order
                </Button>
              </CardFooter>
            </Card>

            {/* Delivery Information */}
            <div className="mt-6 bg-amber-50 rounded-lg p-4">
              <h3 className="font-medium text-primary mb-2">
                Custom Order Information
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>
                  • Custom orders must be placed at least 3 days in advance
                </li>
                <li>
                  • A 50% advance payment is required to confirm your order
                </li>
                <li>• Free delivery for orders above ₹500</li>
                <li>• We may contact you to discuss design details</li>
                <li>• Prices may vary based on complexity of design</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
