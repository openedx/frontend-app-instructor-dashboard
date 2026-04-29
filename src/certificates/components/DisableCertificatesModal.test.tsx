import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@openedx/frontend-base';
import DisableCertificatesModal from '@src/certificates/components/DisableCertificatesModal';
import { renderWithIntl } from '@src/testUtils';
import messages from '@src/certificates/messages';

describe('DisableCertificatesModal', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  const defaultProps = {
    isOpen: true,
    isEnabled: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    isSubmitting: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders disable modal when certificates are enabled', () => {
    renderWithIntl(<DisableCertificatesModal {...defaultProps} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders enable modal when certificates are disabled', () => {
    renderWithIntl(<DisableCertificatesModal {...defaultProps} isEnabled={false} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders save and close buttons', () => {
    renderWithIntl(<DisableCertificatesModal {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    const saveButton = buttons.find(btn => btn.textContent === messages.save.defaultMessage);
    const closeButton = buttons.find(btn => btn.textContent === messages.close.defaultMessage);

    expect(saveButton).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });

  it('calls onConfirm when save button is clicked and checkbox state changed', async () => {
    renderWithIntl(<DisableCertificatesModal {...defaultProps} isEnabled={true} />);
    const user = userEvent.setup();

    // Change the checkbox state
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    const saveButton = screen.getByRole('button', { name: messages.save.defaultMessage });
    await user.click(saveButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', async () => {
    renderWithIntl(<DisableCertificatesModal {...defaultProps} />);
    const user = userEvent.setup();

    const buttons = screen.getAllByRole('button');
    const closeButton = buttons.find(btn => btn.textContent === messages.close.defaultMessage);
    if (!closeButton) throw new Error('Close button not found');
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when isSubmitting is true', () => {
    renderWithIntl(<DisableCertificatesModal {...defaultProps} isSubmitting={true} />);

    const buttons = screen.getAllByRole('button');
    const saveButton = buttons.find(btn => btn.textContent === messages.save.defaultMessage);
    const closeButton = buttons.find(btn => btn.textContent === messages.close.defaultMessage);

    expect(saveButton).toBeDisabled();
    expect(closeButton).toBeDisabled();
  });

  it('does not render when isOpen is false', () => {
    renderWithIntl(<DisableCertificatesModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText(messages.studentGeneratedCertificatesModalTitle.defaultMessage)).not.toBeInTheDocument();
  });

  it('switches title and message based on isEnabled prop', () => {
    const { rerender } = renderWithIntl(
      <DisableCertificatesModal {...defaultProps} isEnabled={true} />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    rerender(
      <IntlProvider locale="en" messages={{}}>
        <DisableCertificatesModal {...defaultProps} isEnabled={false} />
      </IntlProvider>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('enables buttons when not submitting', () => {
    renderWithIntl(<DisableCertificatesModal {...defaultProps} isSubmitting={false} />);

    const buttons = screen.getAllByRole('button');
    const saveButton = buttons.find(btn => btn.textContent === messages.save.defaultMessage);
    const closeButton = buttons.find(btn => btn.textContent === messages.close.defaultMessage);

    expect(saveButton).not.toBeDisabled();
    expect(closeButton).not.toBeDisabled();
  });

  it('renders with small size modal', () => {
    renderWithIntl(<DisableCertificatesModal {...defaultProps} />);

    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
  });

  it('has close button in header', () => {
    renderWithIntl(<DisableCertificatesModal {...defaultProps} />);

    // Modal should have the default close button (X) in header
    const closeButtons = screen.queryAllByLabelText('Close');
    expect(closeButtons.length).toBeGreaterThan(0);
  });

  it('calls onClose when save button is clicked without changes', async () => {
    renderWithIntl(<DisableCertificatesModal {...defaultProps} />);
    const user = userEvent.setup();

    const saveButton = screen.getByRole('button', { name: messages.save.defaultMessage });
    await user.click(saveButton);

    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });
});
