"use client";

import { Button } from "@/components/ui/button";
import { Code, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/lib/auth-client";
import { ModeToggle } from "../mode-toggle";
import { redirect, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";


const links = [
  {
     href: "/dashboard", label: "Dashboard" },
  {
     href: "/learn", label: "Learn"  },
  {
     href: "/projects", label: "Projects"  },
  {
     href: "/community", label: "Community"
  }
]
export function DashboardHeader() {
  const path = usePathname()
  const handleSignOut = async () => {
    await signOut();
    redirect("/")
  };

  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
            <Code className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">KiroCode</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          {
            links.map((link, idx) => (
              <Link key={`${idx}-${link.href}-${link.label}`} href={link.href} className={cn("text-muted-foreground hover:text-foreground transition-colors", {
                "text-foreground": path.includes(link.href)
              })}>
            {link.label}
          </Link>
            ))
          }
        </nav>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" />
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}