"use client";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.jpeg"
                alt="Grave the Crave Bakery"
                width={60}
                height={60}
                className="w-14 h-14 rounded-full"
              />
              <span className="font-bold text-xl">Grave the Crave</span>
            </Link>
            <p className="text-gray-300 mt-2">
              Delicious homemade baked goods made with love and premium
              ingredients.
            </p>
            <div className="flex gap-4 mt-4">
              <a
                href="https://www.facebook.com/profile.php?id=61552625923857"
                className="text-white hover:text-amber-400 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-white hover:text-amber-400 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-white hover:text-amber-400 transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/order"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  Order Now
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Our Products</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/menu#cakes"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  Cakes
                </Link>
              </li>
              <li>
                <Link
                  href="/menu#pastries"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  Pastries
                </Link>
              </li>
              <li>
                <Link
                  href="/menu#donuts"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  Donuts
                </Link>
              </li>
              <li>
                <Link
                  href="/menu#specials"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  Special Orders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone
                  size={18}
                  className="text-amber-400 mt-1 flex-shrink-0"
                />
                <span className="text-gray-300">+91 7001480849</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-amber-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300">gravethecrave@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="text-amber-400 mt-1 flex-shrink-0"
                />
                <span className="text-gray-300">
                  Shri Durga Palli, Katwa, West Bengal 713130
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-400">
          <p>
            © {new Date().getFullYear()} Grave the Crave Bakery. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
