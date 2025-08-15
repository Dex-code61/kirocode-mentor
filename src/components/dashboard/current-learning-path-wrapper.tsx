import { Suspense } from "react";
import { getCurrentLearningPath } from "@/actions/cursus.actions";
import { CurrentLearningPath } from "./current-learning-path";
import { NoLearningPath } from "./no-learning-path";
import { CurrentLearningPathSkeleton } from "./current-learning-path-skeleton";

async function CurrentLearningPathContent() {
  const learningPathData = await getCurrentLearningPath();

  if (!learningPathData) {
    return <NoLearningPath />;
  }

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'paused':
        return 'Paused';
      default:
        return 'In Progress';
    }
  };

  return (
    <CurrentLearningPath
    id={learningPathData.id}
      title={learningPathData.title}
      module={learningPathData.currentModule 
        ? `Module ${learningPathData.currentModule.order}: ${learningPathData.currentModule.title}`
        : `${learningPathData.completedModules}/${learningPathData.totalModules} modules completed`
      }
      progress={Math.round(learningPathData.enrollment.progress)}
      status={getStatusVariant(learningPathData.enrollment.status)}
      onContinue={() => {
        // This will be handled by the client component
        console.log('Continue learning clicked');
      }}
    />
  );
}

export function CurrentLearningPathWrapper() {
  return (
    <Suspense fallback={<CurrentLearningPathSkeleton />}>
      <CurrentLearningPathContent />
    </Suspense>
  );
}