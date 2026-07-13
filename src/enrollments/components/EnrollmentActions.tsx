import { useIntl } from '@openedx/frontend-base';
import { Button } from '@openedx/paragon';
import messages from '@src/enrollments/messages';

export interface EnrollmentActionsSlotProps {
  /**
   * Course permissions from the instructor API (e.g. `admin`, `instructor`, `dataResearcher`).
   * Provided so a slot widget can decide which actions to show, but not interpreted by this MFE.
   */
  permissions?: Record<string, boolean | undefined>,
  /** Opens the Enroll Learners modal (owned by the Enrollments page). */
  onEnrollLearners: () => void,
  /** Opens the Add Beta Testers modal (owned by the Enrollments page). */
  onAddBetaTesters: () => void,
}

/**
 * Default widget for the enrollment actions slot (`enrollmentActionsSlotId`).
 *
 * It renders the "Add Beta Testers" and "Enroll Learners" buttons.
 *
 * The slot passes `permissions`, `onEnrollLearners` and `onAddBetaTesters` to every widget
 * registered in it, so a site operator can REPLACE this widget from `site.config` with their own
 * component that decides whether to show each button and which permission gates it — without
 * changing this MFE.
 */
const EnrollmentActions = ({ onEnrollLearners, onAddBetaTesters }: EnrollmentActionsSlotProps) => {
  const intl = useIntl();

  return (
    <>
      <Button variant="outline-primary" onClick={onAddBetaTesters}>+ {intl.formatMessage(messages.addBetaTesters)}</Button>
      <Button onClick={onEnrollLearners}>+ {intl.formatMessage(messages.enrollLearners)}</Button>
    </>
  );
};

export default EnrollmentActions;
