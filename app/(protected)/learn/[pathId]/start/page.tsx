import { Suspense } from 'react'
import { notFound, redirect } from 'next/navigation'
import { getLearningPathById } from '@/actions/cursus.actions'
import { getServerSession } from '@/lib/auth-server'
import { ModulesList } from '@/components/learn/modules-list'
import { LearningPathProgress } from '@/components/learn/learning-path-progress'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

interface StartLearningPageProps {
  params: {
    pathId: string
  }
}

export default async function StartLearningPage({ params }: StartLearningPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<StartLearningSkeleton />}>
        <StartLearningContent pathId={params.pathId} />
      </Suspense>
    </div>
  )
}

async function StartLearningContent({ pathId }: { pathId: string }) {
  const session = await getServerSession()
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const result = await getLearningPathById({ pathId })
  
  if (!result?.data) {
    notFound()
  }

  const learningPath = result.data

  // Check if user is enrolled
  const userEnrollment = learningPath.enrollments?.find(
    (enrollment: any) => enrollment.userId === session.user.id && enrollment.status === 'ACTIVE'
  )

  if (!userEnrollment) {
    redirect(`/learn/${pathId}/unauthorized`)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/learn" className="hover:text-foreground">Learn</Link>
          <span>/</span>
          <Link href={`/learn/${pathId}`} className="hover:text-foreground">{learningPath.title}</Link>
          <span>/</span>
          <span className="text-foreground">Start Learning</span>
        </nav>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            {learningPath.title}
          </h1>
          <p className="text-muted-foreground">
            Continue your learning journey. Track your progress and complete modules at your own pace.
          </p>
        </div>
      </div>

      {/* Progress Overview */}
      <LearningPathProgress 
        pathId={pathId}
        enrollment={userEnrollment}
        totalModules={learningPath.modules.length}
      />

      {/* Modules List */}
      <ModulesList 
        pathId={pathId}
        modules={learningPath.modules}
        userEnrollment={userEnrollment}
      />
    </div>
  )
}

function StartLearningSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-12" />
          <span>/</span>
          <Skeleton className="h-4 w-32" />
          <span>/</span>
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-5 w-full" />
      </div>

      {/* Progress Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-2 w-full" />
      </div>

      {/* Modules Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: StartLearningPageProps) {
  const result = await getLearningPathById({ pathId: params.pathId })
  
  if (!result?.data) {
    return {
      title: 'Start Learning | KiroCode Mentor',
    }
  }

  return {
    title: `Start Learning: ${result.data.title} | KiroCode Mentor`,
    description: `Continue your progress in ${result.data.title}`,
  }
}