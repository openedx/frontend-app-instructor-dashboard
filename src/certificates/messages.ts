import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  pageTitle: {
    id: 'instruct.certificates.pageTitle',
    defaultMessage: 'Certificates',
    description: 'Title for certificates page',
  },
  grantExceptionsButton: {
    id: 'instruct.certificates.grantExceptionsButton',
    defaultMessage: 'Grant Exception(s)',
    description: 'Button to grant certificate exceptions',
  },
  invalidateCertificateButton: {
    id: 'instruct.certificates.invalidateCertificateButton',
    defaultMessage: 'Invalidate Certificate',
    description: 'Button to invalidate certificates',
  },
  disableCertificatesButton: {
    id: 'instruct.certificates.disableCertificatesButton',
    defaultMessage: 'Disable Certificates',
    description: 'Button to disable certificate generation',
  },
  regenerateCertificatesButton: {
    id: 'instruct.certificates.regenerateCertificatesButton',
    defaultMessage: 'Regenerate Certificates',
    description: 'Button to regenerate certificates',
  },
  issuedCertificatesTab: {
    id: 'instruct.certificates.issuedCertificatesTab',
    defaultMessage: 'Issued Certificates',
    description: 'Tab label for issued certificates',
  },
  generationHistoryTab: {
    id: 'instruct.certificates.generationHistoryTab',
    defaultMessage: 'Certificate Generation History',
    description: 'Tab label for certificate generation history',
  },
  searchPlaceholder: {
    id: 'instruct.certificates.searchPlaceholder',
    defaultMessage: 'Search by username or email',
    description: 'Placeholder text for search input',
  },
  filterAllLearners: {
    id: 'instruct.certificates.filterAllLearners',
    defaultMessage: 'All Learners',
    description: 'Filter option for all learners',
  },
  filterReceived: {
    id: 'instruct.certificates.filterReceived',
    defaultMessage: 'Received',
    description: 'Filter option for learners who received certificates',
  },
  filterNotReceived: {
    id: 'instruct.certificates.filterNotReceived',
    defaultMessage: 'Not Received',
    description: 'Filter option for learners who did not receive certificates',
  },
  filterAuditPassing: {
    id: 'instruct.certificates.filterAuditPassing',
    defaultMessage: 'Audit - Passing',
    description: 'Filter option for audit learners who are passing',
  },
  filterAuditNotPassing: {
    id: 'instruct.certificates.filterAuditNotPassing',
    defaultMessage: 'Audit - Not Passing',
    description: 'Filter option for audit learners who are not passing',
  },
  filterErrorState: {
    id: 'instruct.certificates.filterErrorState',
    defaultMessage: 'Error State',
    description: 'Filter option for error states',
  },
  filterGrantedExceptions: {
    id: 'instruct.certificates.filterGrantedExceptions',
    defaultMessage: 'Granted Exceptions',
    description: 'Filter option for granted exceptions',
  },
  filterInvalidated: {
    id: 'instruct.certificates.filterInvalidated',
    defaultMessage: 'Invalidated',
    description: 'Filter option for invalidated certificates',
  },
  columnUsername: {
    id: 'instruct.certificates.columnUsername',
    defaultMessage: 'Username',
    description: 'Table column header for username',
  },
  columnEmail: {
    id: 'instruct.certificates.columnEmail',
    defaultMessage: 'Email',
    description: 'Table column header for email',
  },
  columnEnrollmentTrack: {
    id: 'instruct.certificates.columnEnrollmentTrack',
    defaultMessage: 'Enrollment Track',
    description: 'Table column header for enrollment track',
  },
  columnCertificateStatus: {
    id: 'instruct.certificates.columnCertificateStatus',
    defaultMessage: 'Certificate Status',
    description: 'Table column header for certificate status',
  },
  columnSpecialCase: {
    id: 'instruct.certificates.columnSpecialCase',
    defaultMessage: 'Special Case',
    description: 'Table column header for special case',
  },
  columnExceptionGranted: {
    id: 'instruct.certificates.columnExceptionGranted',
    defaultMessage: 'Exception Granted',
    description: 'Table column header for exception granted',
  },
  columnExceptionNotes: {
    id: 'instruct.certificates.columnExceptionNotes',
    defaultMessage: 'Exception Notes',
    description: 'Table column header for exception notes',
  },
  columnInvalidatedBy: {
    id: 'instruct.certificates.columnInvalidatedBy',
    defaultMessage: 'Invalidated By',
    description: 'Table column header for invalidated by',
  },
  columnInvalidationDate: {
    id: 'instruct.certificates.columnInvalidationDate',
    defaultMessage: 'Invalidation Date',
    description: 'Table column header for invalidation date',
  },
  columnInvalidationNote: {
    id: 'instruct.certificates.columnInvalidationNote',
    defaultMessage: 'Invalidation Note',
    description: 'Table column header for invalidation note',
  },
  columnActions: {
    id: 'instruct.certificates.columnActions',
    defaultMessage: 'Actions',
    description: 'Table column header for actions',
  },
  removeExceptionAction: {
    id: 'instruct.certificates.removeExceptionAction',
    defaultMessage: 'Remove Exception',
    description: 'Action menu item to remove exception',
  },
  removeInvalidationAction: {
    id: 'instruct.certificates.removeInvalidationAction',
    defaultMessage: 'Remove Invalidation',
    description: 'Action menu item to remove invalidation',
  },
  noDataMessage: {
    id: 'instruct.certificates.noDataMessage',
    defaultMessage: 'No certificates found',
    description: 'Message when no certificates are found',
  },
  exceptionRemovedToast: {
    id: 'instruct.certificates.exceptionRemovedToast',
    defaultMessage: 'Exception removed for {email}',
    description: 'Toast message when exception is removed',
  },
  invalidationRemovedToast: {
    id: 'instruct.certificates.invalidationRemovedToast',
    defaultMessage: 'The certificate for {email} has been re-validated and the system is re-running the grade for this learner.',
    description: 'Toast message when invalidation is removed',
  },
  exceptionsGrantedToast: {
    id: 'instruct.certificates.exceptionsGrantedToast',
    defaultMessage: 'Exceptions granted for {count} learner(s)',
    description: 'Toast message when exceptions are granted',
  },
  certificatesInvalidatedToast: {
    id: 'instruct.certificates.certificatesInvalidatedToast',
    defaultMessage: 'Certificates invalidated for {count} learner(s)',
    description: 'Toast message when certificates are invalidated',
  },
  grantExceptionsModalTitle: {
    id: 'instruct.certificates.grantExceptionsModalTitle',
    defaultMessage: 'Grant Certificate Exceptions',
    description: 'Title for grant exceptions modal',
  },
  grantExceptionsModalDescription: {
    id: 'instruct.certificates.grantExceptionsModalDescription',
    defaultMessage: 'Enter usernames or emails, or upload a CSV file to grant certificate exceptions.',
    description: 'Description for grant exceptions modal',
  },
  invalidateCertificateModalTitle: {
    id: 'instruct.certificates.invalidateCertificateModalTitle',
    defaultMessage: 'Invalidate Certificates',
    description: 'Title for invalidate certificate modal',
  },
  invalidateCertificateModalDescription: {
    id: 'instruct.certificates.invalidateCertificateModalDescription',
    defaultMessage: 'Enter usernames or emails, or upload a CSV file to invalidate certificates.',
    description: 'Description for invalidate certificate modal',
  },
  removeExceptionModalTitle: {
    id: 'instruct.certificates.removeExceptionModalTitle',
    defaultMessage: 'Remove Exception',
    description: 'Title for remove exception modal',
  },
  removeExceptionModalMessage: {
    id: 'instruct.certificates.removeExceptionModalMessage',
    defaultMessage: 'Are you sure you want to remove the certificate exception for {email}?',
    description: 'Message for remove exception confirmation modal',
  },
  removeInvalidationModalTitle: {
    id: 'instruct.certificates.removeInvalidationModalTitle',
    defaultMessage: 'Remove Invalidation',
    description: 'Title for remove invalidation modal',
  },
  removeInvalidationModalMessage: {
    id: 'instruct.certificates.removeInvalidationModalMessage',
    defaultMessage: 'Are you sure you want to remove invalidation for {email}?',
    description: 'Message for remove invalidation confirmation modal',
  },
  disableCertificatesModalTitle: {
    id: 'instruct.certificates.disableCertificatesModalTitle',
    defaultMessage: 'Disable Certificate Generation',
    description: 'Title for disable certificates modal',
  },
  disableCertificatesModalMessage: {
    id: 'instruct.certificates.disableCertificatesModalMessage',
    defaultMessage: 'Students will not be able to receive certificates until certificate generation is re-enabled. Are you sure you want to disable certificate generation?',
    description: 'Message for disable certificates modal',
  },
  enableCertificatesModalTitle: {
    id: 'instruct.certificates.enableCertificatesModalTitle',
    defaultMessage: 'Enable Certificate Generation',
    description: 'Title for enable certificates modal',
  },
  enableCertificatesModalMessage: {
    id: 'instruct.certificates.enableCertificatesModalMessage',
    defaultMessage: 'Are you sure you want to enable certificate generation for this course?',
    description: 'Message for enable certificates modal',
  },
  notesLabel: {
    id: 'instruct.certificates.notesLabel',
    defaultMessage: 'Notes (Optional)',
    description: 'Label for notes field',
  },
  notesPlaceholder: {
    id: 'instruct.certificates.notesPlaceholder',
    defaultMessage: 'Enter notes...',
    description: 'Placeholder for notes field',
  },
  learnersLabel: {
    id: 'instruct.certificates.learnersLabel',
    defaultMessage: 'Username or Email',
    description: 'Label for learners field',
  },
  learnersPlaceholder: {
    id: 'instruct.certificates.learnersPlaceholder',
    defaultMessage: 'Enter usernames or emails (one per line)',
    description: 'Placeholder for learners field',
  },
  cancel: {
    id: 'instruct.certificates.cancel',
    defaultMessage: 'Cancel',
    description: 'Cancel button text',
  },
  confirm: {
    id: 'instruct.certificates.confirm',
    defaultMessage: 'Confirm',
    description: 'Confirm button text',
  },
  submit: {
    id: 'instruct.certificates.submit',
    defaultMessage: 'Submit',
    description: 'Submit button text',
  },
  columnTaskName: {
    id: 'instruct.certificates.columnTaskName',
    defaultMessage: 'Task Name',
    description: 'Table column header for task name',
  },
  columnDate: {
    id: 'instruct.certificates.columnDate',
    defaultMessage: 'Date',
    description: 'Table column header for date',
  },
  columnDetails: {
    id: 'instruct.certificates.columnDetails',
    defaultMessage: 'Details',
    description: 'Table column header for details',
  },
  noTasksMessage: {
    id: 'instruct.certificates.noTasksMessage',
    defaultMessage: 'No certificate generation tasks found',
    description: 'Message when no tasks are found',
  },
  errorGrantException: {
    id: 'instruct.certificates.errorGrantException',
    defaultMessage: 'Failed to grant exceptions',
    description: 'Error message when granting exceptions fails',
  },
  errorInvalidateCertificate: {
    id: 'instruct.certificates.errorInvalidateCertificate',
    defaultMessage: 'Failed to invalidate certificates',
    description: 'Error message when invalidating certificates fails',
  },
  errorRemoveException: {
    id: 'instruct.certificates.errorRemoveException',
    defaultMessage: 'Failed to remove exception',
    description: 'Error message when removing exception fails',
  },
  errorRemoveInvalidation: {
    id: 'instruct.certificates.errorRemoveInvalidation',
    defaultMessage: 'Failed to remove invalidation',
    description: 'Error message when removing invalidation fails',
  },
  errorToggleCertificateGeneration: {
    id: 'instruct.certificates.errorToggleCertificateGeneration',
    defaultMessage: 'Failed to toggle certificate generation',
    description: 'Error message when toggling certificate generation fails',
  },
  successEnableCertificates: {
    id: 'instruct.certificates.successEnableCertificates',
    defaultMessage: 'Certificate generation enabled',
    description: 'Success message when certificate generation is enabled',
  },
  successDisableCertificates: {
    id: 'instruct.certificates.successDisableCertificates',
    defaultMessage: 'Certificate generation disabled',
    description: 'Success message when certificate generation is disabled',
  },
  certificatesDisabledMessage: {
    id: 'instruct.certificates.certificatesDisabledMessage',
    defaultMessage: 'Certificate management features are not enabled for this course. Please contact your system administrator to enable certificate generation.',
    description: 'Message displayed when certificate features are disabled',
  },
  certificatesRegeneratedToast: {
    id: 'instruct.certificates.certificatesRegeneratedToast',
    defaultMessage: 'Certificate regeneration started successfully',
    description: 'Success message when certificates are regenerated',
  },
  errorRegenerateCertificates: {
    id: 'instruct.certificates.errorRegenerateCertificates',
    defaultMessage: 'Failed to regenerate certificates',
    description: 'Error message when certificate regeneration fails',
  },
  regenerateCertificatesButtonWithFilter: {
    id: 'instruct.certificates.regenerateCertificatesButtonWithFilter',
    defaultMessage: 'Regenerate Certificates: {filter}',
    description: 'Button to regenerate certificates with filter applied',
  },
  generateCertificatesButton: {
    id: 'instruct.certificates.generateCertificatesButton',
    defaultMessage: 'Generate Certificates',
    description: 'Button to generate certificates for granted exceptions',
  },
  regenerateTooltipAllLearners: {
    id: 'instruct.certificates.regenerateTooltipAllLearners',
    defaultMessage: 'To regenerate certificates, choose a group of learners from the "All Learners" filter',
    description: 'Tooltip for regenerate button when All Learners filter is selected',
  },
  regenerateTooltipInvalidated: {
    id: 'instruct.certificates.regenerateTooltipInvalidated',
    defaultMessage: 'To regenerate certificates, choose a different group of learners from the learners filter',
    description: 'Tooltip for regenerate button when Invalidated filter is selected',
  },
  regenerateModalTitleReceived: {
    id: 'instruct.certificates.regenerateModalTitleReceived',
    defaultMessage: 'Regenerate certificates for learners who have already received certificates?',
    description: 'Title for regenerate modal when Received filter is selected',
  },
  regenerateModalMessageReceived: {
    id: 'instruct.certificates.regenerateModalMessageReceived',
    defaultMessage: 'Clicking "Regenerate" will regenerate certificates for {number} learner(s)',
    description: 'Message for regenerate modal when Received filter is selected',
  },
  regenerateModalTitleNotReceived: {
    id: 'instruct.certificates.regenerateModalTitleNotReceived',
    defaultMessage: 'Regenerate certificates for learners who have not received certificates?',
    description: 'Title for regenerate modal when Not Received filter is selected',
  },
  regenerateModalMessageNotReceived: {
    id: 'instruct.certificates.regenerateModalMessageNotReceived',
    defaultMessage: 'Clicking "Regenerate" will regenerate certificates for {number} learner(s)',
    description: 'Message for regenerate modal when Not Received filter is selected',
  },
  regenerateModalTitleAuditPassing: {
    id: 'instruct.certificates.regenerateModalTitleAuditPassing',
    defaultMessage: 'Regenerate certificates for learners with audit - passing state?',
    description: 'Title for regenerate modal when Audit Passing filter is selected',
  },
  regenerateModalMessageAuditPassing: {
    id: 'instruct.certificates.regenerateModalMessageAuditPassing',
    defaultMessage: 'Clicking "Regenerate" will regenerate certificates for {number} learner(s)',
    description: 'Message for regenerate modal when Audit Passing filter is selected',
  },
  regenerateModalTitleAuditNotPassing: {
    id: 'instruct.certificates.regenerateModalTitleAuditNotPassing',
    defaultMessage: 'Regenerate certificates for learners with audit - not passing state?',
    description: 'Title for regenerate modal when Audit Not Passing filter is selected',
  },
  regenerateModalMessageAuditNotPassing: {
    id: 'instruct.certificates.regenerateModalMessageAuditNotPassing',
    defaultMessage: 'Clicking "Regenerate" will regenerate certificates for {number} learner(s)',
    description: 'Message for regenerate modal when Audit Not Passing filter is selected',
  },
  regenerateModalTitleErrorState: {
    id: 'instruct.certificates.regenerateModalTitleErrorState',
    defaultMessage: 'Regenerate certificates for learners with an error state?',
    description: 'Title for regenerate modal when Error State filter is selected',
  },
  regenerateModalMessageErrorState: {
    id: 'instruct.certificates.regenerateModalMessageErrorState',
    defaultMessage: 'Clicking "Regenerate" will regenerate certificates for {number} learner(s)',
    description: 'Message for regenerate modal when Error State filter is selected',
  },
  generateModalTitle: {
    id: 'instruct.certificates.generateModalTitle',
    defaultMessage: 'Generate Certificates?',
    description: 'Title for generate certificates modal',
  },
  generateModalDescription: {
    id: 'instruct.certificates.generateModalDescription',
    defaultMessage: 'Generate certificates for learners who have granted exceptions? Clicking "Generate" will regenerate certificates for {number} learner(s)',
    description: 'Description for generate certificates modal',
  },
  generateOptionAll: {
    id: 'instruct.certificates.generateOptionAll',
    defaultMessage: 'All Users on the Exception list',
    description: 'Option to generate certificates for all users on exception list',
  },
  generateOptionWithoutCertificate: {
    id: 'instruct.certificates.generateOptionWithoutCertificate',
    defaultMessage: 'All Users on the Exception list who do not yet have a certificate',
    description: 'Option to generate certificates for users without certificates',
  },
  generate: {
    id: 'instruct.certificates.generate',
    defaultMessage: 'Generate',
    description: 'Generate button text',
  },
  regenerate: {
    id: 'instruct.certificates.regenerate',
    defaultMessage: 'Regenerate',
    description: 'Regenerate button text',
  },
  regenerateModalTitleDefault: {
    id: 'instruct.certificates.regenerateModalTitleDefault',
    defaultMessage: 'Regenerate Certificates?',
    description: 'Default title for regenerate modal',
  },
  regenerateModalMessageDefault: {
    id: 'instruct.certificates.regenerateModalMessageDefault',
    defaultMessage: 'Clicking "Regenerate" will regenerate certificates for {number} learner(s)',
    description: 'Default message for regenerate modal',
  },
});

export default messages;
