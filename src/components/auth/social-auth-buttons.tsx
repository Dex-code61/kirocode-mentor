"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Github, Mail } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";

interface SocialAuthButtonsProps {
  onError?: (error: string) => void;
}

export function SocialAuthButtons({ onError }: SocialAuthButtonsProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading("google");
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      if (onError) {
        onError("Error signing in with Google");
        toast.error("Error signing in with Google");
      }
    } finally {
      setIsLoading(null);
    }
  };

  const handleGithubSignIn = async () => {
    setIsLoading("github");
    try {
      await signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      if (onError) {
        onError("Error signing in with GitHub");
        toast.error("Error signing in with GitHub");
      }
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        variant="outline"
        onClick={handleGoogleSignIn}
        disabled={isLoading !== null}
        className="w-full"
      >
        <Mail className="w-4 h-4 mr-2" />
        {isLoading === "google" ? "..." : "Google"}
      </Button>
      <Button
        variant="outline"
        onClick={handleGithubSignIn}
        disabled={isLoading !== null}
        className="w-full"
      >
        <Github className="w-4 h-4 mr-2" />
        {isLoading === "github" ? "..." : "GitHub"}
      </Button>
    </div>
  );
}