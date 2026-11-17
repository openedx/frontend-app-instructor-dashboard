import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useIntl } from '@openedx/frontend-base';
import { IconButton, Skeleton } from '@openedx/paragon';
import { Settings } from '@openedx/paragon/icons';
import { CohortProvider, useCohortContext } from '@src/cohorts/components/CohortContext';
import DisableCohortsModal from '@src/cohorts/components/DisableCohortsModal';
import DisabledCohortsView from '@src/cohorts/components/DisabledCohortsView';
import EnabledCohortsView from '@src/cohorts/components/EnabledCohortsView';
import { useCohortStatus, useToggleCohorts } from '@src/cohorts/data/apiHook';
import messages from '@src/cohorts/messages';
import { useAlert } from '@src/providers/AlertProvider';
import './CohortsPage.scss';
import { COURSE_PERMISSIONS, PermissionAlert, PermissionGate, useCoursePermission, usePermissionDeniedHandler } from '@src/permissions';
import AccessErrorAlert from '@src/providers/AccessErrorAlert';
import { isForbiddenError } from '@src/data/utils';

const CohortsPageContent = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams();
  const { data: cohortStatus, isLoading, error } = useCohortStatus(courseId);
  const { allowed: canManageCohorts } = useCoursePermission(COURSE_PERMISSIONS.MANAGE_COHORTS);
  const onPermissionDenied = usePermissionDeniedHandler();
  const { mutate: toggleCohortsMutate } = useToggleCohorts(courseId);
  const [isOpenDisableModal, setIsOpenDisableModal] = useState(false);
  const { clearSelectedCohort } = useCohortContext();
  const { isCohorted = false } = cohortStatus ?? {};
  const { showModal } = useAlert();

  const handleEnableCohorts = () => {
    toggleCohortsMutate({ isCohorted: true },
      {
        onError: (error) => {
          if (onPermissionDenied(error)) return;
          const errorMessage = (isAxiosError(error) && error?.response?.data?.developer_message) || intl.formatMessage(messages.enableCohortError);
          showModal({
            confirmText: intl.formatMessage(messages.closeButton),
            message: errorMessage,
            variant: 'danger',
          });
        }
      });
  };

  const handleDisableCohorts = () => {
    toggleCohortsMutate({ isCohorted: false },
      {
        onSuccess: () => clearSelectedCohort(),
        onError: (error) => {
          if (onPermissionDenied(error)) return;
          const errorMessage = (isAxiosError(error) && error?.response?.data?.developer_message) || intl.formatMessage(messages.disableCohortError);
          showModal({
            confirmText: intl.formatMessage(messages.closeButton),
            message: errorMessage,
            variant: 'danger',
          });
        }
      });
    setIsOpenDisableModal(false);
  };

  if (isLoading) return <Skeleton className="lead" />;
  if (error) return <AccessErrorAlert errorType={isForbiddenError(error) ? 'forbidden' : 'generic'} />;

  return (
    <>
      <div className="d-inline-flex align-items-center">
        <h3 className="mb-0 text-primary-700">{intl.formatMessage(messages.cohortsTitle)}</h3>
        {isCohorted && canManageCohorts && (
          <div className="small">
            <IconButton
              alt={intl.formatMessage(messages.disableCohorts)}
              iconAs={Settings}
              iconClassNames="mb-2 text-gray-500"
              size="sm"
              variant="secondary"
              onClick={() => setIsOpenDisableModal(true)}
            />
          </div>
        )}
      </div>
      {isCohorted && !canManageCohorts && <PermissionAlert className="mt-4.5" />}
      {isCohorted ? (
        <EnabledCohortsView />
      ) : (
        <PermissionGate
          permission={COURSE_PERMISSIONS.MANAGE_COHORTS}
          fallback={(
            <PermissionAlert className="mt-4.5">
              {intl.formatMessage(messages.disabledViewOnlyAlert)}
            </PermissionAlert>
          )}
        >
          <DisabledCohortsView onEnableCohorts={handleEnableCohorts} />
        </PermissionGate>
      )}
      <PermissionGate permission={COURSE_PERMISSIONS.MANAGE_COHORTS}>
        <DisableCohortsModal isOpen={isOpenDisableModal} onClose={() => setIsOpenDisableModal(false)} onConfirmDisable={handleDisableCohorts} />
      </PermissionGate>
    </>
  );
};

// It was necessary to wrap the entire content with CohortProvider here to avoid errors in the use of cohort hooks within a provider
const CohortsPage = () => {
  return (
    <PermissionGate
      permission={COURSE_PERMISSIONS.VIEW_COHORTS}
      loading={<Skeleton className="lead" />}
      fallback={<AccessErrorAlert errorType="forbidden" />}
    >
      <CohortProvider>
        <CohortsPageContent />
      </CohortProvider>
    </PermissionGate>
  );
};

export default CohortsPage;
