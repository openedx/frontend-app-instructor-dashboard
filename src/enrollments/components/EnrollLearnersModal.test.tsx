import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import EnrollLearnersModal, { EnrollLearnersModalProps } from '@src/enrollments/components/EnrollLearnersModal';
import { useUpdateEnrollments } from '@src/enrollments/data/apiHook';
import messages from '@src/enrollments/messages';
import { renderWithAlertAndIntl } from '@src/testUtils';

const defaultProps: EnrollLearnersModalProps = {
  isOpen: true,
  onClose: jest.fn(),
};

const mockShowModal = jest.fn();

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
  }),
  AlertProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const renderComponent = (props = {}) =>
  renderWithAlertAndIntl(<EnrollLearnersModal {...defaultProps} {...props} />);

describe('EnrollLearnersModal', () => {
  const mutateMock = jest.fn();

  beforeEach(() => {
    (useUpdateEnrollments as jest.Mock).mockReturnValue({ mutate: mutateMock });
    mockShowModal.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with title and instructions', () => {
    renderComponent();
    expect(screen.getByText(messages.enrollLearners.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.addLearnerInstructions.defaultMessage)).toBeInTheDocument();
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

  it('calls onSave with trimmed email list when Save is clicked', async () => {
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
      action: 'enroll',
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
      action: 'enroll',
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
      action: 'enroll',
      autoEnroll: true,
      emailStudents: true,
    }, {
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    });
  });

  it('does not call onSuccess if textarea is empty', async () => {
    renderComponent();
    const saveBtn = screen.getByRole('button', {
      name: messages.saveButton.defaultMessage,
    });
    const user = userEvent.setup();
    expect(saveBtn).toBeDisabled();
    await user.click(saveBtn);
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('does not render modal when isOpen is false', () => {
    renderComponent({ isOpen: false });
    expect(screen.queryByText(messages.enrollLearners.defaultMessage)).not.toBeInTheDocument();
  });

  it('calls onClose when mutation succeeds', async () => {
    const mutateWithCallback = (_users: string[], callbacks: any) => {
      callbacks.onSuccess({ results: [{ identifier: 'test@example.com', invalidIdentifier: false }] });
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

  it('shows error alert when mutation fails', async () => {
    const mutateWithError = (_users: string[], callbacks: any) => {
      callbacks.onError({ message: messages.enrollLearnerError.defaultMessage });
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

  it('shows default error message when error has no message', async () => {
    const mutateWithError = (_users: string[], callbacks: any) => {
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
      action: 'enroll',
      autoEnroll: true,
      emailStudents: true,
    }, {
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    });
  });
});
