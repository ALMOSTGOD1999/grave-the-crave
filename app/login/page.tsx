"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const next = searchParams.get("next") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.fullName || user.email}!`);
      router.push(next);
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
    <FadeIn direction="up" className="max-w-md mx-auto">
      <Card className="border-amber-100 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">Log in</CardTitle>
          <CardDescription>
            Access your account to place orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
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
              {submitting ? "Logging in..." : "Log in"}
            </Button>
          </form>
          <p className="text-sm text-gray-600 text-center mt-6">
            New here?{" "}
            <Link href="/signup" className="text-amber-600 hover:underline">
              Create an account
            </Link>
          </p>
          <p className="text-xs text-gray-400 text-center mt-3">
            Bakery staff?{" "}
            <Link href="/admin/login" className="hover:underline">
              Admin login
            </Link>
          </p>
        </CardContent>
      </Card>
    </FadeIn>
  );
}

export default function LoginPage() {
  return (
    <main className="pt-32 pb-24 min-h-screen bg-gradient-to-b from-amber-50/60 to-white">
      <div className="container mx-auto px-4">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
