import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { Button, Skeleton } from '@openedx/paragon';
import { Edit } from '@openedx/paragon/icons';
import { useCcxSchedule } from '@src/ccxCoach/data/apiHook';
import EditSchedule from '@src/ccxCoach/pages/schedule/components/EditSchedule';
import EmptySchedule from '@src/ccxCoach/pages/schedule/components/EmptySchedule';
import messages from './messages';

const SchedulePage = () => {
  const { courseId = '' } = useParams<{ courseId: string }>();
  const intl = useIntl();
  const { data: scheduleData = [], isLoading } = useCcxSchedule(courseId);
  const isEmptySchedule = scheduleData.length === 0;

  if (isLoading) {
    return <Skeleton count={3} />;
  }

  return (
    <div className={isEmptySchedule ? 'mb-3' : 'd-flex align-items-center justify-content-between mb-3'}>
      <h3 className="text-primary-500 mb-0">{intl.formatMessage(messages.schedulePageTitle)}</h3>
      {
        isEmptySchedule ? (
          <EmptySchedule />
        ) : (
          <>
            <Button iconBefore={Edit}>
              {intl.formatMessage(messages.editCcxSchedule)}
            </Button>
            <EditSchedule />
          </>
        )
      }
    </div>
  );
};

export default SchedulePage;
