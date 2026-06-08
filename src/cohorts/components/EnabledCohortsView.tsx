import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useIntl } from '@openedx/frontend-base';
import { FormControl, Button, Card, Alert } from '@openedx/paragon';
import { CheckCircle, Error, WarningFilled } from '@openedx/paragon/icons';
import { useCohortContext } from '@src/cohorts/components/CohortContext';
import CohortsForm from '@src/cohorts/components/CohortsForm';
import SelectedCohortInfo from '@src/cohorts/components/SelectedCohortInfo';
import { useCohorts, useCreateCohort } from '@src/cohorts/data/apiHook';
import { assignmentTypes } from '@src/cohorts/constants';
import messages from '@src/cohorts/messages';
import { CohortData, BasicCohortData } from '@src/cohorts/types';
import { useAlert } from '@src/providers/AlertProvider';

const alertIcons = {
  success: CheckCircle,
  error: Error,
  warning: WarningFilled,
};

const EnabledCohortsView = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { data = [] } = useCohorts(courseId);
  const { mutate: createCohort } = useCreateCohort(courseId);
  const { clearSelectedCohort, selectedCohort, setSelectedCohort } = useCohortContext();
  const [displayAddForm, setDisplayAddForm] = useState(false);
  const { alerts, addAlert, removeAlert, clearAlerts, showModal } = useAlert();

  const cohortsList = [{ id: 'null', name: intl.formatMessage(messages.selectCohortPlaceholder) }, ...data];

  // Sync selectedCohort with updated data when useCohorts refetches
  useEffect(() => {
    if (selectedCohort && data.length > 0) {
      const updatedCohort = data.find(cohort => cohort.id?.toString() === selectedCohort.id?.toString());
      if (updatedCohort && (
        updatedCohort.userCount !== selectedCohort.userCount
        || updatedCohort.name !== selectedCohort.name
        || updatedCohort.assignmentType !== selectedCohort.assignmentType
      )) {
        const updatedCohortData: CohortData = {
          id: updatedCohort.id,
          name: updatedCohort.name,
          assignmentType: updatedCohort.assignmentType ?? assignmentTypes.automatic,
          groupId: updatedCohort.groupId,
          userPartitionId: updatedCohort.userPartitionId,
          userCount: updatedCohort.userCount ?? 0,
        };
        setSelectedCohort(updatedCohortData);
      }
    }
  }, [data, selectedCohort, setSelectedCohort]);

  const handleAddCohort = () => {
    clearSelectedCohort();
    clearAlerts();
    setDisplayAddForm(true);
  };

  const handleSelectCohort = (event: React.ChangeEvent<HTMLSelectElement>) => {
    clearAlerts();
    const selectedValue = event.target.value;
    const selectedCohortFromApi = cohortsList.find(cohort => cohort.id?.toString() === selectedValue);
    setDisplayAddForm(false);

    if (selectedCohortFromApi && selectedCohortFromApi.id !== 'null') {
      const cohortFormData: CohortData = {
        id: selectedCohortFromApi.id,
        name: selectedCohortFromApi.name,
        assignmentType: selectedCohortFromApi.assignmentType ?? assignmentTypes.automatic,
        groupId: selectedCohortFromApi.groupId,
        userPartitionId: selectedCohortFromApi.userPartitionId,
        userCount: selectedCohortFromApi.userCount ?? 0,
      };
      setSelectedCohort(cohortFormData);
    } else {
      clearSelectedCohort();
    }
  };

  const handleNewCohort = (newCohort: BasicCohortData) => {
    createCohort(newCohort, {
      onSuccess: (newCohort: CohortData) => {
        addAlert({
          type: 'success',
          message: intl.formatMessage(messages.addCohortSuccessMessage, { cohortName: newCohort.name })
        });
        setSelectedCohort(newCohort);
        hideAddForm();
      },
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

  const hideAddForm = () => {
    setDisplayAddForm(false);
  };

  return (
    <>
      <div className="d-flex mt-4.5">
        <FormControl
          as="select"
          disabled={displayAddForm || cohortsList.length === 1}
          name="cohort"
          placeholder={intl.formatMessage(messages.selectCohortPlaceholder)}
          value={selectedCohort?.id?.toString() ?? 'null'}
          onChange={handleSelectCohort}
        >
          {
            cohortsList.map((cohort) => (
              <option key={cohort.id} value={cohort.id}>
                {cohort.name}
              </option>
            ))
          }
        </FormControl>
        <Button onClick={handleAddCohort} disabled={displayAddForm}>+ {intl.formatMessage(messages.addCohort)}</Button>
      </div>
      {alerts.map(alert => (
        <Alert
          key={alert.id}
          className="mt-3"
          icon={alertIcons[alert.type]}
          variant={alert.type === 'error' ? 'danger' : alert.type}
          dismissible
          onClose={() => removeAlert(alert.id)}
        >
          <p className="mb-0">{alert.message}</p>
          {alert.extraContent}
        </Alert>
      ))}
      {displayAddForm && (
        <Card className="mt-3 bg-light-200">
          <CohortsForm disableManualAssignment={data.length === 0} onCancel={hideAddForm} onSubmit={handleNewCohort} />
        </Card>
      )}
      {selectedCohort && <SelectedCohortInfo />}
    </>
  );
};

export default EnabledCohortsView;
