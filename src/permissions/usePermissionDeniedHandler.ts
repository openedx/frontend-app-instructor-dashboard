import { useCallback } from 'react';
import { useIntl } from '@openedx/frontend-base';
import { useAlert } from '@src/providers/AlertProvider';
import { isForbiddenError } from '@src/data/utils';
import messages from './messages';

/**
 * Returns a handler that surfaces a toast when an action fails with a backend
 * `403`.
 *
 * `authzPermissions` is advisory; the backend still enforces. When the frontend
 * optimistically allowed an action the backend rejects, this gives consistent
 * feedback. Use as the default `onError` for action mutations:
 *
 * @example
 * const onPermissionDenied = usePermissionDeniedHandler();
 * useMutation({ mutationFn, onError: onPermissionDenied });
 */
export const usePermissionDeniedHandler = () => {
  const intl = useIntl();
  const { showToast } = useAlert();

  return useCallback((error: unknown) => {
    if (isForbiddenError(error)) {
      showToast(intl.formatMessage(messages.permissionDeniedToast));
      return true;
    }
    return false;
  }, [intl, showToast]);
};
