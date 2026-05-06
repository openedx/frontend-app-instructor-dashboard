import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IssuedCertificatesTab from '@src/certificates/components/IssuedCertificatesTab';
import { renderWithIntl } from '@src/testUtils';
import { CertificateData, CertificateFilter, CertificateStatus, SpecialCase } from '@src/certificates/types';

describe('IssuedCertificatesTab', () => {
  const mockOnSearchChange = jest.fn();
  const mockOnFilterChange = jest.fn();
  const mockOnPageChange = jest.fn();
  const mockOnRemoveException = jest.fn();
  const mockOnRemoveInvalidation = jest.fn();
  const mockOnRegenerateCertificates = jest.fn();

  const mockCertificateData: CertificateData[] = [
    {
      username: 'user1',
      email: 'user1@example.com',
      enrollmentTrack: 'verified',
      certificateStatus: CertificateStatus.RECEIVED,
      specialCase: SpecialCase.NONE,
    },
  ];

  const defaultProps = {
    data: mockCertificateData,
    isLoading: false,
    itemCount: 1,
    pageCount: 1,
    search: '',
    onSearchChange: mockOnSearchChange,
    filter: CertificateFilter.ALL_LEARNERS,
    onFilterChange: mockOnFilterChange,
    currentPage: 0,
    onPageChange: mockOnPageChange,
    onRemoveException: mockOnRemoveException,
    onRemoveInvalidation: mockOnRemoveInvalidation,
    onRegenerateCertificates: mockOnRegenerateCertificates,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders CertificatesToolbar component', () => {
    renderWithIntl(<IssuedCertificatesTab {...defaultProps} />);

    // Toolbar elements should be present
    expect(screen.getByPlaceholderText(/Search/i)).toBeInTheDocument();
  });

  it('renders CertificateTable component', () => {
    renderWithIntl(<IssuedCertificatesTab {...defaultProps} />);

    // Table should display the data
    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
  });

  it('passes search prop to toolbar', () => {
    renderWithIntl(<IssuedCertificatesTab {...defaultProps} search="testuser" />);

    const searchInput = screen.getByPlaceholderText(/Search/i) as HTMLInputElement;
    expect(searchInput.value).toBe('testuser');
  });

  it('passes filter prop to toolbar', () => {
    renderWithIntl(<IssuedCertificatesTab {...defaultProps} filter={CertificateFilter.RECEIVED} />);

    // Filter dropdown button should show the selected filter
    const receivedButtons = screen.getAllByRole('button', { name: /Received/i });
    expect(receivedButtons.length).toBeGreaterThan(0);
  });

  it('calls onSearchChange when search input changes', async () => {
    renderWithIntl(<IssuedCertificatesTab {...defaultProps} />);
    const user = userEvent.setup();

    const searchInput = screen.getByPlaceholderText(/Search/i);
    await user.type(searchInput, 'test');

    expect(mockOnSearchChange).toHaveBeenCalled();
  });

  it('calls onFilterChange when filter is changed', async () => {
    renderWithIntl(<IssuedCertificatesTab {...defaultProps} />);
    const user = userEvent.setup();

    const filterButton = screen.getByRole('button', { name: /All Learners/i });
    await user.click(filterButton);

    const receivedOptions = screen.getAllByText(/Received/i);
    await user.click(receivedOptions[1]);

    expect(mockOnFilterChange).toHaveBeenCalled();
  });

  it('button is disabled when ALL_LEARNERS filter is selected', async () => {
    renderWithIntl(<IssuedCertificatesTab {...defaultProps} />);

    const regenerateButton = screen.getByText(/Regenerate Certificates/i);
    expect(regenerateButton).toBeDisabled();
  });

  it('calls onRegenerateCertificates when button is clicked with filter', async () => {
    renderWithIntl(<IssuedCertificatesTab {...defaultProps} filter={CertificateFilter.RECEIVED} />);
    const user = userEvent.setup();

    const regenerateButton = screen.getByText(/Regenerate Certificates/i);
    await user.click(regenerateButton);

    expect(mockOnRegenerateCertificates).toHaveBeenCalledTimes(1);
  });

  it('passes data to table component', () => {
    const multipleData: CertificateData[] = [
      {
        username: 'user1',
        email: 'user1@example.com',
        enrollmentTrack: 'verified',
        certificateStatus: CertificateStatus.RECEIVED,
        specialCase: SpecialCase.NONE,
      },
      {
        username: 'user2',
        email: 'user2@example.com',
        enrollmentTrack: 'audit',
        certificateStatus: CertificateStatus.NOT_RECEIVED,
        specialCase: SpecialCase.NONE,
      },
    ];

    renderWithIntl(<IssuedCertificatesTab {...defaultProps} data={multipleData} itemCount={2} />);

    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
  });

  it('passes isLoading prop to table', () => {
    renderWithIntl(<IssuedCertificatesTab {...defaultProps} isLoading={true} />);

    // Table should be present even when loading
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('displays correct page count and item count', () => {
    renderWithIntl(<IssuedCertificatesTab {...defaultProps} itemCount={25} pageCount={3} />);

    // Table should be rendered with pagination
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('has proper layout structure', () => {
    const { container } = renderWithIntl(<IssuedCertificatesTab {...defaultProps} />);

    const tabContainer = container.querySelector('.certificates-tab-container');
    expect(tabContainer).toBeInTheDocument();
  });

  it('renders empty data correctly', () => {
    renderWithIntl(<IssuedCertificatesTab {...defaultProps} data={[]} itemCount={0} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
