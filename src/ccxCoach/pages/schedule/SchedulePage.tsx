import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { Button, OverlayTrigger, Skeleton, Tooltip, useToggle } from '@openedx/paragon';
import { Edit } from '@openedx/paragon/icons';
import { useCcxSchedule, useSaveCcxSchedule } from '@src/ccxCoach/data/apiHook';
import Schedule from '@src/ccxCoach/pages/schedule/components/Schedule';
import EmptySchedule from '@src/ccxCoach/pages/schedule/components/EmptySchedule';
import messages from './messages';
import { BlockAttributes } from './types';

const SchedulePage = () => {
  const { courseId = '' } = useParams<{ courseId: string }>();
  const intl = useIntl();
  const { data: scheduleData = [], isLoading } = useCcxSchedule(courseId);
  const { mutate: saveCcxSchedule } = useSaveCcxSchedule(courseId);
  const isEmptySchedule = scheduleData.filter((chapter: BlockAttributes) => !chapter.hidden).length === 0;
  const [isEditing, startEditing, cancelEditing] = useToggle(false);

  const handleSaveSchedule = (editedScheduleData: BlockAttributes[]) => {
    saveCcxSchedule(editedScheduleData);
    cancelEditing();
  };

  const editButton = (
    <Button iconBefore={Edit} disabled={isEditing} onClick={startEditing}>
      {intl.formatMessage(messages.editCcxSchedule)}
    </Button>
  );

  if (isLoading) {
    return <Skeleton count={3} />;
  }

  return (
    isEmptySchedule && !isEditing ? (
      <>
        <h3 className="text-primary-500 mb-0">{intl.formatMessage(messages.schedulePageTitle)}</h3>
        <EmptySchedule onScheduleCCX={startEditing} />
      </>
    ) : (
      <>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h3 className="text-primary-500 mb-0">{intl.formatMessage(messages.schedulePageTitle)}</h3>
          {isEditing ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="edit-ccx-schedule-tooltip" className="info-tooltip">{intl.formatMessage(messages.editCcxScheduleTooltip)}</Tooltip>}
            >
              <span className="d-inline-block">
                {editButton}
              </span>
            </OverlayTrigger>
          ) : editButton}
        </div>
        <Schedule scheduleData={scheduleData} isEditing={isEditing} onSave={handleSaveSchedule} onCancel={cancelEditing} startEditing={startEditing} />
      </>
    )
  );
};

export default SchedulePage;
