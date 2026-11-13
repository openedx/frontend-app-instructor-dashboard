import { useIntl } from '@openedx/frontend-base';
import { Button } from '@openedx/paragon';
import messages from '@src/enrollments/messages';

export interface EnrollmentActionsSlotProps {
  /**
   * Course permissions from the instructor API (e.g. `admin`, `instructor`, `dataResearcher`).
   * Provided so a slot widget can decide which actions to show, but not interpreted by this MFE.
   */
  permissions?: Record<string, boolean | undefined>;
  /** Opens the Enroll Learners modal (owned by the Enrollments page). */
  onEnrollLearners: () => void;
  /** Opens the Add Beta Testers modal (owned by the Enrollments page). */
  onAddBetaTesters: () => void;
  /**
   * Hide the Add Beta Testers button. True when the course does not support beta testers
   * (CCX Coach) or the user lacks the permission to manage them.
   */
  hideBetaTesters?: boolean;
  /** Hide the Enroll Learners button. True when the user lacks the permission to enroll learners. */
  hideEnrollLearners?: boolean;
}

/**
 * Default widget for the enrollment actions slot (`enrollmentActionsSlotId`).
 *
 * It renders the "Add Beta Testers" and "Enroll Learners" buttons. It does no permission checks of
 * its own: the Enrollments page decides from the user's AuthZ permissions and passes
 * `hideBetaTesters` / `hideEnrollLearners`, so the widget stays usable in the CCX Coach dashboard.
 *
 * The slot passes `permissions`, `onEnrollLearners` and `onAddBetaTesters` to every widget
 * registered in it, so a site operator can REPLACE this widget from `site.config` with their own
 * component that decides whether to show each button and which permission gates it — without
 * changing this MFE. See this folder's README for details.
 */
const EnrollmentActionsSlot = ({
  onEnrollLearners, onAddBetaTesters, hideBetaTesters = false, hideEnrollLearners = false,
}: EnrollmentActionsSlotProps) => {
  const intl = useIntl();

  return (
    <>
      {!hideBetaTesters && <Button variant="outline-primary" onClick={onAddBetaTesters}>+ {intl.formatMessage(messages.addBetaTesters)}</Button>}
      {!hideEnrollLearners && <Button onClick={onEnrollLearners}>+ {intl.formatMessage(messages.enrollLearners)}</Button>}
    </>
  );
};

export default EnrollmentActionsSlot;
