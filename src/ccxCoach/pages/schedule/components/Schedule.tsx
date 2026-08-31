import { useMemo, useState } from 'react';
import { useIntl } from '@openedx/frontend-base';
import { ActionRow, Button, useToggle } from '@openedx/paragon';
import RemoveModal from '@src/ccxCoach/pages/schedule/components/RemoveModal';
import ScheduleModal from '@src/ccxCoach/pages/schedule/components/ScheduleModal';
import { ScheduleEditProvider } from '@src/ccxCoach/pages/schedule/components/ScheduleEditContext';
import SectionCard from '@src/ccxCoach/pages/schedule/components/SectionCard';
import messages from '../messages';
import { BlockAttributes, CategoryType } from '../types';

interface EditScheduleProps {
  scheduleData: BlockAttributes[],
  isEditing: boolean,
  onSave: (editedScheduleData: BlockAttributes[]) => void,
  onCancel: () => void,
  startEditing: () => void,
}

const updateBlockAttributes = (
  blocks: BlockAttributes[],
  selectedLocation: string,
  hidden: boolean,
  start?: string,
  due?: string,
): BlockAttributes[] => {
  const setBlockAndChildrenHidden = (block: BlockAttributes): BlockAttributes => ({
    ...block,
    hidden,
    ...(block.children && { children: block.children.map(setBlockAndChildrenHidden) }),
  });

  const setSelectedBlockDates = (block: BlockAttributes): BlockAttributes => ({
    ...block,
    ...(block.category === 'chapter' && start && { start }),
    ...(block.category === 'sequential' && start && { start }),
    ...(block.category === 'sequential' && due && { due }),
  });

  const updateBlock = (block: BlockAttributes): [BlockAttributes, boolean] => {
    if (block.location === selectedLocation) {
      if (block.category === 'chapter' || block.category === 'sequential') {
        return [setSelectedBlockDates(setBlockAndChildrenHidden(block)), false];
      }

      return [{ ...block, hidden }, block.category === 'vertical'];
    }

    if (!block.children) {
      return [block, false];
    }

    let hasSelectedVerticalChild = false;
    const children = block.children.map((child) => {
      const [updatedChild, hasSelectedVertical] = updateBlock(child);
      hasSelectedVerticalChild = hasSelectedVerticalChild || hasSelectedVertical;
      return updatedChild;
    });
    const shouldUpdateParentHidden = hasSelectedVerticalChild && (block.category === 'chapter' || block.category === 'sequential');

    return [{
      ...block,
      hidden: shouldUpdateParentHidden ? (hidden ? children.every((child) => child.hidden) : false) : block.hidden,
      children,
    }, hasSelectedVerticalChild && block.category !== 'chapter'];
  };

  return blocks.map((block) => updateBlock(block)[0]);
};

const findBlockByLocation = (blocks: BlockAttributes[], location: string): BlockAttributes | undefined => {
  for (const block of blocks) {
    if (block.location === location) {
      return block;
    }
    if (block.children) {
      const found = findBlockByLocation(block.children, location);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
};

const collectHiddenLocations = (blocks: BlockAttributes[]): Set<string> => {
  const hidden = new Set<string>();
  const walk = (currentBlocks: BlockAttributes[]) => {
    for (const block of currentBlocks) {
      if (block.hidden) {
        hidden.add(block.location);
      }
      if (block.children) {
        walk(block.children);
      }
    }
  };
  walk(blocks);
  return hidden;
};

const Schedule = ({ scheduleData, isEditing, onSave, onCancel, startEditing }: EditScheduleProps) => {
  const intl = useIntl();
  const [editedScheduleData, setEditedScheduleData] = useState<BlockAttributes[]>(scheduleData);
  const [isOpenScheduleModal, openScheduleModal, closeScheduleModal] = useToggle(false);
  const [isOpenRemoveModal, openRemoveModal, closeRemoveModal] = useToggle(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const selectedBlock = useMemo(
    () => (selectedLocation ? findBlockByLocation(editedScheduleData, selectedLocation) : undefined),
    [editedScheduleData, selectedLocation],
  );
  const initiallyHiddenLocations = useMemo(() => collectHiddenLocations(scheduleData), [scheduleData]);

  const handleAdd = (location: string, category: CategoryType) => {
    if (category !== 'vertical') {
      setSelectedCategory(category);
      setSelectedLocation(location);
      openScheduleModal();
    } else {
      setEditedScheduleData((currentScheduleData) => updateBlockAttributes(currentScheduleData, location, false));
    }
  };

  const handleConfirmSave = (startDate: string, endDate?: string) => {
    setEditedScheduleData((currentScheduleData) => updateBlockAttributes(
      currentScheduleData,
      selectedLocation,
      false,
      startDate,
      endDate,
    ));
    setSelectedLocation('');
    setSelectedCategory(null);
    if (!isEditing) startEditing();
    closeScheduleModal();
  };

  const handleRemove = (location: string, category: CategoryType) => {
    if (category !== 'vertical') {
      setSelectedCategory(category);
      setSelectedLocation(location);
      openRemoveModal();
    } else {
      setEditedScheduleData((currentScheduleData) => updateBlockAttributes(currentScheduleData, location, true));
    }
  };

  const handleConfirmRemove = () => {
    setEditedScheduleData((currentScheduleData) => updateBlockAttributes(currentScheduleData, selectedLocation, true));
    setSelectedLocation('');
    setSelectedCategory(null);
    closeRemoveModal();
  };

  return (
    <ScheduleEditProvider initiallyHidden={initiallyHiddenLocations}>
      {
        editedScheduleData.length > 0 && (editedScheduleData.map((section) => (
          <SectionCard
            key={section.location}
            {...section}
            isEditing={isEditing}
            onAdd={handleAdd}
            onRemove={handleRemove}
          />
        )))
      }
      { isEditing && (
        <ActionRow className="position-sticky bg-white border-top p-3 mt-4 mx-n4" style={{ bottom: 0 }}>
          <Button variant="tertiary" onClick={onCancel}>
            {intl.formatMessage(messages.cancelButton)}
          </Button>
          <Button onClick={() => onSave(editedScheduleData)}>
            {intl.formatMessage(messages.saveButton)}
          </Button>
        </ActionRow>
      )}
      { selectedCategory && (
        <>
          <ScheduleModal
            isOpen={isOpenScheduleModal}
            category={selectedCategory}
            start={selectedBlock?.start}
            due={selectedBlock?.due}
            onClose={closeScheduleModal}
            onSave={handleConfirmSave}
          />
          <RemoveModal
            category={selectedCategory}
            isOpen={isOpenRemoveModal}
            onClose={closeRemoveModal}
            onRemove={handleConfirmRemove}
          />
        </>
      )}
    </ScheduleEditProvider>
  );
};

export default Schedule;
