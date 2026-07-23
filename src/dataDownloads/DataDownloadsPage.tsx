import messages from './messages';
import { useIntl, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { DataDownloadTable } from './components/DataDownloadTable';
import { GenerateReports } from './components/GenerateReports';
import { useParams } from 'react-router-dom';
import { useGeneratedReports, useGenerateReportLink } from './data/apiHook';
import { useCallback, useState, useRef, useEffect } from 'react';
import { getApiBaseUrl } from '@src/data/api';
import { useCourseInfo } from '@src/data/apiHook';
import { getReportTypeDisplayName } from './utils';
import PageNotFound from '@src/components/PageNotFound';
import { useAlert } from '@src/providers/AlertProvider';
import { PendingTasks } from '@src/components/PendingTasks';

const DataDownloadsPage = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const [isPolling, setIsPolling] = useState(false);
  const [problemResponsesError, setProblemResponsesError] = useState<string | undefined>(undefined);
  const { showToast, showModal } = useAlert();
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialReportCountRef = useRef<number | null>(null);

  const { data: courseInfo } = useCourseInfo(courseId);
  const { data: reportsData, isLoading, error } = useGeneratedReports(courseId, { enablePolling: isPolling });
  const { mutate: generateReportLinkMutate, isPending: isGenerating } = useGenerateReportLink(courseId);

  // Check if we got a 404 error
  const is404 = (error as any)?.response?.status === 404;

  // Cleanup polling timeout on unmount
  useEffect(() => {
    return () => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, []);

  // Stop polling when new reports appear
  useEffect(() => {
    if (!isPolling || !reportsData?.downloads) {
      return;
    }

    const currentCount = reportsData.downloads.length;

    // If we have a baseline count and it has increased, stop polling
    if (initialReportCountRef.current !== null && currentCount > initialReportCountRef.current) {
      setIsPolling(false);
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
        pollingTimeoutRef.current = null;
      }
      initialReportCountRef.current = null;
    }
  }, [reportsData?.downloads, isPolling]);

  const startPolling = useCallback(() => {
    // Clear any existing timeout before starting new one
    if (pollingTimeoutRef.current) {
      clearTimeout(pollingTimeoutRef.current);
    }

    // Store the current report count as baseline
    initialReportCountRef.current = reportsData?.downloads?.length ?? 0;

    setIsPolling(true);
    pollingTimeoutRef.current = setTimeout(() => {
      setIsPolling(false);
      pollingTimeoutRef.current = null;
      initialReportCountRef.current = null;
    }, 60000);
  }, [reportsData?.downloads?.length]);

  // Extract downloads array from API response and transform to match expected format
  const data = reportsData?.downloads?.map(report => ({
    dateGenerated: report.dateGenerated,
    reportType: getReportTypeDisplayName(report.reportType, intl),
    reportName: report.reportName,
    downloadLink: report.reportUrl, // Map reportUrl to downloadLink
  })) ?? [];

  const handleDownload = useCallback(async (downloadLink: string, reportName: string) => {
    try {
      // The downloadLink is a relative path, so we need to prepend the LMS base URL
      const baseUrl = getApiBaseUrl();
      const fullUrl = downloadLink.startsWith('http') ? downloadLink : `${baseUrl}${downloadLink}`;

      // Use authenticated HTTP client to fetch the file as a blob
      const response = await getAuthenticatedHttpClient().get(fullUrl, {
        responseType: 'blob',
      });

      // Use the reportName from the API as the filename
      const filename = reportName || 'report.csv';

      // Create blob URL and trigger download
      const blob = new Blob([response.data]);
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      showModal({
        title: intl.formatMessage(messages.downloadReportError),
        message: intl.formatMessage(messages.downloadReportError),
        variant: 'danger',
        confirmText: 'OK',
      });
    }
  }, [intl, showModal]);

  const handleGenerateReport = useCallback((reportType: string) => {
    generateReportLinkMutate(
      { reportType },
      {
        onSuccess: () => {
          const reportTypeName = getReportTypeDisplayName(reportType, intl);
          showToast(
            intl.formatMessage(messages.generateReportSuccess, { reportType: reportTypeName }),
          );
          // Start polling for 60 seconds to check for the new report
          startPolling();
        },
        onError: (error: any) => {
          console.error('Error generating report:', error);
          const errorMessage = error?.response?.data?.error || intl.formatMessage(messages.generateReportError);
          showModal({
            title: intl.formatMessage(messages.generateReportError),
            message: errorMessage,
            variant: 'danger',
            confirmText: 'OK',
          });
        }
      }
    );
  }, [generateReportLinkMutate, intl, showToast, showModal, startPolling]);

  const handleGenerateProblemResponsesReport = useCallback((problemLocation?: string) => {
    // Clear any previous error
    setProblemResponsesError(undefined);

    generateReportLinkMutate(
      {
        reportType: 'problem_responses',
        problemLocation,
      },
      {
        onSuccess: () => {
          const reportTypeName = getReportTypeDisplayName('problem_responses', intl);
          showToast(
            intl.formatMessage(messages.generateReportSuccess, { reportType: reportTypeName }),
          );
          // Start polling for 60 seconds to check for the new report
          startPolling();
        },
        onError: (error: any) => {
          console.error('Error generating report:', error);
          const errorMessage = error?.response?.data?.error || intl.formatMessage(messages.generateReportError);
          setProblemResponsesError(errorMessage);
        }
      }
    );
  }, [generateReportLinkMutate, intl, showToast, startPolling]);

  if (is404) {
    return <PageNotFound />;
  }

  return (
    <>
      <h3 className="text-primary-700">{intl.formatMessage(messages.dataDownloadsTitle)}</h3>
      <p className="text-primary-700">{intl.formatMessage(messages.dataDownloadsDescription)}</p>
      <p className="text-primary-700">{intl.formatMessage(messages.dataDownloadsReportExpirationPolicyMessage)}</p>
      <DataDownloadTable data={data} isLoading={isLoading} onDownloadClick={handleDownload} />
      <GenerateReports
        onGenerateReport={handleGenerateReport}
        onGenerateProblemResponsesReport={handleGenerateProblemResponsesReport}
        isGenerating={isGenerating}
        problemResponsesError={problemResponsesError}
        certificatesEnabled={courseInfo?.certificatesEnabled}
      />
      <PendingTasks />
    </>
  );
};

export default DataDownloadsPage;
