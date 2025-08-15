import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { getChallengeById } from '@/actions/cursus.actions';
import { getServerSession } from '@/lib/auth-server';
import { ChallengeEditor } from '@/components/learn/challenge-editor';
import { ChallengeHeader } from '@/components/learn/challenge-header';
import { ChallengeSidebar } from '@/components/learn/challenge-sidebar-fixed';
import { Skeleton } from '@/components/ui/skeleton';
import { mapSubmissionForComponent } from '@/utils/submission-mapper';
import { safeMapChallenge } from '@/utils/challenge-validator';
import { ChallengePageClient } from '@/components/learn/challenge-page-client';

interface ChallengePageProps {
  params: Promise<{
    pathId: string;
    challengeId: string;
  }>;
}

export default async function ChallengePage({
  params: _params,
}: ChallengePageProps) {
  const params = await _params;
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<ChallengePageSkeleton />}>
        <ChallengePageContent
          pathId={params.pathId}
          challengeId={params.challengeId}
        />
      </Suspense>
    </div>
  );
}

async function ChallengePageContent({
  pathId,
  challengeId,
}: {
  pathId: string;
  challengeId: string;
}) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const result = await getChallengeById({ challengeId });

  if (!result?.data) {
    notFound();
  }

  const challenge = result.data;

  if (!challenge.isEnrolled) {
    redirect(`/learn/${pathId}/unauthorized`);
  }

  // Map the database data to component-expected format with validation
  const mappedChallenge = safeMapChallenge(challenge, challengeId);
  const mappedSubmission = mapSubmissionForComponent(
    challenge.latestSubmission
  );

  return (
    <ChallengePageClient
      pathId={pathId}
      challenge={mappedChallenge}
      latestSubmission={mappedSubmission}
    />
  );
}

function ChallengePageSkeleton() {
  return (
    <div className="flex h-screen">
      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b bg-background px-6 flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-8 w-24" />
        </div>

        {/* Editor */}
        <div className="flex-1 p-6">
          <Skeleton className="h-full w-full" />
        </div>
      </div>

      {/* Sidebar Skeleton */}
      <div className="w-96 border-l bg-muted/30 p-6 space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-6 w-24" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({
  params: _params,
}: ChallengePageProps) {
  const params = await _params;
  const result = await getChallengeById({ challengeId: params.challengeId });

  if (!result?.data) {
    return {
      title: 'Challenge | KiroCode Mentor',
    };
  }

  return {
    title: `${result.data.title} | ${result.data.module.learningPath.title} | KiroCode Mentor`,
    description: result.data.description,
  };
}
