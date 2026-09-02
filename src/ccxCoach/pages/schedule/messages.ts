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
  editCcxScheduleTooltip: {
    id: 'schedule.editCcxScheduleTooltip',
    defaultMessage: 'Editing CCX Schedule. To exit click Save or Cancel below',
    description: 'Tooltip shown when the edit CCX schedule button is disabled',
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
    defaultMessage: 'In UTC.',
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
  scheduleContent: {
    id: 'schedule.scheduleContent',
    defaultMessage: 'Schedule Content',
    description: 'Label for the save changes button in the scheduling dialog',
  },
  saveButton: {
    id: 'schedule.saveButton',
    defaultMessage: 'Save',
    description: 'Label for the save button in the scheduling dialog',
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
  blockTypeSection: {
    id: 'schedule.blockTypeSection',
    defaultMessage: 'Section',
    description: 'Localized label for section block type',
  },
  blockTypeSubsection: {
    id: 'schedule.blockTypeSubsection',
    defaultMessage: 'Subsection',
    description: 'Localized label for subsection block type',
  },
  blockTypeUnit: {
    id: 'schedule.blockTypeUnit',
    defaultMessage: 'Unit',
    description: 'Localized label for unit block type',
  },
  start: {
    id: 'schedule.start',
    defaultMessage: 'Start:',
    description: 'Label for the start date in the schedule',
  },
  due: {
    id: 'schedule.due',
    defaultMessage: 'Due:',
    description: 'Label for the due date in the schedule',
  },
  clickToSet: {
    id: 'schedule.clickToSet',
    defaultMessage: 'Click to set',
    description: 'Label indicating that the user can click to set a date or time',
  },
  addSection: {
    id: 'schedule.addSection',
    defaultMessage: 'Add Section',
    description: 'Label for the button to add a new section in the schedule',
  },
  addSubsection: {
    id: 'schedule.addSubsection',
    defaultMessage: 'Add Subsection',
    description: 'Label for the button to add a new subsection in the schedule',
  },
  addUnit: {
    id: 'schedule.addUnit',
    defaultMessage: 'Add Unit',
    description: 'Label for the button to add a new unit in the schedule',
  },
  willBeRemoved: {
    id: 'schedule.willBeRemoved',
    defaultMessage: '{blockType} will be removed',
    description: 'Label shown on the remove-toggle button after clicking Remove in edit mode',
  },
  undoKeep: {
    id: 'schedule.undoKeep',
    defaultMessage: 'Undo: Keep {blockType}',
    description: 'Hover label on the remove-toggle button to undo the removal',
  },
  parentWillBeRemoved: {
    id: 'schedule.parentWillBeRemoved',
    defaultMessage: '{parentType} will be removed. To add {blockType} undo removal',
    description: 'Tooltip shown when a child block Add button is disabled because an ancestor is set to be removed',
  },
});

export default messages;
