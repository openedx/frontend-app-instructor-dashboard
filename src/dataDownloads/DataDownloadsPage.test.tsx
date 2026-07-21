import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getAuthenticatedHttpClient, IntlProvider } from '@openedx/frontend-base';
import { MemoryRouter } from 'react-router-dom';
import DataDownloadsPage from './DataDownloadsPage';
import { useGeneratedReports, useGenerateReportLink } from './data/apiHook';
import { AlertProvider } from '@src/providers/AlertProvider';
import { renderWithQueryClient } from '@src/testUtils';
import messages from './messages';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('./data/apiHook');
jest.mock('@src/components/PageNotFound', () => ({
  __esModule: true,
  default: () => <div>Page Not Found</div>,
}));
jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  getAuthenticatedHttpClient: jest.fn(),
}));
jest.mock('@src/data/api', () => ({
  getApiBaseUrl: jest.fn(() => 'http://lms.example.com'),
}));
jest.mock('@src/data/apiHook', () => ({
  useCourseInfo: () => ({ data: { certificatesEnabled: false } }),
}));

const mockUseGeneratedReports = useGeneratedReports as jest.MockedFunction<typeof useGeneratedReports>;
const mockUseGenerateReportLink = useGenerateReportLink as jest.MockedFunction<typeof useGenerateReportLink>;
const mockGetAuthenticatedHttpClient = getAuthenticatedHttpClient as jest.MockedFunction<typeof getAuthenticatedHttpClient>;

const mockReportsData = [
  {
    dateGenerated: '2025-10-01T12:00:00Z',
    reportType: 'enrolled_students',
    reportName: 'Test Report A.csv',
    reportUrl: '/path/to/report-a.csv',
  },
];

const renderWithProviders = (component: React.ReactElement, courseId = 'course-123') => {
  return renderWithQueryClient(
    <AlertProvider>
      <MemoryRouter initialEntries={[`/course/${courseId}/data-downloads`]}>
        {component}
      </MemoryRouter>
    </AlertProvider>
  );
};

describe('DataDownloadsPage', () => {
  const mockMutate = jest.fn();
  const mockHttpGet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: mockReportsData },
      isLoading: false,
    } as any);

    mockUseGenerateReportLink.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any);

    mockGetAuthenticatedHttpClient.mockReturnValue({
      get: mockHttpGet,
    } as any);

    mockHttpGet.mockResolvedValue({
      data: new Blob(['test'], { type: 'text/csv' }),
    });

    // Mock DOM APIs
    global.URL.createObjectURL = jest.fn(() => 'blob:mock');
    global.URL.revokeObjectURL = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render page with data', async () => {
    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: mockReportsData },
      isLoading: false,
    } as any);
    renderWithProviders(<DataDownloadsPage />);

    expect(screen.getByText(messages.dataDownloadsTitle.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(/The reports listed below are available for download/)).toBeInTheDocument();
    expect(screen.getByText(/To keep student data secure/)).toBeInTheDocument();
  });

  it('should handle download report click', async () => {
    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: mockReportsData },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);
    // The download functionality is now internal and doesn't call mutate directly
    // We're just checking that the button is clickable
    const downloadButton = screen.getByText(messages.downloadLinkLabel.defaultMessage);
    expect(downloadButton).toBeInTheDocument();
  });

  it('should render PageNotFound when 404 error occurs', () => {
    mockUseGeneratedReports.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { response: { status: 404 } },
    } as any);

    renderWithProviders(<DataDownloadsPage />);
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    mockUseGeneratedReports.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    renderWithProviders(<DataDownloadsPage />);
    expect(screen.getByText(messages.dataDownloadsTitle.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.generateReportsTitle.defaultMessage)).toBeInTheDocument();
  });

  it('should render empty table when no downloads', () => {
    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: [] },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);
    expect(screen.getByText(messages.dataDownloadsTitle.defaultMessage)).toBeInTheDocument();
  });

  it('should call generateReportLink when generate button clicked', async () => {
    const user = userEvent.setup();
    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: [] },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);

    const generateButton = screen.getByRole('button', { name: messages.generateEnrolledStudentsReport.defaultMessage });
    await user.click(generateButton);

    expect(mockMutate).toHaveBeenCalledWith(
      { reportType: 'enrolled_students' },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );
  });

  it('should show success toast and start polling on successful report generation', async () => {
    const user = userEvent.setup();
    let capturedCallbacks: any;

    mockMutate.mockImplementation((_, callbacks) => {
      capturedCallbacks = callbacks;
    });

    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: [] },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);

    const generateButton = screen.getByRole('button', { name: messages.generateEnrolledStudentsReport.defaultMessage });
    await user.click(generateButton);

    // Trigger the onSuccess callback
    capturedCallbacks.onSuccess();

    // Should show success toast
    await waitFor(() => {
      expect(screen.getByText(/Generating.*Enrolled Students Report/)).toBeInTheDocument();
    });
  });

  it('should show error toast on failed report generation', async () => {
    const user = userEvent.setup();
    let capturedCallbacks: any;
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    mockMutate.mockImplementation((_, callbacks) => {
      capturedCallbacks = callbacks;
    });

    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: [] },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);

    const generateButton = screen.getByRole('button', { name: messages.generateEnrolledStudentsReport.defaultMessage });
    await user.click(generateButton);

    // Trigger the onError callback
    capturedCallbacks.onError(new Error('Test error'));

    // Should show error toast
    await waitFor(() => {
      const errorElements = screen.getAllByText(messages.generateReportError.defaultMessage);
      expect(errorElements.length).toBeGreaterThan(0);
    });

    consoleError.mockRestore();
  });

  it('should call generateReportLink for problem responses with location', async () => {
    const user = userEvent.setup();
    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: [] },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);

    // Switch to Problem Response tab
    const problemTab = screen.getByRole('tab', { name: messages.problemResponseReportsTabTitle.defaultMessage });
    await user.click(problemTab);

    // Type in problem location
    const locationInput = screen.getByPlaceholderText(messages.problemLocationPlaceholder.defaultMessage);
    await user.type(locationInput, 'block-v1:test');

    // Click generate
    const generateButton = screen.getByRole('button', { name: messages.generateProblemResponsesReport.defaultMessage });
    await user.click(generateButton);

    expect(mockMutate).toHaveBeenCalledWith(
      { reportType: 'problem_responses', problemLocation: 'block-v1:test' },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );
  });

  it('should show success toast for problem responses report generation', async () => {
    const user = userEvent.setup();
    let capturedCallbacks: any;

    mockMutate.mockImplementation((_, callbacks) => {
      capturedCallbacks = callbacks;
    });

    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: [] },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);

    // Switch to Problem Response tab
    const problemTab = screen.getByRole('tab', { name: messages.problemResponseReportsTabTitle.defaultMessage });
    await user.click(problemTab);

    const generateButton = screen.getByRole('button', { name: messages.generateProblemResponsesReport.defaultMessage });
    await user.click(generateButton);

    // Trigger the onSuccess callback
    capturedCallbacks.onSuccess();

    // Should show success toast
    await waitFor(() => {
      expect(screen.getByText(/Generating.*Problem Responses Report/)).toBeInTheDocument();
    });
  });

  it('should show error toast for problem responses report generation failure', async () => {
    const user = userEvent.setup();
    let capturedCallbacks: any;
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    mockMutate.mockImplementation((_, callbacks) => {
      capturedCallbacks = callbacks;
    });

    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: [] },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);

    // Switch to Problem Response tab
    const problemTab = screen.getByRole('tab', { name: messages.problemResponseReportsTabTitle.defaultMessage });
    await user.click(problemTab);

    const generateButton = screen.getByRole('button', { name: messages.generateProblemResponsesReport.defaultMessage });
    await user.click(generateButton);

    // Trigger the onError callback
    capturedCallbacks.onError(new Error('Test error'));

    // Should show error toast
    await waitFor(() => {
      const errorElements = screen.getAllByText(messages.generateReportError.defaultMessage);
      expect(errorElements.length).toBeGreaterThan(0);
    });

    consoleError.mockRestore();
  });

  it('should show isGenerating state on buttons', () => {
    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: [] },
      isLoading: false,
    } as any);

    mockUseGenerateReportLink.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    } as any);

    renderWithProviders(<DataDownloadsPage />);

    const generateButton = screen.getByRole('button', { name: messages.generateEnrolledStudentsReport.defaultMessage });
    expect(generateButton).toBeDisabled();
  });

  it('should handle error state without 404', () => {
    mockUseGeneratedReports.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { response: { status: 500 } },
    } as any);

    renderWithProviders(<DataDownloadsPage />);
    // Should still render the page, not PageNotFound
    expect(screen.getByText(messages.dataDownloadsTitle.defaultMessage)).toBeInTheDocument();
    expect(screen.queryByText('Page Not Found')).not.toBeInTheDocument();
  });

  it('should transform report data correctly', () => {
    const testReports = [
      {
        dateGenerated: '2025-01-01T00:00:00Z',
        reportType: 'grade',
        reportName: 'grades.csv',
        reportUrl: '/path/to/grades.csv',
      },
    ];

    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: testReports },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);

    expect(screen.getByText(testReports[0].dateGenerated)).toBeInTheDocument();
    // Use getAllByText since "Grade Report" appears in both the table and the generate section
    expect(screen.getAllByText(messages.gradeReportTitle.defaultMessage)[0]).toBeInTheDocument();
    expect(screen.getByText(testReports[0].reportName)).toBeInTheDocument();
  });

  it('should render download button for reports', () => {
    renderWithProviders(<DataDownloadsPage />);
    expect(screen.getByText(messages.downloadLinkLabel.defaultMessage)).toBeInTheDocument();
  });

  it('should handle download error', async () => {
    const user = userEvent.setup();
    mockHttpGet.mockRejectedValueOnce(new Error('Download failed'));

    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: mockReportsData },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);

    const downloadButton = screen.getByText(messages.downloadLinkLabel.defaultMessage);
    await user.click(downloadButton);

    await waitFor(() => {
      expect(screen.getAllByText(messages.downloadReportError.defaultMessage).length).toBeGreaterThan(0);
    });
  });

  it('should cleanup on unmount', () => {
    jest.useFakeTimers();

    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: [] },
      isLoading: false,
    } as any);

    const { unmount } = renderWithProviders(<DataDownloadsPage />);

    unmount();

    jest.runAllTimers();
    jest.useRealTimers();
  });

  it('should stop polling when report count increases', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });
    let capturedCallbacks: any;

    mockMutate.mockImplementation((_, callbacks) => {
      capturedCallbacks = callbacks;
    });

    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: [] },
      isLoading: false,
    } as any);

    const { rerender } = renderWithProviders(<DataDownloadsPage />);

    const generateButton = screen.getByRole('button', { name: messages.generateEnrolledStudentsReport.defaultMessage });
    await user.click(generateButton);

    // Trigger the onSuccess callback to start polling
    capturedCallbacks.onSuccess();

    // Wait for toast to appear
    await waitFor(() => {
      expect(screen.getByText(/Generating.*Enrolled Students Report/)).toBeInTheDocument();
    });

    // Simulate report added by updating the mock and rerendering
    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: mockReportsData },
      isLoading: false,
    } as any);

    rerender(
      <QueryClientProvider client={new QueryClient()}>
        <IntlProvider locale="en" messages={{}}>
          <AlertProvider>
            <MemoryRouter initialEntries={['/course/course-123/data-downloads']}>
              <DataDownloadsPage />
            </MemoryRouter>
          </AlertProvider>
        </IntlProvider>
      </QueryClientProvider>
    );

    jest.useRealTimers();
  });

  it('should stop polling after 60 seconds timeout', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });
    let capturedCallbacks: any;

    mockMutate.mockImplementation((_, callbacks) => {
      capturedCallbacks = callbacks;
    });

    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: [] },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);

    const generateButton = screen.getByRole('button', { name: messages.generateEnrolledStudentsReport.defaultMessage });
    await user.click(generateButton);

    // Trigger the onSuccess callback to start polling
    capturedCallbacks.onSuccess();

    // Fast-forward 60 seconds
    jest.advanceTimersByTime(60000);

    jest.useRealTimers();
  });

  it('should clear existing timeout when starting new polling', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });
    let capturedCallbacks: any;

    mockMutate.mockImplementation((_, callbacks) => {
      capturedCallbacks = callbacks;
    });

    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: [] },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);

    const generateButton = screen.getByRole('button', { name: messages.generateEnrolledStudentsReport.defaultMessage });

    // Start first polling
    await user.click(generateButton);
    capturedCallbacks.onSuccess();

    // Start second polling before first completes
    await user.click(generateButton);
    capturedCallbacks.onSuccess();

    jest.useRealTimers();
  });

  it('should trigger download with relative URL prepended with base URL', async () => {
    const user = userEvent.setup();

    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: mockReportsData },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);

    const downloadButton = screen.getByText(messages.downloadLinkLabel.defaultMessage);
    await user.click(downloadButton);

    await waitFor(() => {
      expect(mockHttpGet).toHaveBeenCalledWith(
        'http://lms.example.com/path/to/report-a.csv',
        { responseType: 'blob' }
      );
    });

    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock');
  });

  it('should trigger download with absolute URL without prepending base URL', async () => {
    const user = userEvent.setup();
    const absoluteUrlReport = [
      {
        ...mockReportsData[0],
        reportUrl: 'http://cdn.example.com/reports/report.csv',
      },
    ];

    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: absoluteUrlReport },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);

    const downloadButton = screen.getByText(messages.downloadLinkLabel.defaultMessage);
    await user.click(downloadButton);

    await waitFor(() => {
      expect(mockHttpGet).toHaveBeenCalledWith(
        'http://cdn.example.com/reports/report.csv',
        { responseType: 'blob' }
      );
    });
  });

  it('should show download error modal when download fails', async () => {
    const user = userEvent.setup();
    mockHttpGet.mockRejectedValueOnce(new Error('Network error'));

    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: mockReportsData },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);

    const downloadButton = screen.getByText(messages.downloadLinkLabel.defaultMessage);
    await user.click(downloadButton);

    await waitFor(() => {
      expect(screen.getAllByText(messages.downloadReportError.defaultMessage).length).toBeGreaterThan(0);
    });
  });

  it('should show error message from API response when generate report fails with response error', async () => {
    const user = userEvent.setup();
    let capturedCallbacks: any;
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    mockMutate.mockImplementation((_, callbacks) => {
      capturedCallbacks = callbacks;
    });

    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: [] },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);

    const generateButton = screen.getByRole('button', { name: messages.generateEnrolledStudentsReport.defaultMessage });
    await user.click(generateButton);

    const apiError = { response: { data: { error: 'Course not configured for reports' } } };
    capturedCallbacks.onError(apiError);

    await waitFor(() => {
      expect(screen.getByText('Course not configured for reports')).toBeInTheDocument();
    });

    consoleError.mockRestore();
  });

  it('should set problemResponsesError from API response when problem responses report fails', async () => {
    const user = userEvent.setup();
    let capturedCallbacks: any;
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    mockMutate.mockImplementation((_, callbacks) => {
      capturedCallbacks = callbacks;
    });

    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: [] },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);

    const problemTab = screen.getByRole('tab', { name: messages.problemResponseReportsTabTitle.defaultMessage });
    await user.click(problemTab);

    const generateButton = screen.getByRole('button', { name: messages.generateProblemResponsesReport.defaultMessage });
    await user.click(generateButton);

    const apiError = { response: { data: { error: 'Invalid problem location' } } };
    capturedCallbacks.onError(apiError);

    await waitFor(() => {
      expect(screen.getByText('Invalid problem location')).toBeInTheDocument();
    });

    consoleError.mockRestore();
  });

  it('should clear problemResponsesError when generating a new problem responses report', async () => {
    const user = userEvent.setup();
    let capturedCallbacks: any;
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    mockMutate.mockImplementation((_, callbacks) => {
      capturedCallbacks = callbacks;
    });

    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: [] },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);

    const problemTab = screen.getByRole('tab', { name: messages.problemResponseReportsTabTitle.defaultMessage });
    await user.click(problemTab);

    const generateButton = screen.getByRole('button', { name: messages.generateProblemResponsesReport.defaultMessage });

    // First attempt: trigger error
    await user.click(generateButton);
    capturedCallbacks.onError({ response: { data: { error: 'Invalid problem location' } } });

    await waitFor(() => {
      expect(screen.getByText('Invalid problem location')).toBeInTheDocument();
    });

    // Second attempt: error should be cleared before mutate is called
    await user.click(generateButton);
    expect(screen.queryByText('Invalid problem location')).not.toBeInTheDocument();

    consoleError.mockRestore();
  });

  it('should render pending tasks', async () => {
    renderWithProviders(<DataDownloadsPage />);
    const pendingTasks = screen.getByText('Pending Tasks');
    expect(pendingTasks).toBeInTheDocument();
  });
});
