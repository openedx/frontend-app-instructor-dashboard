import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { resolveRouteByRole } from '@openedx/frontend-base';
import { useCourseInfo } from '@src/data/apiHook';
import GradingActionRow from '@src/grading/components/GradingActionRow';
import { useGradingConfiguration } from '@src/grading/data/apiHook';
import messages from '@src/grading/messages';
import { renderWithAlertAndIntl as renderWithIntl } from '@src/testUtils';
import { COURSE_PERMISSIONS } from '@src/permissions';
import { mockCoursePermissions } from '@src/permissions/testUtils';

jest.mock('@src/permissions/useCoursePermissions');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    courseId: 'course-v1:edX+DemoX+Demo_Course',
  }),
}));

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  resolveRouteByRole: jest.fn(),
}));

jest.mock('@src/data/apiHook', () => ({
  useCourseInfo: jest.fn(),
}));

jest.mock('@src/grading/data/apiHook', () => ({
  useGradingConfiguration: jest.fn(),
}));

describe('GradingActionRow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCoursePermissions({
      [COURSE_PERMISSIONS.VIEW_GRADEBOOK]: true,
      [COURSE_PERMISSIONS.VIEW_GRADING_CONFIGURATION]: true,
      [COURSE_PERMISSIONS.VIEW_GRADING_SETTINGS]: true,
    });
    (resolveRouteByRole as jest.Mock).mockReturnValue(null);
    (useCourseInfo as jest.Mock).mockReturnValue({ data: { gradebookUrl: 'https://example.com/gradebook', studioGradingUrl: 'https://example.com/studio' } });
    // TODO: Update this mock to use similar structure when API is ready, currently just returning random text to ensure component renders without error
    (useGradingConfiguration as jest.Mock).mockReturnValue({ data: 'Some random text' });
  });

  it('renders ActionRow with gradebook and configuration buttons', () => {
    renderWithIntl(<GradingActionRow />);
    const gradebookLink = screen.getByRole('link', { name: messages.viewGradebook.defaultMessage });
    expect(gradebookLink).toHaveAttribute('href', 'https://example.com/gradebook');
    expect(screen.getByRole('button', { name: messages.configurationAlt.defaultMessage })).toBeInTheDocument();
  });

  describe('permissions', () => {
    it.each([
      { gradebook: false, configuration: false, settings: false },
      { gradebook: true, configuration: false, settings: false },
      { gradebook: false, configuration: true, settings: false },
      { gradebook: false, configuration: false, settings: true },
      { gradebook: true, configuration: true, settings: false },
      { gradebook: true, configuration: false, settings: true },
      { gradebook: false, configuration: true, settings: true },
      { gradebook: true, configuration: true, settings: true },
    ])('shows authorized controls for gradebook=$gradebook configuration=$configuration settings=$settings', async ({ gradebook, configuration, settings }) => {
      mockCoursePermissions({
        [COURSE_PERMISSIONS.VIEW_GRADEBOOK]: gradebook,
        [COURSE_PERMISSIONS.VIEW_GRADING_CONFIGURATION]: configuration,
        [COURSE_PERMISSIONS.VIEW_GRADING_SETTINGS]: settings,
        [COURSE_PERMISSIONS.MANAGE_LEARNER_GRADING]: true,
      });
      renderWithIntl(<GradingActionRow />);
      expect(!!screen.queryByRole('link', { name: messages.viewGradebook.defaultMessage })).toBe(gradebook);
      const menu = screen.queryByRole('button', { name: messages.configurationAlt.defaultMessage });
      expect(!!menu).toBe(configuration || settings);
      if (menu) {
        await userEvent.setup().click(menu);
        expect(!!screen.queryByText(messages.viewGradingConfiguration.defaultMessage)).toBe(configuration);
        expect(!!screen.queryByText(messages.viewCourseGradingSettings.defaultMessage)).toBe(settings);
      }
      expect(useGradingConfiguration).not.toHaveBeenCalled();
    });

    it('does not mount the configuration query while permissions load', () => {
      mockCoursePermissions({}, { isLoading: true });
      renderWithIntl(<GradingActionRow />);
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(useGradingConfiguration).not.toHaveBeenCalled();
    });
  });

  it('renders an SPA link when the site provides a gradebook route', () => {
    (resolveRouteByRole as jest.Mock).mockReturnValue({ url: '/gradebook/course-v1:edX+DemoX+Demo_Course', isInternal: true });
    renderWithIntl(<MemoryRouter><GradingActionRow /></MemoryRouter>);
    expect(resolveRouteByRole).toHaveBeenCalledWith('org.openedx.frontend.role.gradebook', { courseId: 'course-v1:edX+DemoX+Demo_Course' });
    const gradebookLink = screen.getByRole('link', { name: messages.viewGradebook.defaultMessage });
    expect(gradebookLink).toHaveAttribute('href', '/gradebook/course-v1:edX+DemoX+Demo_Course');
  });

  it('renders a plain anchor when the gradebook route is external', () => {
    (resolveRouteByRole as jest.Mock).mockReturnValue({ url: 'https://other.example.com/gradebook', isInternal: false });
    renderWithIntl(<GradingActionRow />);
    const gradebookLink = screen.getByRole('link', { name: messages.viewGradebook.defaultMessage });
    expect(gradebookLink).toHaveAttribute('href', 'https://other.example.com/gradebook');
  });

  it('opens configuration menu when configuration button is clicked', async () => {
    renderWithIntl(<GradingActionRow />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: messages.configurationAlt.defaultMessage }));
    expect(screen.getByText('View Grading Configuration')).toBeInTheDocument();
    expect(screen.getByText('View Course Grading Settings')).toBeInTheDocument();
  });

  it('opens and closes GradingConfigurationModal when menu item is clicked', async () => {
    renderWithIntl(<GradingActionRow />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: messages.configurationAlt.defaultMessage }));
    const gradingConfigButton = screen.getByText('View Grading Configuration');
    await user.click(gradingConfigButton);
    expect(screen.getByRole('dialog', { name: messages.gradingConfiguration.defaultMessage })).toBeInTheDocument();

    // Close modal
    await user.click(screen.getAllByRole('button', { name: messages.close.defaultMessage })[0]);
    expect(screen.queryByRole('dialog', { name: messages.gradingConfiguration.defaultMessage })).not.toBeInTheDocument();
  });
});
