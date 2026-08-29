import { useIntl } from '@openedx/frontend-base';
import { ModalDialog, ActionRow, Button } from '@openedx/paragon';
import messages from '../messages';

interface ResetExtensionsModalProps {
  isOpen: boolean;
  message: string;
  title: string;
  onCancelReset: () => void;
  onClose: () => void;
  onConfirmReset: () => void;
}

const ResetExtensionsModal = ({
  isOpen,
  message,
  title,
  onCancelReset,
  onClose,
  onConfirmReset,
}: ResetExtensionsModalProps) => {
  const intl = useIntl();
  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} hasCloseButton={false} title={title} isOverflowVisible={false} className="p-4">
      <h4 className="mb-2.5">{title}</h4>
      <p className="mb-2.5">{message}</p>
      <ActionRow>
        <Button variant="tertiary" onClick={onCancelReset}>{intl.formatMessage(messages.cancel)}</Button>
        <Button variant="primary" onClick={onConfirmReset}>{intl.formatMessage(messages.confirm)}</Button>
      </ActionRow>
    </ModalDialog>
  );
};

export default ResetExtensionsModal;
