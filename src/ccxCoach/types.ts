import type { TabProps } from '@src/instructorNav/InstructorNav';

export interface CcxCoachInfoResponse {
  courseId: string;
  ccxCourseId: string;
  tabs?: TabProps[];
}
