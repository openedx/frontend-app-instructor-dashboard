import { Link, useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { useToggle, ActionRow, Button, IconButton, Dropdown } from '@openedx/paragon';
import { TrendingUp, MoreVert, OpenInNew } from '@openedx/paragon/icons';
import { useCourseInfo } from '@src/data/apiHook';
import GradingConfigurationModal from '@src/grading/components/GradingConfigurationModal';
import messages from '@src/grading/messages';
import { resolveRouteByRole } from '@src/utils/routeByRole';

const gradebookRole = 'org.openedx.frontend.role.gradebook';

const GradingActionRow = () => {
  const { courseId = '' } = useParams<{ courseId: string }>();
  const intl = useIntl();
  const { data = { gradebookUrl: '', studioGradingUrl: '' } } = useCourseInfo(courseId);
  const [isOpenConfigModal, openConfigModal, closeConfigModal] = useToggle(false);

  const handleConfigModalOpen = () => {
    openConfigModal();
  };

  // Prefer the gradebook route if the running site provides one, so navigation
  // stays within the SPA; otherwise fall back to a full page load of the URL
  // the LMS reports.
  const gradebookRoute = resolveRouteByRole(gradebookRole, { courseId });

  return (
    <>
      <ActionRow>
        {gradebookRoute?.isInternal ? (
          <Button as={Link} to={gradebookRoute.url} iconBefore={TrendingUp} variant="outline-primary">{intl.formatMessage(messages.viewGradebook)}</Button>
        ) : (
          <Button as="a" href={gradebookRoute?.url ?? data.gradebookUrl} iconBefore={TrendingUp} variant="outline-primary">{intl.formatMessage(messages.viewGradebook)}</Button>
        )}
        <Dropdown>
          <Dropdown.Toggle
            as={IconButton}
            alt={intl.formatMessage(messages.configurationAlt)}
            className="lead"
            iconAs={MoreVert}
          />
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleConfigModalOpen}>
              {intl.formatMessage(messages.viewGradingConfiguration)}
            </Dropdown.Item>
            <Dropdown.Item as="a" href={data.studioGradingUrl} target="_blank">
              {intl.formatMessage(messages.viewCourseGradingSettings)}
              <OpenInNew className="ml-2" />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </ActionRow>
      <GradingConfigurationModal isOpen={isOpenConfigModal} onClose={closeConfigModal} />
    </>
  );
};

export default GradingActionRow;
