import { Suspense } from 'react'
import { getAvailableLearningPaths } from '@/actions/cursus.actions'
import { LearningPathsHeader } from '@/components/learn/learning-paths-header'
import { LearningPathsFilters } from '@/components/learn/learning-paths-filters'
import { LearningPathsSkeleton } from '@/components/learn/learning-paths-skeleton'
import { LearningPathsGrid } from '@/components/learn/learning-paths-grid'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'

export default async function LearnPage({
  searchParams,
}: {
  searchParams: { category?: string; difficulty?: string; search?: string }
}) {
  return (
    <NuqsAdapter>
      <div className="container mx-auto px-4 py-8">
        <LearningPathsHeader />
        
        <div className="mt-8">
          <LearningPathsFilters />
        </div>

        <div className="mt-8">
          <Suspense fallback={<LearningPathsSkeleton />}>
            <LearningPathsContent searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </NuqsAdapter>
  )
}

async function LearningPathsContent({
  searchParams,
}: {
  searchParams: { category?: string; difficulty?: string; search?: string }
}) {
  const learningPaths = await getAvailableLearningPaths()
  console.warn(learningPaths);
  
  // Filter learning paths based on search params
  const filteredPaths = learningPaths.filter((path) => {
    const matchesCategory = !searchParams.category || path.category === searchParams.category
    const matchesDifficulty = !searchParams.difficulty || path.difficulty === searchParams.difficulty
    const matchesSearch = !searchParams.search || 
      path.title.toLowerCase().includes(searchParams.search.toLowerCase()) ||
      path.description.toLowerCase().includes(searchParams.search.toLowerCase())
    
    return matchesCategory && matchesDifficulty && matchesSearch
  })

  return <LearningPathsGrid learningPaths={filteredPaths} />
}