import { Learner, PaginationParams } from '@src/types';

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
  action: 'enroll' | 'unenroll';
  autoEnroll?: boolean;
  emailStudents?: boolean;
}

export interface UpdateBetaTestersParams {
  identifier: string[];
  action: 'add' | 'remove';
  autoEnroll?: boolean;
  emailStudents?: boolean;
}

export interface UpdateEnrollmentsResponse {
  results: {
    identifier: string;
    invalidIdentifier: boolean;
  }[];
}

export interface UpdateBetaTestersResponse {
  results: {
    identifier: string;
    userDoesNotExist: boolean;
    isActive: boolean | null;
  }[];
}
