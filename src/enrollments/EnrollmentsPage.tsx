import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Slot, useIntl } from '@openedx/frontend-base';
import { ActionRow, Dropdown, IconButton } from '@openedx/paragon';
import { MoreVert } from '@openedx/paragon/icons';
import messages from '@src/enrollments/messages';
import AddBetaTestersModal from '@src/enrollments/components/AddBetaTestersModal';
import EnrollLearnersModal from '@src/enrollments/components/EnrollLearnersModal';
import EnrollmentsList from '@src/enrollments/components/EnrollmentsList';
import EnrollmentStatusModal from '@src/enrollments/components/EnrollmentStatusModal';
import UnenrollModal from '@src/enrollments/components/UnenrollModal';
import { EnrolledLearner } from '@src/enrollments/types';
import { AlertOutlet, useAlert } from '@src/providers/AlertProvider';
import { useCourseInfo } from '@src/data/apiHook';
import { enrollmentActionsSlotId } from '@src/constants';
import UpdateBetaTesterModal from './components/UpdateBetaTesterModal';

const EnrollmentsPage = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { data: courseInfo } = useCourseInfo(courseId);
  const { clearAlerts } = useAlert();
  const [isEnrollmentStatusModalOpen, setIsEnrollmentStatusModalOpen] = useState(false);
  const [isEnrollLearnersModalOpen, setIsEnrollLearnersModalOpen] = useState(false);
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

  // Passed to the enrollment actions slot so slot widgets can open the modals, which stay owned
  // by this page regardless of how a site operator renders the buttons.
  const handleEnrollLearners = useCallback(() => {
    setIsEnrollLearnersModalOpen(true);
    clearAlerts();
  }, [clearAlerts]);

  const handleAddBetaTesters = useCallback(() => {
    setIsAddBetaTestersModalOpen(true);
    clearAlerts();
  }, [clearAlerts]);

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
              <Dropdown.Item onClick={handleOpenEnrollmentStatusModal}>
                {intl.formatMessage(messages.checkEnrollmentStatus)}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Slot
            id={enrollmentActionsSlotId}
            permissions={courseInfo?.permissions}
            onEnrollLearners={handleEnrollLearners}
            onAddBetaTesters={handleAddBetaTesters}
          />
        </ActionRow>
      </div>
      <AlertOutlet />
      <EnrollmentsList onUnenroll={handleUnenroll} onBetaTesterChange={handleBetaTesterChange} />
      <EnrollmentStatusModal isOpen={isEnrollmentStatusModalOpen} onClose={handleCloseEnrollmentStatusModal} />
      {selectedLearner && <UnenrollModal isOpen={isUnenrollModalOpen} learner={selectedLearner} onClose={handleUnenrollModalClose} />}
      <EnrollLearnersModal isOpen={isEnrollLearnersModalOpen} onClose={() => setIsEnrollLearnersModalOpen(false)} />
      <AddBetaTestersModal isOpen={isAddBetaTestersModalOpen} onClose={() => setIsAddBetaTestersModalOpen(false)} />
      {selectedLearner && <UpdateBetaTesterModal isOpen={isUpdateBetaTesterModalOpen} learner={selectedLearner} onClose={handleCloseUpdateBetaTesterModal} />}
    </>
  );
};

export default EnrollmentsPage;
