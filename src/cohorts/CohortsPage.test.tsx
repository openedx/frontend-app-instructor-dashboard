import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CohortsPage from './CohortsPage';
import { useCohorts, useCohortStatus, useToggleCohorts } from './data/apiHook';
import { renderWithAlertAndIntl } from '@src/testUtils';
import messages from './messages';
import { CohortProvider } from './components/CohortContext';
import * as AlertProvider from '@src/providers/AlertProvider';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'course-v1:edX+Test+2024' }),
}));

jest.mock('axios', () => ({
  isAxiosError: (error: any) => error?.isAxiosError === true,
}));

jest.mock('./data/apiHook', () => ({
  useCohorts: jest.fn(),
  useCohortStatus: jest.fn(),
  useToggleCohorts: jest.fn(),
  useCreateCohort: () => ({ mutate: jest.fn() }),
}));

describe('CohortsPage', () => {
  const renderWithCohortsProvider = () => renderWithAlertAndIntl(<CohortProvider><CohortsPage /></CohortProvider>);
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders cohorts list and add button when cohorts exist', () => {
    (useCohorts as jest.Mock).mockReturnValue({ data: [{ id: '1', name: 'Cohort 1' }] });
    (useCohortStatus as jest.Mock).mockReturnValue({ data: { isCohorted: true } });
    (useToggleCohorts as jest.Mock).mockReturnValue({ mutate: jest.fn() });

    renderWithCohortsProvider();
    expect(screen.getByText(messages.cohortsTitle.defaultMessage)).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Cohort 1' })).toBeInTheDocument();
    expect(screen.getByText(`+ ${messages.addCohort.defaultMessage}`)).toBeInTheDocument();
  });

  it('renders no cohorts message and enable button when no cohorts', () => {
    (useCohorts as jest.Mock).mockReturnValue({ data: [] });
    (useCohortStatus as jest.Mock).mockReturnValue({ data: { isCohorted: false } });
    (useToggleCohorts as jest.Mock).mockReturnValue({ mutate: jest.fn() });

    renderWithCohortsProvider();
    expect(screen.getByText(messages.noCohortsMessage.defaultMessage)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.enableCohorts.defaultMessage })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: messages.learnMore.defaultMessage })).toBeInTheDocument();
  });

  it('calls enableCohortsMutate when enable button is clicked', async () => {
    const enableMock = jest.fn();
    (useCohorts as jest.Mock).mockReturnValue({ data: [] });
    (useCohortStatus as jest.Mock).mockReturnValue({ data: { isCohorted: false } });
    (useToggleCohorts as jest.Mock).mockReturnValue({ mutate: enableMock });

    renderWithCohortsProvider();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: messages.enableCohorts.defaultMessage }));
    expect(enableMock).toHaveBeenCalled();
  });

  it('opens and closes the disable cohorts modal', async () => {
    (useCohorts as jest.Mock).mockReturnValue({ data: [{ id: '1', name: 'Cohort 1' }] });
    (useCohortStatus as jest.Mock).mockReturnValue({ data: { isCohorted: true } });
    (useToggleCohorts as jest.Mock).mockReturnValue({ mutate: jest.fn() });

    renderWithCohortsProvider();
    const user = userEvent.setup();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: messages.disableCohorts.defaultMessage }));
    expect(screen.getByRole('dialog', { name: messages.disableCohorts.defaultMessage })).toBeInTheDocument();
  });

  it('calls disableCohortsMutate and closes modal on confirm', async () => {
    const disableMock = jest.fn();
    (useCohorts as jest.Mock).mockReturnValue({ data: [{ id: '1', name: 'Cohort 1' }] });
    (useCohortStatus as jest.Mock).mockReturnValue({ data: { isCohorted: true } });
    (useToggleCohorts as jest.Mock).mockReturnValue({ mutate: disableMock });

    renderWithCohortsProvider();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: messages.disableCohorts.defaultMessage }));
    await user.click(screen.getByRole('button', { name: messages.disableLabel.defaultMessage }));
    expect(disableMock).toHaveBeenCalled();
  });

  it('shows error modal when enable cohorts fails', async () => {
    const showModalMock = jest.fn();
    jest.spyOn(AlertProvider, 'useAlert').mockReturnValue({
      alerts: [],
      addAlert: jest.fn(),
      removeAlert: jest.fn(),
      clearAlerts: jest.fn(),
      showToast: jest.fn(),
      showModal: showModalMock,
      showInlineAlert: jest.fn(),
      dismissInlineAlert: jest.fn(),
      inlineAlerts: [],
    });

    const enableMock = jest.fn();
    (useCohorts as jest.Mock).mockReturnValue({ data: [] });
    (useCohortStatus as jest.Mock).mockReturnValue({ data: { isCohorted: false } });
    (useToggleCohorts as jest.Mock).mockReturnValue({ mutate: enableMock });

    renderWithCohortsProvider();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: messages.enableCohorts.defaultMessage }));

    // Simulate error callback
    const callArgs = enableMock.mock.calls[0][1];
    callArgs.onError(new Error('Enable failed'));

    expect(showModalMock).toHaveBeenCalledWith({
      confirmText: messages.closeButton.defaultMessage,
      message: messages.enableCohortError.defaultMessage,
      variant: 'danger',
    });
  });

  it('shows error modal with API message when enable cohorts fails with axios error', async () => {
    const showModalMock = jest.fn();
    jest.spyOn(AlertProvider, 'useAlert').mockReturnValue({
      alerts: [],
      addAlert: jest.fn(),
      removeAlert: jest.fn(),
      clearAlerts: jest.fn(),
      showToast: jest.fn(),
      showModal: showModalMock,
      showInlineAlert: jest.fn(),
      dismissInlineAlert: jest.fn(),
      inlineAlerts: [],
    });

    const enableMock = jest.fn();
    (useCohorts as jest.Mock).mockReturnValue({ data: [] });
    (useCohortStatus as jest.Mock).mockReturnValue({ data: { isCohorted: false } });
    (useToggleCohorts as jest.Mock).mockReturnValue({ mutate: enableMock });

    renderWithCohortsProvider();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: messages.enableCohorts.defaultMessage }));

    // Simulate axios error with developer_message
    const axiosError = {
      isAxiosError: true,
      response: { data: { developer_message: 'API specific error' } },
    };
    const callArgs = enableMock.mock.calls[0][1];
    callArgs.onError(axiosError);

    expect(showModalMock).toHaveBeenCalledWith({
      confirmText: messages.closeButton.defaultMessage,
      message: 'API specific error',
      variant: 'danger',
    });
  });

  it('shows error modal when disable cohorts fails', async () => {
    const showModalMock = jest.fn();
    jest.spyOn(AlertProvider, 'useAlert').mockReturnValue({
      alerts: [],
      addAlert: jest.fn(),
      removeAlert: jest.fn(),
      clearAlerts: jest.fn(),
      showToast: jest.fn(),
      showModal: showModalMock,
      showInlineAlert: jest.fn(),
      dismissInlineAlert: jest.fn(),
      inlineAlerts: [],
    });

    const disableMock = jest.fn();
    (useCohorts as jest.Mock).mockReturnValue({ data: [{ id: '1', name: 'Cohort 1' }] });
    (useCohortStatus as jest.Mock).mockReturnValue({ data: { isCohorted: true } });
    (useToggleCohorts as jest.Mock).mockReturnValue({ mutate: disableMock });

    renderWithCohortsProvider();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: messages.disableCohorts.defaultMessage }));
    await user.click(screen.getByRole('button', { name: messages.disableLabel.defaultMessage }));

    // Simulate error callback
    const callArgs = disableMock.mock.calls[0][1];
    callArgs.onError(new Error('Disable failed'));

    expect(showModalMock).toHaveBeenCalledWith({
      confirmText: messages.closeButton.defaultMessage,
      message: messages.disableCohortError.defaultMessage,
      variant: 'danger',
    });
  });
});
