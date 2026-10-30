"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import StocksSection from "./sections/stocks";
import BillingSection from "./sections/billing";
import CustomersSection from "./sections/customers";
import PromotionSection from "./sections/promotion";
import PricingSection from "./sections/pricing";
import { Package, Receipt, Users, Megaphone, Tags } from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/admin/login");
    }
  }, [loading, isAdmin, router]);

  if (loading || !isAdmin) {
    return (
      <main className="pt-32 pb-24 min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-24 min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage stocks, billing, customers, promotions and pricing
          </p>
        </div>

        <Tabs defaultValue="stocks" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 sm:mb-8 h-auto p-1 sm:h-9">
            <TabsTrigger
              value="stocks"
              className="flex flex-col sm:flex-row items-center justify-center gap-1 px-1 py-2 sm:py-1.5 sm:gap-2"
            >
              <Package className="h-4 w-4" />
              <span className="text-[11px] sm:text-sm">Stocks</span>
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="flex flex-col sm:flex-row items-center justify-center gap-1 px-1 py-2 sm:py-1.5 sm:gap-2"
            >
              <Receipt className="h-4 w-4" />
              <span className="text-[11px] sm:text-sm">Billing</span>
            </TabsTrigger>
            <TabsTrigger
              value="customers"
              className="flex flex-col sm:flex-row items-center justify-center gap-1 px-1 py-2 sm:py-1.5 sm:gap-2"
            >
              <Users className="h-4 w-4" />
              <span className="text-[11px] sm:text-sm">Customers</span>
            </TabsTrigger>
            <TabsTrigger
              value="promotion"
              className="flex flex-col sm:flex-row items-center justify-center gap-1 px-1 py-2 sm:py-1.5 sm:gap-2"
            >
              <Megaphone className="h-4 w-4" />
              <span className="text-[11px] sm:text-sm">Promotion</span>
            </TabsTrigger>
            <TabsTrigger
              value="pricing"
              className="flex flex-col sm:flex-row items-center justify-center gap-1 px-1 py-2 sm:py-1.5 sm:gap-2"
            >
              <Tags className="h-4 w-4" />
              <span className="text-[11px] sm:text-sm">Pricing</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stocks">
            <StocksSection />
          </TabsContent>
          <TabsContent value="billing">
            <BillingSection />
          </TabsContent>
          <TabsContent value="customers">
            <CustomersSection />
          </TabsContent>
          <TabsContent value="promotion">
            <PromotionSection />
          </TabsContent>
          <TabsContent value="pricing">
            <PricingSection />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
