import { Suspense } from 'react'
import { notFound, redirect } from 'next/navigation'
import { getModuleById } from '@/actions/cursus.actions'
import { getServerSession } from '@/lib/auth-server'
import { ModuleContent } from '@/components/learn/module-content'
import { ModuleNavigation } from '@/components/learn/module-navigation'
import { ModuleSidebar } from '@/components/learn/module-sidebar'
import { Skeleton } from '@/components/ui/skeleton'

interface ModulePageProps {
  params: {
    pathId: string
    moduleId: string
  }
}

export default async function ModulePage({ params }: ModulePageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<ModulePageSkeleton />}>
        <ModulePageContent pathId={params.pathId} moduleId={params.moduleId} />
      </Suspense>
    </div>
  )
}

async function ModulePageContent({ pathId, moduleId }: { pathId: string, moduleId: string }) {
  const session = await getServerSession()
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const result = await getModuleById({ moduleId })
  
  if (!result?.data) {
    notFound()
  }

  const module = result.data

  if (!module.isEnrolled) {
    redirect(`/learn/${pathId}/unauthorized`)
  }

  return (
    <div className="w-full flex h-screen">
      {/* Main Content */}
      <div className="w-full flex flex-col">
        {/* Navigation Header */}
        <ModuleNavigation 
          pathId={pathId}
          module={module}
          userProgress={module.userProgress}
        />

        {/* Module Content */}
        <div className="overflow-auto">
          <ModuleContent 
            module={module}
            userProgress={module.userProgress}
          />
        </div>
      </div>

      {/* Sidebar */}
      {/* <div className="w-80 border-l bg-muted/30">
        <ModuleSidebar 
          pathId={pathId}
          module={module}
          userProgress={module.userProgress}
        />
      </div> */}
    </div>
  )
}

function ModulePageSkeleton() {
  return (
    <div className="flex h-screen">
      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b bg-background px-6 flex items-center">
          <Skeleton className="h-6 w-48" />
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar Skeleton */}
      <div className="w-80 border-l bg-muted/30 p-6 space-y-6">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: ModulePageProps) {
  const result = await getModuleById({ moduleId: params.moduleId })
  
  if (!result?.data) {
    return {
      title: 'Module | KiroCode Mentor',
    }
  }

  return {
    title: `${result.data.title} | ${result.data.learningPath.title} | KiroCode Mentor`,
    description: result.data.description,
  }
}