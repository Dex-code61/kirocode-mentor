import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

export function NoLearningPath() {
  return (
    <Card className="border-dashed">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-6 h-6 text-muted-foreground" />
        </div>
        <CardTitle>No Active Learning Path</CardTitle>
        <CardDescription>
          Start your coding journey by choosing a learning path that matches your goals
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Explore our curated learning paths designed to take you from beginner to expert
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/learn">
                Browse Learning Paths
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/assessment">
                Take Skill Assessment
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}