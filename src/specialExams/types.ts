import { PaginationParams } from '@src/types';

export interface Attempt {
  id: number,
  user: {
    username: string,
    id: number,
  },
  examId: number,
  examName: string,
  allowedTimeLimitMins: number,
  examType: string,
  startTime: string,
  endTime: string | null,
  status: string,
  readyToResume: boolean,
}

export interface AttemptsParams extends PaginationParams {
  emailOrUsername: string,
  ordering: string,
}

export type AttemptAction = 'reset' | 'resume';

export interface ResetAttemptParams {
  username: string,
  examId: number,
}

export interface ResumeAttemptParams {
  attemptId: number,
  userId: number,
}

export interface Allowance {
  value: string,
  key: string,
  proctoredExam: {
    examName: string,
    examType: string,
    id: number,
  },
  user: {
    username: string,
    email: string,
    id: number,
  },
  id: number,
}

export interface AddAllowanceParams {
  userIds: string[],
  examType: string,
  examIds: number[],
  allowanceType: string,
  value: string,
}

export interface AddAllowanceForm {
  users: string,
  examType: string,
  examIds: number[],
  allowanceType: string,
  value: string,
}

export interface SpecialExam {
  examName: string,
  examType: string,
  timeLimitMins: number,
  contentId: string,
  courseId: string,
  dueDate: string | null,
  isProctored: boolean,
  isActive: boolean,
  isPracticeExam: boolean,
  hideAfterDue: boolean,
  id: number,
}

export interface DeleteAllowanceParams {
  examId: number,
  userIds: number[],
  allowanceType: string,
}

export interface OnboardingStatus {
  username: string,
  enrollmentMode: string | null,
  status: string | null,
  modified: string | null,
}

export interface OnboardingParams {
  page: number,
  emailOrUsername: string,
}

export interface ProctoringSettings {
  proctoringProvider: string | null,
  proctoringEscalationEmail: string | null,
  createZendeskTickets: boolean,
  enableProctoredExams: boolean,
  supportsOnboarding: boolean,
  reviewDashboardAvailable: boolean,
}
