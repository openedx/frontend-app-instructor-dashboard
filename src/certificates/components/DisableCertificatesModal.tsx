import { useState } from 'react';
import { ActionRow, Button, Form, ModalDialog } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import messages from '@src/certificates/messages';

interface DisableCertificatesModalProps {
  isOpen: boolean,
  isEnabled: boolean,
  onClose: () => void,
  onConfirm: () => void,
  isSubmitting: boolean,
}

const DisableCertificatesModal = ({
  isOpen,
  isEnabled,
  onClose,
  onConfirm,
  isSubmitting,
}: DisableCertificatesModalProps) => {
  const intl = useIntl();
  const [enabled, setEnabled] = useState(isEnabled);

  const handleSave = () => {
    if (enabled !== isEnabled) {
      onConfirm();
    } else {
      onClose();
    }
  };

  const handleClose = () => {
    setEnabled(isEnabled); // Reset to original value
    onClose();
  };

  return (
    <ModalDialog
      title={intl.formatMessage(messages.studentGeneratedCertificatesModalTitle)}
      onClose={handleClose}
      isOpen={isOpen}
      size="md"
      hasCloseButton
      isOverflowVisible={false}
    >
      <ModalDialog.Header className="border-bottom">
        <ModalDialog.Title>
          {intl.formatMessage(messages.studentGeneratedCertificatesModalTitle)}
        </ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body className="px-4 py-3">
        <Form.Group>
          <Form.Checkbox
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          >
            {intl.formatMessage(messages.enableStudentGeneratedCertificates)}
          </Form.Checkbox>
          <Form.Text className="text-muted">
            {intl.formatMessage(messages.studentGeneratedCertificatesDescription)}
          </Form.Text>
        </Form.Group>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <Button variant="tertiary" onClick={handleClose} disabled={isSubmitting}>
            {intl.formatMessage(messages.close)}
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSubmitting}>
            {intl.formatMessage(messages.save)}
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default DisableCertificatesModal;
