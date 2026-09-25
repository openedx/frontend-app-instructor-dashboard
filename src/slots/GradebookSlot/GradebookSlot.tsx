import { Slot, useIntl, useWidgetsForId } from '@openedx/frontend-base';
import { Alert, Button } from '@openedx/paragon';
import { studentGradesSlotId } from '@src/constants';
import messages from './messages';

const GradebookSlot = ({ courseId, onBack }: { courseId: string; onBack: () => void }) => {
  const intl = useIntl();
  const widgets = useWidgetsForId(studentGradesSlotId);

  if (widgets.length === 0) {
    return (
      <Alert
        variant="warning"
        actions={[
          <Button key="gradebook-not-available-back" onClick={onBack}>
            {intl.formatMessage(messages.gradebookNotAvailableBackButton)}
          </Button>,
        ]}
      >
        <Alert.Heading>
          {intl.formatMessage(messages.gradebookNotAvailableTitle)}
        </Alert.Heading>
        <p>{intl.formatMessage(messages.gradebookNotAvailableMessage)}</p>
      </Alert>
    );
  }

  return (
    <Slot id={studentGradesSlotId} courseId={courseId} onBack={onBack} />
  );
};

export default GradebookSlot;
