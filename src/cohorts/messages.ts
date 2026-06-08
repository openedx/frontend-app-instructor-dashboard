import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  cohortsTitle: {
    id: 'instruct.cohorts.title',
    defaultMessage: 'Cohorts',
    description: 'Title for the cohorts page'
  },
  addCohort: {
    id: 'instruct.cohorts.addCohort',
    defaultMessage: 'Add Cohort',
    description: 'Button label for adding a new cohort'
  },
  disableMessage: {
    id: 'instruct.cohorts.disableModal.disableMessage',
    defaultMessage: 'Disable Cohorts? Disabling cohorts while a course is in progress will cause an unexpected change for your learners.',
    description: 'Message displayed in the disable cohorts confirmation modal'
  },
  cancelLabel: {
    id: 'instruct.cohorts.disableModal.cancelLabel',
    defaultMessage: 'Cancel',
    description: 'Label for the cancel button in the disable cohorts modal'
  },
  disableLabel: {
    id: 'instruct.cohorts.disableModal.disableLabel',
    defaultMessage: 'Disable',
    description: 'Label for the disable button in the disable cohorts modal'
  },
  noCohortsMessage: {
    id: 'instruct.cohorts.noCohortsMessage',
    defaultMessage: 'You can use Cohorts to create smaller communities in your course, or to design different course experiences for different groups of learners.',
    description: 'Message displayed when there are no cohorts'
  },
  learnMore: {
    id: 'instruct.cohorts.learnMore',
    defaultMessage: 'Learn more',
    description: 'Label for the learn more link'
  },
  enableCohorts: {
    id: 'instruct.cohorts.enableCohorts',
    defaultMessage: 'Enable Cohorts',
    description: 'Label for the enable cohorts button'
  },
  disableCohorts: {
    id: 'instruct.cohorts.disableCohorts',
    defaultMessage: 'Disable Cohorts',
    description: 'Label for the disable cohorts button'
  },
  selectCohortPlaceholder: {
    id: 'instruct.cohorts.selectCohortPlaceholder',
    defaultMessage: 'Select a cohort',
    description: 'Placeholder text for the select cohort dropdown'
  },
  cohortName: {
    id: 'instruct.cohorts.cohortName',
    defaultMessage: 'Cohort Name',
    description: 'Label for the cohort name input field'
  },
  saveLabel: {
    id: 'instruct.cohorts.saveLabel',
    defaultMessage: 'Save',
    description: 'Label for the save button'
  },
  cohortAssignmentMethod: {
    id: 'instruct.cohorts.addForm.cohortAssignmentMethod',
    defaultMessage: 'Cohort Assignment Method',
    description: 'Label for the cohort assignment method section'
  },
  automatic: {
    id: 'instruct.cohorts.addForm.automatic',
    defaultMessage: 'Automatic',
    description: 'Label for the automatic cohort assignment method option'
  },
  manual: {
    id: 'instruct.cohorts.addForm.manual',
    defaultMessage: 'Manual',
    description: 'Label for the manual cohort assignment method option'
  },
  associatedContentGroup: {
    id: 'instruct.cohorts.addForm.associatedContentGroup',
    defaultMessage: 'Associated Content Group',
    description: 'Label for the associated content group section'
  },
  noContentGroup: {
    id: 'instruct.cohorts.addForm.noContentGroup',
    defaultMessage: 'No Content Group',
    description: 'Label for the no content group option'
  },
  selectAContentGroup: {
    id: 'instruct.cohorts.addForm.selectAContentGroup',
    defaultMessage: 'Select a Content Group',
    description: 'Label for the select a content group option'
  },
  notSelected: {
    id: 'instruct.cohorts.addForm.notSelected',
    defaultMessage: 'Not Selected',
    description: 'Label for the not selected content group option'
  },
  noContentGroups: {
    id: 'instruct.cohorts.addForm.noContentGroups',
    defaultMessage: 'No content groups exist.',
    description: 'Message displayed when there are no content groups'
  },
  createContentGroup: {
    id: 'instruct.cohorts.addForm.createContentGroup',
    defaultMessage: 'Create a content group',
    description: 'Label for the create a content group link'
  },
  addCohortSuccessMessage: {
    id: 'instruct.cohorts.addForm.successMessage',
    defaultMessage: 'The {cohortName} cohort has been created. You can manually add students to this cohort below.',
    description: 'Success message displayed when a new cohort is added'
  },
  cohortDisclaimer: {
    id: 'instruct.cohorts.cohortDisclaimer',
    defaultMessage: 'To review learner cohort assignments or see the results of uploading a CSV file, download course profile information or cohort results on the',
    description: 'Disclaimer message for cohorts'
  },
  page: {
    id: 'instruct.cohorts.page',
    defaultMessage: 'page',
    description: 'Label for the page link'
  },
  settings: {
    id: 'instruct.cohorts.settings',
    defaultMessage: 'Settings',
    description: 'Label for the settings tab'
  },
  manageLearners: {
    id: 'instruct.cohorts.manageLearners',
    defaultMessage: 'Manage Learners',
    description: 'Label for the manage learners tab'
  },
  studentsOnCohort: {
    id: 'instruct.cohorts.studentsOnCohort',
    defaultMessage: '(contains {users} students)',
    description: 'Label showing the number of students on this cohort'
  },
  automaticCohortWarning: {
    id: 'instruct.cohorts.automaticCohortWarning',
    defaultMessage: 'Learners are added to this cohort automatically.',
    description: 'Warning about automatic cohort assignment'
  },
  manualCohortWarning: {
    id: 'instruct.cohorts.manualCohortWarning',
    defaultMessage: 'Learners are added to this cohort only when you provide their email addresses or usernames on this page.',
    description: 'Warning about manual cohort assignment'
  },
  warningCohortLink: {
    id: 'instruct.cohorts.warningCohortLink',
    defaultMessage: 'What does this mean?',
    description: 'Link text for more information about cohort assignment'
  },
  cohortUpdateSuccessMessage: {
    id: 'instruct.cohorts.cohortUpdateSuccessMessage',
    defaultMessage: 'Settings have been saved.',
    description: 'Success message displayed when a cohort is updated'
  },
  addLearnersTitle: {
    id: 'instruct.cohorts.addLearnersTitle',
    defaultMessage: 'Add Learners to this cohort',
    description: 'Title for the add learners section'
  },
  addLearnersSubtitle: {
    id: 'instruct.cohorts.addLearnersSubtitle',
    defaultMessage: 'Note: Learners can be in only one cohort. Adding learners to this group overrides any previous group assignment.',
    description: 'Subtitle for the add learners section'
  },
  addLearnersInstructions: {
    id: 'instruct.cohorts.addLearnersInstructions',
    defaultMessage: 'Enter email addresses and/or usernames, separated by new lines or commas, for the learners you want to add.*',
    description: 'Instructions for adding learners to a cohort'
  },
  addLearnersFootnote: {
    id: 'instruct.cohorts.addLearnersFootnote',
    defaultMessage: 'You will not receive notification for emails that bounce, so double-check your spelling.',
    description: 'Footnote for adding learners to a cohort'
  },
  learnersExample: {
    id: 'instruct.cohorts.learnersExample',
    defaultMessage: 'e.g. johndoe@example.com, JaneDoe, Joeydoe@example.com',
    description: 'Placeholder for the learners example'
  },
  addLearnersLabel: {
    id: 'instruct.cohorts.addLearnersLabel',
    defaultMessage: 'Add Learners',
    description: 'Label for the add learners button'
  },
  manualAssignmentDisabledTooltip: {
    id: 'instruct.cohorts.manualAssignmentDisabledTooltip',
    defaultMessage: 'There must be one cohort to which students can automatically be assigned.',
    description: 'Tooltip message when manual assignment is disabled'
  },
  addLearnersSuccessMessage: {
    id: 'instruct.cohorts.addLearnersSuccessMessage',
    defaultMessage: '{countLearners} learners have been added to this cohort.',
    description: 'Success message displayed when learners are added to a cohort'
  },
  addLearnersErrorMessage: {
    id: 'instruct.cohorts.addLearnersErrorMessage',
    defaultMessage: '{countLearners} learners could not be added to this cohort.',
    description: 'Error message displayed when there is an issue adding learners to a cohort'
  },
  addLearnersWarningMessage: {
    id: 'instruct.cohorts.addLearnersWarningMessage',
    defaultMessage: '{countLearners} were pre-assigned for this cohort. This learner will automatically be added to the cohort when they enroll in the course.',
    description: 'Warning message displayed when some learners could not be added to a cohort'
  },
  existingLearner: {
    id: 'instruct.cohorts.existingLearner',
    defaultMessage: '{learner} learner was already in the cohort.',
    description: 'Message indicating that a learner is already assigned to a cohort'
  },
  unknownLearner: {
    id: 'instruct.cohorts.unknownLearner',
    defaultMessage: 'Unknown username or email: {learner}',
    description: 'Message indicating that a learner is not recognized in the course'
  },
  downloadCSVCaption: {
    id: 'instruct.cohorts.downloadCSVCaption',
    defaultMessage: 'Assign learners to cohorts by uploading a CSV file',
    description: 'Caption for the learners CSV upload collapsible section'
  },
  uploadSuccessMessage: {
    id: 'instruct.cohorts.uploadSuccessMessage',
    defaultMessage: 'Your file {fileName} has been uploaded. Allow a few minutes for processing.',
    description: 'Message displayed when learners are successfully added to cohorts via CSV upload'
  },
  noFileFoundMessage: {
    id: 'instruct.cohorts.noFileFoundMessage',
    defaultMessage: 'No file found in upload data. Please try again.',
    description: 'Error message displayed when no file is found in the uploaded data'
  },
  closeButton: {
    id: 'instruct.cohorts.closeButton',
    defaultMessage: 'Close',
    description: 'Label for the close button'
  },
  enableCohortError: {
    id: 'instruct.cohorts.enableCohortError',
    defaultMessage: 'An error occurred while enabling cohorts. Please try again later.',
    description: 'Error message displayed when enabling cohorts fails'
  },
  disableCohortError: {
    id: 'instruct.cohorts.disableCohortError',
    defaultMessage: 'An error occurred while disabling cohorts. Please try again later.',
    description: 'Error message displayed when disabling cohorts fails'
  },
  editCohortError: {
    id: 'instruct.cohorts.editCohortError',
    defaultMessage: 'An error occurred while saving your changes. Please try again later.',
    description: 'Error message displayed when editing a cohort fails'
  }
});

export default messages;
