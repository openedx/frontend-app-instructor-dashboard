import {
  Children, cloneElement, isValidElement, ReactElement, ReactNode, FC,
} from 'react';
import { OverlayTrigger, Tooltip } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import { usePermissionContext } from './PermissionContext';
import messages from './messages';

export interface PermissionGateProps {
  /** A single required permission. Mutually exclusive with `anyOf`. */
  permission?: string;
  /** The gate opens if the user holds at least one of these permissions. */
  anyOf?: string[];
  /**
   * How to treat the gated content when the permission is denied:
   * - `hide` (default): render `fallback` instead of the children.
   * - `disable`: render the children disabled, with a tooltip explaining why.
   */
  mode?: 'hide' | 'disable';
  /** Rendered in `hide` mode when denied. Defaults to nothing. */
  fallback?: ReactNode;
  /** Rendered while permissions are loading. Defaults to nothing. */
  loading?: ReactNode;
  children: ReactNode;
}

/**
 * Show, hide, or disable content based on the user's AuthZ permissions.
 *
 * @example
 * <PermissionGate permission="courses.enroll_learners">
 *   <EnrollButton />
 * </PermissionGate>
 *
 * @example
 * <PermissionGate permission="courses.enroll_learners" mode="disable">
 *   <Button>Enroll</Button>
 * </PermissionGate>
 */
const PermissionGate: FC<PermissionGateProps> = ({
  permission,
  anyOf,
  mode = 'hide',
  fallback = null,
  loading = null,
  children,
}) => {
  const intl = useIntl();
  const { permissions, isLoading } = usePermissionContext();
  const toCheck = anyOf ?? (permission ? [permission] : []);

  // Resolve against the shared context map (not a hook loop, so the number of
  // hooks stays constant even as `anyOf` changes).
  // - No permission to check: no-op, render children.
  // - Field absent entirely (flag off, pre-rollout): permissive.
  // - Field present: allowed if any required permission is true.
  const allowed = toCheck.length === 0
    || permissions === undefined
    || toCheck.some(p => permissions[p] === true);

  if (isLoading) {
    return <>{loading}</>;
  }

  if (allowed) {
    return <>{children}</>;
  }

  if (mode === 'disable') {
    return (
      <OverlayTrigger
        placement="top"
        overlay={(
          <Tooltip id="permission-gate-disabled-tooltip">
            {intl.formatMessage(messages.disabledActionTooltip)}
          </Tooltip>
        )}
      >
        <span className="d-inline-block">
          {Children.map(children, child => (
            isValidElement(child)
              ? cloneElement(child as ReactElement, { disabled: true })
              : child
          ))}
        </span>
      </OverlayTrigger>
    );
  }

  return <>{fallback}</>;
};

export default PermissionGate;
