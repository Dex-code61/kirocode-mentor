import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Zap, Target, Users, Trophy, Code } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Adaptive AI",
    description: "Our AI analyzes your learning style and adapts content in real-time"
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Real-time code correction and explanations with personalized suggestions"
  },
  {
    icon: Target,
    title: "Real Projects",
    description: "Work on enterprise use cases to bridge the theory-practice gap"
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description: "Learn with other developers in a synchronized collaborative environment"
  },
  {
    icon: Trophy,
    title: "Measurable Progress",
    description: "Track your progress with detailed metrics and industry-recognized certifications"
  },
  {
    icon: Code,
    title: "Professional Editor",
    description: "Complete IDE with Monaco Editor, debugging, and all modern features"
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why KiroCode Mentor?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A revolutionary approach that adapts to you, not the other way around
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}