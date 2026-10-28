import { usePermissionContext } from './PermissionContext';
import { UseCoursePermissionResult } from './types';

/**
 * Resolve whether the current user holds a single AuthZ permission in the course.
 *
 * Fallback semantics:
 * - While the course info is loading: `allowed` is `false`, `isLoading` is `true`.
 * - When the `authzPermissions` field is entirely absent (backend AuthZ flag
 *   off, pre-rollout): `allowed` is `true` so current behaviour is unchanged.
 * - When the field is present but the specific permission is missing or
 *   `false`: `allowed` is `false`.
 *
 * Accepts any string so new backend permissions work without a frontend change;
 * use a `PermissionId` literal at the call site for autocomplete.
 *
 * @example
 * const { allowed } = useCoursePermission('courses.enroll_learners');
 */
export const useCoursePermission = (permission: string): UseCoursePermissionResult => {
  const { permissions, isLoading } = usePermissionContext();

  if (isLoading) {
    return { allowed: false, isLoading: true };
  }

  // Field absent entirely: permissive, so behaviour is unchanged pre-rollout.
  if (permissions === undefined) {
    return { allowed: true, isLoading: false };
  }

  return { allowed: permissions[permission] === true, isLoading: false };
};
