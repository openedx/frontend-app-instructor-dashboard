import { Button, Tabs, Tab, Form, Card, Icon, OverlayTrigger, Tooltip } from '@openedx/paragon';
import { InfoOutline } from '@openedx/paragon/icons';
import { useIntl } from '@openedx/frontend-base';
import { useState, useCallback } from 'react';
import messages from '@src/dataDownloads/messages';

interface GenerateReportsProps {
  onGenerateReport: (reportType: string) => void,
  onGenerateProblemResponsesReport: (problemLocation?: string) => void,
  isGenerating: boolean,
  problemResponsesError?: string,
  certificatesEnabled?: boolean,
}

interface ReportSectionProps {
  titleMessage: { id: string, defaultMessage: string, description?: string },
  descriptionMessage: { id: string, defaultMessage: string, description?: string },
  buttonMessage: { id: string, defaultMessage: string, description?: string },
  onGenerate: () => void,
  isFirst?: boolean,
  isLast?: boolean,
  isGenerating: boolean,
}

const ReportSection = ({
  titleMessage,
  descriptionMessage,
  buttonMessage,
  onGenerate,
  isFirst = false,
  isLast = false,
  isGenerating,
}: ReportSectionProps) => {
  const intl = useIntl();

  return (
    <div className={`d-lg-flex justify-content-between align-items-center ${isFirst ? 'pt-2.5' : 'pt-4.5'} pb-3.5 ${!isLast ? 'border-bottom' : ''}`}>
      <div className="mr-lg-3">
        <h4 className="text-primary-700">{intl.formatMessage(titleMessage)}</h4>
        <p className="text-primary-700 m-lg-0">{intl.formatMessage(descriptionMessage)}</p>
      </div>
      <Button
        variant="primary"
        onClick={onGenerate}
        disabled={isGenerating}
        className="text-nowrap"
      >
        {intl.formatMessage(buttonMessage)}
      </Button>
    </div>
  );
};

const GenerateReports = ({
  onGenerateReport,
  onGenerateProblemResponsesReport,
  isGenerating,
  problemResponsesError,
  certificatesEnabled = false,
}: GenerateReportsProps) => {
  const intl = useIntl();
  const [problemLocation, setProblemLocation] = useState('');

  const handleGenerateProblemResponsesReport = useCallback(() => {
    onGenerateProblemResponsesReport(problemLocation || undefined);
  }, [onGenerateProblemResponsesReport, problemLocation]);

  return (
    <>
      <h3 id="generate-reports" className="mt-4 text-primary-700">{intl.formatMessage(messages.generateReportsTitle)}</h3>
      <p className="text-primary-700">{intl.formatMessage(messages.generateReportsDescription)}</p>
      <Card variant="muted">
        <Tabs defaultActiveKey="enrollment" className="mb-3">
          <Tab eventKey="enrollment" title={intl.formatMessage(messages.enrollmentReportsTabTitle)}>
            <div className="d-flex flex-column px-3.5">
              <ReportSection
                titleMessage={messages.enrolledStudentsReportTitle}
                descriptionMessage={messages.enrolledStudentsReportDescription}
                buttonMessage={messages.generateEnrolledStudentsReport}
                onGenerate={() => onGenerateReport('enrolled_students')}
                isFirst
                isGenerating={isGenerating}
              />

              <ReportSection
                titleMessage={messages.pendingEnrollmentsReportTitle}
                descriptionMessage={messages.pendingEnrollmentsReportDescription}
                buttonMessage={messages.generatePendingEnrollmentsReport}
                onGenerate={() => onGenerateReport('pending_enrollments')}
                isGenerating={isGenerating}
              />

              <ReportSection
                titleMessage={messages.pendingActivationsReportTitle}
                descriptionMessage={messages.pendingActivationsReportDescription}
                buttonMessage={messages.generatePendingActivationsReport}
                onGenerate={() => onGenerateReport('pending_activations')}
                isGenerating={isGenerating}
              />

              <ReportSection
                titleMessage={messages.anonymizedStudentIdsReportTitle}
                descriptionMessage={messages.anonymizedStudentIdsReportDescription}
                buttonMessage={messages.generateAnonymizedStudentIdsReport}
                onGenerate={() => onGenerateReport('anonymized_student_ids')}
                isLast
                isGenerating={isGenerating}
              />
            </div>
          </Tab>

          <Tab eventKey="grading" title={intl.formatMessage(messages.gradingReportsTabTitle)}>
            <div className="d-flex flex-column px-3.5">
              <ReportSection
                titleMessage={messages.gradeReportTitle}
                descriptionMessage={messages.gradeReportDescription}
                buttonMessage={messages.generateGradeReport}
                onGenerate={() => onGenerateReport('grade')}
                isFirst
                isGenerating={isGenerating}
              />

              <ReportSection
                titleMessage={messages.problemGradeReportTitle}
                descriptionMessage={messages.problemGradeReportDescription}
                buttonMessage={messages.generateProblemGradeReport}
                onGenerate={() => onGenerateReport('problem_grade')}
                isLast
                isGenerating={isGenerating}
              />
            </div>
          </Tab>

          <Tab eventKey="problemResponse" title={intl.formatMessage(messages.problemResponseReportsTabTitle)}>
            <div className="d-flex flex-column px-3.5">
              <ReportSection
                titleMessage={messages.ora2SummaryReportTitle}
                descriptionMessage={messages.ora2SummaryReportDescription}
                buttonMessage={messages.generateOra2SummaryReport}
                onGenerate={() => onGenerateReport('ora2_summary')}
                isFirst
                isGenerating={isGenerating}
              />

              <ReportSection
                titleMessage={messages.ora2DataReportTitle}
                descriptionMessage={messages.ora2DataReportDescription}
                buttonMessage={messages.generateOra2DataReport}
                onGenerate={() => onGenerateReport('ora2_data')}
                isGenerating={isGenerating}
              />

              <ReportSection
                titleMessage={messages.submissionFilesArchiveTitle}
                descriptionMessage={messages.submissionFilesArchiveDescription}
                buttonMessage={messages.generateSubmissionFilesArchive}
                onGenerate={() => onGenerateReport('ora2_submission_files')}
                isGenerating={isGenerating}
              />

              <div className="pt-4.5 pb-3.5 d-lg-flex w-100 gap-4">
                <div className="mw-xs w-lg-50">
                  <h4 className="text-primary-700">{intl.formatMessage(messages.problemResponsesReportTitle)}</h4>
                  <p className="text-primary-700 mb-0">{intl.formatMessage(messages.problemResponsesReportDescription)}</p>
                  <p className="text-primary-700">{intl.formatMessage(messages.problemResponsesReportNote)}</p>
                </div>
                <div className="d-flex align-items-end gap-3 flex-grow-1">
                  <Form.Group className="m-0 flex-grow-1" isInvalid={!!problemResponsesError}>
                    <Form.Label className="d-flex align-content-end align-items-center gap-2">
                      {intl.formatMessage(messages.specifyProblemLocation)}
                      <OverlayTrigger
                        placement="top"
                        overlay={(
                          <Tooltip id="problem-location-tooltip">
                            {intl.formatMessage(messages.problemLocationTooltip)}
                          </Tooltip>
                        )}
                      >
                        <Icon src={InfoOutline} size="sm" aria-label={intl.formatMessage(messages.problemLocationInfoIconLabel)} />
                      </OverlayTrigger>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={intl.formatMessage(messages.problemLocationPlaceholder)}
                      value={problemLocation}
                      onChange={(e) => setProblemLocation(e.target.value)}
                      className="flex-grow-1"
                    />
                    {problemResponsesError && (
                      <Form.Control.Feedback type="invalid">
                        {problemResponsesError}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <Button
                    variant="primary"
                    onClick={handleGenerateProblemResponsesReport}
                    disabled={isGenerating}
                    className="text-nowrap"
                  >
                    {intl.formatMessage(messages.generateProblemResponsesReport)}
                  </Button>
                </div>
              </div>
            </div>
          </Tab>

          {certificatesEnabled && (
            <Tab eventKey="certificates" title={intl.formatMessage(messages.certificateReportsTabTitle)}>
              <div className="d-flex flex-column px-3.5">
                <ReportSection
                  titleMessage={messages.issuedCertificatesTitle}
                  descriptionMessage={messages.issuedCertificatesDescription}
                  buttonMessage={messages.generateCertificatesReport}
                  onGenerate={() => onGenerateReport('issued_certificates')}
                  isFirst
                  isLast
                  isGenerating={isGenerating}
                />
              </div>
            </Tab>
          )}
        </Tabs>
      </Card>
    </>
  );
};

export { GenerateReports };
