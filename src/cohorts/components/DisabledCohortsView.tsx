import { getExternalLinkUrl, useIntl } from '@openedx/frontend-base';
import { Button, Hyperlink } from '@openedx/paragon';
import messages from '../messages';

interface DisabledCohortsViewProps {
  onEnableCohorts: () => void;
}

const DisabledCohortsView = ({ onEnableCohorts }: DisabledCohortsViewProps) => {
  const intl = useIntl();

  return (
    <div className="d-flex bg-light-200 border border-light-400 p-5 mt-4.5 align-items-center">
      <p className="m-0">
        {intl.formatMessage(messages.noCohortsMessage)} <Hyperlink destination={getExternalLinkUrl('https://openedx.atlassian.net/wiki/spaces/ENG/pages/123456789/Cohorts+Feature+Documentation')} showLaunchIcon={false} target="_blank">{intl.formatMessage(messages.learnMore)}</Hyperlink>
      </p>
      <Button className="ml-3 flex-shrink-0" onClick={onEnableCohorts}>{intl.formatMessage(messages.enableCohorts)}</Button>
    </div>
  );
};

export default DisabledCohortsView;
