import { useIntl } from '@openedx/frontend-base';
import { ModalDialog, ActionRow, Button } from '@openedx/paragon';
import messages from '../messages';
import { BlockTypeT } from '../types';

interface RemoveModalProps {
  onClose: () => void,
  onRemove: () => void,
  isOpen: boolean,
  blockType: BlockTypeT,
}

const RemoveModal = ({ isOpen, onClose, onRemove, blockType }: RemoveModalProps): JSX.Element => {
  const intl = useIntl();

  return (
    <ModalDialog isOpen={isOpen} title={intl.formatMessage(messages.removeDialogTitle)} onClose={onClose} isOverflowVisible={false}>
      <ModalDialog.Header>
        <ModalDialog.Title className="text-primary-500">
          {intl.formatMessage(messages.removeDialogTitle, { blockType })}
        </ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        <p className="text-gray-700 mb-0">{intl.formatMessage(messages.removeConfirmation, { blockType })}</p>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <Button variant="tertiary" onClick={onClose}>
            {intl.formatMessage(messages.cancelButton)}
          </Button>
          <Button onClick={onRemove}>
            {intl.formatMessage(messages.removeButton, { blockType })}
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default RemoveModal;
