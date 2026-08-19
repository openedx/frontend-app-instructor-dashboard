import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createCcxCoachCourse,
  getCcxCoachGradingPolicy,
  getCcxCoachInfo,
  saveCcxCoachGradingPolicy,
} from './api';
import {
  useCcxCoachInfo,
  useCreateCcxCoachCourse,
  useGradingPolicy,
  useSaveGradingPolicy,
} from './apiHook';
import { ccxCoachInfoQueryKeys } from './queryKeys';

jest.mock('./api', () => ({
  getCcxCoachInfo: jest.fn(),
  createCcxCoachCourse: jest.fn(),
  getCcxCoachGradingPolicy: jest.fn(),
  saveCcxCoachGradingPolicy: jest.fn(),
}));

const mockCcxCoachData = {
  courseId: 'course-v1:edX+DemoX+Demo_Course',
  ccxCourseId: 'ccx-v1:edX+DemoX+Demo_Course+ccx@1',
  tabs: [],
};

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

describe('useCcxCoachInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches ccx coach info successfully', async () => {
    (getCcxCoachInfo as jest.Mock).mockResolvedValue(mockCcxCoachData);

    const { result } = renderHook(() => useCcxCoachInfo('course-v1:edX+DemoX+Demo_Course'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getCcxCoachInfo).toHaveBeenCalledWith('course-v1:edX+DemoX+Demo_Course');
    expect(result.current.data).toBe(mockCcxCoachData);
    expect(result.current.error).toBe(null);
  });

  it('handles API error', async () => {
    const mockError = new Error('API Error');
    (getCcxCoachInfo as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useCcxCoachInfo('course-v1:edX+DemoX+Demo_Course'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(getCcxCoachInfo).toHaveBeenCalledWith('course-v1:edX+DemoX+Demo_Course');
    expect(result.current.error).toBe(mockError);
    expect(result.current.data).toBe(undefined);
  });

  it('is disabled when courseId is empty', () => {
    const { result } = renderHook(() => useCcxCoachInfo(''), {
      wrapper: createWrapper(),
    });

    expect(getCcxCoachInfo).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe(undefined);
  });
});

describe('useCreateCcxCoachCourse', () => {
  const courseId = 'course-v1:edX+DemoX+Demo_Course';
  const ccxCourseName = 'My New CCX';
  const mockCreatedData = {
    ccxCourseId: 'ccx-v1:edX+DemoX+Demo_Course+ccx@1',
  };

  const createWrapperWithClient = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    Wrapper.displayName = 'TestWrapperWithClient';
    return { Wrapper, queryClient };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls createCcxCoachCourse with the given course id and name on mutate', async () => {
    (createCcxCoachCourse as jest.Mock).mockResolvedValue(mockCreatedData as any);
    const { Wrapper } = createWrapperWithClient();

    const { result } = renderHook(() => useCreateCcxCoachCourse(courseId), {
      wrapper: Wrapper,
    });

    result.current.mutate(ccxCourseName);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(createCcxCoachCourse).toHaveBeenCalledWith(courseId, ccxCourseName);
    expect(result.current.data).toEqual(mockCreatedData);
  });

  it('invalidates the ccxCoachInfo query for the course on success', async () => {
    (createCcxCoachCourse as jest.Mock).mockResolvedValue(mockCreatedData as any);
    const { Wrapper, queryClient } = createWrapperWithClient();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useCreateCcxCoachCourse(courseId), {
      wrapper: Wrapper,
    });

    result.current.mutate(ccxCourseName);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ccxCoachInfoQueryKeys.byCourse(courseId),
      exact: false,
    });
  });

  it('surfaces API errors through the mutation state', async () => {
    const mockError = new Error('Create failed');
    (createCcxCoachCourse as jest.Mock).mockRejectedValue(mockError);
    const { Wrapper, queryClient } = createWrapperWithClient();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useCreateCcxCoachCourse(courseId), {
      wrapper: Wrapper,
    });

    result.current.mutate(ccxCourseName);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(mockError);
    expect(invalidateSpy).not.toHaveBeenCalled();
  });
});

describe('useGradingPolicy', () => {
  const courseId = 'course-v1:edX+DemoX+Demo_Course';
  const mockPolicy = '{ "GRADER": [] }';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches grading policy successfully', async () => {
    (getCcxCoachGradingPolicy as jest.Mock).mockResolvedValue(mockPolicy);

    const { result } = renderHook(() => useGradingPolicy(courseId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getCcxCoachGradingPolicy).toHaveBeenCalledWith(courseId);
    expect(result.current.data).toBe(mockPolicy);
  });

  it('handles API error', async () => {
    const mockError = new Error('Policy error');
    (getCcxCoachGradingPolicy as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useGradingPolicy(courseId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(mockError);
  });

  it('is disabled when courseId is empty', () => {
    const { result } = renderHook(() => useGradingPolicy(''), {
      wrapper: createWrapper(),
    });

    expect(getCcxCoachGradingPolicy).not.toHaveBeenCalled();
    expect(result.current.data).toBe(undefined);
  });
});

describe('useSaveGradingPolicy', () => {
  const courseId = 'course-v1:edX+DemoX+Demo_Course';
  const updatedPolicy = '{ "GRADER": [{ "type": "Homework" }] }';

  const createWrapperWithClient = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    Wrapper.displayName = 'TestWrapperWithClient';
    return { Wrapper, queryClient };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls saveCcxCoachGradingPolicy with course id and payload', async () => {
    (saveCcxCoachGradingPolicy as jest.Mock).mockResolvedValue({ success: true } as any);
    const { Wrapper } = createWrapperWithClient();

    const { result } = renderHook(() => useSaveGradingPolicy(courseId), {
      wrapper: Wrapper,
    });

    result.current.mutate(updatedPolicy);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(saveCcxCoachGradingPolicy).toHaveBeenCalledWith(courseId, updatedPolicy);
  });

  it('invalidates gradingPolicy query with exact match on success', async () => {
    (saveCcxCoachGradingPolicy as jest.Mock).mockResolvedValue({ success: true } as any);
    const { Wrapper, queryClient } = createWrapperWithClient();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useSaveGradingPolicy(courseId), {
      wrapper: Wrapper,
    });

    result.current.mutate(updatedPolicy);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ccxCoachInfoQueryKeys.gradingPolicy(courseId),
      exact: true,
    });
  });

  it('surfaces API errors and does not invalidate cache', async () => {
    const mockError = new Error('Save failed');
    (saveCcxCoachGradingPolicy as jest.Mock).mockRejectedValue(mockError);
    const { Wrapper, queryClient } = createWrapperWithClient();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useSaveGradingPolicy(courseId), {
      wrapper: Wrapper,
    });

    result.current.mutate(updatedPolicy);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(mockError);
    expect(invalidateSpy).not.toHaveBeenCalled();
  });
});
