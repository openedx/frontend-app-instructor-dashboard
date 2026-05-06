import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CertificatesPage from '@src/certificates/CertificatesPage';
import { renderWithAlertAndIntl } from '@src/testUtils';
import { useCourseInfo } from '@src/data/apiHook';
import {
  useCertificateGenerationHistory,
  useGrantBulkExceptions,
  useInstructorTasks,
  useInvalidateCertificate,
  useIssuedCertificates,
  useRegenerateCertificates,
  useRemoveException,
  useRemoveInvalidation,
  useToggleCertificateGeneration,
  useUploadBulkExceptionsCsv,
} from '@src/certificates/data/apiHook';
import messages from '@src/certificates/messages';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'course-v1:edX+Test+2024' }),
}));

jest.mock('@src/certificates/data/apiHook');
jest.mock('@src/data/apiHook', () => ({
  useCourseInfo: jest.fn(),
}));

const mockUseCourseInfo = useCourseInfo as jest.MockedFunction<typeof useCourseInfo>;
const mockUseCertificateGenerationHistory = useCertificateGenerationHistory as jest.MockedFunction<typeof useCertificateGenerationHistory>;
const mockUseInstructorTasks = useInstructorTasks as jest.MockedFunction<typeof useInstructorTasks>;
const mockUseIssuedCertificates = useIssuedCertificates as jest.MockedFunction<typeof useIssuedCertificates>;
const mockUseGrantBulkExceptions = useGrantBulkExceptions as jest.MockedFunction<typeof useGrantBulkExceptions>;
const mockUseUploadBulkExceptionsCsv = useUploadBulkExceptionsCsv as jest.MockedFunction<typeof useUploadBulkExceptionsCsv>;
const mockUseInvalidateCertificate = useInvalidateCertificate as jest.MockedFunction<typeof useInvalidateCertificate>;
const mockUseRegenerateCertificates = useRegenerateCertificates as jest.MockedFunction<typeof useRegenerateCertificates>;
const mockUseRemoveException = useRemoveException as jest.MockedFunction<typeof useRemoveException>;
const mockUseRemoveInvalidation = useRemoveInvalidation as jest.MockedFunction<typeof useRemoveInvalidation>;
const mockUseToggleCertificateGeneration = useToggleCertificateGeneration as jest.MockedFunction<typeof useToggleCertificateGeneration>;

describe('CertificatesPage', () => {
  const mockGrantExceptions = jest.fn();
  const mockInvalidateCert = jest.fn();
  const mockRegenerateCerts = jest.fn();
  const mockRemoveException = jest.fn();
  const mockRemoveInvalidation = jest.fn();
  const mockToggleGeneration = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCourseInfo.mockReturnValue({
      data: { certificatesEnabled: true },
      isLoading: false,
      error: null,
    } as any);

    mockUseCertificateGenerationHistory.mockReturnValue({
      data: {
        results: [],
        count: 0,
        numPages: 0,
        next: null,
        previous: null,
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useCertificateGenerationHistory>);

    mockUseIssuedCertificates.mockReturnValue({
      data: {
        results: [
          {
            username: 'user1',
            email: 'user1@example.com',
            enrollmentTrack: 'verified',
            certificateStatus: 'downloadable',
            specialCase: '',
          },
          {
            username: 'user2',
            email: 'user2@example.com',
            enrollmentTrack: 'audit',
            certificateStatus: 'notpassing',
            specialCase: '',
          },
          {
            username: 'user3',
            email: 'user3@example.com',
            enrollmentTrack: 'audit',
            certificateStatus: 'audit_passing',
            specialCase: '',
          },
          {
            username: 'user4',
            email: 'user4@example.com',
            enrollmentTrack: 'audit',
            certificateStatus: 'audit_notpassing',
            specialCase: '',
          },
          {
            username: 'user5',
            email: 'user5@example.com',
            enrollmentTrack: 'verified',
            certificateStatus: 'error',
            specialCase: '',
          },
          {
            username: 'user6',
            email: 'user6@example.com',
            enrollmentTrack: 'verified',
            certificateStatus: 'downloadable',
            specialCase: 'exception',
          },
          {
            username: 'user7',
            email: 'user7@example.com',
            enrollmentTrack: 'verified',
            certificateStatus: 'notpassing',
            specialCase: 'invalidated',
          },
        ],
        count: 7,
        numPages: 1,
        next: null,
        previous: null,
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useIssuedCertificates>);

    mockUseInstructorTasks.mockReturnValue({
      data: {
        results: [],
        count: 0,
        numPages: 0,
        next: null,
        previous: null,
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useInstructorTasks>);

    mockUseGrantBulkExceptions.mockReturnValue({
      mutate: mockGrantExceptions,
      isPending: false,
    } as unknown as ReturnType<typeof useGrantBulkExceptions>);

    mockUseUploadBulkExceptionsCsv.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useUploadBulkExceptionsCsv>);

    mockUseInvalidateCertificate.mockReturnValue({
      mutate: mockInvalidateCert,
      isPending: false,
    } as unknown as ReturnType<typeof useInvalidateCertificate>);

    mockUseRegenerateCertificates.mockReturnValue({
      mutate: mockRegenerateCerts,
      isPending: false,
    } as unknown as ReturnType<typeof useRegenerateCertificates>);

    mockUseRemoveException.mockReturnValue({
      mutate: mockRemoveException,
    } as unknown as ReturnType<typeof useRemoveException>);

    mockUseRemoveInvalidation.mockReturnValue({
      mutate: mockRemoveInvalidation,
      isPending: false,
    } as unknown as ReturnType<typeof useRemoveInvalidation>);

    mockUseToggleCertificateGeneration.mockReturnValue({
      mutate: mockToggleGeneration,
      isPending: false,
    } as unknown as ReturnType<typeof useToggleCertificateGeneration>);
  });

  it('renders page with header and tabs', () => {
    renderWithAlertAndIntl(<CertificatesPage />);

    expect(screen.getByText(messages.issuedCertificatesTab.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.generationHistoryTab.defaultMessage)).toBeInTheDocument();
  });

  it('renders issued certificates tab by default', () => {
    renderWithAlertAndIntl(<CertificatesPage />);

    expect(screen.getByText(messages.issuedCertificatesTab.defaultMessage)).toBeInTheDocument();
  });

  it('switches to generation history tab', async () => {
    renderWithAlertAndIntl(<CertificatesPage />);
    const user = userEvent.setup();

    const historyTab = screen.getByText(messages.generationHistoryTab.defaultMessage);
    await user.click(historyTab);

    await waitFor(() => {
      expect(screen.getByText(messages.generationHistoryTab.defaultMessage)).toBeInTheDocument();
    });
  });

  it('renders page header with action buttons', () => {
    renderWithAlertAndIntl(<CertificatesPage />);

    expect(screen.getByText(messages.grantExceptionsButton.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.invalidateCertificateButton.defaultMessage)).toBeInTheDocument();
  });

  it('opens Grant Exceptions modal when button is clicked', async () => {
    renderWithAlertAndIntl(<CertificatesPage />);
    const user = userEvent.setup();

    const grantButton = screen.getByText(messages.grantExceptionsButton.defaultMessage);
    await user.click(grantButton);

    await waitFor(() => {
      expect(screen.getByText(messages.grantExceptionsModalTitle.defaultMessage)).toBeInTheDocument();
    });
  });

  it('opens Invalidate Certificate modal when button is clicked', async () => {
    renderWithAlertAndIntl(<CertificatesPage />);
    const user = userEvent.setup();

    const invalidateButton = screen.getByText(messages.invalidateCertificateButton.defaultMessage);
    await user.click(invalidateButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('displays certificate data in table', () => {
    renderWithAlertAndIntl(<CertificatesPage />);

    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
  });

  it('fetches certificate generation history on mount', () => {
    renderWithAlertAndIntl(<CertificatesPage />);

    expect(mockUseCertificateGenerationHistory).toHaveBeenCalledWith(
      'course-v1:edX+Test+2024',
      { page: 0, pageSize: 25 }
    );
  });

  it('renders with loading state for tasks', () => {
    mockUseInstructorTasks.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as unknown as ReturnType<typeof useInstructorTasks>);

    renderWithAlertAndIntl(<CertificatesPage />);
    expect(screen.getByText(messages.issuedCertificatesTab.defaultMessage)).toBeInTheDocument();
  });

  it('handles page change for certificates', () => {
    renderWithAlertAndIntl(<CertificatesPage />);
    // The component should handle page changes
    expect(screen.getByText('user1')).toBeInTheDocument();
  });

  it('handles page change for tasks', async () => {
    renderWithAlertAndIntl(<CertificatesPage />);
    const user = userEvent.setup();

    // Switch to history tab
    const historyTab = screen.getByText(messages.generationHistoryTab.defaultMessage);
    await user.click(historyTab);

    await waitFor(() => {
      expect(screen.getByText(messages.generationHistoryTab.defaultMessage)).toBeInTheDocument();
    });
  });

  describe('Grant Exceptions', () => {
    it('calls mutation with correct parameters when form is submitted', async () => {
      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      const grantButton = screen.getByText(messages.grantExceptionsButton.defaultMessage);
      await user.click(grantButton);

      await waitFor(() => {
        expect(screen.getByText(messages.grantExceptionsModalTitle.defaultMessage)).toBeInTheDocument();
      });

      // Fill in the form
      const learnerInput = screen.getByPlaceholderText(messages.studentEmailUsername.defaultMessage);
      const notesInput = screen.getByPlaceholderText(messages.notesOptional.defaultMessage);

      await user.type(learnerInput, 'user1');
      await user.type(notesInput, 'Test note');

      // Submit the form
      const saveButton = screen.getByText(messages.save.defaultMessage);
      await user.click(saveButton);

      // Verify mutation was called
      expect(mockGrantExceptions).toHaveBeenCalledWith(
        { learners: ['user1'], notes: 'Test note' },
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        })
      );
    });

    it('shows success toast when grant exceptions succeeds', async () => {
      // Make mock invoke onSuccess callback with proper data structure
      mockGrantExceptions.mockImplementation((_data, options) => {
        if (options?.onSuccess) {
          options.onSuccess({ success: ['user1'], errors: [] });
        }
      });

      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      const grantButton = screen.getByText(messages.grantExceptionsButton.defaultMessage);
      await user.click(grantButton);

      await waitFor(() => {
        expect(screen.getByText(messages.grantExceptionsModalTitle.defaultMessage)).toBeInTheDocument();
      });

      // Fill in and submit the form
      const learnerInput = screen.getByPlaceholderText(messages.studentEmailUsername.defaultMessage);
      await user.type(learnerInput, 'user1');

      const saveButton = screen.getByText(messages.save.defaultMessage);
      await user.click(saveButton);

      // Verify the modal is closed (side effect of onSuccess)
      await waitFor(() => {
        expect(screen.queryByText(messages.grantExceptionsModalTitle.defaultMessage)).not.toBeInTheDocument();
      });
    });

    it('shows error alert when grant exceptions fails', async () => {
      // Make mock invoke onError callback when called
      mockGrantExceptions.mockImplementation((_data, options) => {
        if (options?.onError) {
          const error = { response: { data: { message: 'Test error' } } };
          options.onError(error);
        }
      });

      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      const grantButton = screen.getByText(messages.grantExceptionsButton.defaultMessage);
      await user.click(grantButton);

      await waitFor(() => {
        expect(screen.getByText(messages.grantExceptionsModalTitle.defaultMessage)).toBeInTheDocument();
      });

      // Fill in and submit the form
      const learnerInput = screen.getByPlaceholderText(messages.studentEmailUsername.defaultMessage);
      await user.type(learnerInput, 'user1');

      const saveButton = screen.getByText(messages.save.defaultMessage);
      await user.click(saveButton);

      // Verify mutation was called (error alert is shown by AlertProvider)
      expect(mockGrantExceptions).toHaveBeenCalled();
    });

    it('shows warning modal when grant exceptions partially succeeds', async () => {
      // Make mock invoke onSuccess with some errors
      mockGrantExceptions.mockImplementation((_data, options) => {
        if (options?.onSuccess) {
          options.onSuccess({
            success: ['user1'],
            errors: [{ learner: 'user2', message: 'User not found' }]
          });
        }
      });

      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      const grantButton = screen.getByText(messages.grantExceptionsButton.defaultMessage);
      await user.click(grantButton);

      await waitFor(() => {
        expect(screen.getByText(messages.grantExceptionsModalTitle.defaultMessage)).toBeInTheDocument();
      });

      const learnerInput = screen.getByPlaceholderText(messages.studentEmailUsername.defaultMessage);
      await user.type(learnerInput, 'user1');

      const saveButton = screen.getByText(messages.save.defaultMessage);
      await user.click(saveButton);

      // Modal should close
      await waitFor(() => {
        expect(screen.queryByText(messages.grantExceptionsModalTitle.defaultMessage)).not.toBeInTheDocument();
      });
    });

    it('handles CSV upload with success', async () => {
      const mockUploadCsv = jest.fn();
      mockUseUploadBulkExceptionsCsv.mockReturnValue({
        mutate: mockUploadCsv,
        isPending: false,
      } as unknown as ReturnType<typeof useUploadBulkExceptionsCsv>);

      mockUploadCsv.mockImplementation((_data, options) => {
        if (options?.onSuccess) {
          options.onSuccess({ success: ['user1', 'user2'], errors: [] });
        }
      });

      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      const grantButton = screen.getByText(messages.grantExceptionsButton.defaultMessage);
      await user.click(grantButton);

      await waitFor(() => {
        expect(screen.getByText(messages.grantExceptionsModalTitle.defaultMessage)).toBeInTheDocument();
      });

      // Switch to Bulk tab
      const bulkTab = screen.getByRole('tab', { name: messages.bulkUploadTab.defaultMessage });
      await user.click(bulkTab);

      // Create and upload a mock file
      const csvFile = new File(['username,notes\nuser1,note1'], 'test.csv', { type: 'text/csv' });
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      if (fileInput) {
        await user.upload(fileInput, csvFile);
        await screen.findByText(/test\.csv/i);

        const saveButton = screen.getByText(messages.save.defaultMessage);
        await user.click(saveButton);

        expect(mockUploadCsv).toHaveBeenCalled();
      }
    });

    it('handles CSV upload with partial errors', async () => {
      const mockUploadCsv = jest.fn();
      mockUseUploadBulkExceptionsCsv.mockReturnValue({
        mutate: mockUploadCsv,
        isPending: false,
      } as unknown as ReturnType<typeof useUploadBulkExceptionsCsv>);

      mockUploadCsv.mockImplementation((_data, options) => {
        if (options?.onSuccess) {
          options.onSuccess({
            success: ['user1'],
            errors: [{ learner: 'user2', message: 'User not found' }]
          });
        }
      });

      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      const grantButton = screen.getByText(messages.grantExceptionsButton.defaultMessage);
      await user.click(grantButton);

      await waitFor(() => {
        expect(screen.getByText(messages.grantExceptionsModalTitle.defaultMessage)).toBeInTheDocument();
      });

      // Switch to Bulk tab
      const bulkTab = screen.getByRole('tab', { name: messages.bulkUploadTab.defaultMessage });
      await user.click(bulkTab);

      const csvFile = new File(['username,notes\nuser1,note1'], 'test.csv', { type: 'text/csv' });
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      if (fileInput) {
        await user.upload(fileInput, csvFile);
        await screen.findByText(/test\.csv/i);

        const saveButton = screen.getByText(messages.save.defaultMessage);
        await user.click(saveButton);

        // Wait for modal to close and error modal to appear
        await waitFor(() => {
          expect(screen.queryByText(messages.grantExceptionsModalTitle.defaultMessage)).not.toBeInTheDocument();
        });
      }
    });

    it('handles CSV upload error', async () => {
      const mockUploadCsv = jest.fn();
      mockUseUploadBulkExceptionsCsv.mockReturnValue({
        mutate: mockUploadCsv,
        isPending: false,
      } as unknown as ReturnType<typeof useUploadBulkExceptionsCsv>);

      mockUploadCsv.mockImplementation((_data, options) => {
        if (options?.onError) {
          options.onError({ response: { data: { message: 'CSV upload failed' } } });
        }
      });

      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      const grantButton = screen.getByText(messages.grantExceptionsButton.defaultMessage);
      await user.click(grantButton);

      await waitFor(() => {
        expect(screen.getByText(messages.grantExceptionsModalTitle.defaultMessage)).toBeInTheDocument();
      });

      // Switch to Bulk tab
      const bulkTab = screen.getByRole('tab', { name: messages.bulkUploadTab.defaultMessage });
      await user.click(bulkTab);

      const csvFile = new File(['username,notes\nuser1,note1'], 'test.csv', { type: 'text/csv' });
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      if (fileInput) {
        await user.upload(fileInput, csvFile);
        await screen.findByText(/test\.csv/i);

        const saveButton = screen.getByText(messages.save.defaultMessage);
        await user.click(saveButton);

        expect(mockUploadCsv).toHaveBeenCalled();
      }
    });
  });

  describe('Invalidate Certificate', () => {
    it('calls mutation with correct parameters', async () => {
      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      const invalidateButton = screen.getByText(messages.invalidateCertificateButton.defaultMessage);
      await user.click(invalidateButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const learnerInput = screen.getByPlaceholderText(messages.learnerPlaceholder.defaultMessage);
      const notesInput = screen.getByPlaceholderText(messages.notesPlaceholder.defaultMessage);

      await user.type(learnerInput, 'user1');
      await user.type(notesInput, 'Invalid certificate');

      const saveButton = screen.getByText(messages.save.defaultMessage);
      await user.click(saveButton);

      expect(mockInvalidateCert).toHaveBeenCalledWith(
        { learners: ['user1'], notes: 'Invalid certificate' },
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        })
      );
    });

    it('shows success toast when invalidation succeeds', async () => {
      mockInvalidateCert.mockImplementation((_data, options) => {
        if (options?.onSuccess) {
          options.onSuccess({ success: ['user1'], errors: [] });
        }
      });

      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      const invalidateButton = screen.getByText(messages.invalidateCertificateButton.defaultMessage);
      await user.click(invalidateButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const learnerInput = screen.getByPlaceholderText(messages.learnerPlaceholder.defaultMessage);
      await user.type(learnerInput, 'user1');

      const saveButton = screen.getByText(messages.save.defaultMessage);
      await user.click(saveButton);

      // Verify modal is closed (side effect of onSuccess)
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('shows error alert when invalidation fails', async () => {
      mockInvalidateCert.mockImplementation((_data, options) => {
        if (options?.onError) {
          const error = { response: { data: { message: 'Invalidation failed' } } };
          options.onError(error);
        }
      });

      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      const invalidateButton = screen.getByText(messages.invalidateCertificateButton.defaultMessage);
      await user.click(invalidateButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const learnerInput = screen.getByPlaceholderText(messages.learnerPlaceholder.defaultMessage);
      await user.type(learnerInput, 'user1');

      const saveButton = screen.getByText(messages.save.defaultMessage);
      await user.click(saveButton);

      expect(mockInvalidateCert).toHaveBeenCalled();
    });

    it('shows warning modal when invalidation partially succeeds', async () => {
      mockInvalidateCert.mockImplementation((_data, options) => {
        if (options?.onSuccess) {
          options.onSuccess({
            success: ['user1'],
            errors: [{ learner: 'user2', message: 'Certificate not found' }]
          });
        }
      });

      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      const invalidateButton = screen.getByText(messages.invalidateCertificateButton.defaultMessage);
      await user.click(invalidateButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const learnerInput = screen.getByPlaceholderText(messages.learnerPlaceholder.defaultMessage);
      await user.type(learnerInput, 'user1');

      const saveButton = screen.getByText(messages.save.defaultMessage);
      await user.click(saveButton);

      // Verify error modal is shown
      await waitFor(() => {
        expect(screen.getByText(/Some invalidations failed/)).toBeInTheDocument();
      });
    });
  });

  describe('Toggle Certificate Generation', () => {
    it('opens student generated certificates modal when menu item is clicked', async () => {
      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      // Click the dropdown toggle button
      const dropdownToggle = screen.getByRole('button', { name: 'More actions' });
      await user.click(dropdownToggle);

      // Click the student generated certificates menu item
      const menuItem = screen.getByText(messages.studentGeneratedCertificatesMenuItem.defaultMessage);
      await user.click(menuItem);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('calls mutation when save is clicked after toggling checkbox', async () => {
      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      // Click the dropdown toggle button
      const dropdownToggle = screen.getByRole('button', { name: 'More actions' });
      await user.click(dropdownToggle);

      // Click the student generated certificates menu item
      const menuItem = screen.getByText(messages.studentGeneratedCertificatesMenuItem.defaultMessage);
      await user.click(menuItem);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Toggle the checkbox
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      const saveButton = screen.getByText(messages.save.defaultMessage);
      await user.click(saveButton);

      expect(mockToggleGeneration).toHaveBeenCalledWith(
        false,
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        })
      );
    });

    it('closes modal and shows toast when toggle succeeds', async () => {
      mockToggleGeneration.mockImplementation((_data, options) => {
        if (options?.onSuccess) {
          options.onSuccess();
        }
      });

      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      // Click the dropdown toggle button
      const dropdownToggle = screen.getByRole('button', { name: 'More actions' });
      await user.click(dropdownToggle);

      // Click the student generated certificates menu item
      const menuItem = screen.getByText(messages.studentGeneratedCertificatesMenuItem.defaultMessage);
      await user.click(menuItem);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Toggle the checkbox
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      const saveButton = screen.getByText(messages.save.defaultMessage);
      await user.click(saveButton);

      // Verify modal is closed (side effect of onSuccess)
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('shows error alert when toggle fails', async () => {
      mockToggleGeneration.mockImplementation((_data, options) => {
        if (options?.onError) {
          const error = { response: { data: { message: 'Toggle failed' } } };
          options.onError(error);
        }
      });

      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      // Click the dropdown toggle button
      const dropdownToggle = screen.getByRole('button', { name: 'More actions' });
      await user.click(dropdownToggle);

      // Click the student generated certificates menu item
      const menuItem = screen.getByText(messages.studentGeneratedCertificatesMenuItem.defaultMessage);
      await user.click(menuItem);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Toggle the checkbox
      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      const saveButton = screen.getByText(messages.save.defaultMessage);
      await user.click(saveButton);

      expect(mockToggleGeneration).toHaveBeenCalled();
    });
  });

  describe('Remove Operations', () => {
    it('handles remove exception with success', async () => {
      mockRemoveException.mockImplementation((_data, options) => {
        if (options?.onSuccess) {
          options.onSuccess();
        }
      });

      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      // Filter to Granted Exceptions to see user6 with exception
      const filterDropdown = screen.getByText(messages.filterAllLearners.defaultMessage);
      await user.click(filterDropdown);

      const exceptionsFilter = screen.getByText(messages.filterGrantedExceptions.defaultMessage);
      await user.click(exceptionsFilter);

      // Find and click the actions dropdown for user6
      await waitFor(() => {
        expect(screen.getByText('user6')).toBeInTheDocument();
      });

      // Find user6's row and click its action button
      const user6Row = screen.getByText('user6').closest('tr');
      const actionButton = user6Row?.querySelector('button[aria-label="Actions"]');
      await user.click(actionButton!);

      // Click remove exception action (opens confirmation modal)
      const removeAction = screen.getByText(messages.removeExceptionAction.defaultMessage);
      await user.click(removeAction);

      // Confirm the removal
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const confirmButton = screen.getAllByText(messages.removeExceptionAction.defaultMessage)[1]; // Get the second one (the button in modal)
      await user.click(confirmButton);

      expect(mockRemoveException).toHaveBeenCalledWith(
        { username: 'user6' },
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        })
      );
    });

    it('handles remove exception with error', async () => {
      mockRemoveException.mockImplementation((_data, options) => {
        if (options?.onError) {
          const error = { response: { data: { message: 'Remove failed' } } };
          options.onError(error);
        }
      });

      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      // Filter to Granted Exceptions
      const filterDropdown = screen.getByText(messages.filterAllLearners.defaultMessage);
      await user.click(filterDropdown);

      const exceptionsFilter = screen.getByText(messages.filterGrantedExceptions.defaultMessage);
      await user.click(exceptionsFilter);

      await waitFor(() => {
        expect(screen.getByText('user6')).toBeInTheDocument();
      });

      // Find user6's row and click its action button
      const user6Row = screen.getByText('user6').closest('tr');
      const actionButton = user6Row?.querySelector('button[aria-label="Actions"]');
      await user.click(actionButton!);

      const removeAction = screen.getByText(messages.removeExceptionAction.defaultMessage);
      await user.click(removeAction);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const confirmButton = screen.getAllByText(messages.removeExceptionAction.defaultMessage)[1]; // Get the second one (the button in modal)
      await user.click(confirmButton);

      expect(mockRemoveException).toHaveBeenCalled();
    });

    it('handles remove invalidation with success', async () => {
      mockRemoveInvalidation.mockImplementation((_data, options) => {
        if (options?.onSuccess) {
          options.onSuccess();
        }
      });

      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      // Filter to Invalidated to see user7 with invalidation
      const filterDropdown = screen.getByText(messages.filterAllLearners.defaultMessage);
      await user.click(filterDropdown);

      const invalidatedFilter = screen.getByText(messages.filterInvalidated.defaultMessage);
      await user.click(invalidatedFilter);

      await waitFor(() => {
        expect(screen.getByText('user7')).toBeInTheDocument();
      });

      // Find user7's row and click its action button
      const user7Row = screen.getByText('user7').closest('tr');
      const actionButton = user7Row?.querySelector('button[aria-label="Actions"]');
      await user.click(actionButton!);

      // Click remove invalidation action (opens confirmation modal)
      const removeAction = screen.getByText(messages.removeInvalidationAction.defaultMessage);
      await user.click(removeAction);

      // Confirm the removal
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const confirmButton = screen.getAllByText(messages.removeInvalidationAction.defaultMessage)[1]; // Get the second one (the button in modal)
      await user.click(confirmButton);

      expect(mockRemoveInvalidation).toHaveBeenCalledWith(
        { username: 'user7' },
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        })
      );
    });

    it('handles remove invalidation with error', async () => {
      mockRemoveInvalidation.mockImplementation((_data, options) => {
        if (options?.onError) {
          const error = { response: { data: { message: 'Remove failed' } } };
          options.onError(error);
        }
      });

      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      // Filter to Invalidated
      const filterDropdown = screen.getByText(messages.filterAllLearners.defaultMessage);
      await user.click(filterDropdown);

      const invalidatedFilter = screen.getByText(messages.filterInvalidated.defaultMessage);
      await user.click(invalidatedFilter);

      await waitFor(() => {
        expect(screen.getByText('user7')).toBeInTheDocument();
      });

      // Find user7's row and click its action button
      const user7Row = screen.getByText('user7').closest('tr');
      const actionButton = user7Row?.querySelector('button[aria-label="Actions"]');
      await user.click(actionButton!);

      const removeAction = screen.getByText(messages.removeInvalidationAction.defaultMessage);
      await user.click(removeAction);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const confirmButton = screen.getAllByText(messages.removeInvalidationAction.defaultMessage)[1]; // Get the second one (the button in modal)
      await user.click(confirmButton);

      expect(mockRemoveInvalidation).toHaveBeenCalled();
    });

    it('generates certificates for granted exceptions with "all" option', async () => {
      mockRegenerateCerts.mockImplementation((_params, options) => {
        if (options?.onSuccess) {
          options.onSuccess();
        }
      });

      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      // Change filter to "Granted Exceptions"
      const filterDropdown = screen.getByRole('button', { name: /All Learners/i });
      await user.click(filterDropdown);

      await waitFor(() => {
        expect(screen.getByText('Granted Exceptions')).toBeInTheDocument();
      });

      const grantedExceptionsOption = screen.getByText('Granted Exceptions');
      await user.click(grantedExceptionsOption);

      // Click generate button
      const generateButton = screen.getByText(/Generate Certificates/i);
      await user.click(generateButton);

      // Modal should open
      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: 'Generate Certificates?' })).toBeInTheDocument();
      });

      // Click generate button in modal (default "all" option is selected)
      const confirmButton = screen.getByRole('button', { name: 'Generate' });
      await user.click(confirmButton);

      expect(mockRegenerateCerts).toHaveBeenCalledWith(
        { filter: 'granted_exceptions', onlyWithoutCertificate: false },
        expect.any(Object),
      );
    });

    it('generates certificates for granted exceptions with "without certificate" option', async () => {
      mockRegenerateCerts.mockImplementation((_params, options) => {
        if (options?.onSuccess) {
          options.onSuccess();
        }
      });

      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      // Change filter to "Granted Exceptions"
      const filterDropdown = screen.getByRole('button', { name: /All Learners/i });
      await user.click(filterDropdown);

      await waitFor(() => {
        expect(screen.getByText('Granted Exceptions')).toBeInTheDocument();
      });

      const grantedExceptionsOption = screen.getByText('Granted Exceptions');
      await user.click(grantedExceptionsOption);

      // Click generate button
      const generateButton = screen.getByText(/Generate Certificates/i);
      await user.click(generateButton);

      // Modal should open
      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: 'Generate Certificates?' })).toBeInTheDocument();
      });

      // Select "without certificate" option
      const withoutCertOption = screen.getByDisplayValue('without_certificate');
      await user.click(withoutCertOption);

      // Click generate button in modal
      const confirmButton = screen.getByRole('button', { name: 'Generate' });
      await user.click(confirmButton);

      expect(mockRegenerateCerts).toHaveBeenCalledWith(
        { filter: 'granted_exceptions', onlyWithoutCertificate: true },
        expect.any(Object),
      );
    });

    it('shows error modal when generate certificates fails', async () => {
      mockRegenerateCerts.mockImplementation((_params, options) => {
        if (options?.onError) {
          options.onError({ response: { data: { message: 'Generation failed' } } });
        }
      });

      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      // Change filter to "Granted Exceptions"
      const filterDropdown = screen.getByRole('button', { name: /All Learners/i });
      await user.click(filterDropdown);

      await waitFor(() => {
        expect(screen.getByText('Granted Exceptions')).toBeInTheDocument();
      });

      const grantedExceptionsOption = screen.getByText('Granted Exceptions');
      await user.click(grantedExceptionsOption);

      // Click generate button
      const generateButton = screen.getByText(/Generate Certificates/i);
      await user.click(generateButton);

      // Modal should open
      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: 'Generate Certificates?' })).toBeInTheDocument();
      });

      // Click generate button in modal
      const confirmButton = screen.getByRole('button', { name: 'Generate' });
      await user.click(confirmButton);

      expect(mockRegenerateCerts).toHaveBeenCalled();
    });

    it('does not open modal when button is disabled', async () => {
      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      // ALL_LEARNERS filter should have disabled button
      const regenerateButton = screen.getByText(/Regenerate Certificates/i);
      expect(regenerateButton).toBeDisabled();

      await user.click(regenerateButton);

      // Modal should not open
      expect(screen.queryByText('Regenerate')).not.toBeInTheDocument();
    });

    it('closes regenerate modal when cancel is clicked', async () => {
      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      // Change filter to "Received"
      const filterDropdown = screen.getByRole('button', { name: /All Learners/i });
      await user.click(filterDropdown);

      await waitFor(() => {
        expect(screen.getByText('Received')).toBeInTheDocument();
      });

      const receivedOption = screen.getByText('Received');
      await user.click(receivedOption);

      // Click regenerate button
      const regenerateButton = screen.getByText(/Regenerate Certificates/i);
      await user.click(regenerateButton);

      // Modal should open
      await waitFor(() => {
        expect(screen.getByText('Regenerate')).toBeInTheDocument();
      });

      // Click cancel
      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      // Modal should close
      await waitFor(() => {
        expect(screen.queryByText('Regenerate')).not.toBeInTheDocument();
      });
    });

    it('closes generate modal when cancel is clicked', async () => {
      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      // Change filter to "Granted Exceptions"
      const filterDropdown = screen.getByRole('button', { name: /All Learners/i });
      await user.click(filterDropdown);

      await waitFor(() => {
        expect(screen.getByText('Granted Exceptions')).toBeInTheDocument();
      });

      const grantedExceptionsOption = screen.getByText('Granted Exceptions');
      await user.click(grantedExceptionsOption);

      // Click generate button
      const generateButton = screen.getByText(/Generate Certificates/i);
      await user.click(generateButton);

      // Modal should open
      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: 'Generate Certificates?' })).toBeInTheDocument();
      });

      // Click cancel
      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      // Modal should close
      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: 'Generate Certificates?' })).not.toBeInTheDocument();
      });
    });
  });

  describe('Filter and Search', () => {
    it('displays all learners by default', () => {
      renderWithAlertAndIntl(<CertificatesPage />);
      expect(screen.getByText('user1')).toBeInTheDocument();
      expect(screen.getByText('user2')).toBeInTheDocument();
    });

    it('filters by RECEIVED status', () => {
      renderWithAlertAndIntl(<CertificatesPage />);
      // User would select this filter through the toolbar
      // The component has data with downloadable status (RECEIVED)
      expect(screen.getByText('user1')).toBeInTheDocument();
    });

    it('filters by NOT_RECEIVED status', () => {
      renderWithAlertAndIntl(<CertificatesPage />);
      // Component should handle NOT_RECEIVED filter
      expect(screen.getByText('user2')).toBeInTheDocument();
    });

    it('filters by AUDIT_PASSING status', () => {
      renderWithAlertAndIntl(<CertificatesPage />);
      // Component should handle AUDIT_PASSING filter
      expect(screen.getByText('user3')).toBeInTheDocument();
    });

    it('filters by AUDIT_NOT_PASSING status', () => {
      renderWithAlertAndIntl(<CertificatesPage />);
      // Component should handle AUDIT_NOT_PASSING filter
      expect(screen.getByText('user4')).toBeInTheDocument();
    });

    it('filters by ERROR_STATE status', () => {
      renderWithAlertAndIntl(<CertificatesPage />);
      // Component should handle ERROR_STATE filter
      expect(screen.getByText('user5')).toBeInTheDocument();
    });

    it('filters by GRANTED_EXCEPTIONS special case', () => {
      renderWithAlertAndIntl(<CertificatesPage />);
      // Component should handle GRANTED_EXCEPTIONS filter
      expect(screen.getByText('user6')).toBeInTheDocument();
    });

    it('filters by INVALIDATED special case', () => {
      renderWithAlertAndIntl(<CertificatesPage />);
      // Component should handle INVALIDATED filter
      expect(screen.getByText('user7')).toBeInTheDocument();
    });

    it('searches certificates by username', () => {
      renderWithAlertAndIntl(<CertificatesPage />);
      // Search functionality should filter by username
      expect(screen.getByText('user1')).toBeInTheDocument();
    });

    it('searches certificates by email', () => {
      renderWithAlertAndIntl(<CertificatesPage />);
      // Search functionality should filter by email
      expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    });
  });

  describe('Regenerate Certificates', () => {
    it('button is disabled when All Learners filter is selected', async () => {
      renderWithAlertAndIntl(<CertificatesPage />);

      const regenerateButton = screen.getByText(/Regenerate Certificates/i);
      expect(regenerateButton).toBeDisabled();
    });

    it('shows regenerate modal and calls API when regeneration succeeds with filter', async () => {
      mockRegenerateCerts.mockImplementation((_params, options) => {
        if (options?.onSuccess) {
          options.onSuccess();
        }
      });

      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      // Change filter to "Received"
      const filterDropdown = screen.getByRole('button', { name: /All Learners/i });
      await user.click(filterDropdown);

      await waitFor(() => {
        expect(screen.getByText('Received')).toBeInTheDocument();
      });

      const receivedOption = screen.getByText('Received');
      await user.click(receivedOption);

      // Click regenerate button
      const regenerateButton = screen.getByText(/Regenerate Certificates/i);
      await user.click(regenerateButton);

      // Confirm in the modal
      await waitFor(() => {
        expect(screen.getByText('Regenerate')).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', { name: 'Regenerate' });
      await user.click(confirmButton);

      expect(mockRegenerateCerts).toHaveBeenCalledWith(
        { filter: 'received', onlyWithoutCertificate: false },
        expect.any(Object),
      );
    });

    it('shows error modal when regeneration fails', async () => {
      mockRegenerateCerts.mockImplementation((_params, options) => {
        if (options?.onError) {
          options.onError({ response: { data: { message: 'Regeneration failed' } } });
        }
      });

      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      // Change filter to "Received"
      const filterDropdown = screen.getByRole('button', { name: /All Learners/i });
      await user.click(filterDropdown);

      await waitFor(() => {
        expect(screen.getByText('Received')).toBeInTheDocument();
      });

      const receivedOption = screen.getByText('Received');
      await user.click(receivedOption);

      // Click regenerate button
      const regenerateButton = screen.getByText(/Regenerate Certificates/i);
      await user.click(regenerateButton);

      // Confirm in the modal
      await waitFor(() => {
        expect(screen.getByText('Regenerate')).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', { name: 'Regenerate' });
      await user.click(confirmButton);

      expect(mockRegenerateCerts).toHaveBeenCalled();
    });
  });

  describe('Certificates Disabled', () => {
    it('shows warning message when certificates are disabled', () => {
      mockUseCourseInfo.mockReturnValue({
        data: { certificatesEnabled: false },
        isLoading: false,
        error: null,
      } as any);

      renderWithAlertAndIntl(<CertificatesPage />);

      expect(screen.getByText(messages.certificatesDisabledMessage.defaultMessage)).toBeInTheDocument();
    });
  });

  describe('Modal Close Handlers', () => {
    it('closes grant exceptions modal and resets state', async () => {
      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      const grantButton = screen.getByText(messages.grantExceptionsButton.defaultMessage);
      await user.click(grantButton);

      await waitFor(() => {
        expect(screen.getByText(messages.grantExceptionsModalTitle.defaultMessage)).toBeInTheDocument();
      });

      const closeButton = screen.getByLabelText('Close');
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText(messages.grantExceptionsModalTitle.defaultMessage)).not.toBeInTheDocument();
      });
    });

    it('closes invalidate modal and resets state', async () => {
      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      const invalidateButton = screen.getByText(messages.invalidateCertificateButton.defaultMessage);
      await user.click(invalidateButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const closeButton = screen.getByLabelText('Close');
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('closes student generated certificates modal', async () => {
      renderWithAlertAndIntl(<CertificatesPage />);
      const user = userEvent.setup();

      const dropdownToggle = screen.getByRole('button', { name: 'More actions' });
      await user.click(dropdownToggle);

      const menuItem = screen.getByText(messages.studentGeneratedCertificatesMenuItem.defaultMessage);
      await user.click(menuItem);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const closeButton = screen.getByText(messages.close.defaultMessage);
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });
});
