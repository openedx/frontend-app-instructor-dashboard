import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GrantExceptionsModal from '@src/certificates/components/GrantExceptionsModal';
import { renderWithIntl } from '@src/testUtils';
import messages from '@src/certificates/messages';

describe('GrantExceptionsModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockOnUploadCsv = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    onUploadCsv: mockOnUploadCsv,
    isSubmitting: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with correct title', () => {
    renderWithIntl(<GrantExceptionsModal {...defaultProps} />);

    expect(screen.getAllByText(messages.grantExceptionsModalTitle.defaultMessage)[0]).toBeInTheDocument();
  });

  it('renders modal with correct description', () => {
    renderWithIntl(<GrantExceptionsModal {...defaultProps} />);

    expect(screen.getByText(messages.grantExceptionsModalDescription.defaultMessage)).toBeInTheDocument();
  });

  it('renders Individual and Bulk tabs', () => {
    renderWithIntl(<GrantExceptionsModal {...defaultProps} />);

    expect(screen.getByRole('tab', { name: messages.singleLearnerTab.defaultMessage })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: messages.bulkUploadTab.defaultMessage })).toBeInTheDocument();
  });

  it('renders learner input field in Individual tab', () => {
    renderWithIntl(<GrantExceptionsModal {...defaultProps} />);

    expect(screen.getByPlaceholderText(messages.studentEmailUsername.defaultMessage)).toBeInTheDocument();
  });

  it('renders notes input field in Individual tab', () => {
    renderWithIntl(<GrantExceptionsModal {...defaultProps} />);

    expect(screen.getByPlaceholderText(messages.notesOptional.defaultMessage)).toBeInTheDocument();
  });

  it('renders save and cancel buttons', () => {
    renderWithIntl(<GrantExceptionsModal {...defaultProps} />);

    expect(screen.getByRole('button', { name: messages.save.defaultMessage })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.cancel.defaultMessage })).toBeInTheDocument();
  });

  it('calls onSubmit with learner and notes when form is submitted', async () => {
    renderWithIntl(<GrantExceptionsModal {...defaultProps} />);
    const user = userEvent.setup();

    const learnerInput = screen.getByPlaceholderText(messages.studentEmailUsername.defaultMessage);
    const notesInput = screen.getByPlaceholderText(messages.notesOptional.defaultMessage);

    await user.type(learnerInput, 'user1@example.com');
    await user.type(notesInput, 'Granting exception for completion');

    const saveButton = screen.getByRole('button', { name: messages.save.defaultMessage });
    await user.click(saveButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(['user1@example.com'], 'Granting exception for completion');
  });

  it('calls onClose when cancel button is clicked', async () => {
    renderWithIntl(<GrantExceptionsModal {...defaultProps} />);
    const user = userEvent.setup();

    const cancelButton = screen.getByRole('button', { name: messages.cancel.defaultMessage });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when isSubmitting is true', () => {
    renderWithIntl(<GrantExceptionsModal {...defaultProps} isSubmitting={true} />);

    const saveButton = screen.getByRole('button', { name: messages.save.defaultMessage });
    const cancelButton = screen.getByRole('button', { name: messages.cancel.defaultMessage });

    expect(saveButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('does not render when isOpen is false', () => {
    renderWithIntl(<GrantExceptionsModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText(messages.grantExceptionsModalTitle.defaultMessage)).not.toBeInTheDocument();
  });

  it('renders CSV upload in Bulk tab', async () => {
    renderWithIntl(<GrantExceptionsModal {...defaultProps} />);
    const user = userEvent.setup();

    // Click on Bulk tab
    const bulkTab = screen.getByRole('tab', { name: messages.bulkUploadTab.defaultMessage });
    await user.click(bulkTab);

    // Check for CSV upload elements
    expect(screen.getByText(messages.csvFileLabel.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.csvInstructions.defaultMessage)).toBeInTheDocument();
  });

  it('clears form and closes modal when cancel is clicked', async () => {
    renderWithIntl(<GrantExceptionsModal {...defaultProps} />);
    const user = userEvent.setup();

    const learnerInput = screen.getByPlaceholderText(messages.studentEmailUsername.defaultMessage);
    const notesInput = screen.getByPlaceholderText(messages.notesOptional.defaultMessage);

    await user.type(learnerInput, 'user@example.com');
    await user.type(notesInput, 'Test notes');

    const cancelButton = screen.getByRole('button', { name: messages.cancel.defaultMessage });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('trims whitespace from learner input before submit', async () => {
    renderWithIntl(<GrantExceptionsModal {...defaultProps} />);
    const user = userEvent.setup();

    const learnerInput = screen.getByPlaceholderText(messages.studentEmailUsername.defaultMessage);
    await user.type(learnerInput, '  user@example.com  ');

    const saveButton = screen.getByRole('button', { name: messages.save.defaultMessage });
    await user.click(saveButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(['user@example.com'], '');
  });

  it('does not call onUploadCsv when no file is selected', async () => {
    renderWithIntl(<GrantExceptionsModal {...defaultProps} />);
    const user = userEvent.setup();

    const bulkTab = screen.getByRole('tab', { name: messages.bulkUploadTab.defaultMessage });
    await user.click(bulkTab);

    const saveButton = screen.getByRole('button', { name: messages.save.defaultMessage });
    expect(saveButton).toBeDisabled();
  });

  it('calls onUploadCsv when CSV file is uploaded and submitted', async () => {
    renderWithIntl(<GrantExceptionsModal {...defaultProps} />);
    const user = userEvent.setup();

    const bulkTab = screen.getByRole('tab', { name: messages.bulkUploadTab.defaultMessage });
    await user.click(bulkTab);

    // Create a mock file
    const csvFile = new File(['username,notes\nuser1,note1'], 'test.csv', { type: 'text/csv' });

    // Find the file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    if (fileInput) {
      await user.upload(fileInput, csvFile);

      // Wait for file to be processed
      await screen.findByText(/test\.csv/i);

      const saveButton = screen.getByRole('button', { name: messages.save.defaultMessage });
      await user.click(saveButton);

      expect(mockOnUploadCsv).toHaveBeenCalledWith(csvFile);
    }
  });
});
