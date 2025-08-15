import { getAvailableLearningPaths } from '@/actions/cursus.actions';
import { learningPathSearchParams } from '@/types/learningpath.types';
import { useQuery } from '@tanstack/react-query';

export const useLearningPaths = (searchParams?: learningPathSearchParams) => {
  return useQuery({
    queryKey: ['learningPaths', searchParams],
    queryFn: async () => {
      const result = await getAvailableLearningPaths(searchParams || {});

      // If there's an error, throw it so React Query can handle it
      if (result?.serverError) {
        throw new Error(result.serverError);
      }

      if (result?.validationErrors) {
        throw new Error(
          'Validation error: ' + JSON.stringify(result.validationErrors)
        );
      }

      return result.data;

    },
  });
};
