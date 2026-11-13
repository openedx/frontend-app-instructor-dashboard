import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UnenrollModal from '@src/enrollments/components/UnenrollModal';
import { useUpdateEnrollments } from '@src/enrollments/data/apiHook';
import messages from '@src/enrollments/messages';
import { UpdateEnrollmentsParams } from '@src/enrollments/types';
import permissionMessages from '@src/permissions/messages';
import { renderWithAlertAndIntl } from '@src/testUtils';

const learner = {
  fullName: 'Jane Doe',
  email: 'jane@example.com',
  isBetaTester: false,
  username: 'jane.doe',
  mode: 'verified',
};

const defaultProps = {
  learner,
  isOpen: true,
  onClose: jest.fn(),
};

const mockShowModal = jest.fn();
const mockShowToast = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'test-course-id' }),
}));

jest.mock('@src/enrollments/data/apiHook', () => ({
  useUpdateEnrollments: jest.fn(),
}));

jest.mock('@src/providers/AlertProvider', () => ({
  useAlert: () => ({
    showModal: mockShowModal,
    showToast: mockShowToast,
  }),
  AlertProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('UnenrollModal', () => {
  const mutateMock = jest.fn();

  beforeEach(() => {
    (useUpdateEnrollments as jest.Mock).mockReturnValue({
      mutate: mutateMock,
      isPending: false
    });
    mockShowModal.mockClear();
    mockShowToast.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with correct title and confirmation message', () => {
    renderWithAlertAndIntl(
      <UnenrollModal {...defaultProps} />
    );
    expect(screen.getByRole('heading', { name: /unenroll learner/i })).toBeInTheDocument();
    expect(screen.getByText(messages.unenrollLearnersConfirmation.defaultMessage.replace('{name}', learner.fullName))).toBeInTheDocument();
  });

  it('renders Cancel and Unenroll buttons', () => {
    renderWithAlertAndIntl(
      <UnenrollModal {...defaultProps} />
    );
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^unenroll$/i })).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', async () => {
    const onClose = jest.fn();
    renderWithAlertAndIntl(
      <UnenrollModal {...defaultProps} onClose={onClose} />
    );
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls unenrollLearners when Unenroll button is clicked', async () => {
    renderWithAlertAndIntl(
      <UnenrollModal {...defaultProps} />
    );
    await userEvent.click(screen.getByRole('button', { name: /^unenroll$/i }));
    expect(mutateMock).toHaveBeenCalledWith({
      identifier: [learner.username],
      action: 'unenroll',
    }, {
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    });
  });

  it('calls onSuccess and onClose when unenrollment succeeds', async () => {
    const mutateWithCallback = (_params: UpdateEnrollmentsParams, callbacks: any) => {
      callbacks.onSuccess();
    };
    mutateMock.mockImplementation(mutateWithCallback);

    renderWithAlertAndIntl(
      <UnenrollModal {...defaultProps} />
    );
    await userEvent.click(screen.getByRole('button', { name: /^unenroll$/i }));

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('shows error alert when unenrollment fails', async () => {
    const errorMessage = 'Unenrollment failed';
    const mutateWithError = (_params: UpdateEnrollmentsParams, callbacks: any) => {
      callbacks.onError({ message: errorMessage });
    };
    mutateMock.mockImplementation(mutateWithError);

    renderWithAlertAndIntl(
      <UnenrollModal {...defaultProps} />
    );
    await userEvent.click(screen.getByRole('button', { name: /^unenroll$/i }));

    expect(mockShowModal).toHaveBeenCalledWith({
      message: errorMessage,
      variant: 'danger',
      confirmText: messages.closeButton.defaultMessage,
    });
  });

  it('shows the permission denied toast and closes the modal when the backend returns 403', async () => {
    mutateMock.mockImplementation((_params: UpdateEnrollmentsParams, callbacks: any) => {
      callbacks.onError({ response: { status: 403 } });
    });
    renderWithAlertAndIntl(
      <UnenrollModal {...defaultProps} />
    );
    await userEvent.click(screen.getByRole('button', { name: /^unenroll$/i }));
    expect(mockShowToast).toHaveBeenCalledWith(permissionMessages.permissionDeniedToast.defaultMessage);
    expect(mockShowModal).not.toHaveBeenCalled();
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
  it('shows default error message when error has no message', async () => {
    const mutateWithError = (_params: UpdateEnrollmentsParams, callbacks: any) => {
      callbacks.onError({});
    };
    mutateMock.mockImplementation(mutateWithError);

    renderWithAlertAndIntl(
      <UnenrollModal {...defaultProps} />
    );
    await userEvent.click(screen.getByRole('button', { name: /^unenroll$/i }));

    expect(mockShowModal).toHaveBeenCalledWith({
      message: messages.unenrollLearnerError.defaultMessage,
      variant: 'danger',
      confirmText: messages.closeButton.defaultMessage,
    });
  });

  it('disables unenroll button when pending', () => {
    (useUpdateEnrollments as jest.Mock).mockReturnValue({
      mutate: mutateMock,
      isPending: true
    });

    renderWithAlertAndIntl(
      <UnenrollModal {...defaultProps} />
    );

    const unenrollButton = screen.getByRole('button', { name: messages.unenrollButton.defaultMessage });
    expect(unenrollButton).toBeDisabled();
  });

  it('does not render modal when isOpen is false', () => {
    renderWithAlertAndIntl(
      <UnenrollModal {...defaultProps} isOpen={false} />
    );
    expect(screen.queryByText(messages.unenrollLearners.defaultMessage)).not.toBeInTheDocument();
  });

  it('calls onClose when modal close button is clicked', async () => {
    const onClose = jest.fn();
    renderWithAlertAndIntl(
      <UnenrollModal {...defaultProps} onClose={onClose} />
    );
    // ModalDialog close button should have aria-label="Close"
    const closeButton = screen.getByLabelText(/close/i);
    await userEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });
});
