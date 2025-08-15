import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, ArrowLeft } from 'lucide-react'

export default function LearningPathNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-6">
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-4">Learning Path Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The learning path you're looking for doesn't exist or has been removed.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/learn" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Browse Learning Paths
            </Link>
          </Button>
          
          <Button asChild variant="outline">
            <Link href="/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}