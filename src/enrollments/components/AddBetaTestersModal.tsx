import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useIntl } from '@openedx/frontend-base';
import { Button, FormControl, ModalDialog, Form } from '@openedx/paragon';
import { useUpdateBetaTesters } from '@src/enrollments/data/apiHook';
import messages from '@src/enrollments/messages';
import { useAlert } from '@src/providers/AlertProvider';
import { useDebouncedFilter } from '@src/hooks/useDebouncedFilter';

export interface AddBetaTestersModalProps {
  isOpen: boolean,
  onClose: () => void,
}

const AddBetaTestersModal = ({
  isOpen,
  onClose
}: AddBetaTestersModalProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const [emails, setEmails] = useState('');
  const [autoEnroll, setAutoEnroll] = useState(true);
  const [emailStudents, setEmailStudents] = useState(true);
  const { mutate: addBetaTesters } = useUpdateBetaTesters(courseId);
  const { showModal, addAlert } = useAlert();
  const { inputValue, handleChange } = useDebouncedFilter({
    filterValue: emails,
    setFilter: setEmails,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChange(e.target.value);
  };

  const handleSave = () => {
    const identifier = inputValue.split(/[\n,]+/).map(email => email.trim()).filter(Boolean);
    addBetaTesters({ identifier, action: 'add', autoEnroll, emailStudents }, {
      onSuccess: (data) => {
        const failedUsernames = data.results?.filter(user => user.userDoesNotExist).map(user => user.identifier) || [];
        const inactiveUsernames = data.results?.filter(user => !user.isActive && user.isActive !== null && !user.userDoesNotExist).map(user => user.identifier) || [];
        if (failedUsernames.length > 0) {
          addAlert({
            type: 'danger',
            message: intl.formatMessage(messages.failedBetaTesters),
            extraContent: (
              failedUsernames.map((learner: string) => (
                <p key={learner} className="mb-0">• {intl.formatMessage(messages.unknownLearner, { learner })}</p>
              ))
            )
          });
        }
        if (inactiveUsernames.length > 0) {
          addAlert({
            type: 'warning',
            message: intl.formatMessage(messages.inactiveUsers),
            extraContent: (
              inactiveUsernames.map((learner: string) => (
                <p key={learner} className="mb-0">• {intl.formatMessage(messages.inactiveLearner, { learner })}</p>
              ))
            )
          });
        }
        handleChange('');
        setAutoEnroll(true);
        setEmailStudents(true);
        onClose();
      },
      onError: (error) => {
        const notFound = isAxiosError(error) && error.response?.status === 404;
        const errorMessage = notFound
          ? intl.formatMessage(messages.enrollLearnerNotFoundError)
          : intl.formatMessage(messages.enrollLearnerError);
        showModal({
          message: errorMessage,
          variant: 'danger',
          confirmText: intl.formatMessage(messages.closeButton),
        });
      }
    });
  };

  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} isOverflowVisible={false} title={intl.formatMessage(messages.addBetaTesters)}>
      <ModalDialog.Header className="border-light-700 border-bottom">
        <h3 className="text-primary-500">{intl.formatMessage(messages.addBetaTesters)}</h3>
      </ModalDialog.Header>
      <div className="position-relative overflow-auto">
        <ModalDialog.Body className="py-4">
          <p className="text-gray-700 x-small mb-2">{intl.formatMessage(messages.addBetaTestersInstructions)}</p>
          <FormControl
            name="identifier"
            as="textarea"
            rows={4}
            placeholder={intl.formatMessage(messages.userIdentifierPlaceholder)}
            onChange={handleInputChange}
            value={inputValue}
          />
          <div className="d-flex mt-3 text-primary-500">
            <Form.Checkbox
              controlClassName="border-primary-500"
              checked={autoEnroll}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAutoEnroll(e.target.checked)}
            >{intl.formatMessage(messages.autoEnrollCheckbox)}
            </Form.Checkbox>
            <Form.Checkbox
              controlClassName="border-primary-500"
              className="ml-4"
              checked={emailStudents}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailStudents(e.target.checked)}
            >{intl.formatMessage(messages.notifyUsersCheckbox)}
            </Form.Checkbox>
          </div>
        </ModalDialog.Body>
      </div>
      <ModalDialog.Footer className="border-light-700 border-top">
        <Button variant="tertiary" onClick={onClose}>
          {intl.formatMessage(messages.cancelButton)}
        </Button>
        <Button className="ml-2" variant="primary" onClick={handleSave} disabled={inputValue.trim().length === 0}>
          {intl.formatMessage(messages.saveButton)}
        </Button>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default AddBetaTestersModal;
