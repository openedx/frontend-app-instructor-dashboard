import { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import {
  configureAuth, getAuthenticatedHttpClient, getSiteConfig, MockAuthService,
} from '@openedx/frontend-base';
import { useCourseInfo } from '@src/data/apiHook';
import { useCoursePermissions } from './useCoursePermissions';
import { COURSE_PERMISSIONS } from './constants';

// Only the course info request is stubbed. `usePermissions` from frontend-base
// runs for real against a mocked HTTP client, so a change to its return shape or
// request format on a frontend-base bump fails here.
jest.mock('@src/data/apiHook');

const mockUseCourseInfo = useCourseInfo as jest.MockedFunction<typeof useCourseInfo>;

const COURSE_ID = 'course-v1:edX+A+2024';
const { ENROLL_LEARNERS, MANAGE_COURSE_TEAM } = COURSE_PERMISSIONS;

const wrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/${COURSE_ID}`]}>
        <Routes>
          <Route path="/:courseId" element={children} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('useCoursePermissions with the real usePermissions', () => {
  let post: jest.SpyInstance;

  beforeEach(() => {
    configureAuth(MockAuthService, {
      config: getSiteConfig(),
      loggingService: { logInfo: jest.fn(), logError: jest.fn() },
    } as any);
    post = jest.spyOn(getAuthenticatedHttpClient(), 'post');
    mockUseCourseInfo.mockReturnValue({
      data: { authzEnabled: true }, isLoading: false, error: null,
    } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('maps the validate/me response to permissions, defaulting missing entries to false', async () => {
    post.mockResolvedValue({
      data: [{ action: ENROLL_LEARNERS, scope: COURSE_ID, allowed: true }],
    });

    const { result } = renderHook(() => useCoursePermissions(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isAuthzEnabled).toBe(true);
    expect(result.current.permissions[ENROLL_LEARNERS]).toBe(true);
    expect(result.current.permissions[MANAGE_COURSE_TEAM]).toBe(false);
    expect(post).toHaveBeenCalledTimes(1);
    expect(post.mock.calls[0][0]).toContain('/api/authz/v1/permissions/validate/me');
    expect(post.mock.calls[0][1]).toContainEqual({ action: ENROLL_LEARNERS, scope: COURSE_ID });
  });

  it('denies every permission when the validate/me request fails', async () => {
    post.mockRejectedValue(new Error('validate failed'));

    const { result } = renderHook(() => useCoursePermissions(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toEqual(new Error('validate failed'));
    expect(result.current.permissions[ENROLL_LEARNERS]).toBe(false);
    expect(result.current.permissions[MANAGE_COURSE_TEAM]).toBe(false);
  });

  it('makes no request and allows everything when AuthZ is off for the course', async () => {
    mockUseCourseInfo.mockReturnValue({
      data: { authzEnabled: false }, isLoading: false, error: null,
    } as any);

    const { result } = renderHook(() => useCoursePermissions(), { wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthzEnabled).toBe(false);
    expect(result.current.permissions[ENROLL_LEARNERS]).toBe(true);
    expect(post).not.toHaveBeenCalled();
  });
});
