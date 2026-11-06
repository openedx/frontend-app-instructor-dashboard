import { useCoursePermissions } from './useCoursePermissions';
import { PermissionId, UseCoursePermissionResult } from './types';

/**
 * Resolve whether the current user holds a single AuthZ permission in the course.
 *
 * All callers share one cached permission check per course (see
 * `useCoursePermissions`), so calling it from many components sends no extra
 * requests.
 *
 * - While loading: `allowed` is `false`, `isLoading` is `true`.
 * - AuthZ disabled for the course: `allowed` is `true` (legacy behavior; the
 *   backend still enforces its legacy checks).
 * - AuthZ enabled: `allowed` is what openedx-authz returned.
 *
 * @example
 * const { allowed } = useCoursePermission(COURSE_PERMISSIONS.ENROLL_LEARNERS);
 */
export const useCoursePermission = (permission: PermissionId): UseCoursePermissionResult => {
  const { permissions, isLoading } = useCoursePermissions();

  if (isLoading) {
    return { allowed: false, isLoading: true };
  }

  return { allowed: permissions[permission] === true, isLoading: false };
};
