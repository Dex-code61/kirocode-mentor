"use client"
import { BookOpen, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <Search className="w-12 h-12 text-muted-foreground" />
      </div>
      
      <h3 className="text-2xl font-semibold mb-2">No learning paths found</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        We couldn't find any learning paths matching your criteria. 
        Try adjusting your filters or search terms.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="outline" onClick={() => window.location.href = '/learn'}>
          <BookOpen className="w-4 h-4 mr-2" />
          View All Paths
        </Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    </div>
  )
}