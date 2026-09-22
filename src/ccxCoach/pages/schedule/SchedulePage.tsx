import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { Button, OverlayTrigger, Skeleton, Tooltip, useToggle } from '@openedx/paragon';
import { Edit } from '@openedx/paragon/icons';
import { useCcxSchedule, useSaveCcxSchedule } from '@src/ccxCoach/data/apiHook';
import Schedule from '@src/ccxCoach/pages/schedule/components/Schedule';
import EmptySchedule from '@src/ccxCoach/pages/schedule/components/EmptySchedule';
import messages from './messages';
import { BlockAttributes } from './types';
import { useAlert } from '@src/providers/AlertProvider';
import { isAxiosError } from 'axios';

const SchedulePage = () => {
  const { courseId = '' } = useParams<{ courseId: string }>();
  const intl = useIntl();
  const { data: scheduleData = [], isLoading, isFetching } = useCcxSchedule(courseId);
  const { mutate: saveCcxSchedule, isPending: isSaving } = useSaveCcxSchedule(courseId);
  const isEmptySchedule = scheduleData.filter((chapter: BlockAttributes) => !chapter.hidden).length === 0;
  const [isEditing, startEditing, cancelEditing] = useToggle(false);
  const { showModal, showToast } = useAlert();

  const handleSaveSchedule = (editedScheduleData: BlockAttributes[]) => {
    saveCcxSchedule(editedScheduleData, {
      onSuccess: () => {
        showToast(intl.formatMessage(messages.saveSuccess));
      },
      onError: (error) => {
        const message = (isAxiosError(error) && error.response?.data?.detail) || intl.formatMessage(messages.saveError);
        showModal({
          confirmText: intl.formatMessage(messages.closeButton),
          message: message,
          variant: 'danger',
        });
      },
    });
    cancelEditing();
  };

  const editButton = (
    <Button iconBefore={Edit} disabled={isEditing} onClick={startEditing}>
      {intl.formatMessage(messages.editCcxSchedule)}
    </Button>
  );

  if (isLoading || isSaving || isFetching) {
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
