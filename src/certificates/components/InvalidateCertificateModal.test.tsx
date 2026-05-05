import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InvalidateCertificateModal from '@src/certificates/components/InvalidateCertificateModal';
import { renderWithIntl } from '@src/testUtils';
import messages from '@src/certificates/messages';

describe('InvalidateCertificateModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    isSubmitting: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with correct title', () => {
    renderWithIntl(<InvalidateCertificateModal {...defaultProps} />);

    expect(screen.getAllByText(messages.invalidateCertificateModalTitle.defaultMessage)[0]).toBeInTheDocument();
  });

  it('renders modal with correct description', () => {
    renderWithIntl(<InvalidateCertificateModal {...defaultProps} />);

    expect(screen.getByText(messages.invalidateCertificateModalDescription.defaultMessage)).toBeInTheDocument();
  });

  it('renders learner input field', () => {
    renderWithIntl(<InvalidateCertificateModal {...defaultProps} />);

    expect(screen.getByText(messages.learnerLabel.defaultMessage)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(messages.learnerPlaceholder.defaultMessage)).toBeInTheDocument();
  });

  it('renders notes input field', () => {
    renderWithIntl(<InvalidateCertificateModal {...defaultProps} />);

    expect(screen.getByText(messages.notesLabel.defaultMessage)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(messages.notesPlaceholder.defaultMessage)).toBeInTheDocument();
  });

  it('calls onSubmit with learner and notes when form is submitted', async () => {
    renderWithIntl(<InvalidateCertificateModal {...defaultProps} />);
    const user = userEvent.setup();

    const learnerInput = screen.getByPlaceholderText(messages.learnerPlaceholder.defaultMessage);
    const notesInput = screen.getByPlaceholderText(messages.notesPlaceholder.defaultMessage);

    await user.type(learnerInput, 'user1@example.com');
    await user.type(notesInput, 'Certificate invalidated due to violation');

    const saveButton = screen.getByRole('button', { name: messages.save.defaultMessage });
    await user.click(saveButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(
      ['user1@example.com'],
      'Certificate invalidated due to violation'
    );
  });

  it('calls onClose when cancel button is clicked', async () => {
    renderWithIntl(<InvalidateCertificateModal {...defaultProps} />);
    const user = userEvent.setup();

    const cancelButton = screen.getByRole('button', { name: messages.cancel.defaultMessage });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when isSubmitting is true', () => {
    renderWithIntl(<InvalidateCertificateModal {...defaultProps} isSubmitting={true} />);

    const saveButton = screen.getByRole('button', { name: messages.save.defaultMessage });
    const cancelButton = screen.getByRole('button', { name: messages.cancel.defaultMessage });

    expect(saveButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('does not render when isOpen is false', () => {
    renderWithIntl(<InvalidateCertificateModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText(messages.invalidateCertificateModalTitle.defaultMessage)).not.toBeInTheDocument();
  });

  it('save button is disabled when learner field is empty', () => {
    renderWithIntl(<InvalidateCertificateModal {...defaultProps} />);

    const saveButton = screen.getByRole('button', { name: messages.save.defaultMessage });
    expect(saveButton).toBeDisabled();
  });

  it('allows submission without notes', async () => {
    renderWithIntl(<InvalidateCertificateModal {...defaultProps} />);
    const user = userEvent.setup();

    const learnerInput = screen.getByPlaceholderText(messages.learnerPlaceholder.defaultMessage);
    await user.type(learnerInput, 'user1@example.com');

    const saveButton = screen.getByRole('button', { name: messages.save.defaultMessage });
    await user.click(saveButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(['user1@example.com'], '');
  });
});
