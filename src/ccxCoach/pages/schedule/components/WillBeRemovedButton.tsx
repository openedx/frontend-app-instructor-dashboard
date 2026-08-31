import { useState } from 'react';
import { useIntl } from '@openedx/frontend-base';
import { Button } from '@openedx/paragon';
import { Delete } from '@openedx/paragon/icons';
import messages from '../messages';

interface WillBeRemovedButtonProps {
  blockType: string;
  onUndo: () => void;
}

const WillBeRemovedButton = ({ blockType, onUndo }: WillBeRemovedButtonProps) => {
  const intl = useIntl();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Button
      iconBefore={Delete}
      variant="tertiary"
      onClick={onUndo}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {isHovered
        ? intl.formatMessage(messages.undoKeep, { blockType })
        : intl.formatMessage(messages.willBeRemoved, { blockType })}
    </Button>
  );
};

export default WillBeRemovedButton;
