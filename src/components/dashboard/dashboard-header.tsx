"use client";

import { Button } from "@/components/ui/button";
import { Code, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/lib/auth-client";

export function DashboardHeader() {
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
            <Code className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">KiroCode</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/dashboard" className="text-foreground font-medium">
            Dashboard
          </Link>
          <Link href="/learn" className="text-muted-foreground hover:text-foreground transition-colors">
            Learn
          </Link>
          <Link href="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
            Projects
          </Link>
          <Link href="/community" className="text-muted-foreground hover:text-foreground transition-colors">
            Community
          </Link>
        </nav>
        
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}