import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCcxCoachCourse, getCcxCoachGradingPolicy, getCcxCoachInfo, getCcxSchedule, saveCcxCoachGradingPolicy } from './api';
import { ccxCoachInfoQueryKeys } from './queryKeys';

export const useCcxCoachInfo = (courseId: string) => (
  useQuery({
    queryKey: ccxCoachInfoQueryKeys.byCourse(courseId),
    queryFn: () => getCcxCoachInfo(courseId),
    enabled: !!courseId,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  })
);

export const useCreateCcxCoachCourse = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createCcxCoachCourse(courseId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ccxCoachInfoQueryKeys.byCourse(courseId),
        exact: false,
      });
    },
  });
};

export const useCcxSchedule = (courseId: string) => (
  useQuery({
    queryKey: ccxCoachInfoQueryKeys.schedule(courseId),
    queryFn: () => getCcxSchedule(courseId),
    enabled: !!courseId,
  })
);

export const useGradingPolicy = (courseId: string) => (
  useQuery({
    queryKey: ccxCoachInfoQueryKeys.gradingPolicy(courseId),
    queryFn: () => getCcxCoachGradingPolicy(courseId),
    enabled: !!courseId,
  })
);

export const useSaveGradingPolicy = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (gradingPolicy: string) => saveCcxCoachGradingPolicy(courseId, gradingPolicy),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ccxCoachInfoQueryKeys.gradingPolicy(courseId),
        exact: true,
      });
    },
  });
};
