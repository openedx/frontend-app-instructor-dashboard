import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getDateExtensions, resetDateExtension, addDateExtension, getGradedSubsections } from '@src/dateExtensions/data/api';
import { dateExtensionsQueryKeys, gradedSubsectionsQueryKeys } from '@src/dateExtensions/data/queryKeys';
import { DateExtensionQueryParams, ResetDueDateParams } from '@src/dateExtensions/types';

export const useDateExtensions = (courseId: string, params: DateExtensionQueryParams) => (
  useQuery({
    queryKey: dateExtensionsQueryKeys.byCoursePaginated(courseId, params),
    queryFn: () => getDateExtensions(courseId, params),
    enabled: !!courseId,
  })
);

export const useResetDateExtensionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, params }: { courseId: string; params: ResetDueDateParams }) =>
      resetDateExtension(courseId, params),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: dateExtensionsQueryKeys.byCourse(courseId), exact: false });
    },
  });
};

export const useAddDateExtensionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, extensionData }: { courseId: string; extensionData: any }) =>
      addDateExtension(courseId, extensionData),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: dateExtensionsQueryKeys.byCourse(courseId), exact: false });
    },
  });
};

export const useGradedSubsections = (courseId: string) => (
  useQuery({
    queryKey: gradedSubsectionsQueryKeys.byCourse(courseId),
    queryFn: () => getGradedSubsections(courseId),
  })
);
