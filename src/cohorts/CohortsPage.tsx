import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useIntl } from '@openedx/frontend-base';
import { IconButton } from '@openedx/paragon';
import { Settings } from '@openedx/paragon/icons';
import { CohortProvider, useCohortContext } from '@src/cohorts/components/CohortContext';
import DisableCohortsModal from '@src/cohorts/components/DisableCohortsModal';
import DisabledCohortsView from '@src/cohorts/components/DisabledCohortsView';
import EnabledCohortsView from '@src/cohorts/components/EnabledCohortsView';
import { useCohortStatus, useToggleCohorts } from '@src/cohorts/data/apiHook';
import messages from '@src/cohorts/messages';
import { useAlert } from '@src/providers/AlertProvider';
import './CohortsPage.scss';

const CohortsPageContent = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams();
  const { data: cohortStatus } = useCohortStatus(courseId);
  const { mutate: toggleCohortsMutate } = useToggleCohorts(courseId);
  const [isOpenDisableModal, setIsOpenDisableModal] = useState(false);
  const { clearSelectedCohort } = useCohortContext();
  const { isCohorted = false } = cohortStatus ?? {};
  const { showModal } = useAlert();

  const handleEnableCohorts = () => {
    toggleCohortsMutate({ isCohorted: true },
      {
        onError: (error) => {
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

  return (
    <>
      <div className="d-inline-flex align-items-center">
        <h3 className="mb-0 text-primary-700">{intl.formatMessage(messages.cohortsTitle)}</h3>
        {isCohorted && (
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
      {isCohorted ? (
        <EnabledCohortsView />
      ) : (
        <DisabledCohortsView onEnableCohorts={handleEnableCohorts} />
      )}
      <DisableCohortsModal isOpen={isOpenDisableModal} onClose={() => setIsOpenDisableModal(false)} onConfirmDisable={handleDisableCohorts} />
    </>
  );
};

// It was necessary to wrap the entire content with CohortProvider here to avoid errors in the use of cohort hooks within a provider
const CohortsPage = () => {
  return (
    <CohortProvider>
      <CohortsPageContent />
    </CohortProvider>
  );
};

export default CohortsPage;
