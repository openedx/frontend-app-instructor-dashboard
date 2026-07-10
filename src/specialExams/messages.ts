import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  specialExamsTitle: {
    id: 'instruct.specialExams.title',
    defaultMessage: 'Special Exams',
    description: 'Title for the special exams page'
  },
  examAttempts: {
    id: 'instruct.specialExams.examAttempts',
    defaultMessage: 'Exam Attempts',
    description: 'Label for the exam attempts tab'
  },
  allowances: {
    id: 'instruct.specialExams.allowances',
    defaultMessage: 'Allowances',
    description: 'Label for the allowances tab'
  },
  username: {
    id: 'instruct.specialExams.username',
    defaultMessage: 'Username',
    description: 'Column header for username in exam attempts list',
  },
  examName: {
    id: 'instruct.specialExams.examName',
    defaultMessage: 'Exam Name',
    description: 'Column header for exam name in exam attempts list',
  },
  timeLimit: {
    id: 'instruct.specialExams.timeLimit',
    defaultMessage: 'Time Limit',
    description: 'Column header for time limit in exam attempts list',
  },
  type: {
    id: 'instruct.specialExams.type',
    defaultMessage: 'Type',
    description: 'Column header for type in exam attempts list',
  },
  startedAt: {
    id: 'instruct.specialExams.startedAt',
    defaultMessage: 'Started At',
    description: 'Column header for started at in exam attempts list',
  },
  completedAt: {
    id: 'instruct.specialExams.completedAt',
    defaultMessage: 'Completed At',
    description: 'Column header for completed at in exam attempts list',
  },
  status: {
    id: 'instruct.specialExams.status',
    defaultMessage: 'Status',
    description: 'Column header for status in exam attempts list',
  },
  noAttempts: {
    id: 'instruct.specialExams.noAttempts',
    defaultMessage: 'No exam attempts found',
    description: 'Message displayed when there are no exam attempts to show',
  },
  noAllowances: {
    id: 'instruct.specialExams.noAllowances',
    defaultMessage: 'No allowances found',
    description: 'Message displayed when there are no allowances to show',
  },
  editAllowance: {
    id: 'instruct.specialExams.editAllowance',
    defaultMessage: 'Edit Allowance',
    description: 'ARIA label for actions button and modal title when editing an allowance',
  },
  email: {
    id: 'instruct.specialExams.email',
    defaultMessage: 'Email',
    description: 'Column header for email in allowances list',
  },
  allowanceType: {
    id: 'instruct.specialExams.allowanceType',
    defaultMessage: 'Allowance Type',
    description: 'Column header for allowance type in allowances list',
  },
  allowanceValue: {
    id: 'instruct.specialExams.allowanceValue',
    defaultMessage: 'Allowance Value',
    description: 'Column header for allowance value in allowances list',
  },
  addAllowance: {
    id: 'instruct.specialExams.addAllowance',
    defaultMessage: 'Add Allowance',
    description: 'Label for the button to add a new allowance',
  },
  cancel: {
    id: 'instruct.specialExams.cancel',
    defaultMessage: 'Cancel',
    description: 'Label for cancel button in add/edit allowance modal',
  },
  createAllowance: {
    id: 'instruct.specialExams.createAllowance',
    defaultMessage: 'Create Allowance',
    description: 'Label for the create button in add allowance modal',
  },
  specifyLearners: {
    id: 'instruct.specialExams.specifyLearners',
    defaultMessage: 'Specify Learners',
    description: 'Label for the field to specify learners in add allowance modal',
  },
  specifyLearnersPlaceholder: {
    id: 'instruct.specialExams.specifyLearnersPlaceholder',
    defaultMessage: 'Learner email addresses and/or usernames separated by commas',
    description: 'Placeholder for the field to specify learners in add allowance modal',
  },
  selectExamType: {
    id: 'instruct.specialExams.selectExamType',
    defaultMessage: 'Select Exam Type',
    description: 'Label for the field to select exam type in add allowance modal',
  },
  selectExams: {
    id: 'instruct.specialExams.selectExams',
    defaultMessage: 'Select Exam(s)',
    description: 'Label for the field to select exams in add allowance modal',
  },
  selectAllowanceType: {
    id: 'instruct.specialExams.selectAllowanceType',
    defaultMessage: 'Select Allowance Type',
    description: 'Label for the field to select allowance type in add allowance modal',
  },
  addTime: {
    id: 'instruct.specialExams.addTime',
    defaultMessage: 'Add Time',
    description: 'Label for the field to enter time value in add allowance modal',
  },
  addTimePlaceholder: {
    id: 'instruct.specialExams.addTimePlaceholder',
    defaultMessage: 'Time (minutes)',
    description: 'Placeholder for the field to enter time value in add allowance modal',
  },
  actions: {
    id: 'instruct.specialExams.actions',
    defaultMessage: 'Actions',
    description: 'ARIA label for actions button in allowances list',
  },
  proctored: {
    id: 'instruct.specialExams.proctored',
    defaultMessage: 'Proctored',
    description: 'Label for whether the special exam is proctored in the list of special exams',
  },
  timed: {
    id: 'instruct.specialExams.timed',
    defaultMessage: 'Timed',
    description: 'Label for whether the special exam is timed in the list of special exams',
  },
  timeMultiplier: {
    id: 'instruct.specialExams.timeMultiplier',
    defaultMessage: 'Time Multiplier',
    description: 'Label for the time multiplier value in the list of special exams',
  },
  additionalTime: {
    id: 'instruct.specialExams.additionalTime',
    defaultMessage: 'Additional Time',
    description: 'Label for the additional time value in the list of special exams',
  },
  reviewPolicy: {
    id: 'instruct.specialExams.reviewPolicy',
    defaultMessage: 'Review Policy Exception',
    description: 'Label for the review policy exception in the list of special exams',
  },
  exceptionPlaceholder: {
    id: 'instruct.specialExams.exceptionPlaceholder',
    defaultMessage: 'Exception',
    description: 'Placeholder for the review policy exception description in add allowance modal',
  },
  timeMultiplierPlaceholder: {
    id: 'instruct.specialExams.timeMultiplierPlaceholder',
    defaultMessage: 'Multiplier (number > 1)',
    description: 'Placeholder for the time multiplier value in add allowance modal',
  },
  edit: {
    id: 'instruct.specialExams.edit',
    defaultMessage: 'Edit',
    description: 'Label for edit action in allowance list',
  },
  delete: {
    id: 'instruct.specialExams.delete',
    defaultMessage: 'Delete',
    description: 'Label for delete action in allowance list',
  },
  deleteAllowance: {
    id: 'instruct.specialExams.deleteAllowance',
    defaultMessage: 'Delete Allowance',
    description: 'Title for delete allowance confirmation modal'
  },
  deleteConfirmation: {
    id: 'instruct.specialExams.deleteConfirmation',
    defaultMessage: 'Delete allowance for {user} for {examName}?',
    description: 'Delete confirmation message'
  },
  deleteError: {
    id: 'instruct.specialExams.deleteError',
    defaultMessage: 'An error occurred while deleting the allowance. Please try again.',
    description: 'Error message displayed when there is an issue deleting an allowance'
  },
  addAdditionalTimeGranted: {
    id: 'instruct.specialExams.addAdditionalTimeGranted',
    defaultMessage: 'Add Time',
    description: 'Label for additional time granted field in add allowance modal',
  },
  addReviewPolicyException: {
    id: 'instruct.specialExams.addReviewPolicyException',
    defaultMessage: 'Add Policy Exception',
    description: 'Label for review policy exception field in add allowance modal',
  },
  addTimeMultiplier: {
    id: 'instruct.specialExams.addTimeMultiplier',
    defaultMessage: 'Add Time Multiplier',
    description: 'Label for time multiplier field in add allowance modal',
  },
  addAllowanceError: {
    id: 'instruct.specialExams.addAllowanceError',
    defaultMessage: 'An error occurred while adding the allowance. Please try again.',
    description: 'Error message displayed when there is an issue adding a new allowance'
  },
  editAllowanceError: {
    id: 'instruct.specialExams.editAllowanceError',
    defaultMessage: 'An error occurred while editing the allowance. Please try again.',
    description: 'Error message displayed when there is an issue editing an allowance'
  },
  cannotModifyAllowance: {
    id: 'instruct.specialExams.cannotModifyAllowance',
    defaultMessage: 'Cannot {action} allowance: {username} has already attempted the exam',
    description: 'Warning message shown when trying to edit or delete an allowance for a student who has already attempted the exam'
  },
  readyForResume: {
    id: 'instruct.specialExams.readyForResume',
    defaultMessage: 'Ready to Resume?',
    description: 'Label for whether the exam attempt is ready to be resumed in the exam attempts list',
  },
  resume: {
    id: 'instruct.specialExams.resume',
    defaultMessage: 'Resume',
    description: 'Label for resume action in exam attempts list',
  },
  reset: {
    id: 'instruct.specialExams.reset',
    defaultMessage: 'Reset',
    description: 'Label for reset action in exam attempts list',
  },
  true: {
    id: 'instruct.specialExams.true',
    defaultMessage: 'True',
    description: 'Display value for a boolean true value'
  },
  successOnReset: {
    id: 'instruct.specialExams.successOnReset',
    defaultMessage: 'Successfully reset attempt on {examName} for {student}.',
    description: 'Success message shown after resetting an exam attempt'
  },
  errorOnReset: {
    id: 'instruct.specialExams.errorOnReset',
    defaultMessage: 'An error occurred while resetting the attempt. Please try again.',
    description: 'Error message shown when resetting an exam attempt fails'
  },
  close: {
    id: 'instruct.specialExams.close',
    defaultMessage: 'Close',
    description: 'Label for close button'
  },
  confirmationModal: {
    id: 'instruct.specialExams.confirmationModal',
    defaultMessage: 'Confirmation Modal',
    description: 'Confirmation modal title'
  },
  confirmationMessageReset: {
    id: 'instruct.specialExams.confirmationMessageReset',
    defaultMessage: 'Are you sure you want to remove this student\'s exam attempt?',
    description: 'Confirmation message shown when resetting an exam attempt'
  },
  confirmationMessageResume: {
    id: 'instruct.specialExams.confirmationMessageResume',
    defaultMessage: 'Are you sure you want to resume this exam attempt?',
    description: 'Confirmation message shown when resuming an exam attempt'
  },
  errorOnResume: {
    id: 'instruct.specialExams.errorOnResume',
    defaultMessage: 'An error occurred while resuming the attempt. Please try again.',
    description: 'Error message shown when resuming an exam attempt fails'
  },
  successOnResume: {
    id: 'instruct.specialExams.successOnResume',
    defaultMessage: 'Successfully resumed attempt for {student}.',
    description: 'Success message shown after resuming an exam attempt'
  },
  onboarding: {
    id: 'instruct.specialExams.onboarding',
    defaultMessage: 'Onboarding',
    description: 'Label for the student onboarding status tab'
  },
  reviewDashboard: {
    id: 'instruct.specialExams.reviewDashboard',
    defaultMessage: 'Review Dashboard',
    description: 'Label for the proctoring review dashboard tab'
  },
  enrollmentMode: {
    id: 'instruct.specialExams.enrollmentMode',
    defaultMessage: 'Enrollment Mode',
    description: 'Column header for enrollment mode in the onboarding status list'
  },
  onboardingStatus: {
    id: 'instruct.specialExams.onboardingStatus',
    defaultMessage: 'Onboarding Status',
    description: 'Column header for onboarding status in the onboarding status list'
  },
  lastUpdated: {
    id: 'instruct.specialExams.lastUpdated',
    defaultMessage: 'Last Updated',
    description: 'Column header for the last modified date in the onboarding status list'
  },
  noOnboardingStatuses: {
    id: 'instruct.specialExams.noOnboardingStatuses',
    defaultMessage: 'No onboarding statuses found',
    description: 'Message displayed when there are no onboarding statuses to show'
  },
  reviewDashboardTitle: {
    id: 'instruct.specialExams.reviewDashboardTitle',
    defaultMessage: 'Proctoring Review Dashboard',
    description: 'Accessible title for the embedded proctoring review dashboard iframe'
  }
});

export default messages;
