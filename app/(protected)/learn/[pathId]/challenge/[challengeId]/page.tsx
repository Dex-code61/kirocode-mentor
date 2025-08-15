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
    <div className="min-h-screen bg-background">
      {/* Mobile-first responsive layout */}
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <ChallengeHeader
            pathId={pathId}
            challenge={mappedChallenge}
            latestSubmission={mappedSubmission}
          />

          {/* Editor */}
          <div className="flex-1 min-h-0">
            <ChallengeEditor
              challenge={mappedChallenge}
              latestSubmission={mappedSubmission}
            />
          </div>
        </div>

        {/* Sidebar - Hidden on mobile, collapsible on tablet */}
        <div className="hidden lg:block lg:w-96 xl:w-[400px] border-l bg-muted/30 flex-shrink-0">
          <ChallengeSidebar
            pathId={pathId}
            challenge={mappedChallenge}
            latestSubmission={mappedSubmission}
          />
        </div>
      </div>

      {/* Mobile Sidebar - Bottom sheet or modal */}
      <div className="lg:hidden">
        <ChallengeSidebar
          pathId={pathId}
          challenge={mappedChallenge}
          latestSubmission={mappedSubmission}
          isMobile={true}
        />
      </div>
    </div>
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
