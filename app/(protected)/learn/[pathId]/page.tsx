import { Suspense } from 'react'
import { notFound, unauthorized } from 'next/navigation'
import { getLearningPathById } from '@/actions/cursus.actions'
import { LearningPathHeader } from '@/components/learn/learning-path-header'
import { LearningPathContent } from '@/components/learn/learning-path-content'
import { LearningPathSidebar } from '@/components/learn/learning-path-sidebar'
import { LearningPathSkeleton } from '@/components/learn/learning-path-skeleton'
import { getServerSession } from '@/lib/auth-server'

interface LearningPathPageProps {
  params: Promise<{
    pathId: string
  }>
}

export default async function LearningPathPage({ params }: LearningPathPageProps) {
    const { pathId } = await params
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<LearningPathSkeleton />}>
        <LearningPathPageContent pathId={pathId} />
      </Suspense>
    </div>
  )
}

async function LearningPathPageContent({ pathId }: { pathId: string }) {

  const session = await getServerSession()
  if (!session) {
    unauthorized()
  }

  const result = await getLearningPathById({ pathId })
  
  if (!result?.data) {
    notFound()
  }

  const isEnrolled = result.data.enrollments.some(
    (enrollment) => enrollment.userId === session.user.id
  )
  const learningPath = {...result.data, isEnrolled }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <LearningPathHeader learningPath={learningPath} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <LearningPathContent learningPath={learningPath} />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <LearningPathSidebar learningPath={learningPath} />
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: LearningPathPageProps) {
  const result = await getLearningPathById({ pathId: (await params).pathId })
  
  if (!result?.data) {
    return {
      title: 'Learning Path Not Found',
      description: 'The requested learning path could not be found.',
    }
  }

  const learningPath = result.data

  return {
    title: `${learningPath.title} | KiroCode Mentor`,
    description: learningPath.description,
    keywords: [
      learningPath.category.toLowerCase(),
      learningPath.difficulty.toLowerCase(),
      'programming',
      'learning',
      'coding',
      'tutorial'
    ].join(', '),
  }
}