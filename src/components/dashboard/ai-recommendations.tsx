import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, ChevronRight } from "lucide-react";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface AIRecommendationsProps {
  recommendations?: Recommendation[];
}

const defaultRecommendations: Recommendation[] = [
  {
    id: '1',
    title: 'TypeScript Generics',
    description: 'Master advanced type patterns',
    difficulty: 'Intermediate'
  },
  {
    id: '2',
    title: 'Node.js Performance',
    description: 'Optimize your backend code',
    difficulty: 'Advanced'
  }
];

export function AIRecommendations({ recommendations = defaultRecommendations }: AIRecommendationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="w-5 h-5 mr-2 text-primary" />
          AI Recommendations
        </CardTitle>
        <CardDescription>
          Personalized content based on your learning style
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((recommendation) => (
            <div 
              key={recommendation.id}
              className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{recommendation.title}</h4>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {recommendation.description}
              </p>
              <Badge variant="outline" className="text-xs">
                {recommendation.difficulty}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}