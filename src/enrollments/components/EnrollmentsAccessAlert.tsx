import { useIntl } from '@openedx/frontend-base';
import { Alert } from '@openedx/paragon';
import { Lock } from '@openedx/paragon/icons';
import messages from '@src/enrollments/messages';
import { EnrollmentsAccess } from '@src/enrollments/types';

/**
 * Explains why some enrollment actions are missing, so the user knows to ask an
 * administrator instead of assuming the page is broken.
 *
 * Only the combinations that confuse users get a message: view-only, enroll
 * without unenroll, and unenroll without enroll. Having both actions, or holding
 * only the beta tester permission, shows nothing.
 */
const EnrollmentsAccessAlert = ({ access }: { access: EnrollmentsAccess }) => {
  const intl = useIntl();
  const { canEnroll, canUnenroll, canManageBetaTesters } = access;

  let message;
  if (canEnroll && !canUnenroll) {
    message = messages.enrollOnlyAccessAlert;
  } else if (canUnenroll && !canEnroll) {
    message = messages.unenrollOnlyAccessAlert;
  } else if (!canEnroll && !canUnenroll && !canManageBetaTesters) {
    message = messages.viewOnlyAccessAlert;
  }

  if (!message) {
    return null;
  }

  return (
    <Alert variant="info" icon={Lock} className="mt-3">
      {intl.formatMessage(message)}
    </Alert>
  );
};

export default EnrollmentsAccessAlert;
