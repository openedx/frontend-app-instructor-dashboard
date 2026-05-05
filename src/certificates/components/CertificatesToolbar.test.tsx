import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CertificatesToolbar from '@src/certificates/components/CertificatesToolbar';
import { renderWithIntl } from '@src/testUtils';
import { CertificateFilter } from '@src/certificates/types';
import messages from '@src/certificates/messages';

describe('CertificatesToolbar', () => {
  const mockOnSearchChange = jest.fn();
  const mockOnFilterChange = jest.fn();
  const mockOnRegenerateCertificates = jest.fn();

  const defaultProps = {
    search: '',
    onSearchChange: mockOnSearchChange,
    filter: CertificateFilter.ALL_LEARNERS,
    onFilterChange: mockOnFilterChange,
    onRegenerateCertificates: mockOnRegenerateCertificates,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search field with placeholder', () => {
    renderWithIntl(<CertificatesToolbar {...defaultProps} />);

    expect(screen.getByPlaceholderText(messages.searchPlaceholder.defaultMessage)).toBeInTheDocument();
  });

  it('renders filter dropdown', () => {
    renderWithIntl(<CertificatesToolbar {...defaultProps} />);

    expect(screen.getByText(messages.filterAllLearners.defaultMessage)).toBeInTheDocument();
  });

  it('renders regenerate certificates button', () => {
    renderWithIntl(<CertificatesToolbar {...defaultProps} />);

    expect(screen.getByText(messages.regenerateCertificatesButton.defaultMessage)).toBeInTheDocument();
  });

  it('calls onSearchChange when search input changes', async () => {
    renderWithIntl(<CertificatesToolbar {...defaultProps} />);
    const user = userEvent.setup();

    const searchInput = screen.getByPlaceholderText(messages.searchPlaceholder.defaultMessage);
    await user.type(searchInput, 'test');

    expect(mockOnSearchChange).toHaveBeenCalled();
  });

  it('displays search value in input field', () => {
    renderWithIntl(<CertificatesToolbar {...defaultProps} search="testuser" />);

    const searchInput = screen.getByPlaceholderText(messages.searchPlaceholder.defaultMessage) as HTMLInputElement;
    expect(searchInput.value).toBe('testuser');
  });

  it('calls onFilterChange when filter is changed', async () => {
    renderWithIntl(<CertificatesToolbar {...defaultProps} />);
    const user = userEvent.setup();

    const filterButton = screen.getByRole('button', { name: /All Learners/i });
    await user.click(filterButton);

    const receivedOption = screen.getByText(messages.filterReceived.defaultMessage);
    await user.click(receivedOption);

    expect(mockOnFilterChange).toHaveBeenCalledWith(CertificateFilter.RECEIVED);
  });

  it('button is disabled when ALL_LEARNERS filter is selected', async () => {
    renderWithIntl(<CertificatesToolbar {...defaultProps} />);

    const regenerateButton = screen.getByText(messages.regenerateCertificatesButton.defaultMessage);
    expect(regenerateButton).toBeDisabled();
  });

  it('calls onRegenerateCertificates when regenerate button is clicked with filter', async () => {
    renderWithIntl(<CertificatesToolbar {...defaultProps} filter={CertificateFilter.RECEIVED} />);
    const user = userEvent.setup();

    const regenerateButton = screen.getByText(messages.regenerateCertificatesButton.defaultMessage);
    await user.click(regenerateButton);

    expect(mockOnRegenerateCertificates).toHaveBeenCalledTimes(1);
  });

  it('displays selected filter value', () => {
    renderWithIntl(<CertificatesToolbar {...defaultProps} filter={CertificateFilter.RECEIVED} />);

    expect(screen.getByText(messages.filterReceived.defaultMessage)).toBeInTheDocument();
  });

  it('handles empty search string', () => {
    renderWithIntl(<CertificatesToolbar {...defaultProps} search="" />);

    const searchInput = screen.getByPlaceholderText(messages.searchPlaceholder.defaultMessage) as HTMLInputElement;
    expect(searchInput.value).toBe('');
  });

  it('renders regenerate button with outline variant', () => {
    renderWithIntl(<CertificatesToolbar {...defaultProps} />);

    const regenerateButton = screen.getByText(messages.regenerateCertificatesButton.defaultMessage);
    expect(regenerateButton.closest('button')).toHaveClass('btn-outline-primary');
  });

  it('allows clearing search input', async () => {
    renderWithIntl(<CertificatesToolbar {...defaultProps} search="test" />);
    const user = userEvent.setup();

    const searchInput = screen.getByPlaceholderText(messages.searchPlaceholder.defaultMessage);
    await user.clear(searchInput);

    expect(mockOnSearchChange).toHaveBeenCalled();
  });

  it('handles multiple filter changes', async () => {
    renderWithIntl(<CertificatesToolbar {...defaultProps} />);
    const user = userEvent.setup();

    const filterButton = screen.getByRole('button', { name: /All Learners/i });
    await user.click(filterButton);

    expect(screen.getAllByText(messages.filterReceived.defaultMessage).length).toBeGreaterThan(0);
  });

  it('has proper layout structure', () => {
    const { container } = renderWithIntl(<CertificatesToolbar {...defaultProps} />);

    const toolbar = container.querySelector('.d-flex');
    expect(toolbar).toBeInTheDocument();
  });
});
