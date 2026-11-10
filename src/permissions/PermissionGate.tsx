import {
  Children, cloneElement, isValidElement, useId, ReactElement, ReactNode, FC,
} from 'react';
import { OverlayTrigger, Tooltip } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import { useCoursePermissions } from './useCoursePermissions';
import { PermissionId } from './types';
import messages from './messages';

interface PermissionGateBaseProps {
  /**
   * How to treat the gated content when the permission is denied:
   * - `hide` (default): render `fallback` instead of the children.
   * - `disable`: render the children disabled, with a tooltip explaining why.
   *   Only works for children that accept a `disabled` prop (e.g. a Button).
   *   Fragments, links, and components that ignore `disabled` stay interactive.
   */
  mode?: 'hide' | 'disable';
  /** Rendered in `hide` mode when denied. Defaults to nothing. */
  fallback?: ReactNode;
  /** Rendered while permissions are loading. Defaults to nothing. */
  loading?: ReactNode;
  children: ReactNode;
}

/**
 * `permission` and `anyOf` are mutually exclusive. Passing neither means there
 * is nothing to check, so the children render.
 */
export type PermissionGateProps = PermissionGateBaseProps & (
  | {
    /** A single required permission. */
    permission: PermissionId;
    anyOf?: never;
  }
  | {
    /**
     * The gate opens if the user holds at least one of these permissions.
     * An empty list denies, so a list built at runtime never opens the gate by accident.
     */
    anyOf: PermissionId[];
    permission?: never;
  }
  | { permission?: never; anyOf?: never }
);

/**
 * Show, hide, or disable content based on the user's AuthZ permissions.
 *
 * @example
 * <PermissionGate permission={COURSE_PERMISSIONS.ENROLL_LEARNERS}>
 *   <EnrollButton />
 * </PermissionGate>
 *
 * @example
 * <PermissionGate permission={COURSE_PERMISSIONS.ENROLL_LEARNERS} mode="disable">
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
  // A view can render several gates. Each tooltip needs its own id so that every
  // `aria-describedby` points at exactly one element.
  const tooltipId = useId();
  const { permissions, isLoading } = useCoursePermissions();
  const toCheck = anyOf ?? (permission ? [permission] : undefined);

  // Check the shared permissions map directly, keeping the number of hook calls
  // constant even when `anyOf` changes.
  // - Neither prop passed: nothing to check, render children.
  // - Otherwise: allowed if any required permission is true. An empty `anyOf`
  //   has no permission to satisfy it, so it denies. When AuthZ is disabled
  //   for the course, every permission resolves to true.
  const allowed = toCheck === undefined
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
          <Tooltip id={tooltipId}>
            {intl.formatMessage(messages.disabledActionTooltip)}
          </Tooltip>
        )}
      >
        {/* A disabled control can't take focus, so the wrapper is the focus target
            that lets keyboard and screen-reader users reach the tooltip. */}
        <span className="d-inline-block" tabIndex={0}>
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
