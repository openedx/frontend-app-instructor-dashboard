import { useCallback } from 'react';
import { useIntl } from '@openedx/frontend-base';
import { useAlert } from '@src/providers/AlertProvider';
import { isForbiddenError } from '@src/data/utils';
import messages from './messages';
/**
 * Returns a handler that surfaces an error modal when an action fails with a
 * backend `403`.
 *
 * Frontend permission checks are advisory; the backend still enforces. When the frontend
 * optimistically allowed an action the backend rejects, this gives consistent
 * feedback. It uses a modal rather than a toast because the dashboard reserves
 * toasts for success messages and reports errors through modals. Use as the
 * default `onError` for action mutations:
 *
 * @example
 * const onPermissionDenied = usePermissionDeniedHandler();
 * useMutation({ mutationFn, onError: onPermissionDenied });
 */
export const usePermissionDeniedHandler = () => {
  const intl = useIntl();
  const { showModal } = useAlert();
  return useCallback((error: unknown) => {
    if (isForbiddenError(error)) {
      showModal({
        message: intl.formatMessage(messages.permissionDeniedError),
        variant: 'danger',
        confirmText: intl.formatMessage(messages.closeButton),
      });
      return true;
    }
    return false;
  }, [intl, showModal]);
};
