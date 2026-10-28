import { renderHook } from '@testing-library/react';
import { useCoursePermission } from './useCoursePermission';
import { usePermissionContext } from './PermissionContext';

jest.mock('./PermissionContext');

const mockUsePermissionContext = usePermissionContext as jest.MockedFunction<typeof usePermissionContext>;

describe('useCoursePermission', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns allowed=false, isLoading=true while loading', () => {
    mockUsePermissionContext.mockReturnValue({ permissions: undefined, isLoading: true });

    const { result } = renderHook(() => useCoursePermission('courses.enroll_learners'));

    expect(result.current).toEqual({ allowed: false, isLoading: true });
  });

  it('is permissive when the authzPermissions field is absent (flag off)', () => {
    mockUsePermissionContext.mockReturnValue({ permissions: undefined, isLoading: false });

    const { result } = renderHook(() => useCoursePermission('courses.enroll_learners'));

    expect(result.current).toEqual({ allowed: true, isLoading: false });
  });

  it('returns allowed=true when the permission is true', () => {
    mockUsePermissionContext.mockReturnValue({
      permissions: { 'courses.enroll_learners': true },
      isLoading: false,
    });

    const { result } = renderHook(() => useCoursePermission('courses.enroll_learners'));

    expect(result.current.allowed).toBe(true);
  });

  it('returns allowed=false when the permission is false', () => {
    mockUsePermissionContext.mockReturnValue({
      permissions: { 'courses.enroll_learners': false },
      isLoading: false,
    });

    const { result } = renderHook(() => useCoursePermission('courses.enroll_learners'));

    expect(result.current.allowed).toBe(false);
  });

  it('returns allowed=false for an unknown key when the field is present', () => {
    mockUsePermissionContext.mockReturnValue({
      permissions: { 'courses.view_cohorts': true },
      isLoading: false,
    });

    const { result } = renderHook(() => useCoursePermission('courses.enroll_learners'));

    expect(result.current.allowed).toBe(false);
  });
});
