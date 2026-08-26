/* istanbul ignore file */
import { useState } from 'react';
import { useToggle } from '@openedx/paragon';
import ScheduleModal from '@src/ccxCoach/pages/schedule/components/ScheduleModal';
import RemoveModal from './RemoveModal';
import { BlockTypeT } from '../types';

const EditSchedule = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isOpenScheduleModal, openScheduleModal, closeScheduleModal] = useToggle(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isOpenRemoveModal, openRemoveModal, closeRemoveModal] = useToggle(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [blockType, setBlockType] = useState<BlockTypeT>('section');
  const handleSave = (startDate: string, endDate?: string) => {
    console.log('Saved dates:', startDate, endDate);
  };

  const handleRemove = () => {
    console.log('Schedule removed');
  };

  return (
    <>
      <ScheduleModal
        isOpen={isOpenScheduleModal}
        type={blockType}
        onClose={closeScheduleModal}
        onSave={handleSave}
      />
      <RemoveModal
        blockType={blockType}
        isOpen={isOpenRemoveModal}
        onClose={closeRemoveModal}
        onRemove={handleRemove}
      />
    </>
  );
};

export default EditSchedule;
