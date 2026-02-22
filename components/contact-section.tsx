"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import FadeIn from "@/components/animations/fade-in";
import FloatAnimation from "@/components/animations/float-animation";

export default function ContactSection() {
  return (
    <section className="py-20 bg-white relative" id="contact">
      {/* Floating decorative elements */}
      <FloatAnimation
        className="absolute top-20 right-10 opacity-20 hidden md:block"
        amplitude={12}
        duration={5}
      >
        <div className="w-32 h-32 rounded-full bg-amber-200" />
      </FloatAnimation>

      <div className="container mx-auto px-4 relative z-10">
        <FadeIn direction="up" className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Get In Touch
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions or want to place an order? Reach out to us and we'll
            get back to you as soon as possible.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <FadeIn direction="left">
            <h3 className="text-2xl font-semibold text-primary mb-6">
              Contact Information
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
                <div className="bg-amber-100 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Phone</h4>
                  <p className="text-gray-600">+91 7001480849</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Available Mon-Sat, 9am-7pm
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
                <div className="bg-amber-100 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Email</h4>
                  <p className="text-gray-600">gravethecrave@gmail.com</p>
                  <p className="text-gray-500 text-sm mt-1">
                    We'll respond within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
                <div className="bg-amber-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Location</h4>
                  <p className="text-gray-600">
                    Vivekananda Palli, Saheb Bagan, Katwa, West Bengal 713130
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Open for pickup by appointment
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right">
            <h3 className="text-2xl font-semibold text-primary mb-6">
              Send Us a Message
            </h3>

            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 transition-all duration-300"
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
                    className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 transition-all duration-300"
                  />
                </div>
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
                  className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 transition-all duration-300"
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
                  className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 transition-all duration-300"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white group"
              >
                <Send className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                Send Message
              </Button>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
