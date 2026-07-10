import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getAttempts, getAllowances, addAllowance, deleteAllowance, getSpecialExams, resetAttempt, resumeAttempt, getProctoringSettings, getOnboardingStatuses } from '@src/specialExams/data/api';
import { useAttempts, useAllowances, useAddAllowance, useDeleteAllowance, useSpecialExams, useResetAttempt, useResumeAttempt, useProctoringSettings, useOnboardingStatuses } from '@src/specialExams/data/apiHook';
import { AttemptsParams, AddAllowanceParams, DeleteAllowanceParams, OnboardingParams } from '@src/specialExams/types';

jest.mock('@src/specialExams/data/api');

const mockGetAttempts = getAttempts as jest.MockedFunction<typeof getAttempts>;
const mockGetAllowances = getAllowances as jest.MockedFunction<typeof getAllowances>;
const mockAddAllowance = addAllowance as jest.MockedFunction<typeof addAllowance>;
const mockDeleteAllowance = deleteAllowance as jest.MockedFunction<typeof deleteAllowance>;
const mockGetSpecialExams = getSpecialExams as jest.MockedFunction<typeof getSpecialExams>;
const mockResetAttempt = resetAttempt as jest.MockedFunction<typeof resetAttempt>;
const mockResumeAttempt = resumeAttempt as jest.MockedFunction<typeof resumeAttempt>;
const mockGetProctoringSettings = getProctoringSettings as jest.MockedFunction<typeof getProctoringSettings>;
const mockGetOnboardingStatuses = getOnboardingStatuses as jest.MockedFunction<typeof getOnboardingStatuses>;

const mockAttemptsData = {
  count: 2,
  numPages: 1,
  results: [
    {
      id: 1,
      examId: 101,
      user: {
        username: 'student1',
        id: 1
      },
      examName: 'Final Exam',
      allowedTimeLimitMins: 180,
      examType: 'proctored',
      startTime: '2023-01-01T10:00:00Z',
      endTime: '2023-01-01T13:00:00Z',
      status: 'completed',
      readyToResume: false
    },
    {
      id: 2,
      examId: 102,
      user: {
        username: 'student2',
        id: 2
      },
      examName: 'Midterm Exam',
      allowedTimeLimitMins: 120,
      examType: 'timed',
      startTime: '2023-01-02T14:00:00Z',
      endTime: '2023-01-02T16:00:00Z',
      status: 'completed',
      readyToResume: true
    },
  ],
};

const mockAllowancesData = {
  count: 1,
  numPages: 1,
  results: [
    {
      id: 1,
      user: {
        username: 'john_doe',
        email: 'john.doe@hotmail.com',
        id: 5,
      },
      proctoredExam: {
        examName: 'Midterm Exam',
        examType: 'proctored',
        id: 1,
      },
      key: 'additional_time_granted',
      value: '30 minutes',
    },
  ],
};

const mockSpecialExamsData = [
  {
    id: 1,
    examName: 'Midterm Exam',
    examType: 'proctored',
    timeLimitMins: 120,
    contentId: 'content-123',
    courseId: 'course-v1:edX+Test+2023',
    dueDate: '2023-12-01T23:59:00Z',
    isProctored: true,
    isActive: true,
    isPracticeExam: false,
    hideAfterDue: false,
  },
];

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};

describe('specialExams api hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useAttempts', () => {
    const courseId = 'course-v1:edX+Test+2023';
    const params: AttemptsParams = { page: 1, pageSize: 20, emailOrUsername: '', ordering: '' };

    it('fetches attempts successfully', async () => {
      mockGetAttempts.mockResolvedValue(mockAttemptsData);

      const { result } = renderHook(() => useAttempts(courseId, params), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetAttempts).toHaveBeenCalledWith(courseId, params);
      expect(result.current.data).toBe(mockAttemptsData);
      expect(result.current.error).toBe(null);
    });

    it('handles API error', async () => {
      const mockError = new Error('Network error');
      mockGetAttempts.mockRejectedValue(mockError);

      const { result } = renderHook(() => useAttempts(courseId, params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(mockGetAttempts).toHaveBeenCalledWith(courseId, params);
      expect(result.current.error).toBe(mockError);
      expect(result.current.data).toBe(undefined);
    });

    it('handles different params parameters', async () => {
      const customParams: AttemptsParams = { page: 3, pageSize: 50, emailOrUsername: 'student1', ordering: '' };
      mockGetAttempts.mockResolvedValue(mockAttemptsData);

      const { result } = renderHook(() => useAttempts(courseId, customParams), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetAttempts).toHaveBeenCalledWith(courseId, customParams);
      expect(result.current.data).toBe(mockAttemptsData);
    });

    it('is disabled when courseId is empty', () => {
      const { result } = renderHook(() => useAttempts('', params), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(mockGetAttempts).not.toHaveBeenCalled();
    });

    it('is enabled when courseId is provided', async () => {
      mockGetAttempts.mockResolvedValue(mockAttemptsData);

      const { result } = renderHook(() => useAttempts(courseId, params), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetAttempts).toHaveBeenCalledWith(courseId, params);
    });

    it('refetches data when params change', async () => {
      mockGetAttempts.mockResolvedValue(mockAttemptsData);

      const { result, rerender } = renderHook(
        ({ params: hookParams }) => useAttempts(courseId, hookParams),
        {
          wrapper: createWrapper(),
          initialProps: { params },
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetAttempts).toHaveBeenCalledTimes(1);
      expect(mockGetAttempts).toHaveBeenCalledWith(courseId, params);

      // Change params
      const newParams: AttemptsParams = { page: 2, pageSize: 10, emailOrUsername: 'student2', ordering: '' };
      rerender({ params: newParams });

      await waitFor(() => {
        expect(mockGetAttempts).toHaveBeenCalledTimes(2);
      });

      expect(mockGetAttempts).toHaveBeenLastCalledWith(courseId, newParams);
    });

    it('refetches data when courseId changes', async () => {
      mockGetAttempts.mockResolvedValue(mockAttemptsData);

      const { result, rerender } = renderHook(
        ({ courseId: hookCourseId }) => useAttempts(hookCourseId, params),
        {
          wrapper: createWrapper(),
          initialProps: { courseId },
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetAttempts).toHaveBeenCalledTimes(1);
      expect(mockGetAttempts).toHaveBeenCalledWith(courseId, params);

      // Change courseId
      const newCourseId = 'course-v1:edX+NewCourse+2023';
      rerender({ courseId: newCourseId });

      await waitFor(() => {
        expect(mockGetAttempts).toHaveBeenCalledTimes(2);
      });

      expect(mockGetAttempts).toHaveBeenLastCalledWith(newCourseId, params);
    });

    it('does not fetch when enabled is false', () => {
      const { result } = renderHook(() => useAttempts(courseId, params, false), {
        wrapper: createWrapper(),
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.fetchStatus).toBe('idle');
      expect(mockGetAttempts).not.toHaveBeenCalled();
    });

    it('fetches when enabled is true', async () => {
      mockGetAttempts.mockResolvedValue(mockAttemptsData);
      const { result } = renderHook(() => useAttempts(courseId, params, true), {
        wrapper: createWrapper(),
      });
      expect(result.current.isLoading).toBe(true);
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(mockGetAttempts).toHaveBeenCalledWith(courseId, params);
      expect(result.current.data).toBe(mockAttemptsData);
    });

    it('can be manually refetched when enabled is false', async () => {
      mockGetAttempts.mockResolvedValue(mockAttemptsData);
      const { result } = renderHook(() => useAttempts(courseId, params, false), {
        wrapper: createWrapper(),
      });
      expect(mockGetAttempts).not.toHaveBeenCalled();
      expect(result.current.fetchStatus).toBe('idle');
      const refetchResult = await result.current.refetch();
      expect(mockGetAttempts).toHaveBeenCalledWith(courseId, params);
      expect(refetchResult.data).toBe(mockAttemptsData);
    });
  });

  describe('useAllowances', () => {
    const courseId = 'course-v1:edX+Test+2023';
    const params: AttemptsParams = { page: 0, pageSize: 25, emailOrUsername: '', ordering: '' };

    it('fetches allowances successfully', async () => {
      mockGetAllowances.mockResolvedValue(mockAllowancesData);

      const { result } = renderHook(() => useAllowances(courseId, params), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetAllowances).toHaveBeenCalledWith(courseId, params);
      expect(result.current.data).toBe(mockAllowancesData);
    });

    it('is disabled when courseId is empty', () => {
      const { result } = renderHook(() => useAllowances('', params), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(mockGetAllowances).not.toHaveBeenCalled();
    });
  });

  describe('useAddAllowance', () => {
    const courseId = 'course-v1:edX+Test+2023';
    const newAllowanceData: AddAllowanceParams = {
      userIds: ['john_doe'],
      examType: 'proctored',
      examIds: [1],
      allowanceType: 'additional_time_granted',
      value: '30',
    };

    it('successfully adds allowance and invalidates queries', async () => {
      mockAddAllowance.mockResolvedValue([mockAllowancesData.results[0]]);

      const { result } = renderHook(() => useAddAllowance(courseId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        result.current.mutate(newAllowanceData);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockAddAllowance).toHaveBeenCalledWith(courseId, newAllowanceData);
    });

    it('handles add allowance error', async () => {
      const mockError = new Error('Failed to add allowance');
      mockAddAllowance.mockRejectedValue(mockError);

      const { result } = renderHook(() => useAddAllowance(courseId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        result.current.mutate(newAllowanceData);
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(mockError);
    });
  });

  describe('useDeleteAllowance', () => {
    const courseId = 'course-v1:edX+Test+2023';
    const deleteParams: DeleteAllowanceParams = {
      examId: 1,
      userIds: [5],
      allowanceType: 'additional_time_granted',
    };

    it('successfully deletes allowance and invalidates queries', async () => {
      mockDeleteAllowance.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteAllowance(courseId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        result.current.mutate(deleteParams);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockDeleteAllowance).toHaveBeenCalledWith(courseId, deleteParams);
    });

    it('handles delete allowance error', async () => {
      const mockError = new Error('Failed to delete allowance');
      mockDeleteAllowance.mockRejectedValue(mockError);

      const { result } = renderHook(() => useDeleteAllowance(courseId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        result.current.mutate(deleteParams);
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(mockError);
    });
  });

  describe('useSpecialExams', () => {
    const courseId = 'course-v1:edX+Test+2023';
    const examType = 'proctored';

    it('fetches special exams successfully', async () => {
      mockGetSpecialExams.mockResolvedValue(mockSpecialExamsData);

      const { result } = renderHook(() => useSpecialExams(courseId, examType), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetSpecialExams).toHaveBeenCalledWith(courseId, examType);
      expect(result.current.data).toBe(mockSpecialExamsData);
    });

    it('is disabled when courseId is empty', () => {
      const { result } = renderHook(() => useSpecialExams('', examType), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(mockGetSpecialExams).not.toHaveBeenCalled();
    });

    it('is disabled when examType is empty', () => {
      const { result } = renderHook(() => useSpecialExams(courseId, ''), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(mockGetSpecialExams).not.toHaveBeenCalled();
    });

    it('handles API error', async () => {
      const mockError = new Error('Network error');
      mockGetSpecialExams.mockRejectedValue(mockError);

      const { result } = renderHook(() => useSpecialExams(courseId, examType), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(mockError);
    });
  });

  describe('useResetAttempt', () => {
    const courseId = 'course-v1:edX+Test+2023';
    const params = {
      username: 'testuser',
      examId: 3
    };

    it('resets attempt successfully', async () => {
      mockResetAttempt.mockResolvedValue({});

      const { result } = renderHook(() => useResetAttempt(courseId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        result.current.mutate(params);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockResetAttempt).toHaveBeenCalledWith(courseId, params);
    });
  });

  describe('useResumeAttempt', () => {
    it('handles resume attempt successfully', async () => {
      const courseId = 'course-v1:edX+Test+2023';
      const params = {
        userId: 2,
        attemptId: 3
      };
      mockResumeAttempt.mockResolvedValue({});

      const { result } = renderHook(() => useResumeAttempt(courseId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        result.current.mutate(params);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockResumeAttempt).toHaveBeenCalledWith(params);
    });
  });

  describe('useProctoringSettings', () => {
    const courseId = 'course-v1:edX+Test+2023';
    const mockSettings = {
      proctoringProvider: 'proctortrack',
      proctoringEscalationEmail: null,
      createZendeskTickets: false,
      enableProctoredExams: true,
      supportsOnboarding: true,
      reviewDashboardAvailable: true,
    };

    it('fetches proctoring settings successfully', async () => {
      mockGetProctoringSettings.mockResolvedValue(mockSettings);

      const { result } = renderHook(() => useProctoringSettings(courseId), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetProctoringSettings).toHaveBeenCalledWith(courseId);
      expect(result.current.data).toBe(mockSettings);
    });

    it('does not fetch when courseId is empty', () => {
      const { result } = renderHook(() => useProctoringSettings(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockGetProctoringSettings).not.toHaveBeenCalled();
    });
  });

  describe('useOnboardingStatuses', () => {
    const courseId = 'course-v1:edX+Test+2023';
    const params: OnboardingParams = { page: 0, emailOrUsername: '' };
    const mockOnboardingData = {
      count: 1,
      numPages: 1,
      results: [
        { username: 'student1', enrollmentMode: 'verified', status: 'verified', modified: '2023-01-01T10:00:00Z' },
      ],
    };

    it('fetches onboarding statuses successfully', async () => {
      mockGetOnboardingStatuses.mockResolvedValue(mockOnboardingData);

      const { result } = renderHook(() => useOnboardingStatuses(courseId, params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockGetOnboardingStatuses).toHaveBeenCalledWith(courseId, params);
      expect(result.current.data).toBe(mockOnboardingData);
    });

    it('does not fetch when disabled', () => {
      const { result } = renderHook(() => useOnboardingStatuses(courseId, params, false), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockGetOnboardingStatuses).not.toHaveBeenCalled();
    });

    it('handles API error', async () => {
      const mockError = new Error('Network error');
      mockGetOnboardingStatuses.mockRejectedValue(mockError);

      const { result } = renderHook(() => useOnboardingStatuses(courseId, params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(mockError);
    });
  });
});
