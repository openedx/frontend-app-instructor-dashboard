import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  disabledActionTooltip: {
    id: 'instruct.permissions.disabledAction.tooltip',
    defaultMessage: "You don't have permission to perform this action.",
    description: 'Tooltip shown when an action is disabled because the user lacks permission',
  },
  permissionDeniedError: {
    id: 'instruct.permissions.denied.error',
    defaultMessage: "You don't have permission to perform this action.",
    description: 'Error modal message shown when a backend request is rejected with 403 for lack of permission',
  },
  closeButton: {
    id: 'instruct.permissions.denied.closeButton',
    defaultMessage: 'Close',
    description: 'Label for the button that dismisses the permission denied error modal',
  },
  viewOnlyAlert: {
    id: 'instruct.permissions.viewOnly.alert',
    defaultMessage: 'You have view-only access to this page. Contact your course administrator to request edit permissions.',
    description: 'Alert shown on a dashboard page when the user can view it but cannot perform any of its actions',
  },
});

export default messages;
