import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { isAxiosError } from 'axios';
import AddBetaTestersModal, { AddBetaTestersModalProps } from '@src/enrollments/components/AddBetaTestersModal';
import { useUpdateBetaTesters } from '@src/enrollments/data/apiHook';
import messages from '@src/enrollments/messages';
import { renderWithAlertAndIntl } from '@src/testUtils';

const defaultProps: AddBetaTestersModalProps = {
  isOpen: true,
  onClose: jest.fn(),
};

const mockShowModal = jest.fn();
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
    addAlert: mockAddAlert,
  }),
  AlertProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('axios', () => ({
  isAxiosError: jest.fn(),
}));

const renderComponent = (props = {}) =>
  renderWithAlertAndIntl(<AddBetaTestersModal {...defaultProps} {...props} />);

describe('AddBetaTestersModal', () => {
  const mutateMock = jest.fn();

  beforeEach(() => {
    (useUpdateBetaTesters as jest.Mock).mockReturnValue({ mutate: mutateMock });
    mockShowModal.mockClear();
    mockAddAlert.mockClear();
    (isAxiosError as unknown as jest.Mock).mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with title and instructions', () => {
    renderComponent();
    expect(screen.getByRole('dialog', { name: messages.addBetaTesters.defaultMessage })).toBeInTheDocument();
    expect(screen.getByText(messages.addBetaTesters.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.addBetaTestersInstructions.defaultMessage)).toBeInTheDocument();
  });

  it('renders textarea with placeholder', () => {
    renderComponent();
    expect(
      screen.getByPlaceholderText(messages.userIdentifierPlaceholder.defaultMessage)
    ).toBeInTheDocument();
  });

  it('renders checkboxes with correct labels', () => {
    renderComponent();
    expect(
      screen.getByLabelText(messages.autoEnrollCheckbox.defaultMessage)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(messages.notifyUsersCheckbox.defaultMessage)
    ).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', async () => {
    renderComponent();
    const cancelBtn = screen.getByRole('button', {
      name: messages.cancelButton.defaultMessage,
    });
    const user = userEvent.setup();
    await user.click(cancelBtn);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('Save button is disabled when textarea is empty', () => {
    renderComponent();
    const saveBtn = screen.getByRole('button', {
      name: messages.saveButton.defaultMessage,
    });
    expect(saveBtn).toBeDisabled();
  });

  it('Save button is enabled when textarea has input', async () => {
    renderComponent();
    const textarea = screen.getByPlaceholderText(
      messages.userIdentifierPlaceholder.defaultMessage
    );
    const user = userEvent.setup();
    await user.type(textarea, 'test@example.com');
    const saveBtn = screen.getByRole('button', {
      name: messages.saveButton.defaultMessage,
    });
    expect(saveBtn).toBeEnabled();
  });

  it('calls addBetaTesters with trimmed email list when Save is clicked', async () => {
    renderComponent();
    const textarea = screen.getByPlaceholderText(
      messages.userIdentifierPlaceholder.defaultMessage
    );
    const user = userEvent.setup();
    await user.type(textarea, '  alice@example.com, bob@example.com  ');
    const saveBtn = screen.getByRole('button', {
      name: messages.saveButton.defaultMessage,
    });
    await user.click(saveBtn);
    expect(mutateMock).toHaveBeenCalledWith({
      identifier: [
        'alice@example.com',
        'bob@example.com',
      ],
      action: 'add',
      autoEnroll: true,
      emailStudents: true,
    }, {
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    });
  });

  it('splits emails by comma and trims whitespace', async () => {
    renderComponent();
    const textarea = screen.getByPlaceholderText(
      messages.userIdentifierPlaceholder.defaultMessage
    );
    const user = userEvent.setup();
    await user.type(textarea, 'a@a.com,   b@b.com ,c@c.com');
    const saveBtn = screen.getByRole('button', {
      name: messages.saveButton.defaultMessage,
    });
    await user.click(saveBtn);
    expect(mutateMock).toHaveBeenCalledWith({
      identifier: [
        'a@a.com',
        'b@b.com',
        'c@c.com',
      ],
      action: 'add',
      autoEnroll: true,
      emailStudents: true,
    }, {
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    });
  });

  it('splits emails separated by a line break into separate identifiers', async () => {
    renderComponent();
    const textarea = screen.getByPlaceholderText(
      messages.userIdentifierPlaceholder.defaultMessage
    );
    const user = userEvent.setup();
    await user.type(textarea, 'alice@example.com{Enter}bob@example.com');
    const saveBtn = screen.getByRole('button', {
      name: messages.saveButton.defaultMessage,
    });
    await user.click(saveBtn);
    expect(mutateMock).toHaveBeenCalledWith({
      identifier: [
        'alice@example.com',
        'bob@example.com',
      ],
      action: 'add',
      autoEnroll: true,
      emailStudents: true,
    }, {
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    });
  });

  it('does not call mutation if textarea is empty', async () => {
    renderComponent();
    const saveBtn = screen.getByRole('button', {
      name: messages.saveButton.defaultMessage,
    });
    const user = userEvent.setup();
    expect(saveBtn).toBeDisabled();
    await user.click(saveBtn);
    expect(mutateMock).not.toHaveBeenCalled();
  });

  it('does not render modal when isOpen is false', () => {
    renderComponent({ isOpen: false });
    expect(screen.queryByText(messages.addBetaTesters.defaultMessage)).not.toBeInTheDocument();
  });

  it('calls onClose when mutation succeeds with no failures', async () => {
    const mutateWithCallback = (_users: any, callbacks: any) => {
      callbacks.onSuccess({ results: [{ identifier: 'test@example.com', userDoesNotExist: false, isActive: true }] });
    };
    mutateMock.mockImplementation(mutateWithCallback);

    renderComponent();
    const textarea = screen.getByPlaceholderText(
      messages.userIdentifierPlaceholder.defaultMessage
    );
    const user = userEvent.setup();
    await user.type(textarea, 'test@example.com');
    const saveBtn = screen.getByRole('button', {
      name: messages.saveButton.defaultMessage,
    });
    await user.click(saveBtn);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('shows alert for failed users, inactive users, and still calls onClose', async () => {
    const mutateWithCallback = (_users: any, callbacks: any) => {
      callbacks.onSuccess({
        results: [
          { identifier: 'valid@example.com', userDoesNotExist: false, isActive: true },
          { identifier: 'invalid@example.com', userDoesNotExist: true, isActive: null },
          { identifier: 'inactive@example.com', userDoesNotExist: false, isActive: false },
        ]
      });
    };
    mutateMock.mockImplementation(mutateWithCallback);

    renderComponent();
    const textarea = screen.getByPlaceholderText(
      messages.userIdentifierPlaceholder.defaultMessage
    );
    const user = userEvent.setup();
    await user.type(textarea, 'valid@example.com, invalid@example.com, inactive@example.com');
    const saveBtn = screen.getByRole('button', {
      name: messages.saveButton.defaultMessage,
    });
    await user.click(saveBtn);

    expect(mockAddAlert).toHaveBeenCalledWith({
      type: 'danger',
      message: messages.failedBetaTesters.defaultMessage,
      extraContent: expect.any(Array),
    });
    expect(mockAddAlert).toHaveBeenCalledWith({
      type: 'warning',
      message: messages.inactiveUsers.defaultMessage,
      extraContent: expect.any(Array),
    });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('shows error modal when mutation fails with 404 error', async () => {
    (isAxiosError as unknown as jest.Mock).mockReturnValue(true);
    const mutateWithError = (_users: any, callbacks: any) => {
      callbacks.onError({ response: { status: 404 } });
    };
    mutateMock.mockImplementation(mutateWithError);

    renderComponent();
    const textarea = screen.getByPlaceholderText(
      messages.userIdentifierPlaceholder.defaultMessage
    );
    const user = userEvent.setup();
    await user.type(textarea, 'test@example.com');
    const saveBtn = screen.getByRole('button', {
      name: messages.saveButton.defaultMessage,
    });
    await user.click(saveBtn);

    expect(mockShowModal).toHaveBeenCalledWith({
      message: messages.enrollLearnerNotFoundError.defaultMessage,
      variant: 'danger',
      confirmText: messages.closeButton.defaultMessage,
    });
  });

  it('shows general error modal when mutation fails with non-404 error', async () => {
    (isAxiosError as unknown as jest.Mock).mockReturnValue(true);
    const mutateWithError = (_users: any, callbacks: any) => {
      callbacks.onError({ response: { status: 500 } });
    };
    mutateMock.mockImplementation(mutateWithError);

    renderComponent();
    const textarea = screen.getByPlaceholderText(
      messages.userIdentifierPlaceholder.defaultMessage
    );
    const user = userEvent.setup();
    await user.type(textarea, 'test@example.com');
    const saveBtn = screen.getByRole('button', {
      name: messages.saveButton.defaultMessage,
    });
    await user.click(saveBtn);

    expect(mockShowModal).toHaveBeenCalledWith({
      message: messages.enrollLearnerError.defaultMessage,
      variant: 'danger',
      confirmText: messages.closeButton.defaultMessage,
    });
  });

  it('shows general error modal when mutation fails with non-axios error', async () => {
    (isAxiosError as unknown as jest.Mock).mockReturnValue(false);
    const mutateWithError = (_users: any, callbacks: any) => {
      callbacks.onError({});
    };
    mutateMock.mockImplementation(mutateWithError);

    renderComponent();
    const textarea = screen.getByPlaceholderText(
      messages.userIdentifierPlaceholder.defaultMessage
    );
    const user = userEvent.setup();
    await user.type(textarea, 'test@example.com');
    const saveBtn = screen.getByRole('button', {
      name: messages.saveButton.defaultMessage,
    });
    await user.click(saveBtn);

    expect(mockShowModal).toHaveBeenCalledWith({
      message: messages.enrollLearnerError.defaultMessage,
      variant: 'danger',
      confirmText: messages.closeButton.defaultMessage,
    });
  });

  it('filters out empty emails from the list', async () => {
    renderComponent();
    const textarea = screen.getByPlaceholderText(
      messages.userIdentifierPlaceholder.defaultMessage
    );
    const user = userEvent.setup();
    await user.type(textarea, 'alice@example.com,,, ,bob@example.com');
    const saveBtn = screen.getByRole('button', {
      name: messages.saveButton.defaultMessage,
    });
    await user.click(saveBtn);

    expect(mutateMock).toHaveBeenCalledWith({
      identifier: [
        'alice@example.com',
        'bob@example.com',
      ],
      action: 'add',
      autoEnroll: true,
      emailStudents: true,
    }, {
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    });
  });

  it('updates checkbox states correctly', async () => {
    renderComponent();
    const autoEnrollCheckbox = screen.getByLabelText(messages.autoEnrollCheckbox.defaultMessage);
    const notifyUsersCheckbox = screen.getByLabelText(messages.notifyUsersCheckbox.defaultMessage);
    const user = userEvent.setup();

    // Initially both should be checked
    expect(autoEnrollCheckbox).toBeChecked();
    expect(notifyUsersCheckbox).toBeChecked();

    // Uncheck auto enroll
    await user.click(autoEnrollCheckbox);
    expect(autoEnrollCheckbox).not.toBeChecked();

    // Uncheck notify users
    await user.click(notifyUsersCheckbox);
    expect(notifyUsersCheckbox).not.toBeChecked();

    // Test that the values are passed correctly to mutation
    const textarea = screen.getByPlaceholderText(
      messages.userIdentifierPlaceholder.defaultMessage
    );
    await user.type(textarea, 'test@example.com');
    const saveBtn = screen.getByRole('button', {
      name: messages.saveButton.defaultMessage,
    });
    await user.click(saveBtn);

    expect(mutateMock).toHaveBeenCalledWith({
      identifier: ['test@example.com'],
      action: 'add',
      autoEnroll: false,
      emailStudents: false,
    }, {
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    });
  });

  it('resets form state after successful submission', async () => {
    const mutateWithCallback = (_users: any, callbacks: any) => {
      callbacks.onSuccess({ results: [] });
    };
    mutateMock.mockImplementation(mutateWithCallback);

    renderComponent();
    const textarea = screen.getByPlaceholderText(
      messages.userIdentifierPlaceholder.defaultMessage
    ) as HTMLTextAreaElement;
    const autoEnrollCheckbox = screen.getByLabelText(messages.autoEnrollCheckbox.defaultMessage);
    const notifyUsersCheckbox = screen.getByLabelText(messages.notifyUsersCheckbox.defaultMessage);
    const user = userEvent.setup();

    // Set some values
    await user.type(textarea, 'test@example.com');
    await user.click(autoEnrollCheckbox); // Uncheck
    await user.click(notifyUsersCheckbox); // Uncheck

    const saveBtn = screen.getByRole('button', {
      name: messages.saveButton.defaultMessage,
    });
    await user.click(saveBtn);

    // After successful submission, form should be cleaned and closed
    await waitFor(() => expect(textarea.value).toBe(''));
    expect(autoEnrollCheckbox).toBeChecked();
    expect(notifyUsersCheckbox).toBeChecked();
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
