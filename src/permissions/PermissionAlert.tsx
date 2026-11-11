import { ReactNode } from 'react';
import { useIntl } from '@openedx/frontend-base';
import { Alert } from '@openedx/paragon';
import { Lock } from '@openedx/paragon/icons';
import messages from './messages';

export interface PermissionAlertProps {
  className?: string;
  /** Replaces the default view-only message, e.g. when only some actions are missing. */
  children?: ReactNode;
}

/**
 * Explains why actions are missing from a page, so the user knows to ask an
 * administrator instead of assuming the page is broken.
 *
 * Pair it with hiding the controls the user lacks permission for: this alert only
 * explains their absence, it enforces nothing. The caller decides when to render it.
 *
 * It renders inline rather than through `AlertProvider` because it must stay visible
 * for as long as the permissions apply: `AlertOutlet` alerts are dismissible and are
 * cleared whenever a modal opens.
 *
 * Shows a generic view-only message by default. Pass `children` when the user holds
 * some of the page's actions and needs copy that says which ones are missing.
 */
const PermissionAlert = ({ className, children }: PermissionAlertProps) => {
  const intl = useIntl();
  return (
    <Alert variant="info" icon={Lock} className={className}>
      {children ?? intl.formatMessage(messages.viewOnlyAlert)}
    </Alert>
  );
};

export default PermissionAlert;
