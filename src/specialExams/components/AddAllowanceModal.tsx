import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { ActionRow, Button, Form, ModalDialog } from '@openedx/paragon';
import { addLabel, addPlaceholder, allowanceTypesOptions } from '@src/specialExams/constants';
import { useAddAllowance, useSpecialExams } from '@src/specialExams/data/apiHook';
import messages from '@src/specialExams/messages';
import { AddAllowanceForm, AddAllowanceParams } from '@src/specialExams/types';
import { useAlert } from '@src/providers/AlertProvider';

interface AddAllowanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const examTypeOptions = [
  { value: '', label: messages.selectExamType },
  { value: 'proctored', label: messages.proctored },
  { value: 'timed', label: messages.timed },
];

const emptyAllowanceData = {
  examType: '',
  examIds: [],
  allowanceType: '',
  value: '',
  users: ''
};

const AddAllowanceModal = ({ isOpen, onClose }: AddAllowanceModalProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams();
  const [newAllowance, setNewAllowance] = useState<AddAllowanceForm>(emptyAllowanceData);
  const { data: specialExams, refetch } = useSpecialExams(courseId, newAllowance.examType);
  const { mutate: addAllowance } = useAddAllowance(courseId);
  const { showModal } = useAlert();

  const enableSubmitButton = useMemo(() => (allowanceData: AddAllowanceForm) => {
    const { examType, allowanceType, value, users, examIds } = allowanceData;
    if (!examType || !allowanceType || !value || !users || examIds.length === 0) {
      return false;
    }
    const userIds = users.split(',').map(user => user.trim()).filter(user => user);
    return userIds.length > 0;
  }, []);

  useEffect(() => {
    if (isOpen && newAllowance.examType) {
      refetch();
    }
  }, [isOpen, newAllowance.examType, refetch]);

  const handleClose = () => {
    setNewAllowance(emptyAllowanceData);
    onClose();
  };

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userIds = newAllowance.users.split(',').map(user => user.trim()).filter(user => user);
    const allowanceData: AddAllowanceParams = {
      userIds,
      examType: newAllowance.examType,
      examIds: newAllowance.examIds,
      allowanceType: newAllowance.allowanceType,
      value: newAllowance.value,
    };

    addAllowance(allowanceData, {
      onSuccess: () => {
        handleClose();
      },
      onError: () => {
        showModal({
          message: intl.formatMessage(messages.addAllowanceError),
          variant: 'danger',
        });
      }
    });
  };

  const handleChanges = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value, name } = e.target;
    setNewAllowance(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleExam = (value: number) => {
    setNewAllowance(prev => {
      const examIds = prev.examIds.includes(value)
        ? prev.examIds.filter(id => id !== value)
        : [...prev.examIds, value];
      return {
        ...prev,
        examIds,
      };
    });
  };

  return (
    <ModalDialog isOpen={isOpen} onClose={handleClose} title={intl.formatMessage(messages.addAllowance)} isOverflowVisible={false} size="lg">
      <ModalDialog.Header className="border-bottom border-light-700">
        <ModalDialog.Title className="text-primary-700">{intl.formatMessage(messages.addAllowance)}</ModalDialog.Title>
      </ModalDialog.Header>
      <Form className="position-relative overflow-auto" onSubmit={handleAdd}>
        <ModalDialog.Body>
          <Form.Group controlId="specify-learners">
            <Form.Label className="text-primary-500 x-small">{intl.formatMessage(messages.specifyLearners)}:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder={intl.formatMessage(messages.specifyLearnersPlaceholder)}
              name="users"
              onChange={handleChanges}
            />
          </Form.Group>
          <Form.Group controlId="select-exam-type">
            <Form.Label className="text-primary-500 x-small">{intl.formatMessage(messages.selectExamType)}:</Form.Label>
            <Form.Control as="select" name="examType" onChange={handleChanges}>
              {examTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{intl.formatMessage(option.label)}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="select-exams">
            <Form.Label className="text-primary-500 x-small">{intl.formatMessage(messages.selectExams)}:</Form.Label>
            {newAllowance.examType && (
              <Form.CheckboxSet onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleToggleExam(Number(e.target.value))} name="examIds">
                {
                  (specialExams || [])
                    .map((exam) => (
                      <Form.Checkbox className="mt-2" key={exam.id} value={exam.id}>
                        {exam.examName}
                      </Form.Checkbox>
                    ))
                }
              </Form.CheckboxSet>
            )}
          </Form.Group>
          <Form.Group controlId="select-allowance-type">
            <Form.Label className="text-primary-500 x-small">{intl.formatMessage(messages.selectAllowanceType)}:</Form.Label>
            <Form.Control as="select" name="allowanceType" onChange={handleChanges}>
              {allowanceTypesOptions.map(option => (
                <option key={option.value} value={option.value}>{intl.formatMessage(option.label)}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="allowance-value">
            <Form.Label className="text-primary-500 x-small">{intl.formatMessage(addLabel[newAllowance.allowanceType || 'additional_time_granted'])}:</Form.Label>
            <Form.Control
              type={newAllowance.allowanceType === 'review_policy_exception' ? 'text' : 'number'}
              placeholder={intl.formatMessage(addPlaceholder[newAllowance.allowanceType || 'additional_time_granted'])}
              name="value"
              onChange={handleChanges}
            />
          </Form.Group>
        </ModalDialog.Body>
        <ModalDialog.Footer className="border-top border-light-700">
          <ActionRow>
            <Button variant="tertiary" onClick={handleClose}>{intl.formatMessage(messages.cancel)}</Button>
            <Button disabled={!enableSubmitButton(newAllowance)} variant="primary" type="submit">{intl.formatMessage(messages.createAllowance)}</Button>
          </ActionRow>
        </ModalDialog.Footer>
      </Form>
    </ModalDialog>
  );
};

export default AddAllowanceModal;
