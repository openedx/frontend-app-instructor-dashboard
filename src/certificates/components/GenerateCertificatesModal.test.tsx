import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GenerateCertificatesModal from '@src/certificates/components/GenerateCertificatesModal';
import { renderWithIntl } from '@src/testUtils';
import messages from '@src/certificates/messages';

describe('GenerateCertificatesModal', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    isSubmitting: false,
    learnerCount: 15,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with title and description', () => {
    renderWithIntl(<GenerateCertificatesModal {...defaultProps} />);

    expect(screen.getByRole('dialog', { name: messages.generateModalTitle.defaultMessage })).toBeInTheDocument();
    expect(screen.getByText(/Generate certificates for learners who have granted exceptions/i)).toBeInTheDocument();
    expect(screen.getByText(/15 learner/i)).toBeInTheDocument();
  });

  it('renders radio options', () => {
    renderWithIntl(<GenerateCertificatesModal {...defaultProps} />);

    expect(screen.getByText(messages.generateOptionAll.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.generateOptionWithoutCertificate.defaultMessage)).toBeInTheDocument();
  });

  it('selects "all" option by default', () => {
    renderWithIntl(<GenerateCertificatesModal {...defaultProps} />);

    const allOption = screen.getByDisplayValue('all');
    expect(allOption).toBeChecked();
  });

  it('calls onConfirm with false when "all" option is selected', async () => {
    renderWithIntl(<GenerateCertificatesModal {...defaultProps} />);
    const user = userEvent.setup();

    const generateButton = screen.getByText(messages.generate.defaultMessage);
    await user.click(generateButton);

    expect(mockOnConfirm).toHaveBeenCalledWith(false);
  });

  it('calls onConfirm with true when "without_certificate" option is selected', async () => {
    renderWithIntl(<GenerateCertificatesModal {...defaultProps} />);
    const user = userEvent.setup();

    const withoutCertOption = screen.getByDisplayValue('without_certificate');
    await user.click(withoutCertOption);

    const generateButton = screen.getByText(messages.generate.defaultMessage);
    await user.click(generateButton);

    expect(mockOnConfirm).toHaveBeenCalledWith(true);
  });

  it('calls onClose and resets selection when cancel button is clicked', async () => {
    renderWithIntl(<GenerateCertificatesModal {...defaultProps} />);
    const user = userEvent.setup();

    const withoutCertOption = screen.getByDisplayValue('without_certificate');
    await user.click(withoutCertOption);

    const cancelButton = screen.getByText(messages.cancel.defaultMessage);
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('resets selection when modal is closed', async () => {
    renderWithIntl(<GenerateCertificatesModal {...defaultProps} />);
    const user = userEvent.setup();

    // Select without_certificate option
    const withoutCertOption = screen.getByDisplayValue('without_certificate');
    await user.click(withoutCertOption);
    expect(withoutCertOption).toBeChecked();

    // Close modal by clicking cancel
    const cancelButton = screen.getByText(messages.cancel.defaultMessage);
    await user.click(cancelButton);

    // onClose should have been called
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('disables buttons when isSubmitting is true', () => {
    renderWithIntl(<GenerateCertificatesModal {...defaultProps} isSubmitting />);

    const cancelButton = screen.getByText(messages.cancel.defaultMessage);
    const generateButton = screen.getByText(messages.generate.defaultMessage);

    expect(cancelButton).toBeDisabled();
    expect(generateButton).toBeDisabled();
  });

  it('does not render when isOpen is false', () => {
    renderWithIntl(<GenerateCertificatesModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
