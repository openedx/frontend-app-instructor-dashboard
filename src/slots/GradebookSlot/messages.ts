import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  gradebookNotAvailableTitle: {
    id: 'ccxCoach.gradebookSlot.notAvailable.title',
    defaultMessage: 'Gradebook is not available',
    description: 'Title of the warning shown when no Gradebook widget is registered for the CCX Coach student grades slot',
  },
  gradebookNotAvailableMessage: {
    id: 'ccxCoach.gradebookSlot.notAvailable.message',
    defaultMessage: 'To view this content you need to have the Gradebook app enabled. Please contact your operator for more information.',
    description: 'Warning message shown when no Gradebook widget is registered for the CCX Coach student grades slot',
  },
  gradebookNotAvailableBackButton: {
    id: 'ccxCoach.gradebookSlot.notAvailable.backButton',
    defaultMessage: 'Go back',
    description: 'Label for the button that returns the coach to the Student Grades tab when the Gradebook is not available',
  },
});

export default messages;
