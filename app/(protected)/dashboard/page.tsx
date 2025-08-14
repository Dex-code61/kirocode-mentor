
import { redirect } from 'next/navigation';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { WelcomeSection } from '@/components/dashboard/welcome-section';
import { CurrentLearningPath } from '@/components/dashboard/current-learning-path';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { AIRecommendations } from '@/components/dashboard/ai-recommendations';
import { StatsOverview } from '@/components/dashboard/stats-overview';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentAchievements } from '@/components/dashboard/recent-achievements';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';
import { Suspense } from 'react';
import { getServerSession } from '@/lib/auth-server';
import { CurrentLearningPathWrapper } from '@/components/dashboard/current-learning-path-wrapper';

export default async function DashboardPage() {
  const session = await getServerSession()
  
  if(!session) redirect("/auth/signin")

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <WelcomeSection
          userName={session.user.name}
          userEmail={session.user.email}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <CurrentLearningPathWrapper />
            <RecentActivity />
            <AIRecommendations />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <StatsOverview />
            <QuickActions />
            <RecentAchievements />
          </div>
        </div>
      </div>
    </div>
    </Suspense>
  );
}
