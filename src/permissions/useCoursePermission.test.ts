import { renderHook } from '@testing-library/react';
import { useCoursePermission } from './useCoursePermission';
import { useCoursePermissions } from './useCoursePermissions';
import { COURSE_PERMISSIONS } from './constants';

jest.mock('./useCoursePermissions');

const mockUseCoursePermissions = useCoursePermissions as jest.MockedFunction<typeof useCoursePermissions>;

const { ENROLL_LEARNERS, VIEW_COHORTS } = COURSE_PERMISSIONS;

describe('useCoursePermission', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns allowed=false, isLoading=true while loading', () => {
    mockUseCoursePermissions.mockReturnValue({ permissions: {}, isLoading: true, isAuthzEnabled: true });

    const { result } = renderHook(() => useCoursePermission(ENROLL_LEARNERS));

    expect(result.current).toEqual({ allowed: false, isLoading: true });
  });

  it('returns allowed=true when the permission is true', () => {
    mockUseCoursePermissions.mockReturnValue({
      permissions: { [ENROLL_LEARNERS]: true },
      isLoading: false,
      isAuthzEnabled: true,
    });

    const { result } = renderHook(() => useCoursePermission(ENROLL_LEARNERS));

    expect(result.current).toEqual({ allowed: true, isLoading: false });
  });

  it('returns allowed=false when the permission is false', () => {
    mockUseCoursePermissions.mockReturnValue({
      permissions: { [ENROLL_LEARNERS]: false },
      isLoading: false,
      isAuthzEnabled: true,
    });

    const { result } = renderHook(() => useCoursePermission(ENROLL_LEARNERS));

    expect(result.current.allowed).toBe(false);
  });

  it('returns allowed=false when the permission is missing from the map', () => {
    mockUseCoursePermissions.mockReturnValue({
      permissions: { [VIEW_COHORTS]: true },
      isLoading: false,
      isAuthzEnabled: true,
    });

    const { result } = renderHook(() => useCoursePermission(ENROLL_LEARNERS));

    expect(result.current.allowed).toBe(false);
  });
});
