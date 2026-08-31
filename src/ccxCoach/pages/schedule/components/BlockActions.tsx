import { useIntl } from '@openedx/frontend-base';
import { Button } from '@openedx/paragon';
import { Add, Delete } from '@openedx/paragon/icons';
import WillBeRemovedButton from '@src/ccxCoach/pages/schedule/components/WillBeRemovedButton';
import { useScheduleEdit } from '@src/ccxCoach/pages/schedule/components/ScheduleEditContext';
import messages from '../messages';
import { CategoryType } from '../types';

const addMessageByCategory = {
  chapter: messages.addSection,
  sequential: messages.addSubsection,
  vertical: messages.addUnit,
};

const blockTypeMessageByCategory = {
  chapter: messages.blockTypeSection,
  sequential: messages.blockTypeSubsection,
  vertical: messages.blockTypeUnit,
};

interface BlockActionsProps {
  category: CategoryType;
  location: string;
  hidden: boolean;
  isEditing: boolean;
  onAdd: (location: string, category: CategoryType) => void;
  onRemove: (location: string, category: CategoryType) => void;
}

const BlockActions = ({ category, location, hidden, isEditing, onAdd, onRemove }: BlockActionsProps) => {
  const intl = useIntl();
  const { initiallyHidden } = useScheduleEdit();

  if (!isEditing) {
    return null;
  }

  const blockType = intl.formatMessage(blockTypeMessageByCategory[category]);
  const wasInitiallyHidden = initiallyHidden.has(location);
  const handleAdd = () => onAdd(location, category);
  const handleRemove = () => onRemove(location, category);

  if (hidden && wasInitiallyHidden) {
    return (
      <Button iconBefore={Add} variant="outline-primary" onClick={handleAdd}>
        {intl.formatMessage(addMessageByCategory[category])}
      </Button>
    );
  }

  if (hidden) {
    return <WillBeRemovedButton blockType={blockType} onUndo={handleAdd} />;
  }

  return (
    <Button iconBefore={Delete} variant="tertiary" onClick={handleRemove}>
      {intl.formatMessage(messages.removeButton, { blockType })}
    </Button>
  );
};

export default BlockActions;
