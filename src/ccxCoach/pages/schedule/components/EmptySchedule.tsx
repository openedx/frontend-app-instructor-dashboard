import { useIntl } from '@openedx/frontend-base';
import { Button } from '@openedx/paragon';
import messages from '../messages';
import { Event } from '@openedx/paragon/icons';

const EmptySchedule = () => {
  const intl = useIntl();

  const handleScheduleCCX = () => {
    // Implement the logic to schedule a CCX course here
  };

  return (
    <div className="d-flex bg-light-200 border border-light-400 p-5 mt-4.5 align-items-center justify-content-center">
      <p className="m-0">
        {intl.formatMessage(messages.emptyScheduleMessage)}
      </p>
      <Button className="ml-3 flex-shrink-0" iconBefore={Event} onClick={handleScheduleCCX}>{intl.formatMessage(messages.schedulePageTitle)}</Button>
    </div>
  );
};

export default EmptySchedule;
