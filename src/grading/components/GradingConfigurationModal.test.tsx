import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithAlertAndIntl as renderWithIntl } from '@src/testUtils';
import { useGradingConfiguration } from '@src/grading/data/apiHook';
import GradingConfigurationModal from '@src/grading/components/GradingConfigurationModal';
import messages from '@src/grading/messages';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    courseId: 'course-v1:edX+DemoX+Demo_Course',
  }),
}));

jest.mock('../data/apiHook', () => ({
  useGradingConfiguration: jest.fn(),
}));

describe('GradingConfigurationModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    (useGradingConfiguration as jest.Mock).mockReturnValue({ data: null });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when isOpen is true', () => {
    renderWithIntl(<GradingConfigurationModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    renderWithIntl(<GradingConfigurationModal isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('displays grading configuration data when available', () => {
    (useGradingConfiguration as jest.Mock).mockReturnValue({ data: 'Test grading configuration' });
    renderWithIntl(<GradingConfigurationModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText('Test grading configuration')).toBeInTheDocument();
  });

  it('displays no grading configuration message when data is null', () => {
    (useGradingConfiguration as jest.Mock).mockReturnValue({ data: null });
    renderWithIntl(<GradingConfigurationModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText(messages.noGradingConfiguration.defaultMessage)).toBeInTheDocument();
  });

  it('calls useGradingConfiguration with courseId from params', () => {
    renderWithIntl(<GradingConfigurationModal isOpen={true} onClose={mockOnClose} />);
    expect(useGradingConfiguration).toHaveBeenCalledWith('course-v1:edX+DemoX+Demo_Course');
  });

  it('closes on 403 and shows a dismissible permission denied error modal instead of an empty configuration', async () => {
    (useGradingConfiguration as jest.Mock).mockReturnValue({
      data: null,
      error: { response: { status: 403 } },
    });
    renderWithIntl(<GradingConfigurationModal isOpen={true} onClose={mockOnClose} />);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog', { name: messages.gradingConfiguration.defaultMessage })).not.toBeInTheDocument();
    expect(screen.queryByText(messages.noGradingConfiguration.defaultMessage)).not.toBeInTheDocument();
    const errorModal = screen.getByRole('dialog');
    expect(errorModal).toHaveClass('pgn__modal-danger');
    expect(within(errorModal).getByText("You don't have permission to perform this action.")).toBeVisible();

    await userEvent.setup().click(within(errorModal).getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
