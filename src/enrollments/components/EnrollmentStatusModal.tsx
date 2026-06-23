import { useState, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { Button, FormControl, ModalDialog } from '@openedx/paragon';
import { useEnrollmentByUserId } from '@src/enrollments/data/apiHook';
import messages from '@src/enrollments/messages';

interface EnrollmentStatusModalProps {
  isOpen: boolean,
  onClose: () => void,
}

const EnrollmentStatusModal = ({ isOpen, onClose }: EnrollmentStatusModalProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const [learnerIdentifier, setLearnerIdentifier] = useState<string>('');
  const { data = { enrollmentStatus: '' }, refetch } = useEnrollmentByUserId(courseId, learnerIdentifier);

  const handleSearch = () => {
    refetch();
  };

  const handleClose = () => {
    setLearnerIdentifier('');
    onClose();
  };

  return (
    <ModalDialog title={intl.formatMessage(messages.checkEnrollmentStatus)} isOpen={isOpen} onClose={handleClose} isOverflowVisible={false}>
      <ModalDialog.Header>
        <ModalDialog.Title className="text-primary-700">{intl.formatMessage(messages.checkEnrollmentStatus)}</ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body className="border-bottom border-top border-light-700">
        <div className="my-2">
          <p>{intl.formatMessage(messages.enrollmentStatusInstructions)}</p>
          <FormControl
            placeholder={intl.formatMessage(messages.enrollmentStatusPlaceholder)}
            value={learnerIdentifier}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setLearnerIdentifier(e.target.value)}
          />
          <Button
            className="mt-3"
            onClick={handleSearch}
            disabled={!learnerIdentifier.trim()}
          >
            {intl.formatMessage(messages.checkEnrollmentStatus)}
          </Button>

          {data.enrollmentStatus && (
            <p className="mt-3 mb-0">{data.enrollmentStatus}</p>
          )}
        </div>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <Button onClick={handleClose}>{intl.formatMessage(messages.closeButton)}</Button>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default EnrollmentStatusModal;
