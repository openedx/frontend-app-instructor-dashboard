import { Learner, PaginationParams } from '@src/types';
import { BULK_LEARNERS_ACTION } from './constants';

export type LearnersAction = typeof BULK_LEARNERS_ACTION[keyof typeof BULK_LEARNERS_ACTION];
type BetaTestersAction = 'add' | 'remove';

export interface EnrollmentStatusResponse {
  enrollmentStatus: string;
}

export interface EnrolledLearner extends Learner {
  mode: string;
  isBetaTester: boolean;
}

export interface EnrollmentsParams extends PaginationParams {
  emailOrUsername: string;
  isBetaTester: string;
}

export interface UpdateEnrollmentsParams {
  identifier: string[];
  action: LearnersAction;
  autoEnroll?: boolean;
  emailStudents?: boolean;
}

export interface UpdateBetaTestersParams {
  identifier: string[];
  action: BetaTestersAction;
  autoEnroll?: boolean;
  emailStudents?: boolean;
}

export interface EnrollmentState {
  user: boolean;
  enrollment: boolean;
  allowed: boolean;
  autoEnroll: boolean;
}

export interface UpdateEnrollmentsResult {
  identifier: string;
  invalidIdentifier?: boolean;
  error?: boolean;
  before?: EnrollmentState;
  after?: EnrollmentState;
}

export interface UpdateEnrollmentsResponse {
  action?: LearnersAction;
  autoEnroll?: boolean;
  results: UpdateEnrollmentsResult[];
}

export interface UpdateBetaTestersResponse {
  results: {
    identifier: string;
    userDoesNotExist: boolean;
    isActive: boolean | null;
  }[];
}
