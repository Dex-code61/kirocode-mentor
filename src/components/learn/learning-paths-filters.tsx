'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryStates, parseAsString, parseAsInteger } from 'nuqs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useDebounce } from '@/hooks/use-debounce';
import { useEffect } from 'react';

// Validation schema
const searchSchema = z.object({
  search: z
    .string()
    .min(0)
    .max(100, 'Search term must be less than 100 characters')
    // .optional()
    .transform(val => val?.trim() || ''),
});

type SearchFormData = z.infer<typeof searchSchema>;

const categories = [
  { value: 'FRONTEND', label: 'Frontend' },
  { value: 'BACKEND', label: 'Backend' },
  { value: 'FULLSTACK', label: 'Full Stack' },
  { value: 'MOBILE', label: 'Mobile' },
  { value: 'DATA_SCIENCE', label: 'Data Science' },
  { value: 'DEVOPS', label: 'DevOps' },
  { value: 'CYBERSECURITY', label: 'Cybersecurity' },
];

const difficulties = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
  { value: 'EXPERT', label: 'Expert' },
];

export function LearningPathsFilters() {
  // Use nuqs for URL state management
  const [queryState, setQueryState] = useQueryStates({
    search: parseAsString.withDefault(''),
    category: parseAsString.withDefault(''),
    difficulty: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
  });

  // React Hook Form with Zod validation
  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      search: queryState.search,
    },
  });
  const debounceSearchValue = useDebounce(form.watch("search"), 500);

  useEffect(() => onSubmit(), [debounceSearchValue]);
  const onSubmit = () => {
    try {
      searchSchema.parse({ search: debounceSearchValue });
    } catch (error) {
      return;
    }
    setQueryState({
      ...queryState,
      page: 1,
      search: debounceSearchValue || null,
    });
  };

  const clearFilters = () => {
    form.reset({ search: '' });
    setQueryState({
      search: null,
      category: null,
      difficulty: null,
    });
  };

  const hasActiveFilters =
    queryState.search || queryState.category || queryState.difficulty;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 w-full"
          >
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search learning paths..."
                        className="pl-10"
                        {...field}
                        onChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="flex flex-wrap gap-2">
          <Select
            value={queryState.category}
            onValueChange={value =>
              setQueryState({
                ...queryState,
                page: 1,
                category: value === 'all' ? null : value,
              })
            }
          >
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={queryState.difficulty}
            onValueChange={value =>
              setQueryState({
                ...queryState,
                page: 1,
                difficulty: value === 'all' ? null : value,
              })
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {difficulties.map(difficulty => (
                <SelectItem key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {queryState.category && (
            <Badge variant="secondary" className="gap-1">
              {categories.find(c => c.value === queryState.category)?.label}
              <button
                onClick={() => setQueryState({ ...queryState, category: null })}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {queryState.difficulty && (
            <Badge variant="secondary" className="gap-1">
              {difficulties.find(d => d.value === queryState.difficulty)?.label}
              <button
                onClick={() =>
                  setQueryState({ ...queryState, difficulty: null })
                }
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {queryState.search && (
            <Badge variant="secondary" className="gap-1">
              "{queryState.search}"
              <button
                onClick={() => {
                  form.setValue('search', '');
                  setQueryState({ ...queryState, search: null });
                }}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
