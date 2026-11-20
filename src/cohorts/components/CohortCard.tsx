import { Children, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { FormattedMessage, getExternalLinkUrl, useIntl } from '@openedx/frontend-base';
import { Card, Hyperlink, Tab, Tabs, Toast } from '@openedx/paragon';
import messages from '@src/cohorts/messages';
import { CohortData } from '@src/cohorts/types';
import { usePatchCohort } from '@src/cohorts/data/apiHook';
import CohortsForm from '@src/cohorts/components/CohortsForm';
import ManageLearners from '@src/cohorts/components/ManageLearners';
import { useCohortContext } from '@src/cohorts/components/CohortContext';
import { useAlert } from '@src/providers/AlertProvider';
import { COURSE_PERMISSIONS, useCoursePermission, usePermissionDeniedHandler } from '@src/permissions';

export const assignmentLink = {
  random: 'https://docs.openedx.org/en/latest/educators/references/advanced_features/managing_cohort_assignment.html#about-auto-cohorts',
  manual: 'https://docs.openedx.org/en/latest/educators/how-tos/advanced_features/manage_cohorts.html#assign-learners-to-cohorts-manually',
};

const warningMessage = {
  random: messages.automaticCohortWarning,
  manual: messages.manualCohortWarning,
};

const CohortCard = () => {
  const intl = useIntl();
  const { allowed: canManageCohorts } = useCoursePermission(COURSE_PERMISSIONS.MANAGE_COHORTS);
  const onPermissionDenied = usePermissionDeniedHandler();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { selectedCohort, setSelectedCohort } = useCohortContext();
  const { mutate: editCohort } = usePatchCohort(courseId);
  const formRef = useRef<{ resetForm: () => void }>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const { clearAlerts, showModal } = useAlert();

  if (!selectedCohort) {
    return null;
  }

  const handleEditCohort = (updatedCohort: CohortData) => {
    clearAlerts();
    editCohort({ cohortId: selectedCohort.id, cohortInfo: updatedCohort },
      {
        onSuccess: () => {
          setShowSuccessMessage(true);
          setSelectedCohort({ ...selectedCohort, ...updatedCohort });
        },
        onError: (error) => {
          if (onPermissionDenied(error)) return;
          const errorMessage = (isAxiosError(error) && error?.response?.data?.developer_message) || intl.formatMessage(messages.editCohortError);
          showModal({
            confirmText: intl.formatMessage(messages.closeButton),
            message: errorMessage,
            variant: 'danger',
          });
        }
      }
    );
  };

  const handleCancelForm = () => {
    formRef.current?.resetForm();
  };

  return (
    <>
      <Card className="bg-light-200 mt-3">
        <div className="mx-4 my-3.5">
          <div className="d-flex align-items-center">
            <h3 className="text-primary-700 mb-0">{selectedCohort?.name}</h3>
            <p className="ml-3 text-primary-700 mb-0">{intl.formatMessage(messages.studentsOnCohort, { users: selectedCohort?.userCount ?? 0 })}</p>
          </div>
          <p className="x-small mb-0 mt-2">
            <FormattedMessage {...warningMessage[selectedCohort.assignmentType]} /> <Hyperlink showLaunchIcon={false} target="_blank" destination={getExternalLinkUrl(assignmentLink[selectedCohort.assignmentType])}>{intl.formatMessage(messages.warningCohortLink)}</Hyperlink>
          </p>
        </div>
        <Tabs key={canManageCohorts ? 'manage' : 'view'} defaultActiveKey={canManageCohorts ? 'manage-learners' : 'settings'} id="cohort-management-tabs" className="mx-0" onSelect={() => {}}>
          {Children.toArray([
            canManageCohorts && (
              <Tab key="manage-learners" eventKey="manage-learners" title={intl.formatMessage(messages.manageLearners)}>
                <ManageLearners />
              </Tab>
            ),
            <Tab key="settings" eventKey="settings" title={intl.formatMessage(messages.settings)}>
              <CohortsForm
                ref={formRef}
                readOnly={!canManageCohorts}
                onCancel={handleCancelForm}
                onSubmit={handleEditCohort}
              />
            </Tab>,
          ])}
        </Tabs>
      </Card>
      <Toast show={showSuccessMessage} onClose={() => setShowSuccessMessage(false)} className="text-break">
        {intl.formatMessage(messages.cohortUpdateSuccessMessage)}
      </Toast>
    </>
  );
};

export default CohortCard;
