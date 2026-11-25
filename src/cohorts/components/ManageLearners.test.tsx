import { screen } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import { useAddLearnersToCohort } from '@src/cohorts/data/apiHook';
import { useCohortContext } from '@src/cohorts/components/CohortContext';
import ManageLearners from '@src/cohorts/components/ManageLearners';
import messages from '@src/cohorts/messages';
import { renderWithAlertAndIntl } from '@src/testUtils';
import * as AlertProvider from '@src/providers/AlertProvider';
import userEvent from '@testing-library/user-event';
import permissionMessages from '@src/permissions/messages';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('@src/cohorts/data/apiHook', () => ({
  useAddLearnersToCohort: jest.fn(),
}));

jest.mock('@src/cohorts/components/CohortContext', () => ({
  useCohortContext: jest.fn(),
}));

const renderWithAlertProvider = () => renderWithAlertAndIntl(<ManageLearners />);

describe('ManageLearners', () => {
  const mutateMock = jest.fn();
  const addAlertMock = jest.fn();
  const clearAlertsMock = jest.fn();
  let useAlertSpy: jest.SpyInstance;

  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ courseId: 'course-v1:edX+Test+2024' });
    (useCohortContext as jest.Mock).mockReturnValue({ selectedCohort: { id: 123 } });
    (useAddLearnersToCohort as jest.Mock).mockReturnValue({ mutate: mutateMock });

    useAlertSpy = jest.spyOn(AlertProvider, 'useAlert').mockReturnValue({
      addAlert: addAlertMock,
      clearAlerts: clearAlertsMock,
      showToast: jest.fn(),
      showModal: jest.fn(),
      showInlineAlert: jest.fn(),
      dismissInlineAlert: jest.fn(),
      inlineAlerts: [],
      alerts: [],
      removeAlert: jest.fn(),
    });

    mutateMock.mockReset();
    addAlertMock.mockReset();
    clearAlertsMock.mockReset();
  });

  afterEach(() => {
    useAlertSpy.mockRestore();
  });

  it('shows the permission denied error modal when assignment returns 403', async () => {
    const showModal = jest.fn();
    useAlertSpy.mockReturnValue({ ...AlertProvider.useAlert(), showModal });
    mutateMock.mockImplementationOnce((_params, { onError }) => onError({ response: { status: 403 } }));
    renderWithAlertProvider();
    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox'), 'alice');
    await user.click(screen.getByRole('button', { name: `+ ${messages.addLearnersLabel.defaultMessage}` }));
    expect(showModal).toHaveBeenCalledTimes(1);
    expect(showModal).toHaveBeenCalledWith({
      message: permissionMessages.permissionDeniedError.defaultMessage,
      variant: 'danger',
      confirmText: permissionMessages.closeButton.defaultMessage,
    });
    expect(addAlertMock).not.toHaveBeenCalled();
  });

  it('render all static texts', () => {
    renderWithAlertProvider();
    expect(screen.getByRole('heading', { name: messages.addLearnersTitle.defaultMessage })).toBeInTheDocument();
    expect(screen.getByText(messages.addLearnersSubtitle.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.addLearnersInstructions.defaultMessage)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(messages.learnersExample.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.addLearnersFootnote.defaultMessage)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: `+ ${messages.addLearnersLabel.defaultMessage}` })).toBeInTheDocument();
  });

  it('updates textarea value and calls mutate on button click', async () => {
    renderWithAlertProvider();
    const textarea = screen.getByPlaceholderText(messages.learnersExample.defaultMessage);
    const user = userEvent.setup();
    await user.type(textarea, 'user1@example.com,user2@example.com');
    await user.click(screen.getByRole('button', { name: `+ ${messages.addLearnersLabel.defaultMessage}` }));
    expect(mutateMock).toHaveBeenCalledWith(
      ['user1@example.com', 'user2@example.com'],
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );
  });

  it('handles empty input gracefully', async () => {
    renderWithAlertProvider();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: `+ ${messages.addLearnersLabel.defaultMessage}` }));
    expect(mutateMock).toHaveBeenCalledWith(
      [],
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );
  });

  it('calls onError if mutate fails and shows error alert', async () => {
    renderWithAlertProvider();
    const textarea = screen.getByPlaceholderText(messages.learnersExample.defaultMessage);
    const user = userEvent.setup();
    await user.type(textarea, 'user@example.com');
    await user.click(screen.getByRole('button', { name: `+ ${messages.addLearnersLabel.defaultMessage}` }));

    const callArgs = mutateMock.mock.calls[0][1];
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    callArgs.onError('error!');

    expect(consoleErrorSpy).toHaveBeenCalledWith('error!');
    expect(addAlertMock).toHaveBeenCalledWith({
      type: 'error',
      message: messages.addLearnersErrorMessage.defaultMessage
    });
    consoleErrorSpy.mockRestore();
  });

  it('uses default cohort id 0 if selectedCohort is missing', async () => {
    (useCohortContext as jest.Mock).mockReturnValue({ selectedCohort: undefined });
    renderWithAlertProvider();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: `+ ${messages.addLearnersLabel.defaultMessage}` }));
    expect(mutateMock).toHaveBeenCalled();
  });

  it('clears alerts before adding learners', async () => {
    renderWithAlertProvider();
    const textarea = screen.getByPlaceholderText(messages.learnersExample.defaultMessage);
    const user = userEvent.setup();
    await user.type(textarea, 'user@example.com');
    await user.click(screen.getByRole('button', { name: `+ ${messages.addLearnersLabel.defaultMessage}` }));

    expect(clearAlertsMock).toHaveBeenCalled();
  });

  it('handles different input formats (newlines and commas)', async () => {
    renderWithAlertProvider();
    const user = userEvent.setup();
    const textarea = screen.getByPlaceholderText(messages.learnersExample.defaultMessage);

    // Test with newlines
    await user.type(textarea, 'user1@example.com\nuser2@example.com\n\nuser3@example.com');
    await user.click(screen.getByRole('button', { name: `+ ${messages.addLearnersLabel.defaultMessage}` }));

    expect(mutateMock).toHaveBeenCalledWith(
      ['user1@example.com', 'user2@example.com', 'user3@example.com'],
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );
  });

  it('handles mixed separators and extra spaces', async () => {
    renderWithAlertProvider();
    const textarea = screen.getByPlaceholderText(messages.learnersExample.defaultMessage);
    const user = userEvent.setup();
    await user.type(textarea, '  user1@example.com,  user2@example.com  \n user3@example.com , \n\n  ');
    await user.click(screen.getByRole('button', { name: `+ ${messages.addLearnersLabel.defaultMessage}` }));

    expect(mutateMock).toHaveBeenCalledWith(
      ['user1@example.com', 'user2@example.com', 'user3@example.com'],
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );
  });

  describe('onSuccess callback with handleAlertMessages', () => {
    it('shows warning alert for preassigned learners', async () => {
      renderWithAlertProvider();
      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: `+ ${messages.addLearnersLabel.defaultMessage}` }));

      const callArgs = mutateMock.mock.calls[0][1];
      const response = {
        added: [],
        changed: [],
        preassigned: ['user1@example.com', 'user2@example.com'],
        present: [],
        unknown: []
      };

      callArgs.onSuccess(response);

      expect(addAlertMock).toHaveBeenCalledWith({
        type: 'warning',
        message: expect.stringContaining('2'),
        extraContent: expect.any(Array)
      });
    });

    it('shows success alert for added and changed learners', async () => {
      renderWithAlertProvider();
      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: `+ ${messages.addLearnersLabel.defaultMessage}` }));

      const callArgs = mutateMock.mock.calls[0][1];
      const response = {
        added: ['user1@example.com'],
        changed: ['user2@example.com'],
        preassigned: [],
        present: ['user3@example.com'],
        unknown: []
      };

      callArgs.onSuccess(response);

      expect(addAlertMock).toHaveBeenCalledWith({
        type: 'success',
        message: expect.stringContaining('2'),
        extraContent: expect.any(Object)
      });
    });

    it('shows error alert for unknown learners', async () => {
      renderWithAlertProvider();
      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: `+ ${messages.addLearnersLabel.defaultMessage}` }));

      const callArgs = mutateMock.mock.calls[0][1];
      const response = {
        added: [],
        changed: [],
        preassigned: [],
        present: [],
        unknown: ['invaliduser', 'anotherbaduser']
      };

      callArgs.onSuccess(response);

      expect(addAlertMock).toHaveBeenCalledWith({
        type: 'error',
        message: expect.stringContaining('2'),
        extraContent: expect.any(Array)
      });
    });

    it('shows multiple alerts for mixed response types', async () => {
      renderWithAlertProvider();
      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: `+ ${messages.addLearnersLabel.defaultMessage}` }));

      const callArgs = mutateMock.mock.calls[0][1];
      const response = {
        added: ['user1@example.com'],
        changed: [],
        preassigned: ['user2@example.com'],
        present: ['user3@example.com'],
        unknown: ['baduser']
      };

      callArgs.onSuccess(response);

      // Should call addAlert 3 times (warning, success, error)
      expect(addAlertMock).toHaveBeenCalledTimes(3);

      // Check for warning alert (preassigned)
      expect(addAlertMock).toHaveBeenCalledWith({
        type: 'warning',
        message: expect.stringContaining('1'),
        extraContent: expect.any(Array)
      });

      // Check for success alert (added + changed)
      expect(addAlertMock).toHaveBeenCalledWith({
        type: 'success',
        message: expect.stringContaining('1'),
        extraContent: expect.any(Object)
      });

      // Check for error alert (unknown)
      expect(addAlertMock).toHaveBeenCalledWith({
        type: 'error',
        message: expect.stringContaining('1'),
        extraContent: expect.any(Array)
      });
    });

    it('does not show alerts when response arrays are empty', async () => {
      renderWithAlertProvider();
      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: `+ ${messages.addLearnersLabel.defaultMessage}` }));

      const callArgs = mutateMock.mock.calls[0][1];
      const response = {
        added: [],
        changed: [],
        preassigned: [],
        present: [],
        unknown: []
      };

      callArgs.onSuccess(response);

      expect(addAlertMock).not.toHaveBeenCalled();
    });
  });
});
