"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { SignInForm } from "@/components/auth/sign-in-form";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/layout/navbar";
import Link from "next/link";
import { AuthBackgroundWrapper } from "@/components/layout/auth-background-wrapper";
import { Card, CardContent } from "@/components/ui/card";

export default function SignInPage() {
  const [socialError, setSocialError] = useState("");

  return (
    <AuthBackgroundWrapper>
      <Navbar />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-muted-foreground">
              Sign in to continue your learning journey
            </p>
          </div>

          {/* Form Container - Blended into background */}
          <div className="backdrop-blur-[4px] bg-card rounded-xl p-6 border border-border">
            {socialError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{socialError}</AlertDescription>
              </Alert>
            )}

            {/* Social Login */}
            <SocialAuthButtons onError={setSocialError} />

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email Login Form */}
            <SignInForm />

            <div className="text-center mt-4">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <div className="text-center text-sm mt-6 pt-4 border-t border-border/50">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthBackgroundWrapper>
  );
}