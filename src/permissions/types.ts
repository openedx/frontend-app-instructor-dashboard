import { COURSE_PERMISSIONS } from './constants';

/** An AuthZ permission identifier the dashboard checks, e.g. `courses.enroll_learners`. */
export type PermissionId = typeof COURSE_PERMISSIONS[keyof typeof COURSE_PERMISSIONS];

/** Whether the user holds each dashboard permission in the course. */
export type CoursePermissions = Record<PermissionId, boolean>;

export interface CoursePermissionsResult {
  /**
   * Resolved permissions. Every value is `true` when AuthZ is disabled for the
   * course (legacy behavior), and empty while loading.
   */
  permissions: Partial<CoursePermissions>;
  /** True while the course info or the permission check is pending. */
  isLoading: boolean;
  /** Whether AuthZ is enabled for the course (`authzEnabled` from course info). */
  isAuthzEnabled: boolean;
  error?: unknown;
}

export interface UseCoursePermissionResult {
  /** Whether the action is allowed. Always `false` while loading. */
  allowed: boolean;
  isLoading: boolean;
}
