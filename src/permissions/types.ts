import { ReactNode } from 'react';

/**
 * The AuthZ permission identifiers resolved for the Instructor Dashboard.
 *
 * Kept in sync with the backend's ``INSTRUCTOR_DASHBOARD_PERMISSIONS``
 * (openedx-platform ``lms/djangoapps/instructor/authz/constants.py``). The hook
 * and guard accept any ``string`` so new backend permissions do not require a
 * frontend change before they can be consumed; this union exists only for
 * autocomplete and typo safety at call sites.
 */
export type PermissionId =
  | 'courses.view_course_info'
  | 'courses.view_enrollments'
  | 'courses.enroll_learners'
  | 'courses.unenroll_learners'
  | 'courses.view_course_team'
  | 'courses.manage_course_team'
  | 'courses.view_gradebook'
  | 'courses.view_grading_configuration'
  | 'courses.view_grading_settings'
  | 'courses.manage_learner_grading'
  | 'courses.view_learner_extensions'
  | 'courses.manage_learner_extensions'
  | 'courses.view_cohorts'
  | 'courses.manage_cohorts';

/**
 * Effective value of each AuthZ permission for the current user in the course,
 * keyed by its dotted identifier. Absent when the backend AuthZ flag is off.
 */
export type AuthzPermissions = Partial<Record<PermissionId, boolean>> & Record<string, boolean>;

export interface PermissionContextValue {
  /** Effective permission map, or ``undefined`` when the field is absent. */
  permissions?: AuthzPermissions;
  isLoading: boolean;
  error?: unknown;
}

export interface PermissionProviderProps {
  children: ReactNode;
}

export interface UseCoursePermissionResult {
  /**
   * Whether the action is allowed. Permissive (``true``) when the whole
   * ``authzPermissions`` field is absent (pre-rollout); restrictive when the
   * field is present but the specific permission is ``false``.
   */
  allowed: boolean;
  isLoading: boolean;
}
