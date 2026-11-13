import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Slot, useIntl } from '@openedx/frontend-base';
import { ActionRow, Dropdown, IconButton, useToggle } from '@openedx/paragon';
import { MoreVert } from '@openedx/paragon/icons';
import messages from '@src/enrollments/messages';
import AddBetaTestersModal from '@src/enrollments/components/AddBetaTestersModal';
import BulkLearnersModal from '@src/enrollments/components/BulkLearnersModal';
import EnrollmentsList from '@src/enrollments/components/EnrollmentsList';
import EnrollmentStatusModal from '@src/enrollments/components/EnrollmentStatusModal';
import UnenrollModal from '@src/enrollments/components/UnenrollModal';
import { EnrolledLearner, EnrollmentsAccess, LearnersAction } from '@src/enrollments/types';
import { AlertOutlet, useAlert } from '@src/providers/AlertProvider';
import AccessErrorAlert from '@src/providers/AccessErrorAlert';
import { useCourseInfo } from '@src/data/apiHook';
import { enrollmentActionsSlotId } from '@src/constants';
import { PermissionAlert } from '@src/permissions';
import UpdateBetaTesterModal from './components/UpdateBetaTesterModal';
import { BULK_LEARNERS_ACTION, FULL_ENROLLMENTS_ACCESS } from '@src/enrollments/constants';

interface EnrollmentsPageProps {
  hideBetaTesters?: boolean;
  hideEnrollmentStatus?: boolean;
  /**
   * What the user may do on the page. Defaults to everything, which is what the CCX Coach
   * dashboard uses; the instructor dashboard passes the user's AuthZ permissions
   * (see `InstructorEnrollmentsPage`).
   */
  access?: EnrollmentsAccess;
}

const EnrollmentsPage = ({
  hideBetaTesters = false,
  hideEnrollmentStatus = false,
  access = FULL_ENROLLMENTS_ACCESS,
}: EnrollmentsPageProps) => {
  const {
    canViewEnrollments, canEnroll, canUnenroll, canManageBetaTesters,
  } = access;
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { data: courseInfo } = useCourseInfo(courseId);
  const { clearAlerts } = useAlert();
  const [isEnrollmentStatusModalOpen, setIsEnrollmentStatusModalOpen] = useState(false);
  const [isBulkLearnersModalOpen, openBulkLearnersModal, closeBulkLearnersModal] = useToggle(false);
  const [bulkLearnersAction, setBulkLearnersAction] = useState<LearnersAction | null>(null);
  const [isAddBetaTestersModalOpen, setIsAddBetaTestersModalOpen] = useState(false);
  const [isUnenrollModalOpen, setIsUnenrollModalOpen] = useState(false);
  const [isUpdateBetaTesterModalOpen, setIsUpdateBetaTesterModalOpen] = useState(false);
  const [selectedLearner, setSelectedLearner] = useState<EnrolledLearner | null>(null);

  const handleOpenEnrollmentStatusModal = () => {
    setIsEnrollmentStatusModalOpen(true);
  };

  const handleUnenroll = (learner: EnrolledLearner) => {
    setIsUnenrollModalOpen(true);
    setSelectedLearner(learner);
  };

  const handleUnenrollModalClose = () => {
    setIsUnenrollModalOpen(false);
    setSelectedLearner(null);
  };

  const handleCloseEnrollmentStatusModal = () => {
    setIsEnrollmentStatusModalOpen(false);
  };

  const handleBulkLearners = (action: LearnersAction) => {
    setBulkLearnersAction(action);
    openBulkLearnersModal();
    clearAlerts();
  };

  const handleCloseEnrollLearnersModal = () => {
    closeBulkLearnersModal();
    setBulkLearnersAction(null);
  };

  const handleAddBetaTesters = () => {
    setIsAddBetaTestersModalOpen(true);
    clearAlerts();
  };

  const handleBetaTesterChange = (learner: EnrolledLearner) => {
    setIsUpdateBetaTesterModalOpen(true);
    setSelectedLearner(learner);
  };

  const handleCloseUpdateBetaTesterModal = () => {
    setIsUpdateBetaTesterModalOpen(false);
    setSelectedLearner(null);
  };

  // Checking a learner's enrollment status is part of `view_enrollments`. The CCX Coach
  // dashboard opts out through `hideEnrollmentStatus`.
  const canCheckEnrollmentStatus = canViewEnrollments && !hideEnrollmentStatus;
  // Without either item the menu would open empty, so leave the whole menu out.
  const showHeaderMenu = canCheckEnrollmentStatus || canUnenroll;
  const canBulkLearnersAction = bulkLearnersAction === BULK_LEARNERS_ACTION.ENROLL ? canEnroll : canUnenroll;

  // Only the combinations that confuse users get a permission alert: view-only, enroll
  // without unenroll, and unenroll without enroll. Having both actions, or holding only
  // the beta tester permission, shows nothing.
  let accessAlertMessage;
  if (canEnroll && !canUnenroll) {
    accessAlertMessage = messages.enrollOnlyAccessAlert;
  } else if (canUnenroll && !canEnroll) {
    accessAlertMessage = messages.unenrollOnlyAccessAlert;
  } else if (!canEnroll && !canUnenroll && !canManageBetaTesters) {
    accessAlertMessage = messages.viewOnlyAccessAlert;
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="text-primary-700">{intl.formatMessage(messages.enrollmentsPageTitle)}</h3>
        <ActionRow>
          {showHeaderMenu && (
            <Dropdown>
              <Dropdown.Toggle
                as={IconButton}
                src={MoreVert}
                alt={intl.formatMessage(messages.moreActions)}
                id="check-enrollment-status-menu"
              />
              <Dropdown.Menu>
                {canCheckEnrollmentStatus && (
                  <Dropdown.Item onClick={handleOpenEnrollmentStatusModal}>
                    {intl.formatMessage(messages.checkEnrollmentStatus)}
                  </Dropdown.Item>
                )}
                {canUnenroll && (
                  <Dropdown.Item onClick={() => handleBulkLearners(BULK_LEARNERS_ACTION.UNENROLL)}>
                    {intl.formatMessage(messages.unenrollLearners)}
                  </Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          )}
          <Slot
            id={enrollmentActionsSlotId}
            hideBetaTesters={hideBetaTesters || !canManageBetaTesters}
            hideEnrollLearners={!canEnroll}
            permissions={courseInfo?.permissions}
            onEnrollLearners={() => handleBulkLearners(BULK_LEARNERS_ACTION.ENROLL)}
            onAddBetaTesters={handleAddBetaTesters}
          />
        </ActionRow>
      </div>
      {accessAlertMessage && (
        <PermissionAlert className="mt-3">{intl.formatMessage(accessAlertMessage)}</PermissionAlert>
      )}
      <AlertOutlet />
      {canViewEnrollments ? (
        <EnrollmentsList
          onUnenroll={handleUnenroll}
          onBetaTesterChange={handleBetaTesterChange}
          hideBetaTesters={hideBetaTesters}
          canUnenroll={canUnenroll}
          canManageBetaTesters={canManageBetaTesters}
        />
      ) : (
        <AccessErrorAlert errorType="forbidden" />
      )}
      {canCheckEnrollmentStatus && <EnrollmentStatusModal isOpen={isEnrollmentStatusModalOpen} onClose={handleCloseEnrollmentStatusModal} />}
      {/* The modals are mounted only when the user holds the matching permission, in addition to
          the buttons that open them being hidden. */}
      {canUnenroll && selectedLearner && <UnenrollModal isOpen={isUnenrollModalOpen} learner={selectedLearner} onClose={handleUnenrollModalClose} />}
      {canBulkLearnersAction && bulkLearnersAction && <BulkLearnersModal isOpen={isBulkLearnersModalOpen} onClose={handleCloseEnrollLearnersModal} action={bulkLearnersAction} /> }
      {canManageBetaTesters && <AddBetaTestersModal isOpen={isAddBetaTestersModalOpen} onClose={() => setIsAddBetaTestersModalOpen(false)} />}
      {canManageBetaTesters && selectedLearner && <UpdateBetaTesterModal isOpen={isUpdateBetaTesterModalOpen} learner={selectedLearner} onClose={handleCloseUpdateBetaTesterModal} />}
    </>
  );
};

export default EnrollmentsPage;
