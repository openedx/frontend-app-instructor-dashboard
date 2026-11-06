import { useParams } from 'react-router-dom';
import { usePermissions } from '@openedx/frontend-base';
import { useCourseInfo } from '@src/data/apiHook';
import { COURSE_PERMISSIONS } from './constants';
import { CoursePermissions, CoursePermissionsResult, PermissionId } from './types';

const PERMISSION_IDS = Object.values(COURSE_PERMISSIONS) as PermissionId[];

/**
 * Build the `usePermissions` query for every dashboard permission in a course.
 * Each key is the permission id itself, so the result can be read back by id.
 */
const buildPermissionsQuery = (courseId: string) => Object.fromEntries(
  PERMISSION_IDS.map(id => [id, { action: id, scope: courseId }]),
) as Record<PermissionId, { action: PermissionId; scope: string }>;

/**
 * Resolve every dashboard permission for the current course.
 *
 * Always asks the shared frontend-base `usePermissions` hook for the same full
 * set of permissions, so every caller shares one React Query cache entry per
 * course and the dashboard sends a single `validate/me` request per course.
 * Other code should use `useCoursePermission` / `PermissionGate` instead of
 * calling `usePermissions` directly with a smaller query, which would create a
 * separate cache entry and request.
 *
 * Whether AuthZ is on for the course comes from `authzEnabled` on the course
 * info. When it is off, `usePermissions` makes no request and allows
 * everything (legacy behavior). Loading is reported until the course info
 * arrives; otherwise the hook would see `featureEnabled=false` for a moment and
 * briefly allow everything.
 *
 * Internal to the permissions feature; not exported from the barrel.
 */
export const useCoursePermissions = (): CoursePermissionsResult => {
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { data: courseInfo, isLoading: isCourseInfoLoading, error: courseInfoError } = useCourseInfo(courseId);

  const {
    isLoading: isPermissionsLoading, error: permissionsError, isAuthzEnabled, ...results
  } = usePermissions(buildPermissionsQuery(courseId), courseInfo?.authzEnabled ?? false);

  const isLoading = isCourseInfoLoading || isPermissionsLoading;
  const permissions: Partial<CoursePermissions> = {};
  if (!isLoading) {
    PERMISSION_IDS.forEach((id) => {
      permissions[id] = results[id] === true;
    });
  }

  return {
    permissions,
    isLoading,
    isAuthzEnabled,
    error: courseInfoError ?? permissionsError,
  };
};
