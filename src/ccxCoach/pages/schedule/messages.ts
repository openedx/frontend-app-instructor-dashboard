import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  schedulePageTitle: {
    id: 'schedule.pageTitle',
    defaultMessage: 'Schedule CCX',
    description: 'Title for the Schedule CCX page',
  },
  emptyScheduleMessage: {
    id: 'schedule.emptyScheduleMessage',
    defaultMessage: 'You currently have no content scheduled.',
    description: 'Message displayed when there is no content in the schedule page',
  },
  editCcxSchedule: {
    id: 'schedule.editCcxSchedule',
    defaultMessage: 'Edit CCX Schedule',
    description: 'Button label for editing the CCX schedule',
  },
  subsectionDialogTitle: {
    id: 'schedule.subsectionDialogTitle',
    defaultMessage: 'Schedule Subsection',
    description: 'Title for the Schedule Subsection dialog',
  },
  sectionDialogTitle: {
    id: 'schedule.sectionDialogTitle',
    defaultMessage: 'Schedule Section',
    description: 'Title for the Schedule Section dialog',
  },
  setDates: {
    id: 'schedule.setDates',
    defaultMessage: 'Set Dates',
    description: 'Label for the section where users can set dates for scheduling',
  },
  UTCDescription: {
    id: 'schedule.UTCDescription',
    defaultMessage: 'In UTC; please specify MM/DD/YYYY HH:MM.',
    description: 'Description indicating that all dates and times are in UTC',
  },
  startDate: {
    id: 'schedule.startDate',
    defaultMessage: 'Specify the Start Date and Time',
    description: 'Label for the start date input field',
  },
  endDate: {
    id: 'schedule.endDate',
    defaultMessage: 'Specify the Due Date and Time (optional)',
    description: 'Label for the end date input field',
  },
  cancelButton: {
    id: 'schedule.cancelButton',
    defaultMessage: 'Cancel',
    description: 'Label for the cancel button in the scheduling dialog',
  },
  saveButton: {
    id: 'schedule.saveButton',
    defaultMessage: 'Schedule Content',
    description: 'Label for the save changes button in the scheduling dialog',
  },
  removeDialogTitle: {
    id: 'schedule.removeDialogTitle',
    defaultMessage: 'Remove {blockType}?',
    description: 'Title for the Remove Scheduled Content dialog',
  },
  removeConfirmation: {
    id: 'schedule.removeConfirmation',
    defaultMessage: 'Removing {blockType} will unschedule all content contained in the {blockType}',
    description: 'Confirmation message for removing scheduled content',
  },
  removeButton: {
    id: 'schedule.removeButton',
    defaultMessage: 'Remove {blockType}',
    description: 'Label for the remove button in the Remove Scheduled Content dialog',
  },
});

export default messages;
