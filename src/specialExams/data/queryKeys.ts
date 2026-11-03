import { appId } from '@src/constants';
import { AttemptsParams, OnboardingParams } from '../types';

export const specialExamsQueryKeys = {
  all: [appId, 'specialExams'] as const,
  byCourse: (courseId: string) => [...specialExamsQueryKeys.all, courseId] as const,
  attempts: (courseId: string, params?: AttemptsParams) => [...specialExamsQueryKeys.byCourse(courseId), 'attempts', ...(params ? [params.page, params.pageSize, params.emailOrUsername, params.ordering] : [])] as const,
  allowances: (courseId: string, params?: AttemptsParams) => [...specialExamsQueryKeys.byCourse(courseId), 'allowances', ...(params ? [params.page, params.pageSize, params.emailOrUsername, params.ordering] : [])] as const,
  specialExams: (courseId: string, examType: string) => [...specialExamsQueryKeys.byCourse(courseId), 'specialExams', examType] as const,
  onboarding: (courseId: string, params?: OnboardingParams) => [...specialExamsQueryKeys.byCourse(courseId), 'onboarding', ...(params ? [params.page, params.emailOrUsername, params.statuses.join(',')] : [])] as const,
  proctoringSettings: (courseId: string) => [...specialExamsQueryKeys.byCourse(courseId), 'proctoringSettings'] as const,
};
