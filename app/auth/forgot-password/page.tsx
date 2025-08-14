"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Navbar } from "@/components/layout/navbar";

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const handleSuccess = (userEmail: string) => {
    setEmail(userEmail);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
          <div className="bg-background/40 backdrop-blur-sm border border-border/50 rounded-lg p-8 shadow-lg w-full max-w-md">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
              <p className="text-muted-foreground mb-4">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <div className="space-y-3">
                <Button onClick={() => setSuccess(false)} variant="outline" className="w-full">
                  Try Different Email
                </Button>
                <Button asChild className="w-full">
                  <Link href="/auth/signin">Back to Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Forgot Password?</h1>
            <p className="text-muted-foreground">
              No worries! Enter your email and we'll send you a reset link.
            </p>
          </div>

          {/* Form Container - Blended into background */}
          <div className="backdrop-blur-[4px] bg-muted/70 rounded-xl p-6 border border-border">
            <ForgotPasswordForm onSuccess={handleSuccess} />

            <div className="text-center text-sm mt-6 pt-4 border-t border-border/50">
              <span className="text-muted-foreground">Remember your password? </span>
              <Link href="/auth/signin" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}