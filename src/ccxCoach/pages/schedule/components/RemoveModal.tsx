import { useIntl } from '@openedx/frontend-base';
import { ModalDialog, ActionRow, Button } from '@openedx/paragon';
import messages from '../messages';
import { CategoryType } from '../types';
import { BLOCK_CATEGORIES } from '../constants';

interface RemoveModalProps {
  onClose: () => void;
  onRemove: () => void;
  isOpen: boolean;
  category: CategoryType;
}

const blockTypeMessageByCategory = {
  [BLOCK_CATEGORIES.CHAPTER]: messages.blockTypeSection,
  [BLOCK_CATEGORIES.SEQUENTIAL]: messages.blockTypeSubsection,
  [BLOCK_CATEGORIES.VERTICAL]: messages.blockTypeUnit,
};

const RemoveModal = ({ isOpen, onClose, onRemove, category }: RemoveModalProps): JSX.Element => {
  const intl = useIntl();
  const localizedBlockType = intl.formatMessage(blockTypeMessageByCategory[category]);
  const removeDialogTitle = intl.formatMessage(messages.removeDialogTitle, { blockType: localizedBlockType });

  return (
    <ModalDialog isOpen={isOpen} title={removeDialogTitle} onClose={onClose} isOverflowVisible={false}>
      <ModalDialog.Header>
        <ModalDialog.Title className="text-primary-500">
          {removeDialogTitle}
        </ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        <p className="text-gray-700 mb-0">{intl.formatMessage(messages.removeConfirmation, { blockType: localizedBlockType })}</p>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <Button variant="tertiary" onClick={onClose}>
            {intl.formatMessage(messages.cancelButton)}
          </Button>
          <Button onClick={onRemove}>
            {intl.formatMessage(messages.removeButton, { blockType: localizedBlockType })}
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default RemoveModal;
