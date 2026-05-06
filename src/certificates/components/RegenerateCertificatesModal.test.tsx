import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegenerateCertificatesModal from '@src/certificates/components/RegenerateCertificatesModal';
import { renderWithIntl } from '@src/testUtils';
import { CertificateFilter } from '@src/certificates/types';
import messages from '@src/certificates/messages';

describe('RegenerateCertificatesModal', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    isSubmitting: false,
    filter: CertificateFilter.RECEIVED,
    learnerCount: 10,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with received filter title and message', () => {
    renderWithIntl(<RegenerateCertificatesModal {...defaultProps} />);

    expect(screen.getByRole('dialog', { name: messages.regenerateModalTitleReceived.defaultMessage })).toBeInTheDocument();
    expect(screen.getByText(/Clicking "Regenerate" will regenerate certificates for 10 learner/i)).toBeInTheDocument();
  });

  it('renders modal with not received filter title and message', () => {
    renderWithIntl(<RegenerateCertificatesModal {...defaultProps} filter={CertificateFilter.NOT_RECEIVED} />);

    expect(screen.getByRole('dialog', { name: messages.regenerateModalTitleNotReceived.defaultMessage })).toBeInTheDocument();
    expect(screen.getByText(/Clicking "Regenerate" will regenerate certificates for 10 learner/i)).toBeInTheDocument();
  });

  it('renders modal with audit passing filter title and message', () => {
    renderWithIntl(<RegenerateCertificatesModal {...defaultProps} filter={CertificateFilter.AUDIT_PASSING} />);

    expect(screen.getByRole('dialog', { name: messages.regenerateModalTitleAuditPassing.defaultMessage })).toBeInTheDocument();
    expect(screen.getByText(/Clicking "Regenerate" will regenerate certificates for 10 learner/i)).toBeInTheDocument();
  });

  it('renders modal with audit not passing filter title and message', () => {
    renderWithIntl(<RegenerateCertificatesModal {...defaultProps} filter={CertificateFilter.AUDIT_NOT_PASSING} />);

    expect(screen.getByRole('dialog', { name: messages.regenerateModalTitleAuditNotPassing.defaultMessage })).toBeInTheDocument();
    expect(screen.getByText(/Clicking "Regenerate" will regenerate certificates for 10 learner/i)).toBeInTheDocument();
  });

  it('renders modal with error state filter title and message', () => {
    renderWithIntl(<RegenerateCertificatesModal {...defaultProps} filter={CertificateFilter.ERROR_STATE} />);

    expect(screen.getByRole('dialog', { name: messages.regenerateModalTitleErrorState.defaultMessage })).toBeInTheDocument();
    expect(screen.getByText(/Clicking "Regenerate" will regenerate certificates for 10 learner/i)).toBeInTheDocument();
  });

  it('renders modal with default title and message for unknown filter', () => {
    renderWithIntl(<RegenerateCertificatesModal {...defaultProps} filter={CertificateFilter.ALL_LEARNERS} />);

    expect(screen.getByRole('dialog', { name: messages.regenerateModalTitleDefault.defaultMessage })).toBeInTheDocument();
    expect(screen.getByText(/Clicking "Regenerate" will regenerate certificates for 10 learner/i)).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', async () => {
    renderWithIntl(<RegenerateCertificatesModal {...defaultProps} />);
    const user = userEvent.setup();

    const cancelButton = screen.getByText(messages.cancel.defaultMessage);
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when regenerate button is clicked', async () => {
    renderWithIntl(<RegenerateCertificatesModal {...defaultProps} />);
    const user = userEvent.setup();

    const regenerateButton = screen.getByText(messages.regenerate.defaultMessage);
    await user.click(regenerateButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when isSubmitting is true', () => {
    renderWithIntl(<RegenerateCertificatesModal {...defaultProps} isSubmitting />);

    const cancelButton = screen.getByText(messages.cancel.defaultMessage);
    const regenerateButton = screen.getByText(messages.regenerate.defaultMessage);

    expect(cancelButton).toBeDisabled();
    expect(regenerateButton).toBeDisabled();
  });

  it('does not render when isOpen is false', () => {
    renderWithIntl(<RegenerateCertificatesModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
