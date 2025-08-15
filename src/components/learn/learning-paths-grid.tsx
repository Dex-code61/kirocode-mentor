'use client';
import {
  Category,
  Difficulty,
  LearningPath,
  learningPathSearchParams,
} from '@/types/learningpath.types';

import EmptyState from './empty-state';
import LearningPathCard from './learning-path-card';
import { LearningPathsSkeleton } from './learning-paths-skeleton';
import { unauthorized, useSearchParams } from 'next/navigation';
import { useLearningPaths } from '@/queries/cursus.queries';
import { CustomPagination } from '@/components/custom/custom-pagination';
import { useCallback } from 'react';
import { parseAsInteger, useQueryStates } from 'nuqs';
import { useSession } from '@/lib/auth-client';
import { toast } from 'sonner';

export function LearningPathsGrid() {
  const {isPending: isPendingUser, data: session} = useSession()
  const _searchParams = useSearchParams();

  const searchParams: learningPathSearchParams = {
    search: _searchParams.get('search') || "",
    category: (_searchParams.get('category') as Category) || undefined,
    difficulty: (_searchParams.get('difficulty') as Difficulty) || undefined,
    page: parseInt(_searchParams.get('page') || '1', 10) || 1,
    limit: 12,
  };
  
  const { isPending, data, error, refetch } = useLearningPaths(searchParams);

  if (isPending || isPendingUser) return <LearningPathsSkeleton />;

  if (error) {
    toast.error('Error loading learning paths', {
      description: error.message,
    });
    console.warn('Error loading learning paths:', error);
    refetch()
  }

  if(!session){
    unauthorized()
  }

  const result = data?.data || {
    learningPaths: [],
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
      limit: 12,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };

  const learningPaths = result.learningPaths || ([] as LearningPath[]);
  const pagination = result.pagination;

  if (learningPaths.length === 0 && pagination.currentPage === 1) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col w-full space-y-8">
      {/* Results info */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>
          Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{' '}
          {Math.min(
            pagination.currentPage * pagination.limit,
            pagination.totalCount
          )}{' '}
          of {pagination.totalCount} results
        </span>
        {pagination.totalPages > 1 && (
          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
        )}
      </div>

      {/* Learning paths grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningPaths.map((path: LearningPath) => (
          <LearningPathCard userId={session?.user.id} key={path.id} learningPath={path} />
        ))}
      </div>

    
        <LearningPathsPagePagination
            totalPages={pagination.totalPages}
            currentPage={pagination.currentPage}
            onPageChange={(page: number) => {}}
        />
      {/* Pagination */}
      
    </div>
  );
}


interface LearningPathsPagePaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    showEllipsis?: boolean;
    siblingCount?: number;
}


const LearningPathsPagePagination = ({
    totalPages,
    currentPage,
    onPageChange,
    showEllipsis = true,
    siblingCount = 1,
}: LearningPathsPagePaginationProps) => {
    const [queryState, setQueryState] = useQueryStates({
        page: parseAsInteger.withDefault(1),
    });

    const handlePageChange = useCallback(
        (page: number) => {
            setQueryState({
                ...queryState,
                page,
            });
            onPageChange(page);
        },
        [queryState, setQueryState, onPageChange]
    );

    return (
        <>
        {totalPages > 1 && (
        <div className="flex justify-center">
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}</>
    );
}