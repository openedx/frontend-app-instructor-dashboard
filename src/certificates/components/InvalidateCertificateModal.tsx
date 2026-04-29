import { useState } from 'react';
import { useIntl } from '@openedx/frontend-base';
import { ActionRow, Button, Form, ModalDialog } from '@openedx/paragon';
import messages from '@src/certificates/messages';

interface InvalidateCertificateModalProps {
  isOpen: boolean,
  onClose: () => void,
  onSubmit: (learners: string[], notes: string) => void,
  isSubmitting: boolean,
}

const InvalidateCertificateModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: InvalidateCertificateModalProps) => {
  const intl = useIntl();
  const [learner, setLearner] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    const trimmedLearner = learner.trim();
    if (trimmedLearner) {
      onSubmit([trimmedLearner], notes);
      setLearner('');
      setNotes('');
    }
  };

  const handleClose = () => {
    setLearner('');
    setNotes('');
    onClose();
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={handleClose}
      hasCloseButton
      title={intl.formatMessage(messages.invalidateCertificateModalTitle)}
      className="invalidate-certificate-modal"
      isOverflowVisible={false}
    >
      <ModalDialog.Header className="border-bottom">
        <ModalDialog.Title>{intl.formatMessage(messages.invalidateCertificateModalTitle)}</ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body className="px-3">
        <p className="mb-3">{intl.formatMessage(messages.invalidateCertificateModalDescription)}</p>
        <Form.Group className="mb-3">
          <Form.Label>{intl.formatMessage(messages.learnerLabel)}</Form.Label>
          <Form.Control
            type="text"
            placeholder={intl.formatMessage(messages.learnerPlaceholder)}
            value={learner}
            onChange={(e) => setLearner(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>{intl.formatMessage(messages.notesLabel)}</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder={intl.formatMessage(messages.notesPlaceholder)}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Form.Group>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <Button variant="tertiary" onClick={handleClose} disabled={isSubmitting}>
            {intl.formatMessage(messages.cancel)}
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting || !learner.trim()}>
            {intl.formatMessage(messages.save)}
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default InvalidateCertificateModal;
