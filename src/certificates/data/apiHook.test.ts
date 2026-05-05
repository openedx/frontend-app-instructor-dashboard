import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useIssuedCertificates,
  useInstructorTasks,
  useGrantBulkExceptions,
  useInvalidateCertificate,
  useRemoveException,
  useRemoveInvalidation,
  useToggleCertificateGeneration,
  useCertificateGenerationHistory,
  useRegenerateCertificates,
} from '@src/certificates/data/apiHook';
import {
  getIssuedCertificates,
  getInstructorTasks,
  grantBulkExceptions,
  invalidateCertificate,
  removeException,
  removeInvalidation,
  toggleCertificateGeneration,
  getCertificateGenerationHistory,
  regenerateCertificates,
} from '@src/certificates/data/api';
import { CertificateFilter, CertificateStatus, SpecialCase } from '@src/certificates/types';

jest.mock('@src/certificates/data/api');

const mockGetIssuedCertificates = getIssuedCertificates as jest.MockedFunction<typeof getIssuedCertificates>;
const mockGetInstructorTasks = getInstructorTasks as jest.MockedFunction<typeof getInstructorTasks>;
const mockGrantBulkExceptions = grantBulkExceptions as jest.MockedFunction<typeof grantBulkExceptions>;
const mockInvalidateCertificate = invalidateCertificate as jest.MockedFunction<typeof invalidateCertificate>;
const mockRemoveException = removeException as jest.MockedFunction<typeof removeException>;
const mockRemoveInvalidation = removeInvalidation as jest.MockedFunction<typeof removeInvalidation>;
const mockToggleCertificateGeneration = toggleCertificateGeneration as jest.MockedFunction<typeof toggleCertificateGeneration>;
const mockGetCertificateGenerationHistory = getCertificateGenerationHistory as jest.MockedFunction<typeof getCertificateGenerationHistory>;
const mockRegenerateCertificates = regenerateCertificates as jest.MockedFunction<typeof regenerateCertificates>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0, // Disable caching
        staleTime: 0,
      },
      mutations: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  }

  return { Wrapper, queryClient };
};

describe('certificates api hooks', () => {
  let queryClient: QueryClient | null = null;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up QueryClient to prevent memory leaks
    if (queryClient) {
      queryClient.clear();
      queryClient = null;
    }
  });

  describe('useIssuedCertificates', () => {
    it('fetches issued certificates successfully', async () => {
      const mockData = {
        count: 2,
        results: [
          {
            username: 'user1',
            email: 'user1@example.com',
            enrollmentTrack: 'verified',
            certificateStatus: CertificateStatus.RECEIVED,
            specialCase: SpecialCase.NONE,
          },
        ],
        numPages: 1,
        next: null,
        previous: null,
      };

      mockGetIssuedCertificates.mockResolvedValue(mockData);

      const { Wrapper, queryClient: qc } = createWrapper();
      queryClient = qc;

      const { result } = renderHook(
        () => useIssuedCertificates('course-v1:Test+Course+2024', {
          page: 0,
          pageSize: 25,
          filter: CertificateFilter.ALL_LEARNERS,
          search: '',
        }),
        { wrapper: Wrapper }
      );

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetIssuedCertificates).toHaveBeenCalledWith('course-v1:Test+Course+2024', {
        page: 0,
        pageSize: 25,
        filter: CertificateFilter.ALL_LEARNERS,
        search: '',
      });
      expect(result.current.data).toEqual(mockData);
    });

    it('handles API error', async () => {
      const mockError = new Error('API Error');
      mockGetIssuedCertificates.mockRejectedValue(mockError);

      const { Wrapper, queryClient: qc } = createWrapper();
      queryClient = qc;

      const { result } = renderHook(
        () => useIssuedCertificates('course-v1:Test+Course+2024', {
          page: 0,
          pageSize: 25,
          filter: CertificateFilter.ALL_LEARNERS,
          search: '',
        }),
        { wrapper: Wrapper }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(mockError);
    });

    it('does not fetch when courseId is empty', () => {
      const { Wrapper, queryClient: qc } = createWrapper();
      queryClient = qc;

      renderHook(
        () => useIssuedCertificates('', {
          page: 0,
          pageSize: 25,
          filter: CertificateFilter.ALL_LEARNERS,
          search: '',
        }),
        { wrapper: Wrapper }
      );

      expect(mockGetIssuedCertificates).not.toHaveBeenCalled();
    });
  });

  describe('useInstructorTasks', () => {
    it('fetches instructor tasks successfully', async () => {
      const mockData = {
        count: 1,
        results: [
          {
            taskId: 'task1',
            taskName: 'Generate Certificates',
            taskState: 'SUCCESS',
            created: '2024-01-15T10:00:00Z',
            updated: '2024-01-15T10:05:00Z',
            taskOutput: 'Success',
          },
        ],
        numPages: 1,
        next: null,
        previous: null,
      };

      mockGetInstructorTasks.mockResolvedValue(mockData);

      const { Wrapper, queryClient: qc } = createWrapper();
      queryClient = qc;

      const { result } = renderHook(
        () => useInstructorTasks('course-v1:Test+Course+2024', { page: 0, pageSize: 25 }),
        { wrapper: Wrapper }
      );

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetInstructorTasks).toHaveBeenCalledWith('course-v1:Test+Course+2024', {
        page: 0,
        pageSize: 25,
      });
      expect(result.current.data).toEqual(mockData);
    });

    it('handles API error', async () => {
      const mockError = new Error('Task fetch error');
      mockGetInstructorTasks.mockRejectedValue(mockError);

      const { Wrapper, queryClient: qc } = createWrapper();
      queryClient = qc;

      const { result } = renderHook(
        () => useInstructorTasks('course-v1:Test+Course+2024', { page: 0, pageSize: 25 }),
        { wrapper: Wrapper }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(mockError);
    });
  });

  describe('useGrantBulkExceptions', () => {
    it('grants bulk exceptions successfully', async () => {
      mockGrantBulkExceptions.mockResolvedValue({ success: ['user1', 'user2'], errors: [] });

      const { Wrapper, queryClient: qc } = createWrapper();
      queryClient = qc;

      const { result } = renderHook(() => useGrantBulkExceptions('course-v1:Test+Course+2024'), {
        wrapper: Wrapper,
      });

      result.current.mutate({ learners: ['user1', 'user2'], notes: 'Exception granted' });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGrantBulkExceptions).toHaveBeenCalledWith('course-v1:Test+Course+2024', {
        learners: ['user1', 'user2'],
        notes: 'Exception granted',
      });
    });

    it('handles error when granting exceptions', async () => {
      const mockError = new Error('Failed to grant exceptions');
      mockGrantBulkExceptions.mockRejectedValue(mockError);

      const { Wrapper, queryClient: qc } = createWrapper();
      queryClient = qc;

      const { result } = renderHook(() => useGrantBulkExceptions('course-v1:Test+Course+2024'), {
        wrapper: Wrapper,
      });

      result.current.mutate({ learners: ['user1'], notes: 'Test' });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(mockError);
    });
  });

  describe('useInvalidateCertificate', () => {
    it('invalidates certificate successfully', async () => {
      mockInvalidateCertificate.mockResolvedValue({ success: ['user1'], errors: [] });

      const { Wrapper, queryClient: qc } = createWrapper();
      queryClient = qc;

      const { result } = renderHook(() => useInvalidateCertificate('course-v1:Test+Course+2024'), {
        wrapper: Wrapper,
      });

      result.current.mutate({ learners: ['user1'], notes: 'Certificate invalid' });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockInvalidateCertificate).toHaveBeenCalledWith('course-v1:Test+Course+2024', {
        learners: ['user1'],
        notes: 'Certificate invalid',
      });
    });

    it('handles error when invalidating certificate', async () => {
      const mockError = new Error('Failed to invalidate');
      mockInvalidateCertificate.mockRejectedValue(mockError);

      const { Wrapper, queryClient: qc } = createWrapper();
      queryClient = qc;

      const { result } = renderHook(() => useInvalidateCertificate('course-v1:Test+Course+2024'), {
        wrapper: Wrapper,
      });

      result.current.mutate({ learners: ['user1'], notes: '' });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useRemoveException', () => {
    it('removes exception successfully', async () => {
      mockRemoveException.mockResolvedValue(undefined);

      const { Wrapper, queryClient: qc } = createWrapper();
      queryClient = qc;

      const { result } = renderHook(() => useRemoveException('course-v1:Test+Course+2024'), {
        wrapper: Wrapper,
      });

      result.current.mutate({ username: 'user1' });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockRemoveException).toHaveBeenCalledWith('course-v1:Test+Course+2024', {
        username: 'user1',
      });
    });

    it('handles error when removing exception', async () => {
      const mockError = new Error('Failed to remove exception');
      mockRemoveException.mockRejectedValue(mockError);

      const { Wrapper, queryClient: qc } = createWrapper();
      queryClient = qc;

      const { result } = renderHook(() => useRemoveException('course-v1:Test+Course+2024'), {
        wrapper: Wrapper,
      });

      result.current.mutate({ username: 'user1' });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useRemoveInvalidation', () => {
    it('removes invalidation successfully', async () => {
      mockRemoveInvalidation.mockResolvedValue(undefined);

      const { Wrapper, queryClient: qc } = createWrapper();
      queryClient = qc;

      const { result } = renderHook(() => useRemoveInvalidation('course-v1:Test+Course+2024'), {
        wrapper: Wrapper,
      });

      result.current.mutate({ username: 'user1' });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockRemoveInvalidation).toHaveBeenCalledWith('course-v1:Test+Course+2024', {
        username: 'user1',
      });
    });

    it('handles error when removing invalidation', async () => {
      const mockError = new Error('Failed to remove invalidation');
      mockRemoveInvalidation.mockRejectedValue(mockError);

      const { Wrapper, queryClient: qc } = createWrapper();
      queryClient = qc;

      const { result } = renderHook(() => useRemoveInvalidation('course-v1:Test+Course+2024'), {
        wrapper: Wrapper,
      });

      result.current.mutate({ username: 'user1' });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useToggleCertificateGeneration', () => {
    it('enables certificate generation successfully', async () => {
      mockToggleCertificateGeneration.mockResolvedValue(undefined);

      const { Wrapper, queryClient: qc } = createWrapper();
      queryClient = qc;

      const { result } = renderHook(
        () => useToggleCertificateGeneration('course-v1:Test+Course+2024'),
        { wrapper: Wrapper }
      );

      result.current.mutate(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockToggleCertificateGeneration).toHaveBeenCalledWith('course-v1:Test+Course+2024', true);
    });

    it('disables certificate generation successfully', async () => {
      mockToggleCertificateGeneration.mockResolvedValue(undefined);

      const { Wrapper, queryClient: qc } = createWrapper();
      queryClient = qc;

      const { result } = renderHook(
        () => useToggleCertificateGeneration('course-v1:Test+Course+2024'),
        { wrapper: Wrapper }
      );

      result.current.mutate(false);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockToggleCertificateGeneration).toHaveBeenCalledWith('course-v1:Test+Course+2024', false);
    });

    it('handles error when toggling certificate generation', async () => {
      const mockError = new Error('Failed to toggle');
      mockToggleCertificateGeneration.mockRejectedValue(mockError);

      const { Wrapper, queryClient: qc } = createWrapper();
      queryClient = qc;

      const { result } = renderHook(
        () => useToggleCertificateGeneration('course-v1:Test+Course+2024'),
        { wrapper: Wrapper }
      );

      result.current.mutate(true);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useCertificateGenerationHistory', () => {
    it('fetches certificate generation history successfully', async () => {
      const mockData = {
        count: 1,
        results: [
          {
            taskName: 'Generate Certificates',
            date: '2024-01-15T10:00:00Z',
            details: 'Generated 100 certificates',
          },
        ],
        numPages: 1,
        next: null,
        previous: null,
      };

      mockGetCertificateGenerationHistory.mockResolvedValue(mockData);

      const { Wrapper, queryClient: qc } = createWrapper();
      queryClient = qc;

      const { result } = renderHook(
        () => useCertificateGenerationHistory('course-v1:Test+Course+2024', { page: 0, pageSize: 25 }),
        { wrapper: Wrapper }
      );

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetCertificateGenerationHistory).toHaveBeenCalledWith('course-v1:Test+Course+2024', {
        page: 0,
        pageSize: 25,
      });
      expect(result.current.data).toEqual(mockData);
    });

    it('handles API error', async () => {
      const mockError = new Error('History fetch error');
      mockGetCertificateGenerationHistory.mockRejectedValue(mockError);

      const { Wrapper, queryClient: qc } = createWrapper();
      queryClient = qc;

      const { result } = renderHook(
        () => useCertificateGenerationHistory('course-v1:Test+Course+2024', { page: 0, pageSize: 25 }),
        { wrapper: Wrapper }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(mockError);
    });

    it('does not fetch when courseId is empty', () => {
      const { Wrapper, queryClient: qc } = createWrapper();
      queryClient = qc;

      renderHook(
        () => useCertificateGenerationHistory('', { page: 0, pageSize: 25 }),
        { wrapper: Wrapper }
      );

      expect(mockGetCertificateGenerationHistory).not.toHaveBeenCalled();
    });
  });

  describe('useRegenerateCertificates', () => {
    it('regenerates certificates successfully', async () => {
      mockRegenerateCertificates.mockResolvedValue(undefined);

      const { Wrapper, queryClient: qc } = createWrapper();
      queryClient = qc;

      const { result } = renderHook(
        () => useRegenerateCertificates('course-v1:Test+Course+2024'),
        { wrapper: Wrapper }
      );

      result.current.mutate({ filter: 'all', onlyWithoutCertificate: false });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockRegenerateCertificates).toHaveBeenCalledWith('course-v1:Test+Course+2024', 'all', false);
    });

    it('handles error when regenerating certificates', async () => {
      const mockError = new Error('Regeneration failed');
      mockRegenerateCertificates.mockRejectedValue(mockError);

      const { Wrapper, queryClient: qc } = createWrapper();
      queryClient = qc;

      const { result } = renderHook(
        () => useRegenerateCertificates('course-v1:Test+Course+2024'),
        { wrapper: Wrapper }
      );

      result.current.mutate({ filter: 'all', onlyWithoutCertificate: false });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(mockError);
    });
  });
});
