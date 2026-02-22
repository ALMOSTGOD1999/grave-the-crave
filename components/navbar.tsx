"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "Who We Are", href: "/about" },
  { name: "Order Now", href: "/order" },
  { name: "Custom Order", href: "/custom-order" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { state } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-md py-2"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.jpeg"
            alt="Grave the Crave Bakery"
            width={50}
            height={50}
            className="w-12 h-12 rounded-full md:w-14 md:h-14 rounded-full"
          />
          <span
            className={cn(
              "font-semibold text-lg md:text-xl",
              isScrolled ? "text-primary" : "text-white"
            )}
          >
            Grave the Crave
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "font-medium hover:text-amber-500 transition-colors",
                isScrolled ? "text-primary" : "text-white"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Button
            asChild
            className="bg-amber-500 hover:bg-amber-600 text-white rounded-full relative"
          >
            <Link href="/cart">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Cart ({state.itemCount})
              {state.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.itemCount}
                </span>
              )}
            </Link>
          </Button>
        </nav>

        {/* Mobile Navigation Toggle */}
        <button
          className="md:hidden text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X
              className={isScrolled ? "text-primary" : "text-white"}
              size={24}
            />
          ) : (
            <Menu
              className={isScrolled ? "text-primary" : "text-white"}
              size={24}
            />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 right-0 shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-medium text-primary py-2 hover:text-amber-500 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Button
              asChild
              className="bg-amber-500 hover:bg-amber-600 text-white rounded-full w-full relative"
            >
              <Link href="/cart" onClick={() => setIsOpen(false)}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Cart ({state.itemCount})
                {state.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {state.itemCount}
                  </span>
                )}
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
