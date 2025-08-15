'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Clock, 
  Target, 
  CheckCircle, 
  AlertCircle,
  Trophy
} from 'lucide-react';
import { ComponentChallenge, ComponentSubmission } from '@/types/challenge.types';

interface ChallengeHeaderProps {
  pathId: string;
  challenge: ComponentChallenge;
  latestSubmission?: ComponentSubmission | null;
}

const difficultyColors = {
  BEGINNER: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  INTERMEDIATE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  ADVANCED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const statusColors = {
  NOT_STARTED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
};

export const ChallengeHeader: React.FC<ChallengeHeaderProps> = ({
  pathId,
  challenge,
  latestSubmission,
}) => {
  const getStatusIcon = () => {
    if (latestSubmission?.status === 'PASSED') {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    if (latestSubmission?.status === 'FAILED') {
      return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
    if (challenge.status === 'COMPLETED') {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
    return null;
  };

  return (
    <div className="h-16 border-b bg-background px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href={`/learn/${pathId}`}>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Path
          </Button>
        </Link>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">{challenge.title}</h1>
              {getStatusIcon()}
            </div>
            <div className="text-sm text-muted-foreground">
              {challenge.module.learningPath.title} • {challenge.module.title}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          {challenge.estimatedTime} min
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Trophy className="w-4 h-4" />
          {challenge.points} pts
        </div>

        <Badge className={difficultyColors[challenge.difficulty]}>
          {challenge.difficulty.toLowerCase()}
        </Badge>

        {challenge.status && (
          <Badge className={statusColors[challenge.status]}>
            {challenge.status.replace('_', ' ').toLowerCase()}
          </Badge>
        )}

        {latestSubmission && (
          <Badge 
            variant={latestSubmission.status === 'PASSED' ? 'default' : 'destructive'}
            className="flex items-center gap-1"
          >
            {latestSubmission.status === 'PASSED' ? (
              <CheckCircle className="w-3 h-3" />
            ) : (
              <AlertCircle className="w-3 h-3" />
            )}
            {latestSubmission.status}
            {latestSubmission.score !== undefined && ` (${latestSubmission.score}%)`}
          </Badge>
        )}
      </div>
    </div>
  );
};