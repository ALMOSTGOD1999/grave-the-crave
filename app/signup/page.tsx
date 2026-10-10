"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    try {
      const user = await register(name, email, password);
      toast.success(`Account created. Welcome, ${user.fullName || user.email}!`);
      router.push("/");
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
                Create your account
              </CardTitle>
              <CardDescription>
                Sign up to order and track your bakes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
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
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-full"
                >
                  {submitting ? "Creating account..." : "Sign up"}
                </Button>
              </form>
              <p className="text-sm text-gray-600 text-center mt-6">
                Already have an account?{" "}
                <Link href="/login" className="text-amber-600 hover:underline">
                  Log in
                </Link>
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </main>
  );
}
