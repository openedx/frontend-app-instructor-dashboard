import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  disabledActionTooltip: {
    id: 'instruct.permissions.disabledAction.tooltip',
    defaultMessage: "You don't have permission to perform this action.",
    description: 'Tooltip shown when an action is disabled because the user lacks permission',
  },
  permissionDeniedToast: {
    id: 'instruct.permissions.denied.toast',
    defaultMessage: "You don't have permission to perform this action.",
    description: 'Toast shown when a backend request is rejected with 403 for lack of permission',
  },
  viewOnlyAlert: {
    id: 'instruct.permissions.viewOnly.alert',
    defaultMessage: 'You have view-only access to this page. To make changes, contact your course administrator.',
    description: 'Alert shown on a dashboard page when the user can view it but cannot perform any of its actions',
  },
});

export default messages;
