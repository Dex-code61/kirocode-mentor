"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/layout/navbar";
import { AuthBackgroundWrapper } from "@/components/layout/auth-background-wrapper";

export default function SignUpPage() {
  const [socialError, setSocialError] = useState("");
  const [data, setData] = useState({
    email: "",
    success: false
  });
  const router = useRouter();

  const handleSignUpSuccess = (email: string) => {
    setData({
        success: true,
        email
    });
    // Redirect after a short delay to show success message
    // setTimeout(() => {
    //   router.push("/auth/signin");
    // }, 2000);
  };

  if (data.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
          <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-lg p-8 shadow-lg w-full max-w-md">
            <div className="text-center">
              <Button size="icon" className="mb-3" variant="outline">
                <Check className="w-8 h-8 text-green-600" />
              </Button>
              <h2 className="text-2xl font-bold mb-2">Welcome to KiroCode Mentor!</h2>
              <p className="text-muted-foreground mb-4">
                We have sent a verification mail to {data.email}. Click the link in your mail to verify your account.
              </p>
              <Button onClick={() => router.push("/auth/signin")} className="w-full">
                Go to Signin page
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthBackgroundWrapper>
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold mb-2">Start Your Journey</h1>
            <p className="text-muted-foreground">
              Create your account and begin learning with AI
            </p>
          </div>

          {/* Form Container - Blended into background */}
          <div className="bg-card backdrop-blur-sm rounded-xl p-6 ">
            {socialError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{socialError}</AlertDescription>
              </Alert>
            )}

            {/* Social Sign Up */}
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

            {/* Email Sign Up Form */}
            <SignUpForm onSuccess={handleSignUpSuccess} />

            <div className="text-center text-sm mt-6 pt-4 border-t border-border/50">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/auth/signin" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthBackgroundWrapper>
  );
}