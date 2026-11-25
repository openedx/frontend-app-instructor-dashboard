import { useState } from 'react';
import { useIntl } from '@openedx/frontend-base';
import { Button, ButtonGroup, Card, Skeleton } from '@openedx/paragon';
import { PendingTasks } from '@src/components/PendingTasks';
import GradingActionRow from '@src/grading/components/GradingActionRow';
import GradingLearnerContent from '@src/grading/components/GradingLearnerContent';
import messages from '@src/grading/messages';
import { GradingToolsType } from '@src/grading/types';
import { COURSE_PERMISSIONS, PermissionAlert, PermissionGate } from '@src/permissions';
import AccessErrorAlert from '@src/providers/AccessErrorAlert';

const GradingContent = () => {
  const intl = useIntl();
  const [selectedTools, setSelectedTools] = useState<GradingToolsType>('single');
  const [isPendingTasksOpen, setIsPendingTasksOpen] = useState(false);

  const handleOpenPendingTasks = () => {
    setIsPendingTasksOpen(true);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="text-primary-700 mb-0">{intl.formatMessage(messages.pageTitle)}</h3>
        <GradingActionRow />
      </div>
      <PermissionGate
        permission={COURSE_PERMISSIONS.MANAGE_LEARNER_GRADING}
        fallback={<PermissionAlert className="mt-4" />}
      >
        <Card className="bg-light-200 p-4 mt-4.5">
          <ButtonGroup className="d-block">
            <Button
              onClick={() => setSelectedTools('single')}
              variant={selectedTools === 'single' ? 'primary' : 'outline-primary'}
            >
              {intl.formatMessage(messages.singleLearner)}
            </Button>
            <Button
              onClick={() => setSelectedTools('all')}
              variant={selectedTools === 'all' ? 'primary' : 'outline-primary'}
            >
              {intl.formatMessage(messages.allLearners)}
            </Button>
          </ButtonGroup>
          <GradingLearnerContent toolType={selectedTools} onShowTasks={handleOpenPendingTasks} />
        </Card>
        <PendingTasks isOpen={isPendingTasksOpen} onToggle={() => setIsPendingTasksOpen(prev => !prev)} />
      </PermissionGate>
    </>
  );
};

// Tab visibility comes from courseInfo.tabs; this gate protects direct URLs.
const GradingPage = () => (
  <PermissionGate
    anyOf={[
      COURSE_PERMISSIONS.VIEW_GRADEBOOK,
      COURSE_PERMISSIONS.VIEW_GRADING_CONFIGURATION,
      COURSE_PERMISSIONS.VIEW_GRADING_SETTINGS,
      COURSE_PERMISSIONS.MANAGE_LEARNER_GRADING,
    ]}
    loading={<Skeleton className="lead" />}
    fallback={<AccessErrorAlert errorType="forbidden" />}
  >
    <GradingContent />
  </PermissionGate>
);

export default GradingPage;
