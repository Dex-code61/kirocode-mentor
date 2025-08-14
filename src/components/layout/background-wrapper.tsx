import LightRays from '@/components/custom/light-background';

interface BackgroundWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function BackgroundWrapper({
  children,
  className = '',
}: BackgroundWrapperProps) {
  return (
    <div className={`relative min-h-screen  ${className}`}>
      <div className="w-full absolute -z-1 top-0 left-0 right-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="hsl(var(--primary))"
          className="dark:block hidden"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
        />
      </div>
      {children}
    </div>
  );
}
