import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { ActionRow, Alert, Button, FormControl, ModalDialog, useToggle } from '@openedx/paragon';
import { Warning } from '@openedx/paragon/icons';
import { useDebouncedFilter } from '@src/hooks/useDebouncedFilter';
import { useGradingPolicy, useSaveGradingPolicy } from '@src/ccxCoach/data/apiHook';
import { useAlert } from '@src/providers/AlertProvider';
import messages from './messages';

const GradingPolicyPage = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { data = '' } = useGradingPolicy(courseId);
  const { mutate: saveGradingPolicy } = useSaveGradingPolicy(courseId);
  const { showModal, showToast } = useAlert();
  const [gradingPolicy, setGradingPolicy] = useState(data);
  const { inputValue, handleChange } = useDebouncedFilter({
    filterValue: gradingPolicy,
    setFilter: setGradingPolicy,
  });
  const [isOpenConfigModal, openConfigModal, closeConfigModal] = useToggle(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(event.target.value);
  };

  const handleDiscardChanges = () => {
    handleChange(data);
  };

  const handleSaveChanges = () => {
    closeConfigModal();
    saveGradingPolicy(gradingPolicy, {
      onSuccess: () => {
        handleChange(gradingPolicy);
        showToast(intl.formatMessage(messages.saveSuccess));
      },
      onError: () => {
        showModal({
          confirmText: intl.formatMessage(messages.closeButton),
          message: intl.formatMessage(messages.saveError),
          variant: 'danger',
        });
      }
    });
  };

  return (
    <>
      <h3 className="text-primary-700">{intl.formatMessage(messages.gradingPolicyPageTitle)}</h3>
      <Alert
        className="mt-3"
        icon={Warning}
        variant="warning"
      >
        <h4>{intl.formatMessage(messages.warningTitle)}</h4>
        <p className="mb-0">{intl.formatMessage(messages.warningMessage)}</p>
        <p>{intl.formatMessage(messages.warningFooter)}</p>
      </Alert>
      <FormControl
        as="textarea"
        className="mx-0"
        rows={20}
        value={inputValue}
        onChange={handleInputChange}
      />
      <ActionRow className="mt-4">
        <Button disabled={inputValue === data} variant="tertiary" onClick={handleDiscardChanges}>{intl.formatMessage(messages.discardButton)}</Button>
        <Button disabled={inputValue === data} onClick={openConfigModal}>{intl.formatMessage(messages.saveButton)}</Button>
      </ActionRow>
      <ModalDialog isOpen={isOpenConfigModal} title={intl.formatMessage(messages.warningTitle)} onClose={closeConfigModal} isOverflowVisible={false}>
        <ModalDialog.Header>
          <ModalDialog.Title className="text-primary-500">
            {intl.formatMessage(messages.warningTitle)}
          </ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body>
          <p>{intl.formatMessage(messages.confirmationMessage)}</p>
        </ModalDialog.Body>
        <ModalDialog.Footer>
          <ActionRow>
            <Button variant="tertiary" onClick={closeConfigModal}>{intl.formatMessage(messages.cancelButton)}</Button>
            <Button onClick={handleSaveChanges}>{intl.formatMessage(messages.saveButton)}</Button>
          </ActionRow>
        </ModalDialog.Footer>
      </ModalDialog>
    </>
  );
};

export default GradingPolicyPage;
