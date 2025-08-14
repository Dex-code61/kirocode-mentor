

import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { PropsWithChildren } from "react";

export function AuthBackgroundWrapper({children}: PropsWithChildren) {
  return (
    <div className="w-full min-h-screen max-h-max bg-gradient-to-br from-background via-background to-muted/20">
        <div className="w-full h-full relative overflow-y-hidden">
            <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
      />
        </div>
      
      {children}
    </div>
  );
}
