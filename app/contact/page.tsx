"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, Send, Check } from "lucide-react";
import FadeIn from "@/components/animations/fade-in";

export default function ContactPage() {
  return (
    <main className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <FadeIn direction="up">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-center">
            Contact Us
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-center mb-12">
            Have questions or want to place an order? Reach out to us and we'll
            get back to you as soon as possible.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <FadeIn direction="up" delay={0.1}>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Phone</h3>
              <p className="text-gray-600 mb-2">+91 7001480849</p>
              <p className="text-gray-500 text-sm">
                Monday - Saturday: 9am - 9pm
              </p>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Email</h3>
              <p className="text-gray-600 mb-2">gravethecrave@gmail.com</p>
              <p className="text-gray-500 text-sm">
                We'll respond within 24 hours
              </p>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.3}>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Location
              </h3>
              <p className="text-gray-600 mb-2">
                Shri Durga Palli, Katwa, West Bengal 713130
              </p>
              <p className="text-gray-500 text-sm">
                Pickup by appointment only
              </p>
            </div>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <FadeIn direction="left">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-primary mb-6">
                Send Us a Message
              </h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Your Name
                    </label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    placeholder="+91 9876543210"
                    className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder="Order Inquiry"
                    className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Your message here..."
                    rows={5}
                    className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </div>
          </FadeIn>

          <div>
            <FadeIn
              direction="right"
              className="bg-white rounded-lg shadow-lg p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-primary mb-6">
                Business Hours
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-500" />
                    <span className="font-medium">Monday - Friday</span>
                  </div>
                  <span>9:00 AM - 9:00 PM</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-500" />
                    <span className="font-medium">Saturday</span>
                  </div>
                  <span>10:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-500" />
                    <span className="font-medium">Sunday</span>
                  </div>
                  <span>Special orders only</span>
                </div>
              </div>
              <p className="mt-4 text-gray-600 text-sm">
                * Orders must be placed at least 24 hours in advance
              </p>
            </FadeIn>

            <FadeIn
              direction="right"
              delay={0.2}
              className="bg-amber-50 rounded-lg p-6"
            >
              <h3 className="text-xl font-semibold text-primary mb-4">
                Order Information
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="bg-amber-100 rounded-full p-1 mt-0.5">
                    <Check className="h-4 w-4 text-amber-600" />
                  </div>
                  <span>Custom orders available for special occasions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-amber-100 rounded-full p-1 mt-0.5">
                    <Check className="h-4 w-4 text-amber-600" />
                  </div>
                  <span>Delivery available within city limits</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-amber-100 rounded-full p-1 mt-0.5">
                    <Check className="h-4 w-4 text-amber-600" />
                  </div>
                  <span>Free delivery for orders above ₹500</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-amber-100 rounded-full p-1 mt-0.5">
                    <Check className="h-4 w-4 text-amber-600" />
                  </div>
                  <span>Bulk orders for events and parties welcome</span>
                </li>
              </ul>
            </FadeIn>
          </div>
        </div>

        {/* Map Section */}
        <FadeIn
          direction="up"
          className="bg-white rounded-lg shadow-lg p-4 mb-8"
        >
          <div className="aspect-video w-full rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.1966328321794!2d88.3462!3d22.5726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDM0JzIxLjQiTiA4OMKwMjAnNDYuMyJF!5e0!3m2!1sen!2sin!4v1623825278428!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
