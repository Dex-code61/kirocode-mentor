import { BookOpen, Target, Users } from 'lucide-react'

export function LearningPathsHeader() {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-foreground mb-4">
        Choose Your Learning Path
      </h1>
      <p className="text-xl text-muted-foreground mb-8">
        Discover structured learning paths designed to take you from beginner to expert. 
        Each path is crafted with hands-on projects and real-world applications.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="flex flex-col items-center p-6 rounded-lg bg-card border">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Structured Learning</h3>
          <p className="text-sm text-muted-foreground text-center">
            Follow carefully designed curricula with progressive difficulty
          </p>
        </div>
        
        <div className="flex flex-col items-center p-6 rounded-lg bg-card border">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Hands-on Projects</h3>
          <p className="text-sm text-muted-foreground text-center">
            Build real applications and strengthen your portfolio
          </p>
        </div>
        
        <div className="flex flex-col items-center p-6 rounded-lg bg-card border">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Community Support</h3>
          <p className="text-sm text-muted-foreground text-center">
            Learn alongside thousands of other developers
          </p>
        </div>
      </div>
    </div>
  )
}