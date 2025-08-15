"use client";

import { Button } from "@/components/ui/button";
import { Code } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import SessionButton2 from "../custom/session-button-2";

export function Navbar() {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');


  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Code className="w-6 h-6" />
          <span className="font-bold">KiroCode</span>
        </Link>
        
        {!isAuthPage && (
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
          </nav>
        )}
        
        <div className="flex items-center space-x-3">
          {isAuthPage ? (
            <>
              {pathname === '/auth/signin' && (
                <Button variant="outline" asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              )}
              {pathname === '/auth/signup' && (
                <Button variant="outline" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
              )}
              {pathname === '/auth/forgot-password' && (
                <Button variant="outline" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
              )}
            </>
          ) : (
            <>
              <SessionButton2 asChild variant="ghost">
              <Link href="/auth/signin">Sign In</Link>
              </SessionButton2>
              <Button asChild>
                <Link href={"/dashboard"}>Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}


// const NavbarSkeleton = () => {
//   return (
//     <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
//       <div className="container mx-auto px-4 h-16 flex items-center justify-between">
//         <div className="flex items-center space-x-2">
//           <Skeleton className="w-6 h-6" />
//           <Skeleton className="h-6 w-20" />
//         </div>
  
//         <nav className="hidden md:flex items-center space-x-6">
//           <Skeleton className="h-4 w-16" />
//           <Skeleton className="h-4 w-20" />
//           <Skeleton className="h-4 w-14" />
//         </nav>
        
//         <div className="flex items-center space-x-3">
//           <Skeleton className="h-9 w-16" />
//           <Skeleton className="h-9 w-20" />
//         </div>
//       </div>
//     </header>
//   );
// }