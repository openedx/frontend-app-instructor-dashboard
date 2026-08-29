import { appId } from '@src/constants';

export const gradingQueryKeys = {
  all: [appId, 'grading'] as const,
  byCourse: (courseId: string) => [...gradingQueryKeys.all, courseId] as const,
  gradingConfiguration: (courseId: string) => [...gradingQueryKeys.byCourse(courseId), 'gradingConfiguration'] as const,
  resetAttempts: (courseId: string, params: { learner: string; problem: string }) => [...gradingQueryKeys.byCourse(courseId), 'resetAttempts', params.learner, params.problem] as const,
};
