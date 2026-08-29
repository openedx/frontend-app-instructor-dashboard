import { useState } from 'react';
import { ActionRow, Button, Form, FormControl, FormGroup, FormLabel, ModalDialog } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import SpecifyLearnerField from '@src/components/SpecifyLearnerField';
import SelectGradedSubsection from '@src/dateExtensions/components/SelectGradedSubsection';
import messages from '@src/dateExtensions/messages';
import { AddDateExtensionFormData, AddDateExtensionParams } from '@src/dateExtensions/types';

interface AddExtensionModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSubmit: ({ emailOrUsername, blockId, dueDatetime, reason }: AddDateExtensionParams) => void;
}

const initialFormData: AddDateExtensionFormData = {
  emailOrUsername: '',
  blockId: '',
  dueDate: '',
  dueTime: '23:59',
  reason: '',
};

const AddExtensionModal = ({ isOpen, title, onClose, onSubmit }: AddExtensionModalProps) => {
  const intl = useIntl();
  const [formData, setFormData] = useState(initialFormData);

  const isFormFilled = (formData: AddDateExtensionFormData) => {
    return (
      formData.emailOrUsername.trim() !== ''
      && formData.blockId.trim() !== ''
      && formData.dueDate.trim() !== ''
    );
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { emailOrUsername, blockId, dueDate, dueTime, reason } = formData;
    onSubmit({
      emailOrUsername,
      blockId,
      dueDatetime: new Date(`${dueDate}T${dueTime}Z`).toISOString(),
      reason
    });
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title={title} isOverflowVisible={false} size="xl">
      <ModalDialog.Header className="p-3 pl-4 border-bottom">
        <ModalDialog.Title as="h3" className="m-0">
          {title}
        </ModalDialog.Title>
      </ModalDialog.Header>
      <Form onSubmit={handleSubmit} className="position-relative overflow-auto">
        <ModalDialog.Body>
          <div className="pt-3">
            <p>{intl.formatMessage(messages.extensionInstructions)}</p>
            <div className="container-fluid border-bottom mb-4.5 pb-3">
              <div className="row">
                <div className="col-sm-12 col-md-6">
                  <SpecifyLearnerField onClickSelect={(emailOrUsername) => setFormData((prevData) => ({ ...prevData, emailOrUsername }))} />
                </div>
                <div className="col-sm-12 col-md-4">
                  <SelectGradedSubsection
                    label={intl.formatMessage(messages.selectGradedSubsection)}
                    placeholder={intl.formatMessage(messages.selectGradedSubsection)}
                    onChange={onChange}
                  />
                </div>
              </div>
            </div>
            <div>
              <h4>{intl.formatMessage(messages.defineExtension)}</h4>
              <FormGroup size="sm">
                <FormLabel>
                  {intl.formatMessage(messages.extensionDate)}:
                </FormLabel>
                <div className="d-md-flex w-md-50 align-items-center">
                  <FormControl name="dueDate" type="date" size="md" onChange={onChange} />
                  <FormControl name="dueTime" type="time" size="md" className="mt-sm-3 mt-md-0" defaultValue={initialFormData.dueTime} onChange={onChange} />
                </div>
              </FormGroup>
              <FormGroup className="mt-3" size="sm">
                <FormLabel>
                  {intl.formatMessage(messages.reasonForExtension)}:
                </FormLabel>
                <FormControl name="reason" placeholder={intl.formatMessage(messages.reasonForExtension)} size="md" onChange={onChange} />
              </FormGroup>
            </div>
          </div>
        </ModalDialog.Body>
        <ModalDialog.Footer className="p-4 border-top">
          <ActionRow>
            <Button variant="tertiary" onClick={handleCancel}>{intl.formatMessage(messages.cancel)}</Button>
            <Button type="submit" disabled={!isFormFilled(formData)}>
              {intl.formatMessage(messages.addExtension)}
            </Button>
          </ActionRow>
        </ModalDialog.Footer>
      </Form>
    </ModalDialog>
  );
};

export default AddExtensionModal;
