import EmptyState from "./empty-state"
import LearningPathCard from "./learning-path-card"


interface LearningPath {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  estimatedHours: number
  totalEnrollments: number
  averageRating: number | null
}

interface LearningPathsGridProps {
  learningPaths: LearningPath[]
}

export function LearningPathsGrid({ learningPaths }: LearningPathsGridProps) {
  if (learningPaths.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {learningPaths.map((path) => (
        <LearningPathCard key={path.id} learningPath={path} />
      ))}
    </div>
  )
}