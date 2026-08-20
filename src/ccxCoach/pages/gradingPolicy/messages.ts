import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  gradingPolicyPageTitle: {
    id: 'gradingPolicy.pageTitle',
    defaultMessage: 'Grading Policy',
    description: 'Title for the Grading Policy page',
  },
  warningTitle: {
    id: 'gradingPolicy.warningTitle',
    defaultMessage: 'Warning',
    description: 'Title for warning section in the Grading Policy page',
  },
  warningMessage: {
    id: 'gradingPolicy.warningMessage',
    defaultMessage: 'For advanced users only. Errors in the grading policy can lead to the course failing to display. This form does not check the validity of the policy before saving.',
    description: 'Message for warning section in the Grading Policy page',
  },
  warningFooter: {
    id: 'gradingPolicy.warningFooter',
    defaultMessage: 'Most coaches should not need to make changes to the grading policy.',
    description: 'Footer message for warning section in the Grading Policy page',
  },
  discardButton: {
    id: 'gradingPolicy.discardButton',
    defaultMessage: 'Discard Changes',
    description: 'Label for the discard changes button in the Grading Policy page',
  },
  saveButton: {
    id: 'gradingPolicy.saveButton',
    defaultMessage: 'Save Grading Policy',
    description: 'Label for the save changes button in the Grading Policy page',
  },
  saveSuccess: {
    id: 'gradingPolicy.saveSuccess',
    defaultMessage: 'Grading policy saved successfully.',
    description: 'Message displayed when the grading policy is saved successfully',
  },
  saveError: {
    id: 'gradingPolicy.saveError',
    defaultMessage: 'An error occurred while saving the grading policy. Please try again.',
    description: 'Message displayed when there is an error saving the grading policy',
  },
  closeButton: {
    id: 'gradingPolicy.closeButton',
    defaultMessage: 'Close',
    description: 'Label for the close button in the Grading Policy page',
  },
  cancelButton: {
    id: 'gradingPolicy.cancelButton',
    defaultMessage: 'Cancel',
    description: 'Label for the cancel button in the Grading Policy page',
  },
  confirmationMessage: {
    id: 'gradingPolicy.confirmationMessage',
    defaultMessage: 'Errors in the grading policy can lead to the course failing to display. This form does not check the validity of the policy before saving.',
    description: 'Confirmation message displayed when saving changes to the grading policy',
  },
});

export default messages;
