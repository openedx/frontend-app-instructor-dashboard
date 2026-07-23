import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GenerateReports } from './GenerateReports';
import { renderWithIntl } from '@src/testUtils';
import messages from '@src/dataDownloads/messages';

const mockOnGenerateReport = jest.fn();
const mockOnGenerateProblemResponsesReport = jest.fn();

const renderComponent = (
  isGenerating = false,
  problemResponsesError?: string,
  certificatesEnabled = false,
) => renderWithIntl(
  <GenerateReports
    onGenerateReport={mockOnGenerateReport}
    onGenerateProblemResponsesReport={mockOnGenerateProblemResponsesReport}
    isGenerating={isGenerating}
    problemResponsesError={problemResponsesError}
    certificatesEnabled={certificatesEnabled}
  />
);

describe('GenerateReports', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component with the core report tabs', () => {
    renderComponent();

    expect(screen.getByText(messages.generateReportsTitle.defaultMessage)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: messages.enrollmentReportsTabTitle.defaultMessage })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: messages.gradingReportsTabTitle.defaultMessage })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: messages.problemResponseReportsTabTitle.defaultMessage })).toBeInTheDocument();
  });

  it('should not render the Certificate Reports tab when certificates are disabled for the course', () => {
    renderComponent();

    expect(screen.queryByRole('tab', { name: messages.certificateReportsTabTitle.defaultMessage })).not.toBeInTheDocument();
  });

  it('should render the Certificate Reports tab when certificates are enabled for the course', () => {
    renderComponent(false, undefined, true);

    expect(screen.getByRole('tab', { name: messages.certificateReportsTabTitle.defaultMessage })).toBeInTheDocument();
  });

  describe('Enrollment Reports Tab', () => {
    it('should render all enrollment report sections', () => {
      renderComponent();

      expect(screen.getByText(messages.enrolledStudentsReportTitle.defaultMessage)).toBeInTheDocument();
      expect(screen.getByText(messages.pendingEnrollmentsReportTitle.defaultMessage)).toBeInTheDocument();
      expect(screen.getByText(messages.pendingActivationsReportTitle.defaultMessage)).toBeInTheDocument();
      expect(screen.getByText(messages.anonymizedStudentIdsReportTitle.defaultMessage)).toBeInTheDocument();
    });

    it('should call onGenerateReport with enrolled_students when button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      const button = screen.getByRole('button', { name: messages.generateEnrolledStudentsReport.defaultMessage });
      await user.click(button);

      expect(mockOnGenerateReport).toHaveBeenCalledWith('enrolled_students');
    });

    it('should call onGenerateReport with pending_enrollments when button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      const button = screen.getByRole('button', { name: messages.generatePendingEnrollmentsReport.defaultMessage });
      await user.click(button);

      expect(mockOnGenerateReport).toHaveBeenCalledWith('pending_enrollments');
    });

    it('should call onGenerateReport with pending_activations when button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      const button = screen.getByRole('button', { name: messages.generatePendingActivationsReport.defaultMessage });
      await user.click(button);

      expect(mockOnGenerateReport).toHaveBeenCalledWith('pending_activations');
    });

    it('should call onGenerateReport with anonymized_student_ids when button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      const button = screen.getByRole('button', { name: messages.generateAnonymizedStudentIdsReport.defaultMessage });
      await user.click(button);

      expect(mockOnGenerateReport).toHaveBeenCalledWith('anonymized_student_ids');
    });
  });

  describe('Grading Reports Tab', () => {
    it('should render all grading report sections', async () => {
      const user = userEvent.setup();
      renderComponent();

      const tab = screen.getByRole('tab', { name: messages.gradingReportsTabTitle.defaultMessage });
      await user.click(tab);

      expect(screen.getByText(messages.gradeReportTitle.defaultMessage)).toBeInTheDocument();
      expect(screen.getByText(messages.problemGradeReportTitle.defaultMessage)).toBeInTheDocument();
    });

    it('should call onGenerateReport with grade when button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      const tab = screen.getByRole('tab', { name: messages.gradingReportsTabTitle.defaultMessage });
      await user.click(tab);

      const button = screen.getByRole('button', { name: messages.generateGradeReport.defaultMessage });
      await user.click(button);

      expect(mockOnGenerateReport).toHaveBeenCalledWith('grade');
    });

    it('should call onGenerateReport with problem_grade when button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      const tab = screen.getByRole('tab', { name: messages.gradingReportsTabTitle.defaultMessage });
      await user.click(tab);

      const button = screen.getByRole('button', { name: messages.generateProblemGradeReport.defaultMessage });
      await user.click(button);

      expect(mockOnGenerateReport).toHaveBeenCalledWith('problem_grade');
    });
  });

  describe('Problem Response Reports Tab', () => {
    it('should render all problem response report sections', async () => {
      const user = userEvent.setup();
      renderComponent();

      const tab = screen.getByRole('tab', { name: messages.problemResponseReportsTabTitle.defaultMessage });
      await user.click(tab);

      expect(screen.getByText(messages.ora2SummaryReportTitle.defaultMessage)).toBeInTheDocument();
      expect(screen.getByText(messages.ora2DataReportTitle.defaultMessage)).toBeInTheDocument();
      expect(screen.getByText(messages.submissionFilesArchiveTitle.defaultMessage)).toBeInTheDocument();
      expect(screen.getByText(messages.problemResponsesReportTitle.defaultMessage)).toBeInTheDocument();
    });

    it('should call onGenerateReport with ora2_summary when button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      const tab = screen.getByRole('tab', { name: messages.problemResponseReportsTabTitle.defaultMessage });
      await user.click(tab);

      const button = screen.getByRole('button', { name: messages.generateOra2SummaryReport.defaultMessage });
      await user.click(button);

      expect(mockOnGenerateReport).toHaveBeenCalledWith('ora2_summary');
    });

    it('should call onGenerateReport with ora2_data when button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      const tab = screen.getByRole('tab', { name: messages.problemResponseReportsTabTitle.defaultMessage });
      await user.click(tab);

      const button = screen.getByRole('button', { name: messages.generateOra2DataReport.defaultMessage });
      await user.click(button);

      expect(mockOnGenerateReport).toHaveBeenCalledWith('ora2_data');
    });

    it('should call onGenerateReport with ora2_submission_files when button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      const tab = screen.getByRole('tab', { name: messages.problemResponseReportsTabTitle.defaultMessage });
      await user.click(tab);

      const button = screen.getByRole('button', { name: messages.generateSubmissionFilesArchive.defaultMessage });
      await user.click(button);

      expect(mockOnGenerateReport).toHaveBeenCalledWith('ora2_submission_files');
    });

    it('should call onGenerateProblemResponsesReport with undefined when no problem location is provided', async () => {
      const user = userEvent.setup();
      renderComponent();

      const tab = screen.getByRole('tab', { name: messages.problemResponseReportsTabTitle.defaultMessage });
      await user.click(tab);

      const button = screen.getByRole('button', { name: messages.generateProblemResponsesReport.defaultMessage });
      await user.click(button);

      expect(mockOnGenerateProblemResponsesReport).toHaveBeenCalledWith(undefined);
    });

    it('should call onGenerateProblemResponsesReport with problem location when provided', async () => {
      const user = userEvent.setup();
      renderComponent();

      const tab = screen.getByRole('tab', { name: messages.problemResponseReportsTabTitle.defaultMessage });
      await user.click(tab);

      const input = screen.getByPlaceholderText(messages.problemLocationPlaceholder.defaultMessage);
      await user.type(input, 'block-v1:test');

      const button = screen.getByRole('button', { name: messages.generateProblemResponsesReport.defaultMessage });
      await user.click(button);

      expect(mockOnGenerateProblemResponsesReport).toHaveBeenCalledWith('block-v1:test');
    });
  });

  describe('Certificate Reports Tab', () => {
    it('should render certificate report section', async () => {
      const user = userEvent.setup();
      renderComponent(false, undefined, true);

      const tab = screen.getByRole('tab', { name: messages.certificateReportsTabTitle.defaultMessage });
      await user.click(tab);

      expect(screen.getByText(messages.issuedCertificatesTitle.defaultMessage)).toBeInTheDocument();
    });

    it('should call onGenerateReport with issued_certificates when button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent(false, undefined, true);

      const tab = screen.getByRole('tab', { name: messages.certificateReportsTabTitle.defaultMessage });
      await user.click(tab);

      const button = screen.getByRole('button', { name: messages.generateCertificatesReport.defaultMessage });
      await user.click(button);

      expect(mockOnGenerateReport).toHaveBeenCalledWith('issued_certificates');
    });
  });

  describe('isGenerating state', () => {
    it('should disable all buttons when isGenerating is true', () => {
      renderComponent(true);

      const buttons = screen.getAllByRole('button').filter(button => button.getAttribute('type') !== 'button' || button.textContent?.includes('Generate'));
      buttons.forEach(button => {
        if (button.textContent?.includes('Generate')) {
          expect(button).toBeDisabled();
        }
      });
    });

    it('should enable all buttons when isGenerating is false', () => {
      renderComponent(false);

      const generateButton = screen.getByRole('button', { name: messages.generateEnrolledStudentsReport.defaultMessage });
      expect(generateButton).not.toBeDisabled();
    });
  });

  describe('problemResponsesError', () => {
    it('should display validation error message in the problem responses section', async () => {
      const user = userEvent.setup();
      renderComponent(false, 'Invalid problem location');

      const tab = screen.getByRole('tab', { name: messages.problemResponseReportsTabTitle.defaultMessage });
      await user.click(tab);

      expect(screen.getByText('Invalid problem location')).toBeInTheDocument();
    });
  });
});
