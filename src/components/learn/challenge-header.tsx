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
    <div className="border-b bg-background">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <Link href={`/learn/${pathId}`}>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Path</span>
            </Button>
          </Link>

          <Separator orientation="vertical" className="h-6 hidden sm:block" />

          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-semibold truncate">{challenge.title}</h1>
                {getStatusIcon()}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground truncate">
                {challenge.module.learningPath.title} • {challenge.module.title}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
          {/* Mobile: Show only essential info */}
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {challenge.estimatedTime} min
          </div>

          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <Trophy className="w-4 h-4" />
            {challenge.points} pts
          </div>

          <Badge className={`${difficultyColors[challenge.difficulty]} text-xs`}>
            {challenge.difficulty.toLowerCase()}
          </Badge>

          {challenge.status && (
            <Badge className={`${statusColors[challenge.status]} text-xs hidden sm:inline-flex`}>
              {challenge.status.replace('_', ' ').toLowerCase()}
            </Badge>
          )}

          {latestSubmission && (
            <Badge 
              variant={latestSubmission.status === 'PASSED' ? 'default' : 'destructive'}
              className="flex items-center gap-1 text-xs"
            >
              {latestSubmission.status === 'PASSED' ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <AlertCircle className="w-3 h-3" />
              )}
              <span className="hidden sm:inline">{latestSubmission.status}</span>
              {latestSubmission.score !== undefined && (
                <span className="hidden sm:inline"> ({latestSubmission.score}%)</span>
              )}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};