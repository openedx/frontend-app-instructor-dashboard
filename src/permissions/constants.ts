/**
 * The AuthZ permission identifiers used by the Instructor Dashboard.
 *
 * One place to look up which permissions the dashboard checks, so call sites
 * reference a constant instead of a string literal. `useCoursePermissions`
 * requests all of them from openedx-authz in a single `validate/me` call.
 */
export const COURSE_PERMISSIONS = {
  VIEW_COURSE_INFO: 'courses.view_course_info',
  VIEW_ENROLLMENTS: 'courses.view_enrollments',
  ENROLL_LEARNERS: 'courses.enroll_learners',
  UNENROLL_LEARNERS: 'courses.unenroll_learners',
  VIEW_COURSE_TEAM: 'courses.view_course_team',
  MANAGE_COURSE_TEAM: 'courses.manage_course_team',
  VIEW_GRADEBOOK: 'courses.view_gradebook',
  VIEW_GRADING_CONFIGURATION: 'courses.view_grading_configuration',
  VIEW_GRADING_SETTINGS: 'courses.view_grading_settings',
  MANAGE_LEARNER_GRADING: 'courses.manage_learner_grading',
  VIEW_LEARNER_EXTENSIONS: 'courses.view_learner_extensions',
  MANAGE_LEARNER_EXTENSIONS: 'courses.manage_learner_extensions',
  VIEW_COHORTS: 'courses.view_cohorts',
  MANAGE_COHORTS: 'courses.manage_cohorts',
} as const;
