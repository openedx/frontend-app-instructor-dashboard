import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  enrollmentsPageTitle: {
    id: 'instruct.enrollments.page.title',
    defaultMessage: 'Enrollment Management',
    description: 'Title for the enrollments page',
  },
  addBetaTesters: {
    id: 'instruct.enrollments.addBetaTesters',
    defaultMessage: 'Add Beta Testers',
    description: 'Button label for adding beta testers',
  },
  enrollLearners: {
    id: 'instruct.enrollments.enrollLearners',
    defaultMessage: 'Enroll Learners',
    description: 'Button label and modal title for enrolling learners',
  },
  checkEnrollmentStatus: {
    id: 'instruct.enrollments.checkEnrollmentStatus',
    defaultMessage: 'Check Enrollment Status',
    description: 'Check enrollment status modal title and alt for icon button',
  },
  username: {
    id: 'instruct.enrollments.username',
    defaultMessage: 'Username',
    description: 'Column header for username in enrollments list',
  },
  fullName: {
    id: 'instruct.enrollments.fullName',
    defaultMessage: 'Name',
    description: 'Column header for full name in enrollments list',
  },
  email: {
    id: 'instruct.enrollments.email',
    defaultMessage: 'Email',
    description: 'Column header for email in enrollments list',
  },
  track: {
    id: 'instruct.enrollments.track',
    defaultMessage: 'Track',
    description: 'Column header for track in enrollments list',
  },
  betaTester: {
    id: 'instruct.enrollments.betaTester',
    defaultMessage: 'Beta Tester',
    description: 'Column header for beta tester status in enrollments list',
  },
  actions: {
    id: 'instruct.enrollments.actions',
    defaultMessage: 'Actions',
    description: 'Column header for actions in enrollments list',
  },
  unenrollButton: {
    id: 'instruct.enrollments.unenrollButton',
    defaultMessage: 'Unenroll',
    description: 'Button label for unenrolling a learner',
  },
  trueLabel: {
    id: 'instruct.enrollments.trueLabel',
    defaultMessage: 'True',
    description: 'Label for true boolean value',
  },
  addLearnerInstructions: {
    id: 'instruct.enrollments.modals.checkEnrollmentStatus.addLearnerInstructions',
    defaultMessage: 'Enter email addresses and/or usernames separated by new lines or commas. You will not get notification for emails that bounce, so please double-check spelling.',
    description: 'Instructions for enrolling learners to the course',
  },
  enrollmentStatusInstructions: {
    id: 'instruct.enrollments.modals.checkEnrollmentStatus.enrollmentStatusInstructions',
    defaultMessage: 'Enter email address or username. An incorrect or misspelled email address may result in an inaccurate status, please double-check spelling.',
    description: 'Instructions for checking enrollment status of a learner in the course',
  },
  enrollmentStatusPlaceholder: {
    id: 'instruct.enrollments.modals.checkEnrollmentStatus.enrollmentStatusPlaceholder',
    defaultMessage: 'Learner email address or username',
    description: 'Placeholder text for enrolling learners textarea',
  },
  closeButton: {
    id: 'instruct.enrollments.modals.closeButton',
    defaultMessage: 'Close',
    description: 'Label for close button in modals',
  },
  searchPlaceholder: {
    id: 'instruct.enrollments.searchPlaceholder',
    defaultMessage: 'Search enrollments',
    description: 'Placeholder for the search input in enrollments list',
  },
  noEnrollments: {
    id: 'instruct.enrollments.noEnrollments',
    defaultMessage: 'No enrollments found',
    description: 'Message displayed when there are no enrollments to show',
  },
  changeBetaTesterStatus: {
    id: 'instruct.enrollments.changeBetaTesterStatus',
    defaultMessage: 'Change Beta Tester Status',
    description: 'Alt text for change beta tester status icon button',
  },
  grantBetaTester: {
    id: 'instruct.enrollments.grantBetaTester',
    defaultMessage: 'Grant Beta Tester Role',
    description: 'Menu option to grant beta tester status',
  },
  revokeBetaTester: {
    id: 'instruct.enrollments.revokeBetaTester',
    defaultMessage: 'Remove Beta Tester Role',
    description: 'Menu option to revoke beta tester status',
  },
  allEnrollees: {
    id: 'instruct.enrollments.allEnrollees',
    defaultMessage: 'All Enrollees',
    description: 'Option for showing all enrollees in beta tester filter',
  },
  betaTesters: {
    id: 'instruct.enrollments.betaTesters',
    defaultMessage: 'Beta Testers',
    description: 'Option for showing only beta testers in beta tester filter',
  },
  nonBetaTesters: {
    id: 'instruct.enrollments.nonBetaTesters',
    defaultMessage: 'Non-Beta Testers',
    description: 'Option for showing only non-beta testers in beta tester filter',
  },
  statusResponseMessage: {
    id: 'instruct.enrollments.modals.checkEnrollmentStatus.statusResponseMessage',
    defaultMessage: 'Enrollment status for {learnerIdentifier}: {status}',
    description: 'Message displaying the enrollment status for a learner',
  },
  userIdentifierPlaceholder: {
    id: 'instruct.enrollments.modals.enrollLearners.userIdentifierPlaceholder',
    defaultMessage: 'Email addresses / Usernames',
    description: 'Placeholder text for enrolling learners textarea',
  },
  enrollLearnerInstructions: {
    id: 'instruct.enrollments.modals.enrollLearners.enrollLearnerInstructions',
    defaultMessage: 'Enter email addresses and/or usernames separated by new lines or commas. You will not get notification for emails that bounce, so please double-check spelling.',
    description: 'Instructions for enrolling learners to the course',
  },
  unenrollLearners: {
    id: 'instruct.enrollments.modals.unenrollLearners',
    defaultMessage: 'Unenroll Learners',
    description: 'Title for unenroll learners modal',
  },
  unenrollLearnersConfirmation: {
    id: 'instruct.enrollments.modals.unenrollLearnersConfirmation',
    defaultMessage: 'Unenroll {name} from course?',
    description: 'Confirmation message for unenrolling learners',
  },
  unenrollLearnerTitle: {
    id: 'instruct.enrollments.modals.unenrollLearnerTitle',
    defaultMessage: 'Unenroll Learner?',
    description: 'Title for unenroll learner modal',
  },
  saveButton: {
    id: 'instruct.enrollments.modals.saveButton',
    defaultMessage: 'Save',
    description: 'Label for save button in modals',
  },
  cancelButton: {
    id: 'instruct.enrollments.modals.cancelButton',
    defaultMessage: 'Cancel',
    description: 'Label for cancel button in modals',
  },
  autoEnrollCheckbox: {
    id: 'instruct.enrollments.modals.autoEnrollCheckbox',
    defaultMessage: 'Auto Enroll',
    description: 'Label for auto enroll checkbox in enroll learners modal',
  },
  notifyUsersCheckbox: {
    id: 'instruct.enrollments.modals.notifyUsersCheckbox',
    defaultMessage: 'Notify Users by Email',
    description: 'Label for notify users by email checkbox in enroll learners modal',
  },
  enrollLearnerError: {
    id: 'instruct.enrollments.modals.enrollLearnerError',
    defaultMessage: 'An error occurred while enrolling learners. Please try again.',
    description: 'Error message displayed when enrolling learners fails',
  },
  unenrollLearnerError: {
    id: 'instruct.enrollments.modals.unenrollLearnerError',
    defaultMessage: 'An error occurred while unenrolling learner. Please try again.',
    description: 'Error message displayed when unenrolling learner fails',
  },
  enrollLearnerNotFoundError: {
    id: 'instruct.enrollments.modals.enrollLearnerNotFoundError',
    defaultMessage: 'One or more learners were not found. Please check the email addresses or usernames and try again.',
    description: 'Error message displayed when enrolling learners fails due to learner not found',
  },
  addBetaTestersInstructions: {
    id: 'instruct.enrollments.modals.addBetaTesters.addBetaTestersInstructions',
    defaultMessage: 'Enter email addresses and/or usernames separated by new lines or commas. Note: Users must have an activated My Open edX account before they can be enrolled as beta testers.',
    description: 'Instructions for adding beta testers to the course',
  },
  failedEnrollLearners: {
    id: 'instruct.enrollments.modals.enrollLearners.failedEnrollLearners',
    defaultMessage: 'The following usernames and/or email addresses are invalid. All other learners have been enrolled.',
    description: 'Message displaying the learners that could not be enrolled',
  },
  unknownLearner: {
    id: 'instruct.enrollments.unknownLearner',
    defaultMessage: 'Unknown learner: {learner}',
    description: 'Displayed when a learner does not have a full name or username available',
  },
  removeBetaTesterError: {
    id: 'instruct.enrollments.modals.removeBetaTesters.removeBetaTesterError',
    defaultMessage: 'Error removing user as beta tester.',
    description: 'Error message displayed when removing beta testers fails',
  },
  failedBetaTesters: {
    id: 'instruct.enrollments.modals.addBetaTesters.failedBetaTesters',
    defaultMessage: 'The following usernames and/or email addresses are invalid. All other beta testers have been added.',
    description: 'Message displaying the learners that could not be added as beta testers',
  },
  inactiveUsers: {
    id: 'instruct.enrollments.modals.addBetaTesters.inactiveUsers',
    defaultMessage: 'The following users are inactive. They have been added as beta testers, but may not have access to the course until their accounts are active.',
    description: 'Message displaying the learners that are inactive when adding beta testers',
  },
  inactiveLearner: {
    id: 'instruct.enrollments.inactiveLearner',
    defaultMessage: 'Inactive learner: {learner}',
    description: 'Displayed when a learner is inactive',
  },
  addBetaTesterError: {
    id: 'instruct.enrollments.modals.addBetaTesters.addBetaTesterError',
    defaultMessage: 'Error adding users as beta testers.',
    description: 'Error message displayed when adding beta testers fails',
  },
  removeBetaTesterTitle: {
    id: 'instruct.enrollments.modals.removeBetaTester',
    defaultMessage: 'Revoke access?',
    description: 'Title for remove beta tester modal',
  },
  removeBetaTesterDescription: {
    id: 'instruct.enrollments.modals.removeBetaTesterDescription',
    defaultMessage: 'Revoke Beta Tester access?',
    description: 'Description for remove beta tester modal',
  },
  revoke: {
    id: 'instruct.enrollments.revoke',
    defaultMessage: 'Revoke',
    description: 'Button label for revoking access',
  }
});

export default messages;
