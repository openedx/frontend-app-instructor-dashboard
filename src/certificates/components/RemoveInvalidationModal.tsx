import { ActionRow, Button, ModalDialog } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import messages from '@src/certificates/messages';

interface RemoveInvalidationModalProps {
  isOpen: boolean;
  email: string;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

const RemoveInvalidationModal = ({
  isOpen,
  email,
  onClose,
  onConfirm,
  isSubmitting,
}: RemoveInvalidationModalProps) => {
  const intl = useIntl();

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      hasCloseButton={false}
      title={intl.formatMessage(messages.removeInvalidationModalTitle)}
      className="p-4"
      isOverflowVisible={false}
    >
      <ModalDialog.Header>
        <ModalDialog.Title>
          {intl.formatMessage(messages.removeInvalidationModalTitle)}
        </ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        <p className="mb-2.5">
          {intl.formatMessage(messages.removeInvalidationModalMessage, { email })}
        </p>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <Button variant="tertiary" onClick={onClose} disabled={isSubmitting}>
            {intl.formatMessage(messages.cancel)}
          </Button>
          <Button variant="primary" onClick={onConfirm} disabled={isSubmitting}>
            {intl.formatMessage(messages.removeInvalidationAction)}
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default RemoveInvalidationModal;
