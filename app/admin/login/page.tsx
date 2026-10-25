"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { ApiError } from "@/lib/api";
import FadeIn from "@/components/animations/fade-in";

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin, isAdmin, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Already an admin? Go straight to the dashboard.
  useEffect(() => {
    if (!loading && isAdmin) {
      router.replace("/admin");
    }
  }, [loading, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminLogin(username, password);
      toast.success("Logged in as admin");
      router.push("/admin");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Something went wrong. Please try again.";
      toast.error(message);
      setSubmitting(false);
    }
  };

  return (
    <main className="pt-32 pb-24 min-h-screen bg-gradient-to-b from-amber-50/60 to-white">
      <div className="container mx-auto px-4">
        <FadeIn direction="up" className="max-w-md mx-auto">
          <Card className="border-amber-100 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-primary">
                Admin sign in
              </CardTitle>
              <CardDescription>
                Manage stocks, billing, promotions and pricing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Admin"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <PasswordInput
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-full"
                >
                  {submitting ? "Signing in..." : "Sign in"}
                </Button>
              </form>
              <p className="text-xs text-gray-400 text-center mt-6">
                Customer?{" "}
                <Link href="/login" className="hover:underline">
                  Customer login
                </Link>
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </main>
  );
}
