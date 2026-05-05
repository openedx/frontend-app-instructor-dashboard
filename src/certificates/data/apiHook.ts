import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PaginationParams } from '@src/types';
import type {
  CertificateQueryParams,
  GrantExceptionRequest,
  InvalidateCertificateRequest,
  RemoveExceptionRequest,
  RemoveInvalidationRequest,
} from '@src/certificates/types';
import {
  getCertificateGenerationHistory,
  getInstructorTasks,
  getIssuedCertificates,
  grantBulkExceptions,
  invalidateCertificate,
  regenerateCertificates,
  removeException,
  removeInvalidation,
  toggleCertificateGeneration,
} from '@src/certificates/data/api';
import { certificatesQueryKeys } from '@src/certificates/data/queryKeys';

/**
 * Hook to fetch issued certificates
 */
export const useIssuedCertificates = (courseId: string, params: CertificateQueryParams) =>
  useQuery({
    queryKey: certificatesQueryKeys.issued(courseId, params),
    queryFn: () => getIssuedCertificates(courseId, params),
    enabled: !!courseId,
  });

/**
 * Hook to fetch instructor tasks
 */
export const useInstructorTasks = (courseId: string, params: PaginationParams) =>
  useQuery({
    queryKey: certificatesQueryKeys.tasks(courseId, params),
    queryFn: () => getInstructorTasks(courseId, params),
    enabled: !!courseId,
  });

/**
 * Hook to fetch certificate generation history
 */
export const useCertificateGenerationHistory = (courseId: string, params: PaginationParams) =>
  useQuery({
    queryKey: certificatesQueryKeys.generationHistory(courseId, params),
    queryFn: () => getCertificateGenerationHistory(courseId, params),
    enabled: !!courseId,
  });

/**
 * Hook to grant bulk certificate exceptions
 */
export const useGrantBulkExceptions = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: GrantExceptionRequest) => grantBulkExceptions(courseId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: certificatesQueryKeys.byCourse(courseId),
        exact: false,
      });
    },
  });
};

/**
 * Hook to invalidate certificate
 */
export const useInvalidateCertificate = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: InvalidateCertificateRequest) => invalidateCertificate(courseId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: certificatesQueryKeys.byCourse(courseId),
        exact: false,
      });
    },
  });
};

/**
 * Hook to remove certificate exception
 */
export const useRemoveException = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: RemoveExceptionRequest) => removeException(courseId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: certificatesQueryKeys.byCourse(courseId),
        exact: false,
      });
    },
  });
};

/**
 * Hook to remove certificate invalidation
 */
export const useRemoveInvalidation = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: RemoveInvalidationRequest) => removeInvalidation(courseId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: certificatesQueryKeys.byCourse(courseId),
        exact: false,
      });
    },
  });
};

/**
 * Hook to toggle certificate generation
 */
export const useToggleCertificateGeneration = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (enable: boolean) => toggleCertificateGeneration(courseId, enable),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: certificatesQueryKeys.byCourse(courseId),
        exact: false,
      });
    },
  });
};

/**
 * Hook to regenerate certificates
 */
export const useRegenerateCertificates = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ filter, onlyWithoutCertificate }: { filter: string, onlyWithoutCertificate?: boolean }) =>
      regenerateCertificates(courseId, filter, onlyWithoutCertificate),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: certificatesQueryKeys.byCourse(courseId),
        exact: false,
      });
    },
  });
};
