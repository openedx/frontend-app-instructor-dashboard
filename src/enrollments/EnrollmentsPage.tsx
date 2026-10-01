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
import { EnrolledLearner, LearnersAction } from '@src/enrollments/types';
import { AlertOutlet, useAlert } from '@src/providers/AlertProvider';
import { useCourseInfo } from '@src/data/apiHook';
import { enrollmentActionsSlotId } from '@src/constants';
import UpdateBetaTesterModal from './components/UpdateBetaTesterModal';
import { BULK_LEARNERS_ACTION } from '@src/enrollments/constants';

interface EnrollmentsPageProps {
  hideBetaTesters?: boolean;
  hideEnrollmentStatus?: boolean;
}

const EnrollmentsPage = ({ hideBetaTesters = false, hideEnrollmentStatus = false }: EnrollmentsPageProps) => {
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

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="text-primary-700">{intl.formatMessage(messages.enrollmentsPageTitle)}</h3>
        <ActionRow>
          <Dropdown>
            <Dropdown.Toggle
              as={IconButton}
              src={MoreVert}
              alt={intl.formatMessage(messages.checkEnrollmentStatus)}
              id="check-enrollment-status-menu"
            />
            <Dropdown.Menu>
              {!hideEnrollmentStatus && (
                <Dropdown.Item onClick={handleOpenEnrollmentStatusModal}>
                  {intl.formatMessage(messages.checkEnrollmentStatus)}
                </Dropdown.Item>

              )}
              <Dropdown.Item onClick={() => handleBulkLearners(BULK_LEARNERS_ACTION.UNENROLL)}>
                {intl.formatMessage(messages.unenrollLearners)}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Slot
            id={enrollmentActionsSlotId}
            hideBetaTesters={hideBetaTesters}
            permissions={courseInfo?.permissions}
            onEnrollLearners={() => handleBulkLearners(BULK_LEARNERS_ACTION.ENROLL)}
            onAddBetaTesters={handleAddBetaTesters}
          />
        </ActionRow>
      </div>
      <AlertOutlet />
      <EnrollmentsList onUnenroll={handleUnenroll} onBetaTesterChange={handleBetaTesterChange} hideBetaTesters={hideBetaTesters} />
      <EnrollmentStatusModal isOpen={isEnrollmentStatusModalOpen} onClose={handleCloseEnrollmentStatusModal} />
      {selectedLearner && <UnenrollModal isOpen={isUnenrollModalOpen} learner={selectedLearner} onClose={handleUnenrollModalClose} />}
      {bulkLearnersAction && <BulkLearnersModal isOpen={isBulkLearnersModalOpen} onClose={handleCloseEnrollLearnersModal} action={bulkLearnersAction} /> }
      <AddBetaTestersModal isOpen={isAddBetaTestersModalOpen} onClose={() => setIsAddBetaTestersModalOpen(false)} />
      {selectedLearner && <UpdateBetaTesterModal isOpen={isUpdateBetaTesterModalOpen} learner={selectedLearner} onClose={handleCloseUpdateBetaTesterModal} />}
    </>
  );
};

export default EnrollmentsPage;
