import { Skeleton } from '@openedx/paragon';
import EnrollmentsPage from '@src/enrollments/EnrollmentsPage';
import { COURSE_PERMISSIONS, PermissionGate, useCoursePermission } from '@src/permissions';
import AccessErrorAlert from '@src/providers/AccessErrorAlert';

/**
 * Any of these permissions opens the tab.
 * It includes `manage_course_team` because the tab manages beta testers.
 */
const TAB_PERMISSIONS = [
  COURSE_PERMISSIONS.VIEW_ENROLLMENTS,
  COURSE_PERMISSIONS.ENROLL_LEARNERS,
  COURSE_PERMISSIONS.UNENROLL_LEARNERS,
  COURSE_PERMISSIONS.MANAGE_COURSE_TEAM,
];

const EnrollmentsPageWithAccess = () => {
  const { allowed: canViewEnrollments } = useCoursePermission(COURSE_PERMISSIONS.VIEW_ENROLLMENTS);
  const { allowed: canEnroll } = useCoursePermission(COURSE_PERMISSIONS.ENROLL_LEARNERS);
  const { allowed: canUnenroll } = useCoursePermission(COURSE_PERMISSIONS.UNENROLL_LEARNERS);
  // Beta testers are managed with the course team permission.
  const { allowed: canManageBetaTesters } = useCoursePermission(COURSE_PERMISSIONS.MANAGE_COURSE_TEAM);

  return (
    <EnrollmentsPage
      access={{
        canViewEnrollments, canEnroll, canUnenroll, canManageBetaTesters,
      }}
    />
  );
};

/**
 * The Enrollments tab of the instructor dashboard, gated by AuthZ permissions.
 *
 * The tab link is already hidden by the backend when the user holds none of the tab's
 * permissions; this gate covers direct URL access. It lives outside `EnrollmentsPage`
 * because that page is shared with the CCX Coach dashboard, where the permission hooks
 * would send instructor API requests for a CCX course id.
 */
const InstructorEnrollmentsPage = () => (
  <PermissionGate
    anyOf={TAB_PERMISSIONS}
    loading={<Skeleton className="lead" />}
    fallback={<AccessErrorAlert errorType="forbidden" />}
  >
    <EnrollmentsPageWithAccess />
  </PermissionGate>
);

export default InstructorEnrollmentsPage;
