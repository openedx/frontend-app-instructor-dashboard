import { getReportTypeDisplayName, ReportType } from './utils';
import { createIntl } from '@openedx/frontend-base';
import messages from './messages';

const intl = createIntl({
  locale: 'en',
  messages: {},
});

describe('utils', () => {
  describe('getReportTypeDisplayName', () => {
    it('should return display name for enrolled_students report type', () => {
      const displayName = getReportTypeDisplayName(ReportType.ENROLLED_STUDENTS, intl);
      expect(displayName).toBe(messages.enrolledStudentsReportTitle.defaultMessage);
    });

    it('should return display name for pending_enrollments report type', () => {
      const displayName = getReportTypeDisplayName(ReportType.PENDING_ENROLLMENTS, intl);
      expect(displayName).toBe(messages.pendingEnrollmentsReportTitle.defaultMessage);
    });

    it('should return display name for pending_activations report type', () => {
      const displayName = getReportTypeDisplayName(ReportType.PENDING_ACTIVATIONS, intl);
      expect(displayName).toBe(messages.pendingActivationsReportTitle.defaultMessage);
    });

    it('should return display name for anonymized_student_ids report type', () => {
      const displayName = getReportTypeDisplayName(ReportType.ANONYMIZED_STUDENT_IDS, intl);
      expect(displayName).toBe(messages.anonymizedStudentIdsReportTitle.defaultMessage);
    });

    it('should return display name for grade report type', () => {
      const displayName = getReportTypeDisplayName(ReportType.GRADE, intl);
      expect(displayName).toBe(messages.gradeReportTitle.defaultMessage);
    });

    it('should return display name for problem_grade report type', () => {
      const displayName = getReportTypeDisplayName(ReportType.PROBLEM_GRADE, intl);
      expect(displayName).toBe(messages.problemGradeReportTitle.defaultMessage);
    });

    it('should return display name for problem_responses report type', () => {
      const displayName = getReportTypeDisplayName(ReportType.PROBLEM_RESPONSES, intl);
      expect(displayName).toBe(messages.problemResponsesReportTitle.defaultMessage);
    });

    it('should return display name for ora2_summary report type', () => {
      const displayName = getReportTypeDisplayName(ReportType.ORA2_SUMMARY, intl);
      expect(displayName).toBe(messages.ora2SummaryReportTitle.defaultMessage);
    });

    it('should return display name for ora2_data report type', () => {
      const displayName = getReportTypeDisplayName(ReportType.ORA2_DATA, intl);
      expect(displayName).toBe(messages.ora2DataReportTitle.defaultMessage);
    });

    it('should return display name for ora2_submission_files report type', () => {
      const displayName = getReportTypeDisplayName(ReportType.ORA2_SUBMISSION_FILES, intl);
      expect(displayName).toBe(messages.submissionFilesArchiveTitle.defaultMessage);
    });

    it('should return display name for issued_certificates report type', () => {
      const displayName = getReportTypeDisplayName(ReportType.ISSUED_CERTIFICATES, intl);
      expect(displayName).toBe(messages.issuedCertificatesTitle.defaultMessage);
    });

    it('should return display name for proctored_exam_results report type', () => {
      const displayName = getReportTypeDisplayName(ReportType.PROCTORED_EXAM_RESULTS, intl);
      expect(displayName).toBe(messages.proctoredExamResultsReportTitle.defaultMessage);
    });

    it('should return formatted string for unknown report type', () => {
      const displayName = getReportTypeDisplayName('some_unknown_type', intl);
      expect(displayName).toBe('Some Unknown Type');
    });

    it('should handle report type with multiple underscores', () => {
      const displayName = getReportTypeDisplayName('test_report_type_name', intl);
      expect(displayName).toBe('Test Report Type Name');
    });

    it('should handle report type with single word', () => {
      const displayName = getReportTypeDisplayName('report', intl);
      expect(displayName).toBe('Report');
    });
  });

  describe('ReportType enum', () => {
    it('should have correct values for all report types', () => {
      expect(ReportType.ENROLLED_STUDENTS).toBe('enrolled_students');
      expect(ReportType.PENDING_ENROLLMENTS).toBe('pending_enrollments');
      expect(ReportType.PENDING_ACTIVATIONS).toBe('pending_activations');
      expect(ReportType.ANONYMIZED_STUDENT_IDS).toBe('anonymized_student_ids');
      expect(ReportType.GRADE).toBe('grade');
      expect(ReportType.PROBLEM_GRADE).toBe('problem_grade');
      expect(ReportType.PROBLEM_RESPONSES).toBe('problem_responses');
      expect(ReportType.ORA2_SUMMARY).toBe('ora2_summary');
      expect(ReportType.ORA2_DATA).toBe('ora2_data');
      expect(ReportType.ORA2_SUBMISSION_FILES).toBe('ora2_submission_files');
      expect(ReportType.ISSUED_CERTIFICATES).toBe('issued_certificates');
      expect(ReportType.PROCTORED_EXAM_RESULTS).toBe('proctored_exam_results');
      expect(ReportType.UNKNOWN).toBe('unknown');
    });
  });
});
