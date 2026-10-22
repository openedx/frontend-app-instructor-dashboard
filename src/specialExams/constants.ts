import messages from '@src/specialExams/messages';

export const ALLOWANCES_PAGE_SIZE = 25;

export const addLabel = {
  additional_time_granted: messages.addAdditionalTimeGranted,
  review_policy_exception: messages.addReviewPolicyException,
  time_multiplier: messages.addTimeMultiplier,
};

export const addPlaceholder = {
  additional_time_granted: messages.addTimePlaceholder,
  review_policy_exception: messages.exceptionPlaceholder,
  time_multiplier: messages.timeMultiplierPlaceholder,
};

export const allowanceTypesOptions = [
  { value: '', label: messages.allowanceType },
  { value: 'additional_time_granted', label: messages.additionalTime },
  { value: 'review_policy_exception', label: messages.reviewPolicy },
  { value: 'time_multiplier', label: messages.timeMultiplier },
];

export const onboardingStatusLabel = {
  not_started: messages.onboardingStatusNotStarted,
  setup_started: messages.onboardingStatusSetupStarted,
  onboarding_started: messages.onboardingStatusOnboardingStarted,
  other_course_approved: messages.onboardingStatusOtherCourseApproved,
  submitted: messages.onboardingStatusSubmitted,
  verified: messages.onboardingStatusVerified,
  rejected: messages.onboardingStatusRejected,
  error: messages.onboardingStatusError,
  expired: messages.onboardingStatusExpired,
};

// Statuses edx-proctoring can filter by, which differ depending on whether the
// proctoring provider's onboarding profile API is in use (mirrors the legacy dashboard).
export const ONBOARDING_ATTEMPT_STATUSES = [
  'not_started', 'setup_started', 'onboarding_started', 'other_course_approved', 'submitted', 'verified', 'rejected', 'error',
] as const;
export const ONBOARDING_PROFILE_API_STATUSES = [
  'not_started', 'other_course_approved', 'submitted', 'verified', 'rejected', 'expired',
] as const;
