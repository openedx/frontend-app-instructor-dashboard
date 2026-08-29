import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCohorts, getCohortStatus, getContentGroups, toggleCohorts, createCohort, patchCohort, addLearnersToCohort, addLearnersToCohortsBulk } from '@src/cohorts/data/api';
import { cohortsQueryKeys } from '@src/cohorts/data/queryKeys';
import { CohortData, BasicCohortData } from '@src/cohorts/types';

export const useCohortStatus = (courseId: string) => (
  useQuery({
    queryKey: cohortsQueryKeys.enabled(courseId),
    queryFn: () => getCohortStatus(courseId),
    enabled: !!courseId,
  })
);

export const useCohorts = (courseId: string) => (
  useQuery({
    queryKey: cohortsQueryKeys.list(courseId),
    queryFn: () => getCohorts(courseId),
    enabled: !!courseId,
  })
);

export const useToggleCohorts = (courseId: string) => {
  const queryClient = useQueryClient();
  return (useMutation({
    mutationFn: ({ isCohorted }: { isCohorted: boolean }) => toggleCohorts(courseId, isCohorted),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cohortsQueryKeys.enabled(courseId) });
    },
  }));
};

export const useCreateCohort = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cohortInfo: BasicCohortData) => createCohort(courseId, cohortInfo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cohortsQueryKeys.list(courseId) });
    },
  });
};

export const useContentGroupsData = (courseId: string) => (
  useQuery({
    queryKey: cohortsQueryKeys.contentGroups(courseId),
    queryFn: () => getContentGroups(courseId),
    enabled: !!courseId,
  })
);

export const usePatchCohort = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cohortId, cohortInfo }: { cohortId: number; cohortInfo: CohortData }) =>
      patchCohort(courseId, cohortId, cohortInfo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cohortsQueryKeys.byCourse(courseId) });
    },
  });
};

export const useAddLearnersToCohort = (courseId: string, cohortId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (users: string[]) => addLearnersToCohort(courseId, cohortId, users),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cohortsQueryKeys.list(courseId) });
    },
  });
};

export const useAddLearnersToCohortsBulk = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uploadedFile: FormData) => addLearnersToCohortsBulk(courseId, uploadedFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cohortsQueryKeys.list(courseId) });
    },
  });
};
