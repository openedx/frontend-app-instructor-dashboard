import { useIntl } from '@openedx/frontend-base';
import { Button, OverlayTrigger, Tooltip } from '@openedx/paragon';
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
  onAdd: (location: string, category: CategoryType) => void;
  onRemove: (location: string, category: CategoryType) => void;
}

const BlockActions = ({
  category,
  location,
  hidden,
  onAdd,
  onRemove,
}: BlockActionsProps) => {
  const intl = useIntl();
  const { initiallyHidden, blockedByAncestorCategory } = useScheduleEdit();

  const blockType = intl.formatMessage(blockTypeMessageByCategory[category]);
  const wasInitiallyHidden = initiallyHidden.has(location);
  const parentBeingRemovedCategory = blockedByAncestorCategory.get(location);
  const handleAdd = () => onAdd(location, category);
  const handleRemove = () => onRemove(location, category);

  if (hidden && wasInitiallyHidden) {
    const addLabel = intl.formatMessage(addMessageByCategory[category]);
    if (parentBeingRemovedCategory) {
      const parentType = intl.formatMessage(blockTypeMessageByCategory[parentBeingRemovedCategory]);
      const tooltipId = `block-actions-disabled-add-${location}`;
      return (
        <OverlayTrigger
          placement="top"
          overlay={(
            <Tooltip className="info-tooltip" id={tooltipId}>
              {intl.formatMessage(messages.parentWillBeRemoved, { parentType, blockType })}
            </Tooltip>
          )}
        >
          <span className="d-inline-block">
            <Button disabled iconBefore={Add} variant="outline-primary" style={{ pointerEvents: 'none' }}>
              {addLabel}
            </Button>
          </span>
        </OverlayTrigger>
      );
    }
    return (
      <Button iconBefore={Add} variant="outline-primary" onClick={handleAdd}>
        {addLabel}
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
