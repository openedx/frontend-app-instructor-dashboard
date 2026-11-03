import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  pageTitle: {
    id: 'instruct.dataDownloads.pageTitle',
    defaultMessage: 'Data Downloads',
    description: 'Title for the data downloads page'
  },
  dataDownloadsTitle: {
    id: 'instruct.dataDownloads.page.title',
    defaultMessage: 'Available Reports',
    description: 'Title for data downloads page',
  },
  dataDownloadsDescription: {
    id: 'instruct.dataDownloads.page.description',
    defaultMessage: 'The reports listed below are available for download, identified by UTC date and time of generation.',
    description: 'Description for data downloads page',
  },
  dataDownloadsReportExpirationPolicyMessage: {
    id: 'instruct.dataDownloads.page.reportExpiration',
    defaultMessage: 'To keep student data secure, you cannot save or email these links for direct access. Copies of links expire within 5 minutes. Report files are deleted 90 days after generation. If you will need access to old reports, download and store the files, in accordance with your institution\'s data security policies.',
    description: 'Expiration policy message for data downloads page',
  },
  dateGeneratedColumnName: {
    id: 'instruct.dataDownloads.table.column.dateGenerated',
    defaultMessage: 'Date Generated',
    description: 'Column name for date generated in data downloads table',
  },
  reportTypeColumnName: {
    id: 'instruct.dataDownloads.table.column.reportType',
    defaultMessage: 'Report Type',
    description: 'Column name for report type in data downloads table',
  },
  reportNameColumnName: {
    id: 'instruct.dataDownloads.table.column.reportName',
    defaultMessage: 'Report Name',
    description: 'Column name for report name in data downloads table',
  },
  downloadLinkLabel: {
    id: 'instruct.dataDownloads.table.downloadLink',
    defaultMessage: 'Download Report',
    description: 'Label for download link in the download column of data downloads table',
  },
  generateReportsTitle: {
    id: 'instruct.dataDownloads.generateReports.title',
    defaultMessage: 'Generate Reports',
    description: 'Title for generate reports section',
  },
  generateReportsDescription: {
    id: 'instruct.dataDownloads.generateReports.description',
    defaultMessage: 'Once generated, these CSV file reports will be available in the Available Reports section. Generation takes longer for larger courses.',
    description: 'Description for generate reports section',
  },
  enrollmentReportsTabTitle: {
    id: 'instruct.dataDownloads.tabs.enrollmentReports',
    defaultMessage: 'Enrollment Reports',
    description: 'Tab title for enrollment reports',
  },
  gradingReportsTabTitle: {
    id: 'instruct.dataDownloads.tabs.gradingReports',
    defaultMessage: 'Grading Reports',
    description: 'Tab title for grading reports',
  },
  problemResponseReportsTabTitle: {
    id: 'instruct.dataDownloads.tabs.problemResponseReports',
    defaultMessage: 'Problem Response Reports',
    description: 'Tab title for problem response reports',
  },
  certificateReportsTabTitle: {
    id: 'instruct.dataDownloads.tabs.certificateReports',
    defaultMessage: 'Certificate Reports',
    description: 'Tab title for certificate reports',
  },
  proctoredExamReportsTabTitle: {
    id: 'instruct.dataDownloads.tabs.proctoredExamReports',
    defaultMessage: 'Proctored Exam Reports',
    description: 'Tab title for proctored exam reports',
  },
  enrolledStudentsReportTitle: {
    id: 'instruct.dataDownloads.reports.enrolledStudents.title',
    defaultMessage: 'Enrolled Students Report',
    description: 'Title for enrolled students report',
  },
  enrolledStudentsReportDescription: {
    id: 'instruct.dataDownloads.reports.enrolledStudents.description',
    defaultMessage: 'Report of all enrolled learners for this course including email address and username.',
    description: 'Description for enrolled students report',
  },
  generateEnrolledStudentsReport: {
    id: 'instruct.dataDownloads.reports.enrolledStudents.generate',
    defaultMessage: 'Generate Enrolled Students Report',
    description: 'Button text to generate enrolled students report',
  },
  pendingEnrollmentsReportTitle: {
    id: 'instruct.dataDownloads.reports.pendingEnrollments.title',
    defaultMessage: 'Pending Enrollments Report',
    description: 'Title for pending enrollments report',
  },
  pendingEnrollmentsReportDescription: {
    id: 'instruct.dataDownloads.reports.pendingEnrollments.description',
    defaultMessage: 'Report of learners who can enroll in the course but have not done so yet.',
    description: 'Description for pending enrollments report',
  },
  generatePendingEnrollmentsReport: {
    id: 'instruct.dataDownloads.reports.pendingEnrollments.generate',
    defaultMessage: 'Generate Pending Enrollments Report',
    description: 'Button text to generate pending enrollments report',
  },
  pendingActivationsReportTitle: {
    id: 'instruct.dataDownloads.reports.pendingActivations.title',
    defaultMessage: 'Pending Activations Report',
    description: 'Title for pending activations report',
  },
  pendingActivationsReportDescription: {
    id: 'instruct.dataDownloads.reports.pendingActivations.description',
    defaultMessage: 'Report of enrolled learners who have not yet activated their account.',
    description: 'Description for pending activations report',
  },
  generatePendingActivationsReport: {
    id: 'instruct.dataDownloads.reports.pendingActivations.generate',
    defaultMessage: 'Generate Pending Activations Report',
    description: 'Button text to generate pending activations report',
  },
  anonymizedStudentIdsReportTitle: {
    id: 'instruct.dataDownloads.reports.anonymizedStudentIds.title',
    defaultMessage: 'Anonymized Student IDs Report',
    description: 'Title for anonymized student IDs report',
  },
  anonymizedStudentIdsReportDescription: {
    id: 'instruct.dataDownloads.reports.anonymizedStudentIds.description',
    defaultMessage: 'Report of enrolled learners with student IDs anonymized.',
    description: 'Description for anonymized student IDs report',
  },
  generateAnonymizedStudentIdsReport: {
    id: 'instruct.dataDownloads.reports.anonymizedStudentIds.generate',
    defaultMessage: 'Generate Anonymized Student IDs Report',
    description: 'Button text to generate anonymized student IDs report',
  },
  gradeReportTitle: {
    id: 'instruct.dataDownloads.reports.grade.title',
    defaultMessage: 'Grade Report',
    description: 'Title for grade report',
  },
  gradeReportDescription: {
    id: 'instruct.dataDownloads.reports.grade.description',
    defaultMessage: 'Course grade report for all enrolled learners.',
    description: 'Description for grade report',
  },
  generateGradeReport: {
    id: 'instruct.dataDownloads.reports.grade.generate',
    defaultMessage: 'Generate Grade Report',
    description: 'Button text to generate grade report',
  },
  problemGradeReportTitle: {
    id: 'instruct.dataDownloads.reports.problemGrade.title',
    defaultMessage: 'Problem Grade Report',
    description: 'Title for problem grade report',
  },
  problemGradeReportDescription: {
    id: 'instruct.dataDownloads.reports.problemGrade.description',
    defaultMessage: 'Report showing students\' grades for all problems in the course.',
    description: 'Description for problem grade report',
  },
  generateProblemGradeReport: {
    id: 'instruct.dataDownloads.reports.problemGrade.generate',
    defaultMessage: 'Generate Problem Grade Report',
    description: 'Button text to generate problem grade report',
  },
  ora2SummaryReportTitle: {
    id: 'instruct.dataDownloads.reports.ora2Summary.title',
    defaultMessage: 'ORA Summary Report',
    description: 'Title for ORA summary report',
  },
  ora2SummaryReportDescription: {
    id: 'instruct.dataDownloads.reports.ora2Summary.description',
    defaultMessage: 'Report of details and statuses for ORA.',
    description: 'Description for ORA summary report',
  },
  generateOra2SummaryReport: {
    id: 'instruct.dataDownloads.reports.ora2Summary.generate',
    defaultMessage: 'Generate ORA Summary Report',
    description: 'Button text to generate ORA summary report',
  },
  ora2DataReportTitle: {
    id: 'instruct.dataDownloads.reports.ora2Data.title',
    defaultMessage: 'ORA Data Report',
    description: 'Title for ORA data report',
  },
  ora2DataReportDescription: {
    id: 'instruct.dataDownloads.reports.ora2Data.description',
    defaultMessage: 'Report of all ORA assignment details.',
    description: 'Description for ORA data report',
  },
  generateOra2DataReport: {
    id: 'instruct.dataDownloads.reports.ora2Data.generate',
    defaultMessage: 'Generate ORA Data Report',
    description: 'Button text to generate ORA data report',
  },
  submissionFilesArchiveTitle: {
    id: 'instruct.dataDownloads.reports.submissionFiles.title',
    defaultMessage: 'Submission Files Archive',
    description: 'Title for submission files archive',
  },
  submissionFilesArchiveDescription: {
    id: 'instruct.dataDownloads.reports.submissionFiles.description',
    defaultMessage: 'ZIP file containing all submission texts and attachments.',
    description: 'Description for submission files archive',
  },
  generateSubmissionFilesArchive: {
    id: 'instruct.dataDownloads.reports.submissionFiles.generate',
    defaultMessage: 'Generate Submission Files Archive',
    description: 'Button text to generate submission files archive',
  },
  problemResponsesReportTitle: {
    id: 'instruct.dataDownloads.reports.problemResponses.title',
    defaultMessage: 'Problem Responses Report',
    description: 'Title for problem responses report',
  },
  problemResponsesReportDescription: {
    id: 'instruct.dataDownloads.reports.problemResponses.description',
    defaultMessage: 'Report of all student answers to a problem.',
    description: 'Description for problem responses report',
  },
  problemResponsesReportNote: {
    id: 'instruct.dataDownloads.reports.problemResponses.note',
    defaultMessage: 'Note: You can also select a section or chapter to include results of all problems in that section or chapter.',
    description: 'Note for problem responses report',
  },
  generateProblemResponsesReport: {
    id: 'instruct.dataDownloads.reports.problemResponses.generate',
    defaultMessage: 'Generate Problem Report',
    description: 'Button text to generate problem responses report',
  },
  specifyProblemLocation: {
    id: 'instruct.dataDownloads.reports.problemResponses.specifyLocation',
    defaultMessage: 'Specify Section or Problem:',
    description: 'Label for problem location input',
  },
  problemLocationPlaceholder: {
    id: 'instruct.dataDownloads.reports.problemResponses.locationPlaceholder',
    defaultMessage: 'Problem location',
    description: 'Placeholder text for problem location input',
  },
  problemLocationInfoIconLabel: {
    id: 'instruct.dataDownloads.reports.problemResponses.infoIconLabel',
    defaultMessage: 'Example format for problem location',
    description: 'Aria label for the info icon next to the problem location input',
  },
  problemLocationTooltip: {
    id: 'instruct.dataDownloads.reports.problemResponses.locationTooltip',
    defaultMessage: 'Example: block-v1:edX+DemoX+2015+type@problem+block@618c5933b8b544e4a4cc103d3e508378',
    description: 'Tooltip text showing an example problem location format',
  },
  issuedCertificatesTitle: {
    id: 'instruct.dataDownloads.reports.issuedCertificates.title',
    defaultMessage: 'Issued Certificates',
    description: 'Title for issued certificates report',
  },
  issuedCertificatesDescription: {
    id: 'instruct.dataDownloads.reports.issuedCertificates.description',
    defaultMessage: 'Report of Certificates Issued.',
    description: 'Description for issued certificates report',
  },
  generateCertificatesReport: {
    id: 'instruct.dataDownloads.reports.issuedCertificates.generate',
    defaultMessage: 'Generate Certificates Report',
    description: 'Button text to generate issued certificates report',
  },
  proctoredExamResultsReportTitle: {
    id: 'instruct.dataDownloads.reports.proctoredExamResults.title',
    defaultMessage: 'Proctored Exam Results Report',
    description: 'Title for proctored exam results report',
  },
  proctoredExamResultsReportDescription: {
    id: 'instruct.dataDownloads.reports.proctoredExamResults.description',
    defaultMessage: 'Report of all proctored exam results in this course.',
    description: 'Description for proctored exam results report',
  },
  generateProctoredExamResultsReport: {
    id: 'instruct.dataDownloads.reports.proctoredExamResults.generate',
    defaultMessage: 'Generate Proctored Exam Results Report',
    description: 'Button text to generate proctored exam results report',
  },
  // Report type display names for the data downloads table
  reportTypeEnrolledStudents: {
    id: 'instruct.dataDownloads.reportType.enrolledStudents',
    defaultMessage: 'Enrolled Students',
    description: 'Display name for enrolled students report type in table',
  },
  reportTypePendingEnrollments: {
    id: 'instruct.dataDownloads.reportType.pendingEnrollments',
    defaultMessage: 'Pending Enrollments',
    description: 'Display name for pending enrollments report type in table',
  },
  reportTypePendingActivations: {
    id: 'instruct.dataDownloads.reportType.pendingActivations',
    defaultMessage: 'Pending Activations',
    description: 'Display name for pending activations report type in table',
  },
  reportTypeAnonymizedStudentIds: {
    id: 'instruct.dataDownloads.reportType.anonymizedStudentIds',
    defaultMessage: 'Anonymized Student IDs',
    description: 'Display name for anonymized student IDs report type in table',
  },
  reportTypeGrade: {
    id: 'instruct.dataDownloads.reportType.grade',
    defaultMessage: 'Grade',
    description: 'Display name for grade report type in table',
  },
  reportTypeProblemGrade: {
    id: 'instruct.dataDownloads.reportType.problemGrade',
    defaultMessage: 'Problem Grade',
    description: 'Display name for problem grade report type in table',
  },
  reportTypeProblemResponses: {
    id: 'instruct.dataDownloads.reportType.problemResponses',
    defaultMessage: 'Problem Responses',
    description: 'Display name for problem responses report type in table',
  },
  reportTypeOra2Summary: {
    id: 'instruct.dataDownloads.reportType.ora2Summary',
    defaultMessage: 'ORA Summary',
    description: 'Display name for ORA summary report type in table',
  },
  reportTypeOra2Data: {
    id: 'instruct.dataDownloads.reportType.ora2Data',
    defaultMessage: 'ORA Data',
    description: 'Display name for ORA data report type in table',
  },
  reportTypeOra2SubmissionFiles: {
    id: 'instruct.dataDownloads.reportType.ora2SubmissionFiles',
    defaultMessage: 'Submission Files',
    description: 'Display name for ORA submission files report type in table',
  },
  reportTypeIssuedCertificates: {
    id: 'instruct.dataDownloads.reportType.issuedCertificates',
    defaultMessage: 'Issued Certificates',
    description: 'Display name for issued certificates report type in table',
  },
  generateReportSuccess: {
    id: 'instruct.dataDownloads.generateReport.success',
    defaultMessage: 'Generating {reportType}. To view the status of the report, see Pending Tasks',
    description: 'Success message displayed when a report generation is initiated',
  },
  generateReportError: {
    id: 'instruct.dataDownloads.generateReport.error',
    defaultMessage: 'Failed to generate report.',
    description: 'Error message displayed when report generation fails',
  },
  downloadReportError: {
    id: 'instruct.dataDownloads.downloadReport.error',
    defaultMessage: 'Failed to download report.',
    description: 'Error message displayed when a report download fails',
  },
  noReportsFoundMessage: {
    id: 'instruct.dataDownloads.noReportsFoundHeader',
    defaultMessage: 'No reports found',
    description: 'Message displayed when no reports are found in the data downloads table',
  },
});

export default messages;
