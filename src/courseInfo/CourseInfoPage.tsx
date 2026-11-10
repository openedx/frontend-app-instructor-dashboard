import { Skeleton } from '@openedx/paragon';
import { PendingTasks } from '@src/components/PendingTasks';
import { GeneralCourseInfo } from '@src/courseInfo/components/generalCourseInfo';
import { COURSE_PERMISSIONS, PermissionGate } from '@src/permissions';
import AccessErrorAlert from '@src/providers/AccessErrorAlert';
import { EnrollmentSummary } from './components/EnrollmentSummary';

/**
 * The tab link is already hidden by the backend when the user lacks
 * `courses.view_course_info`. This gate covers direct URL access and keeps the
 * enrollment counts from rendering.
 */
const CourseInfoPage = () => (
  <PermissionGate
    permission={COURSE_PERMISSIONS.VIEW_COURSE_INFO}
    loading={<Skeleton className="lead" />}
    fallback={<AccessErrorAlert errorType="forbidden" />}
  >
    <GeneralCourseInfo />
    <EnrollmentSummary />
    <PendingTasks />
  </PermissionGate>
);

export default CourseInfoPage;
