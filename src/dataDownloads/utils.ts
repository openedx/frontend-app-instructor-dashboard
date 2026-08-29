import { IntlShape } from '@openedx/frontend-base';
import messages from './messages';

/**
 * Report type enum matching backend ReportType enum
 */
export enum ReportType {
  ENROLLED_STUDENTS = 'enrolled_students',
  PENDING_ENROLLMENTS = 'pending_enrollments',
  PENDING_ACTIVATIONS = 'pending_activations',
  ANONYMIZED_STUDENT_IDS = 'anonymized_student_ids',
  GRADE = 'grade',
  PROBLEM_GRADE = 'problem_grade',
  PROBLEM_RESPONSES = 'problem_responses',
  ORA2_SUMMARY = 'ora2_summary',
  ORA2_DATA = 'ora2_data',
  ORA2_SUBMISSION_FILES = 'ora2_submission_files',
  ISSUED_CERTIFICATES = 'issued_certificates',
  UNKNOWN = 'unknown',
}

/**
 * Get human-readable display name for a report type
 *
 * @param reportType - The report type identifier from the API
 * @param intl - The intl object for formatting messages
 * @returns Human-readable display name for the report type
 */
export const getReportTypeDisplayName = (reportType: string, intl: IntlShape): string => {
  const reportTypeMap: Record<string, any> = {
    [ReportType.ENROLLED_STUDENTS]: messages.enrolledStudentsReportTitle,
    [ReportType.PENDING_ENROLLMENTS]: messages.pendingEnrollmentsReportTitle,
    [ReportType.PENDING_ACTIVATIONS]: messages.pendingActivationsReportTitle,
    [ReportType.ANONYMIZED_STUDENT_IDS]: messages.anonymizedStudentIdsReportTitle,
    [ReportType.GRADE]: messages.gradeReportTitle,
    [ReportType.PROBLEM_GRADE]: messages.problemGradeReportTitle,
    [ReportType.PROBLEM_RESPONSES]: messages.problemResponsesReportTitle,
    [ReportType.ORA2_SUMMARY]: messages.ora2SummaryReportTitle,
    [ReportType.ORA2_DATA]: messages.ora2DataReportTitle,
    [ReportType.ORA2_SUBMISSION_FILES]: messages.submissionFilesArchiveTitle,
    [ReportType.ISSUED_CERTIFICATES]: messages.issuedCertificatesTitle,
  };

  const messageDescriptor = reportTypeMap[reportType];

  if (!messageDescriptor) {
    // Return the report type as-is if we don't have a mapping
    return reportType.replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  return intl.formatMessage(messageDescriptor);
};
