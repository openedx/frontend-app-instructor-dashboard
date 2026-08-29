import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { Button, ModalDialog } from '@openedx/paragon';
import { useDeleteAllowance } from '@src/specialExams/data/apiHook';
import messages from '@src/specialExams/messages';
import { Allowance } from '@src/specialExams/types';
import { useAlert } from '@src/providers/AlertProvider';

interface DeleteAllowanceProps {
  allowance: Allowance;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteAllowanceModal = ({ allowance, isOpen, onClose }: DeleteAllowanceProps) => {
  const { courseId = '' } = useParams();
  const intl = useIntl();
  const { mutate: deleteAllowance, isPending } = useDeleteAllowance(courseId);
  const { showModal } = useAlert();
  const handleDelete = () => {
    deleteAllowance({ examId: allowance.proctoredExam.id, userIds: [allowance.user.id], allowanceType: allowance.key }, {
      onSuccess: () => {
        onClose();
      },
      onError: () => {
        showModal({
          message: intl.formatMessage(messages.deleteError),
          variant: 'danger',
        });
      }
    });
  };

  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title={intl.formatMessage(messages.deleteAllowance)} isOverflowVisible={false}>
      <ModalDialog.Body className="pt-4 px-4 pb-2.5">
        <p>{intl.formatMessage(messages.deleteConfirmation, { user: allowance.user.username, examName: allowance.proctoredExam.examName })}</p>
      </ModalDialog.Body>
      <ModalDialog.Footer className="pt-2">
        <Button variant="tertiary" onClick={onClose}>{intl.formatMessage(messages.cancel)}</Button>
        <Button
          className="ml-2"
          onClick={handleDelete}
          disabled={isPending}
        >
          {intl.formatMessage(messages.delete)}
        </Button>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default DeleteAllowanceModal;
