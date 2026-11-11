import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UpdateBetaTesterModal from '@src/enrollments/components/UpdateBetaTesterModal';
import { useUpdateBetaTesters } from '@src/enrollments/data/apiHook';
import messages from '@src/enrollments/messages';
import permissionMessages from '@src/permissions/messages';
import { renderWithAlertAndIntl } from '@src/testUtils';

const learnerBetaTester = {
  fullName: 'Jane Doe',
  email: 'jane@example.com',
  isBetaTester: true,
  username: 'jane.doe',
  mode: 'verified',
};

const learnerNonBetaTester = {
  fullName: 'John Smith',
  email: 'john@example.com',
  isBetaTester: false,
  username: 'john.smith',
  mode: 'verified',
};

const defaultProps = {
  learner: learnerBetaTester,
  isOpen: true,
  onClose: jest.fn(),
};

const mockShowModal = jest.fn();
const mockShowToast = jest.fn();
const mockAddAlert = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'test-course-id' }),
}));

jest.mock('@src/enrollments/data/apiHook', () => ({
  useUpdateBetaTesters: jest.fn(),
}));

jest.mock('@src/providers/AlertProvider', () => ({
  useAlert: () => ({
    showModal: mockShowModal,
    showToast: mockShowToast,
    addAlert: mockAddAlert,
  }),
  AlertProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('UpdateBetaTesterModal', () => {
  const mutateMock = jest.fn();

  beforeEach(() => {
    mutateMock.mockResolvedValue({ results: [] });
    (useUpdateBetaTesters as jest.Mock).mockReturnValue({
      mutateAsync: mutateMock,
      isPending: false,
    });
    mockShowModal.mockClear();
    mockShowToast.mockClear();
    mockAddAlert.mockClear();
    defaultProps.onClose.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when learner is a beta tester (isBetaTester: true)', () => {
    it('renders modal with correct title and confirmation message', () => {
      renderWithAlertAndIntl(
        <UpdateBetaTesterModal {...defaultProps} />
      );
      expect(screen.getByRole('dialog', { name: /revoke access/i })).toBeInTheDocument();
      expect(screen.getByText(messages.removeBetaTesterDescription.defaultMessage)).toBeInTheDocument();
    });

    it('renders Cancel and Revoke buttons', () => {
      renderWithAlertAndIntl(
        <UpdateBetaTesterModal {...defaultProps} />
      );
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /revoke/i })).toBeInTheDocument();
    });

    it('calls onClose when Cancel button is clicked', async () => {
      const onClose = jest.fn();
      renderWithAlertAndIntl(
        <UpdateBetaTesterModal {...defaultProps} onClose={onClose} />
      );
      await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(onClose).toHaveBeenCalled();
    });

    it('calls updateBetaTester with remove action when Revoke button is clicked', async () => {
      renderWithAlertAndIntl(
        <UpdateBetaTesterModal {...defaultProps} />
      );
      await userEvent.click(screen.getByRole('button', { name: /revoke/i }));
      expect(mutateMock).toHaveBeenCalledWith({
        identifier: [learnerBetaTester.username],
        action: 'remove',
      });
    });

    it('calls onClose when Revoke button is clicked', async () => {
      mutateMock.mockResolvedValue({ results: [] });
      renderWithAlertAndIntl(
        <UpdateBetaTesterModal {...defaultProps} />
      );
      await userEvent.click(screen.getByRole('button', { name: /revoke/i }));

      await waitFor(() => {
        expect(defaultProps.onClose).toHaveBeenCalled();
      });
    });

    it('disables revoke button when pending', () => {
      (useUpdateBetaTesters as jest.Mock).mockReturnValue({
        mutateAsync: mutateMock,
        isPending: true,
      });

      renderWithAlertAndIntl(
        <UpdateBetaTesterModal {...defaultProps} />
      );

      const revokeButton = screen.getByRole('button', { name: messages.revoke.defaultMessage });
      expect(revokeButton).toBeDisabled();
    });

    it('calls onClose when modal close button is clicked', async () => {
      const onClose = jest.fn();
      renderWithAlertAndIntl(
        <UpdateBetaTesterModal {...defaultProps} onClose={onClose} />
      );
      const closeButton = screen.getByLabelText(/close/i);
      await userEvent.click(closeButton);
      expect(onClose).toHaveBeenCalled();
    });

    it('does not render modal when isOpen is false', () => {
      renderWithAlertAndIntl(
        <UpdateBetaTesterModal {...defaultProps} isOpen={false} />
      );
      expect(screen.queryByText(messages.removeBetaTesterDescription.defaultMessage)).not.toBeInTheDocument();
    });
  });

  describe('when learner is not a beta tester (isBetaTester: false)', () => {
    const nonBetaTesterProps = {
      ...defaultProps,
      learner: learnerNonBetaTester,
    };

    it('automatically calls updateBetaTester with add action and does not render modal', () => {
      renderWithAlertAndIntl(
        <UpdateBetaTesterModal {...nonBetaTesterProps} />
      );

      expect(mutateMock).toHaveBeenCalledWith({
        identifier: [learnerNonBetaTester.username],
        action: 'add',
      });

      // Modal should not be rendered
      expect(screen.queryByText(messages.removeBetaTesterDescription.defaultMessage)).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /revoke/i })).not.toBeInTheDocument();
    });

    it('calls onClose when automatically adding beta tester', async () => {
      mutateMock.mockResolvedValue({ results: [] });
      renderWithAlertAndIntl(
        <UpdateBetaTesterModal {...nonBetaTesterProps} />
      );

      await waitFor(() => {
        expect(defaultProps.onClose).toHaveBeenCalled();
      });
    });
  });

  describe('when the backend rejects the change with 403', () => {
    it('shows the permission denied toast instead of the error modal', async () => {
      mutateMock.mockRejectedValue({ response: { status: 403 } });
      renderWithAlertAndIntl(
        <UpdateBetaTesterModal {...defaultProps} />
      );
      await userEvent.click(screen.getByRole('button', { name: /revoke/i }));
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith(permissionMessages.permissionDeniedToast.defaultMessage);
      });
      expect(mockShowModal).not.toHaveBeenCalled();
    });
  });

  describe('mutation success scenarios', () => {
    it('shows alert with failed usernames when some users fail (remove action)', async () => {
      const mockSuccessData = {
        results: [
          { identifier: 'failed-user', userDoesNotExist: true, isActive: true },
          { identifier: 'jane.doe', userDoesNotExist: false, isActive: true },
        ]
      };
      mutateMock.mockResolvedValue(mockSuccessData);

      renderWithAlertAndIntl(
        <UpdateBetaTesterModal {...defaultProps} />
      );
      await userEvent.click(screen.getByRole('button', { name: /revoke/i }));

      await waitFor(() => {
        expect(mockAddAlert).toHaveBeenCalledWith({
          type: 'danger',
          message: messages.failedBetaTesters.defaultMessage,
          extraContent: expect.any(Array),
        });
      });
    });

    it('shows alert with failed usernames when some users fail (add action)', async () => {
      const mockSuccessData = {
        results: [
          { identifier: 'failed-user', userDoesNotExist: true, isActive: null },
        ]
      };
      mutateMock.mockResolvedValue(mockSuccessData);

      const nonBetaTesterProps = {
        ...defaultProps,
        learner: learnerNonBetaTester,
      };

      renderWithAlertAndIntl(
        <UpdateBetaTesterModal {...nonBetaTesterProps} />
      );

      await waitFor(() => {
        expect(mockAddAlert).toHaveBeenCalledWith({
          type: 'danger',
          message: messages.failedBetaTesters.defaultMessage,
          extraContent: expect.any(Array),
        });
      });
    });

    it('shows alert with inactive usernames when some users are inactive', async () => {
      const mockSuccessData = {
        results: [
          { identifier: 'inactive-user', userDoesNotExist: false, isActive: false },
          { identifier: 'jane.doe', userDoesNotExist: false, isActive: true },
        ]
      };
      mutateMock.mockResolvedValue(mockSuccessData);

      const nonBetaTesterProps = {
        ...defaultProps,
        learner: learnerNonBetaTester,
      };

      renderWithAlertAndIntl(
        <UpdateBetaTesterModal {...nonBetaTesterProps} />
      );

      await waitFor(() => {
        expect(mockAddAlert).toHaveBeenCalledWith({
          type: 'warning',
          message: messages.inactiveUsers.defaultMessage,
          extraContent: expect.any(Array),
        });
      });
    });

    it('does not show alert when all users succeed', async () => {
      const mockSuccessData = {
        results: [
          { identifier: 'jane.doe', userDoesNotExist: false, isActive: true },
        ]
      };
      mutateMock.mockResolvedValue(mockSuccessData);

      renderWithAlertAndIntl(
        <UpdateBetaTesterModal {...defaultProps} />
      );
      await userEvent.click(screen.getByRole('button', { name: /revoke/i }));

      await waitFor(() => {
        expect(defaultProps.onClose).toHaveBeenCalled();
      });
      expect(mockAddAlert).not.toHaveBeenCalled();
    });

    it('does not show alert when results array is empty', async () => {
      mutateMock.mockResolvedValue({ results: [] });

      renderWithAlertAndIntl(
        <UpdateBetaTesterModal {...defaultProps} />
      );
      await userEvent.click(screen.getByRole('button', { name: /revoke/i }));

      await waitFor(() => {
        expect(defaultProps.onClose).toHaveBeenCalled();
      });
      expect(mockAddAlert).not.toHaveBeenCalled();
    });
  });

  describe('mutation error scenarios', () => {
    it('shows error modal when removing beta tester fails', async () => {
      mutateMock.mockRejectedValue(new Error('API error'));

      renderWithAlertAndIntl(
        <UpdateBetaTesterModal {...defaultProps} />
      );
      await userEvent.click(screen.getByRole('button', { name: /revoke/i }));

      await waitFor(() => {
        expect(mockShowModal).toHaveBeenCalledWith({
          message: messages.removeBetaTesterError.defaultMessage,
          variant: 'danger',
          confirmText: messages.closeButton.defaultMessage,
        });
      });
    });

    it('shows error modal when adding beta tester fails', async () => {
      mutateMock.mockRejectedValue(new Error('API error'));

      const nonBetaTesterProps = {
        ...defaultProps,
        learner: learnerNonBetaTester,
      };

      renderWithAlertAndIntl(
        <UpdateBetaTesterModal {...nonBetaTesterProps} />
      );

      await waitFor(() => {
        expect(mockShowModal).toHaveBeenCalledWith({
          message: messages.addBetaTesterError.defaultMessage,
          variant: 'danger',
          confirmText: messages.closeButton.defaultMessage,
        });
      });
    });
  });

  describe('edge cases', () => {
    it('handles success callback with undefined results', async () => {
      mutateMock.mockResolvedValue({});

      renderWithAlertAndIntl(
        <UpdateBetaTesterModal {...defaultProps} />
      );
      await userEvent.click(screen.getByRole('button', { name: /revoke/i }));

      await waitFor(() => {
        expect(defaultProps.onClose).toHaveBeenCalled();
      });
      expect(mockAddAlert).not.toHaveBeenCalled();
    });

    it('handles success callback with null results', async () => {
      mutateMock.mockResolvedValue({ results: null });

      renderWithAlertAndIntl(
        <UpdateBetaTesterModal {...defaultProps} />
      );
      await userEvent.click(screen.getByRole('button', { name: /revoke/i }));

      await waitFor(() => {
        expect(defaultProps.onClose).toHaveBeenCalled();
      });
      expect(mockAddAlert).not.toHaveBeenCalled();
    });

    it('renders failed learner names correctly in alert', async () => {
      const mockSuccessData = {
        results: [
          { identifier: 'user1@example.com', userDoesNotExist: true },
          { identifier: 'user2', userDoesNotExist: true },
        ]
      };
      mutateMock.mockResolvedValue(mockSuccessData);

      renderWithAlertAndIntl(
        <UpdateBetaTesterModal {...defaultProps} />
      );
      await userEvent.click(screen.getByRole('button', { name: /revoke/i }));

      await waitFor(() => {
        expect(mockAddAlert).toHaveBeenCalled();
      });

      const alertCall = mockAddAlert.mock.calls[0][0];
      expect(alertCall.extraContent).toHaveLength(2);
    });
  });
});
