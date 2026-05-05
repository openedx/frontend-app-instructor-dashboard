import { useState } from 'react';
import { ActionRow, Button, Form, ModalDialog } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import messages from '@src/certificates/messages';

interface GenerateCertificatesModalProps {
  isOpen: boolean,
  onClose: () => void,
  onConfirm: (onlyWithoutCertificate: boolean) => void,
  isSubmitting: boolean,
  learnerCount: number,
}

const GenerateCertificatesModal = ({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  learnerCount,
}: GenerateCertificatesModalProps) => {
  const intl = useIntl();
  const [selectedOption, setSelectedOption] = useState<'all' | 'without_certificate'>('all');

  const handleConfirm = () => {
    onConfirm(selectedOption === 'without_certificate');
  };

  const handleClose = () => {
    setSelectedOption('all');
    onClose();
  };

  return (
    <ModalDialog
      title={intl.formatMessage(messages.generateModalTitle)}
      onClose={handleClose}
      isOpen={isOpen}
      size="md"
      hasCloseButton={false}
      isOverflowVisible={false}
    >
      <div className="mx-4 mt-4 mb-3">
        <p className="mb-3">
          {intl.formatMessage(messages.generateModalDescription, { number: learnerCount })}
        </p>
        <Form.Group>
          <Form.RadioSet
            name="generate-option"
            onChange={(e) => setSelectedOption(e.target.value as 'all' | 'without_certificate')}
            value={selectedOption}
          >
            <Form.Radio value="all">
              {intl.formatMessage(messages.generateOptionAll)}
            </Form.Radio>
            <Form.Radio value="without_certificate">
              {intl.formatMessage(messages.generateOptionWithoutCertificate)}
            </Form.Radio>
          </Form.RadioSet>
        </Form.Group>
      </div>
      <ModalDialog.Footer>
        <ActionRow>
          <Button variant="tertiary" onClick={handleClose} disabled={isSubmitting}>
            {intl.formatMessage(messages.cancel)}
          </Button>
          <Button variant="primary" onClick={handleConfirm} disabled={isSubmitting}>
            {intl.formatMessage(messages.generate)}
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default GenerateCertificatesModal;
