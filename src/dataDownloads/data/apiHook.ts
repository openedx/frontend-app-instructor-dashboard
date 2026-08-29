import { useMutation, useQuery } from '@tanstack/react-query';
import { generateReportLink, getGeneratedReports } from './api';
import { dataDownloadsQueryKeys as queryKeys } from './queryKeys';

export const useGeneratedReports = (courseId: string, options?: { enablePolling?: boolean }) => (
  useQuery({
    queryKey: queryKeys.generatedReports(courseId),
    queryFn: () => getGeneratedReports(courseId),
    retry: (failureCount, error: any) => {
      // Don't retry on 404 errors
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
    // Poll every 3 seconds when polling is enabled
    refetchInterval: options?.enablePolling ? 3000 : false,
  })
);

export const useGenerateReportLink = (courseId: string) => (
  useMutation({
    mutationKey: queryKeys.generateReportLink(courseId),
    mutationFn: ({ reportType, problemLocation }: { reportType: string; problemLocation?: string }) =>
      generateReportLink(courseId, reportType, problemLocation),
  })
);
