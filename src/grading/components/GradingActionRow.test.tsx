import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { resolveRouteByRole } from '@openedx/frontend-base';
import { useCourseInfo } from '@src/data/apiHook';
import GradingActionRow from '@src/grading/components/GradingActionRow';
import { useGradingConfiguration } from '@src/grading/data/apiHook';
import messages from '@src/grading/messages';
import { renderWithIntl } from '@src/testUtils';

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
