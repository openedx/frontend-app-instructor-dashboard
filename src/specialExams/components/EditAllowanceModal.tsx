import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { ActionRow, Button, Form, ModalDialog } from '@openedx/paragon';
import SpecifyLearnerField from '@src/components/SpecifyLearnerField';
import { useLearner } from '@src/data/apiHook';
import { addLabel, addPlaceholder, allowanceTypesOptions } from '@src/specialExams/constants';
import { useAddAllowance } from '@src/specialExams/data/apiHook';
import messages from '@src/specialExams/messages';
import { Allowance } from '@src/specialExams/types';
import { useAlert } from '@src/providers/AlertProvider';

interface EditAllowanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  allowance: Allowance;
}

const EditAllowanceModal = ({ isOpen, onClose, allowance }: EditAllowanceModalProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { mutate: editAllowance } = useAddAllowance(courseId);
  const { data: learner, refetch } = useLearner(courseId, allowance.user.username);
  const [editedAllowance, setEditedAllowance] = useState({
    allowanceType: allowance.key,
    value: allowance.value,
  });
  const { showModal } = useAlert();

  useEffect(() => {
    if (isOpen) {
      // Refetch learner data when modal opens to ensure we have the most up-to-date information
      refetch();
    }
  }, [isOpen, refetch]);

  const handleChanges = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedAllowance(prev => ({ ...prev, [name]: value }));
  };

  const hasChanges = useMemo(() => {
    return (editedAllowance.allowanceType !== allowance.key && editedAllowance.allowanceType !== '')
      || editedAllowance.value !== allowance.value;
  }, [editedAllowance, allowance]);

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    editAllowance({
      examType: allowance.proctoredExam.examType,
      allowanceType: editedAllowance.allowanceType,
      value: editedAllowance.value,
      userIds: [allowance.user.username],
      examIds: [allowance.proctoredExam.id],
    }, {
      onSuccess: () => {
        onClose();
      },
      onError: () => {
        showModal({
          message: intl.formatMessage(messages.editAllowanceError),
          variant: 'danger',
        });
      }
    });
  };

  if (!learner?.username) {
    return null;
  }

  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title={intl.formatMessage(messages.editAllowance)} isOverflowVisible={false} size="lg">
      <ModalDialog.Header className="border-bottom border-light-700">
        <ModalDialog.Title className="text-primary-700">{intl.formatMessage(messages.editAllowance)}</ModalDialog.Title>
      </ModalDialog.Header>
      <Form className="position-relative overflow-auto" onSubmit={handleEdit}>
        <ModalDialog.Body>
          <Form.Group controlId="learner-info">
            <SpecifyLearnerField learner={learner} onClickSelect={() => {}} />
          </Form.Group>
          <Form.Group controlId="select-exam-type">
            <Form.Label className="text-primary-500 x-small">{intl.formatMessage(messages.selectExamType)}:</Form.Label>
            <Form.Control as="select" disabled controlClassName="text-capitalize">
              <option value="">{allowance.proctoredExam.examType}</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="select-exams">
            <Form.Label className="text-primary-500 x-small">{intl.formatMessage(messages.selectExams)}:</Form.Label>
            <div>
              <Form.Checkbox className="mt-2" key={allowance.proctoredExam.examName} checked disabled labelClassName="text-primary-500">
                {allowance.proctoredExam.examName}
              </Form.Checkbox>
            </div>
          </Form.Group>
          <Form.Group controlId="select-allowance-type">
            <Form.Label className="text-primary-500 x-small">{intl.formatMessage(messages.selectAllowanceType)}:</Form.Label>
            <Form.Control as="select" name="allowanceType" onChange={handleChanges} value={editedAllowance.allowanceType}>
              {allowanceTypesOptions.map(option => (
                <option key={option.value} value={option.value}>{intl.formatMessage(option.label)}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="allowance-value">
            <Form.Label className="text-primary-500 x-small">{intl.formatMessage(addLabel[editedAllowance.allowanceType || 'additional_time_granted'])}:</Form.Label>
            <Form.Control
              type={editedAllowance.allowanceType === 'review_policy_exception' ? 'text' : 'number'}
              placeholder={intl.formatMessage(addPlaceholder[editedAllowance.allowanceType || 'additional_time_granted'])}
              name="value"
              value={editedAllowance.value}
              onChange={handleChanges}
            />
          </Form.Group>
        </ModalDialog.Body>
        <ModalDialog.Footer className="border-top border-light-700">
          <ActionRow>
            <Button variant="tertiary" onClick={onClose}>{intl.formatMessage(messages.cancel)}</Button>
            <Button variant="primary" type="submit" disabled={!hasChanges}>{intl.formatMessage(messages.editAllowance)}</Button>
          </ActionRow>
        </ModalDialog.Footer>
      </Form>
    </ModalDialog>
  );
};

export default EditAllowanceModal;
