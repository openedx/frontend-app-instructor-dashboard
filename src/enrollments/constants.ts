export const BULK_LEARNERS_ACTION = {
  ENROLL: 'enroll',
  UNENROLL: 'unenroll',
};

/**
 * What the current user may do on the Enrollments tab. `EnrollmentsPage` defaults to
 * everything allowed, which keeps the CCX Coach dashboard (not governed by AuthZ) unchanged.
 */
export const FULL_ENROLLMENTS_ACCESS = {
  canViewEnrollments: true,
  canEnroll: true,
  canUnenroll: true,
  canManageBetaTesters: true,
};
