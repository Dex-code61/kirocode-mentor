import { Suspense } from 'react'
import { LearningPathsHeader } from '@/components/learn/learning-paths-header'
import { LearningPathsFilters } from '@/components/learn/learning-paths-filters'
import { LearningPathsSkeleton } from '@/components/learn/learning-paths-skeleton'
import { LearningPathsGrid } from '@/components/learn/learning-paths-grid'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export default async function LearnPage() {
  return (
    <NuqsAdapter>
      <div className="container mx-auto px-4 py-8">
        <LearningPathsHeader />
        
        <div className="mt-8">
          <LearningPathsFilters />
        </div>

        <div className="mt-8">
          <Suspense fallback={<LearningPathsSkeleton />}>
            <LearningPathsGrid />
          </Suspense>
        </div>
      </div>
    </NuqsAdapter>
  )
}

