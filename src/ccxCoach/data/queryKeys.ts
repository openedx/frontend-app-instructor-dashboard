import { appId } from '@src/constants';

export const ccxCoachInfoQueryKeys = {
  all: [appId, 'ccxCoachInfo'] as const,
  byCourse: (courseId: string) => [appId, 'ccxCoachInfo', courseId] as const,
  gradingPolicy: (courseId: string) => [appId, 'ccxCoachInfo', courseId, 'gradingPolicy'] as const,
  schedule: (courseId: string) => [appId, 'ccxCoachInfo', courseId, 'schedule'] as const,
};
