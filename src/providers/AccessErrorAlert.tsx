import { Alert } from '@openedx/paragon';
import { Error as ErrorIcon } from '@openedx/paragon/icons';
import { useIntl } from '@openedx/frontend-base';
import messages from '@src/providers/messages';

export type AccessErrorAlertType = 'forbidden' | 'unauthorized' | 'generic';

const errorMessages = {
  unauthorized: {
    heading: messages.unauthorizedErrorHeading,
    message: messages.unauthorizedErrorMessage,
  },
  forbidden: {
    heading: messages.forbiddenErrorHeading,
    message: messages.forbiddenErrorMessage,
  },
  generic: {
    heading: messages.genericErrorHeading,
    message: messages.genericErrorMessage,
  },
};

interface AccessErrorAlertProps {
  errorType: AccessErrorAlertType;
}

/**
 * Presentational alert for access errors. It is shared by `AccessErrorGuard`,
 * which shows it for the whole dashboard, and by views that deny only their own
 * content (for example a tab the user lacks the permission for). A view must not
 * set the dashboard-wide error for that case, because `InstructorNav` hides every
 * tab while an error is set and the user could not leave the page.
 */
const AccessErrorAlert = ({ errorType }: AccessErrorAlertProps) => {
  const intl = useIntl();
  const { heading, message } = errorMessages[errorType];

  return (
    <Alert variant="danger" icon={ErrorIcon}>
      <Alert.Heading>{intl.formatMessage(heading)}</Alert.Heading>
      <p>{intl.formatMessage(message)}</p>
    </Alert>
  );
};

export default AccessErrorAlert;
