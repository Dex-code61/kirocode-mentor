'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Home,
  CheckCircle,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';

interface ModuleNavigationProps {
  pathId: string;
  module: {
    id: string;
    title: string;
    order: number;
    type: string;
    estimatedTime: number;
    learningPath: {
      title: string;
    };
  };
  userProgress: {
    status: string;
    completionRate: number;
    timeSpent: number;
  } | null;
}

export function ModuleNavigation({
  pathId,
  module,
  userProgress,
}: ModuleNavigationProps) {
  const progress = userProgress?.completionRate || 0;
  const isCompleted = userProgress?.status === 'COMPLETED';
  const timeSpent = userProgress?.timeSpent || 0;

  return (
    <>
    <div className="w-full h-16 border-b bg-background px-6 flex items-center justify-between">
      {/* Left side - Navigation */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/learn/${pathId}/start`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course
          </Link>
        </Button>

        <Fragment>
          <div className="hidden h-6 w-px bg-border min-[1000px]:flex" />

          <div className="hidden items-center gap-2  min-[1000px]:flex">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <Home className="w-4 h-4" />
              </Link>
            </Button>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm text-muted-foreground truncate max-w-[200px]">
              {module.learningPath.title}
            </span>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm font-medium truncate max-w-[200px]">
              {module.title}
            </span>
          </div>
        </Fragment>
      </div>

      {/* Center - Progress */}
      {/* <div className="flex-1 max-w-md mx-8">
        <div className="space-y-2 flex flex-col">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground min-w-max mr-0.5">Module Progress</span>
            <div className="flex items-center gap-2">
              {isCompleted && <CheckCircle className="w-3 h-3 text-green-600" />}
              <span className="font-medium">{progress.toFixed(0)}%</span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div> */}

      {/* Right side - Stats and Actions */}
      <div className="flex items-center gap-4">
        <div className="items-center gap-4 text-sm text-muted-foreground hidden min-[1000px]:flex">
          <div className="flex items-center gap-1 min-w-max">
            <Clock className="w-4 h-4" />
            <span>
              {timeSpent}m / {module.estimatedTime}m
            </span>
          </div>
          {/* <Badge variant="outline">
            Module {module.order}
          </Badge> */}

          <Badge variant="secondary">{module.type}</Badge>
        </div>

        <div className="h-6 w-px bg-border hidden min-[1000px]:flex" />

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <Button variant="ghost" size="sm">
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>

    {/* For responsive navlinks */}
    <div className='w-full flex h-16 border-b bg-background px-6 min-[1000px]:hidden items-center justify-between'>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <Home className="w-4 h-4" />
              </Link>
            </Button>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm text-muted-foreground truncate max-w-[70px] min-[500px]:max-w-[100px] min-[700px]:max-w-[200px]">
              {module.learningPath.title}
            </span>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm font-medium truncate max-w-[70px] min-[500px]:max-w-[100px] min-[700px]:max-w-[200px]">
              {module.title}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1 min-w-max">
            <Clock className="w-4 h-4" />
            <span>
              {timeSpent}m / {module.estimatedTime}m
            </span>
          </div>
          {/* <Badge variant="outline">
            Module {module.order}
          </Badge> */}

          <Badge variant="secondary">{module.type}</Badge>
        </div>
        </div>
    </>
  );
}
