import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Play } from "lucide-react";

interface CurrentLearningPathProps {
  title?: string;
  module?: string;
  progress?: number;
  status?: string;
  onContinue?: () => void;
}

export function CurrentLearningPath({ 
  title = "React Advanced Patterns",
  module = "Module 3: Custom Hooks & Context",
  progress = 65,
  status = "In Progress",
  onContinue
}: CurrentLearningPathProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="w-5 h-5 mr-2 text-primary" />
          Current Learning Path
        </CardTitle>
        <CardDescription>
          Continue where you left off
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{module}</p>
            </div>
            <Badge variant="secondary">{status}</Badge>
          </div>
          <Progress value={progress} className="w-full" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{progress}% Complete</span>
            <Button size="sm">
              Continue Learning
              <Play className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}