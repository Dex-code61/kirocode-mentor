interface WelcomeSectionProps {
  userName?: string;
  userEmail?: string;
}

export function WelcomeSection({ userName, userEmail }: WelcomeSectionProps) {

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">
        Welcome back, {userName || userEmail}!
      </h1>
      <p className="text-muted-foreground">
        Ready to continue your coding journey? Let's see what you can accomplish today.
      </p>
    </div>
  );
}