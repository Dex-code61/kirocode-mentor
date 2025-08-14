import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import SessionButton from "../custom/session-button";

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-20 text-center">
      <div className="max-w-4xl mx-auto">
        <Badge variant="secondary" className="mb-6">
          <Sparkles className="w-4 h-4 mr-2" />
          Revolutionize Your Coding Journey
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Your Personal AI Mentor to
          <span className="text-primary"> Master Code</span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          End the 73% dropout rate! Our AI adapts to your learning style, 
          provides instant code feedback, and guides you to excellence.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <SessionButton size="lg" asChild>
            <Link href="/dashboard">
              Start Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </SessionButton>
          {/* <Button size="lg" asChild>
            
          </Button> */}
          <Button size="lg" variant="outline" asChild>
            <Link href="#demo">
              Watch Demo
            </Link>
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">95%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">-60%</div>
            <div className="text-sm text-muted-foreground">Learning Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">AI Mentor Available</div>
          </div>
        </div>
      </div>
    </section>
  );
}