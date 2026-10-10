"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import StocksSection from "./sections/stocks";
import BillingSection from "./sections/billing";
import PromotionSection from "./sections/promotion";
import PricingSection from "./sections/pricing";
import { Package, Receipt, Megaphone, Tags } from "lucide-react";

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage stocks, billing, promotions and pricing
          </p>
        </div>

        <Tabs defaultValue="stocks" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="stocks" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Stocks</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
            <TabsTrigger value="promotion" className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              <span className="hidden sm:inline">Promotion</span>
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center gap-2">
              <Tags className="h-4 w-4" />
              <span className="hidden sm:inline">Pricing</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stocks">
            <StocksSection />
          </TabsContent>
          <TabsContent value="billing">
            <BillingSection />
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
