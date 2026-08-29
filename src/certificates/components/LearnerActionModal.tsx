import { useState } from 'react';
import { ActionRow, Button, Form, ModalDialog } from '@openedx/paragon';

interface LearnerActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (learners: string[], notes: string) => void;
  isSubmitting: boolean;
  title: string;
  description: string;
  notesLabel: string;
  notesPlaceholder: string;
  submitLabel: string;
  cancelLabel: string;
  learnersLabel: string;
  learnersPlaceholder: string;
}

const LearnerActionModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  title,
  description,
  notesLabel,
  notesPlaceholder,
  submitLabel,
  cancelLabel,
  learnersLabel,
  learnersPlaceholder,
}: LearnerActionModalProps) => {
  const [learners, setLearners] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    // Parse comma-separated learners and filter out empty strings
    const learnersArray = learners
      .split(',')
      .map((learner) => learner.trim())
      .filter((learner) => learner.length > 0);

    if (learnersArray.length > 0) {
      onSubmit(learnersArray, notes);
      setLearners('');
      setNotes('');
    }
  };

  const handleClose = () => {
    setLearners('');
    setNotes('');
    onClose();
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={handleClose}
      hasCloseButton
      title={title}
      className="p-4"
      isOverflowVisible={false}
    >
      <ModalDialog.Header>
        <ModalDialog.Title>{title}</ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        <p className="mb-3">{description}</p>
        <Form.Group className="mb-3">
          <Form.Label>{learnersLabel}</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder={learnersPlaceholder}
            value={learners}
            onChange={(e) => setLearners(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label>{notesLabel}</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder={notesPlaceholder}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Form.Group>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <Button variant="tertiary" onClick={handleClose} disabled={isSubmitting}>
            {cancelLabel}
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting || !learners.trim()}>
            {submitLabel}
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default LearnerActionModal;
