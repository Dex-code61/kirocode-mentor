'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { enrollInLearningPath } from '@/actions/cursus.actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, BookOpen } from 'lucide-react'

interface EnrollButtonProps {
  pathId: string
}

export function EnrollButton({ pathId }: EnrollButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleEnroll = async () => {
    setIsLoading(true)
    
    try {
      const result = await enrollInLearningPath({ pathId })
      
      if (result?.data?.success) {
        toast.success(result.data.message || 'Successfully enrolled!')
        router.push(`/learn/${result.data.data?.learningPathId}`) // Redirect to dashboard
      } else {
        toast.error(result?.data?.message || 'Failed to enroll')
      }
    } catch (error) {
      console.error('Enrollment error:', error)
      toast.error('An error occurred while enrolling')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      size="lg" 
      onClick={handleEnroll}
      disabled={isLoading}
      className="min-w-[200px]"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Enrolling...
        </>
      ) : (
        <>
          <BookOpen className="w-4 h-4 mr-2" />
          Start Learning
        </>
      )}
    </Button>
  )
}