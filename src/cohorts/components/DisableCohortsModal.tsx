import { ActionRow, Button, ModalDialog } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import messages from '../messages';

interface DisableCohortsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDisable: () => void;
}

const DisableCohortsModal = ({ isOpen, onClose, onConfirmDisable }: DisableCohortsModalProps) => {
  const intl = useIntl();

  return (
    <ModalDialog title={intl.formatMessage(messages.disableCohorts)} onClose={onClose} isOpen={isOpen} size="sm" hasCloseButton={false} isOverflowVisible={false}>
      <div className="mx-4 mt-4 mb-2.5">
        <p>{intl.formatMessage(messages.disableMessage)}</p>
      </div>
      <ModalDialog.Footer>
        <ActionRow>
          <Button variant="tertiary" onClick={onClose}>{intl.formatMessage(messages.cancelLabel)}</Button>
          <Button variant="primary" onClick={onConfirmDisable}>{intl.formatMessage(messages.disableLabel)}</Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default DisableCohortsModal;
