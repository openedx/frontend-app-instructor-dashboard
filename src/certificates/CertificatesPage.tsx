import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Container, Tab, Tabs, Alert } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import { useAlert } from '@src/providers/AlertProvider';
import { useCourseInfo } from '@src/data/apiHook';
import CertificatesPageHeader from '@src/certificates/components/CertificatesPageHeader';
import IssuedCertificatesTab from '@src/certificates/components/IssuedCertificatesTab';
import GenerationHistoryTable from '@src/certificates/components/GenerationHistoryTable';
import GrantExceptionsModal from '@src/certificates/components/GrantExceptionsModal';
import InvalidateCertificateModal from '@src/certificates/components/InvalidateCertificateModal';
import RemoveExceptionModal from '@src/certificates/components/RemoveExceptionModal';
import RemoveInvalidationModal from '@src/certificates/components/RemoveInvalidationModal';
import DisableCertificatesModal from '@src/certificates/components/DisableCertificatesModal';
import {
  useCertificateGenerationHistory,
  useGrantBulkExceptions,
  useInvalidateCertificate,
  useIssuedCertificates,
  useRegenerateCertificates,
  useRemoveException,
  useRemoveInvalidation,
  useToggleCertificateGeneration,
  useUploadBulkExceptionsCsv,
} from '@src/certificates/data/apiHook';
import { CertificateFilter } from '@src/certificates/types';
import { CERTIFICATES_PAGE_SIZE, TAB_KEYS, MODAL_TITLES, ALERT_VARIANTS } from '@src/certificates/constants';
import { getErrorMessage } from '@src/certificates/utils/errorHandling';
import messages from '@src/certificates/messages';
import './CertificatesPage.scss';

const CertificatesPage = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { showToast, showModal } = useAlert();
  const { data: courseInfo } = useCourseInfo(courseId);

  const [filter, setFilter] = useState<CertificateFilter>(CertificateFilter.ALL_LEARNERS);
  const [search, setSearch] = useState('');
  const [certificatesPage, setCertificatesPage] = useState(0);
  const [tasksPage, setTasksPage] = useState(0);
  const [activeTab, setActiveTab] = useState(TAB_KEYS.ISSUED);
  const [selectedUsername, setSelectedUsername] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [isCertificateGenerationEnabled, setIsCertificateGenerationEnabled] = useState(true);

  const [isGrantExceptionsOpen, setIsGrantExceptionsOpen] = useState(false);
  const [isInvalidateCertificateOpen, setIsInvalidateCertificateOpen] = useState(false);
  const [isRemoveExceptionOpen, setIsRemoveExceptionOpen] = useState(false);
  const [isRemoveInvalidationOpen, setIsRemoveInvalidationOpen] = useState(false);
  const [isDisableCertificatesOpen, setIsDisableCertificatesOpen] = useState(false);

  const {
    data: certificatesData,
    isLoading: isLoadingCertificates,
  } = useIssuedCertificates(courseId, {
    page: certificatesPage,
    pageSize: CERTIFICATES_PAGE_SIZE,
    filter,
    search,
  });

  const {
    data: historyData,
    isLoading: isLoadingHistory,
  } = useCertificateGenerationHistory(courseId, {
    page: tasksPage,
    pageSize: CERTIFICATES_PAGE_SIZE,
  });

  const { mutate: grantExceptions, isPending: isGrantingExceptions } = useGrantBulkExceptions(courseId);
  const { mutate: uploadCsvExceptions, isPending: isUploadingCsv } = useUploadBulkExceptionsCsv(courseId);
  const { mutate: invalidateCert, isPending: isInvalidating } = useInvalidateCertificate(courseId);
  const { mutate: removeExcept, isPending: isRemovingException } = useRemoveException(courseId);
  const { mutate: removeInval, isPending: isRemovingInvalidation } = useRemoveInvalidation(courseId);
  const { mutate: toggleGeneration, isPending: isTogglingGeneration } = useToggleCertificateGeneration(courseId);
  const { mutate: regenerateCerts } = useRegenerateCertificates(courseId);

  const handleGrantExceptions = useCallback((learners: string[], notes: string) => {
    grantExceptions(
      { learners, notes },
      {
        onSuccess: (data) => {
          setIsGrantExceptionsOpen(false);
          if (data.errors && data.errors.length > 0) {
            const errorMessages = data.errors.map(err => `${err.learner}: ${err.message}`).join('\n');
            showModal({
              title: MODAL_TITLES.ERROR,
              message: `Some exceptions failed:\n${errorMessages}`,
              variant: ALERT_VARIANTS.WARNING,
            });
          }
          if (data.success && data.success.length > 0) {
            showToast(intl.formatMessage(messages.exceptionsGrantedToast, { count: data.success.length }));
          }
        },
        onError: (error) => {
          showModal({
            title: MODAL_TITLES.ERROR,
            message: getErrorMessage(error, intl.formatMessage(messages.errorGrantException)),
            variant: ALERT_VARIANTS.DANGER,
          });
        },
      },
    );
  }, [grantExceptions, showToast, showModal, intl]);

  const handleUploadCsvExceptions = useCallback((file: File) => {
    uploadCsvExceptions(
      file,
      {
        onSuccess: (data) => {
          setIsGrantExceptionsOpen(false);
          if (data.errors && data.errors.length > 0) {
            const errorMessages = data.errors.map(err => `${err.learner}: ${err.message}`).join('\n');
            showModal({
              title: MODAL_TITLES.ERROR,
              message: `Some exceptions failed:\n${errorMessages}`,
              variant: ALERT_VARIANTS.WARNING,
            });
          }
          if (data.success && data.success.length > 0) {
            showToast(intl.formatMessage(messages.exceptionsGrantedToast, { count: data.success.length }));
          }
        },
        onError: (error) => {
          showModal({
            title: MODAL_TITLES.ERROR,
            message: getErrorMessage(error, intl.formatMessage(messages.errorGrantException)),
            variant: ALERT_VARIANTS.DANGER,
          });
        },
      },
    );
  }, [uploadCsvExceptions, showToast, showModal, intl]);

  const handleInvalidateCertificate = useCallback((learners: string[], notes: string) => {
    invalidateCert(
      { learners, notes },
      {
        onSuccess: (data) => {
          setIsInvalidateCertificateOpen(false);
          if (data.errors && data.errors.length > 0) {
            const errorMessages = data.errors.map(err => `${err.learner}: ${err.message}`).join('\n');
            showModal({
              title: MODAL_TITLES.ERROR,
              message: `Some invalidations failed:\n${errorMessages}`,
              variant: ALERT_VARIANTS.WARNING,
            });
          }
          if (data.success && data.success.length > 0) {
            showToast(intl.formatMessage(messages.certificatesInvalidatedToast, { count: data.success.length }));
          }
        },
        onError: (error) => {
          showModal({
            title: MODAL_TITLES.ERROR,
            message: getErrorMessage(error, intl.formatMessage(messages.errorInvalidateCertificate)),
            variant: ALERT_VARIANTS.DANGER,
          });
        },
      },
    );
  }, [invalidateCert, showToast, showModal, intl]);

  const handleRemoveExceptionClick = useCallback((username: string, email: string) => {
    setSelectedUsername(username);
    setSelectedEmail(email);
    setIsRemoveExceptionOpen(true);
  }, []);

  const handleRemoveExceptionConfirm = useCallback(() => {
    // Backend accepts either username or email - use whichever is available
    const identifier = selectedUsername || selectedEmail;

    if (!identifier) {
      showModal({
        title: MODAL_TITLES.ERROR,
        message: intl.formatMessage(messages.errorRemoveException) + ': Username or email is required',
        variant: ALERT_VARIANTS.DANGER,
      });
      return;
    }

    removeExcept(
      { username: identifier },
      {
        onSuccess: () => {
          setIsRemoveExceptionOpen(false);
          setSelectedUsername('');
          setSelectedEmail('');
          showToast(intl.formatMessage(messages.exceptionRemovedToast, { email: selectedEmail }));
        },
        onError: (error) => {
          showModal({
            title: MODAL_TITLES.ERROR,
            message: getErrorMessage(error, intl.formatMessage(messages.errorRemoveException)),
            variant: ALERT_VARIANTS.DANGER,
          });
        },
      },
    );
  }, [removeExcept, selectedUsername, selectedEmail, showToast, showModal, intl]);

  const handleRemoveInvalidationClick = useCallback((username: string, email: string) => {
    setSelectedUsername(username);
    setSelectedEmail(email);
    setIsRemoveInvalidationOpen(true);
  }, []);

  const handleRemoveInvalidationConfirm = useCallback(() => {
    // Backend accepts either username or email - use whichever is available
    const identifier = selectedUsername || selectedEmail;

    if (!identifier) {
      showModal({
        title: MODAL_TITLES.ERROR,
        message: intl.formatMessage(messages.errorRemoveInvalidation) + ': Username or email is required',
        variant: ALERT_VARIANTS.DANGER,
      });
      return;
    }

    removeInval(
      { username: identifier },
      {
        onSuccess: () => {
          setIsRemoveInvalidationOpen(false);
          setSelectedUsername('');
          setSelectedEmail('');
          showToast(intl.formatMessage(messages.invalidationRemovedToast, { email: selectedEmail }));
        },
        onError: (error) => {
          showModal({
            title: MODAL_TITLES.ERROR,
            message: getErrorMessage(error, intl.formatMessage(messages.errorRemoveInvalidation)),
            variant: ALERT_VARIANTS.DANGER,
          });
        },
      },
    );
  }, [removeInval, selectedUsername, selectedEmail, showToast, showModal, intl]);

  const handleToggleCertificateGeneration = useCallback(() => {
    const newState = !isCertificateGenerationEnabled;
    toggleGeneration(newState, {
      onSuccess: () => {
        setIsCertificateGenerationEnabled(newState);
        setIsDisableCertificatesOpen(false);
        showToast(
          newState
            ? intl.formatMessage(messages.successEnableCertificates)
            : intl.formatMessage(messages.successDisableCertificates),
        );
      },
      onError: (error) => {
        showModal({
          title: MODAL_TITLES.ERROR,
          message: getErrorMessage(error, intl.formatMessage(messages.errorToggleCertificateGeneration)),
          variant: ALERT_VARIANTS.DANGER,
        });
      },
    });
  }, [isCertificateGenerationEnabled, toggleGeneration, showToast, showModal, intl]);

  const handleRegenerateCertificates = useCallback(() => {
    regenerateCerts(filter, {
      onSuccess: () => {
        showToast(intl.formatMessage(messages.certificatesRegeneratedToast));
      },
      onError: (error) => {
        showModal({
          title: MODAL_TITLES.ERROR,
          message: getErrorMessage(error, intl.formatMessage(messages.errorRegenerateCertificates)),
          variant: ALERT_VARIANTS.DANGER,
        });
      },
    });
  }, [regenerateCerts, filter, showToast, showModal, intl]);

  // Check if certificate management is disabled
  if (courseInfo && !courseInfo.certificatesEnabled) {
    return (
      <Container className="mt-4.5 mb-4" fluid>
        <Alert variant="warning">
          {intl.formatMessage(messages.certificatesDisabledMessage)}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4.5 mb-4" fluid>
      <CertificatesPageHeader
        onGrantExceptions={() => setIsGrantExceptionsOpen(true)}
        onInvalidateCertificate={() => setIsInvalidateCertificateOpen(true)}
        onStudentGeneratedCertificates={() => setIsDisableCertificatesOpen(true)}
      />

      <Card variant="muted" className="pt-3 pt-md-4 pb-4 pb-md-6 certificates-card">
        <Tabs
          activeKey={activeTab}
          onSelect={(key) => setActiveTab(key || TAB_KEYS.ISSUED)}
          className="mx-4"
          variant="button-group"
        >
          <Tab eventKey={TAB_KEYS.ISSUED} title={intl.formatMessage(messages.issuedCertificatesTab)}>
            <IssuedCertificatesTab
              data={certificatesData?.results || []}
              isLoading={isLoadingCertificates}
              itemCount={certificatesData?.count || 0}
              pageCount={certificatesData?.numPages || 0}
              search={search}
              onSearchChange={setSearch}
              filter={filter}
              onFilterChange={setFilter}
              currentPage={certificatesPage}
              onPageChange={setCertificatesPage}
              onRemoveException={handleRemoveExceptionClick}
              onRemoveInvalidation={handleRemoveInvalidationClick}
              onRegenerateCertificates={handleRegenerateCertificates}
            />
          </Tab>
          <Tab eventKey={TAB_KEYS.HISTORY} title={intl.formatMessage(messages.generationHistoryTab)}>
            <div className="d-flex flex-column mt-3 mt-md-4">
              <GenerationHistoryTable
                data={historyData?.results || []}
                isLoading={isLoadingHistory}
                itemCount={historyData?.count || 0}
                pageCount={historyData?.numPages || 0}
                currentPage={tasksPage}
                onPageChange={setTasksPage}
              />
            </div>
          </Tab>
        </Tabs>
      </Card>

      <GrantExceptionsModal
        isOpen={isGrantExceptionsOpen}
        onClose={() => setIsGrantExceptionsOpen(false)}
        onSubmit={handleGrantExceptions}
        onUploadCsv={handleUploadCsvExceptions}
        isSubmitting={isGrantingExceptions || isUploadingCsv}
      />
      <InvalidateCertificateModal
        isOpen={isInvalidateCertificateOpen}
        onClose={() => setIsInvalidateCertificateOpen(false)}
        onSubmit={handleInvalidateCertificate}
        isSubmitting={isInvalidating}
      />
      <RemoveExceptionModal
        isOpen={isRemoveExceptionOpen}
        email={selectedEmail}
        onClose={() => {
          setIsRemoveExceptionOpen(false);
          setSelectedUsername('');
          setSelectedEmail('');
        }}
        onConfirm={handleRemoveExceptionConfirm}
        isSubmitting={isRemovingException}
      />
      <RemoveInvalidationModal
        isOpen={isRemoveInvalidationOpen}
        email={selectedEmail}
        onClose={() => {
          setIsRemoveInvalidationOpen(false);
          setSelectedUsername('');
          setSelectedEmail('');
        }}
        onConfirm={handleRemoveInvalidationConfirm}
        isSubmitting={isRemovingInvalidation}
      />
      <DisableCertificatesModal
        isOpen={isDisableCertificatesOpen}
        isEnabled={isCertificateGenerationEnabled}
        onClose={() => setIsDisableCertificatesOpen(false)}
        onConfirm={handleToggleCertificateGeneration}
        isSubmitting={isTogglingGeneration}
      />
    </Container>
  );
};

export default CertificatesPage;
