import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { Button, FormControl } from '@openedx/paragon';
import { useCohortContext } from '@src/cohorts/components/CohortContext';
import { useAddLearnersToCohort } from '@src/cohorts/data/apiHook';
import messages from '@src/cohorts/messages';
import { useAlert } from '@src/providers/AlertProvider';

interface AddLearnersResponse {
  added: string[];
  changed: string[];
  preassigned: string[];
  present: string[];
  unknown: string[];
}

const ManageLearners = () => {
  const { courseId = '' } = useParams();
  const intl = useIntl();
  const { selectedCohort } = useCohortContext();
  const { mutate: addLearnersToCohort } = useAddLearnersToCohort(courseId, selectedCohort?.id ? Number(selectedCohort.id) : 0);
  const [users, setUsers] = useState('');
  const { addAlert, clearAlerts } = useAlert();

  const handleAlertMessages = (response: AddLearnersResponse) => {
    const { added, changed, preassigned, present, unknown } = response;
    if (preassigned.length > 0) {
      addAlert({
        type: 'warning',
        message: intl.formatMessage(messages.addLearnersWarningMessage, {
          countLearners: preassigned.length,
        }),
        extraContent: (
          preassigned.map((learner: string) => (
            <p key={learner} className="mb-0">• {learner}</p>
          ))
        )
      });
    }
    if (present.length > 0 || added.length > 0 || changed.length > 0) {
      addAlert({
        type: 'success',
        message: intl.formatMessage(messages.addLearnersSuccessMessage, {
          countLearners: added.length + changed.length,
        }),
        extraContent: (
          present.length > 0 && (
            present.map((learner: string) => (
              <p key={learner} className="mb-0">• {intl.formatMessage(messages.existingLearner, { learner })}</p>
            ))
          ))
      });
    }
    if (unknown.length > 0) {
      addAlert({
        type: 'error',
        message: intl.formatMessage(messages.addLearnersErrorMessage, {
          countLearners: unknown.length,
        }),
        extraContent: (
          unknown.map((learner: string) => (
            <p key={learner} className="mb-0">• {intl.formatMessage(messages.unknownLearner, { learner })}</p>
          ))
        )
      });
    }
  };

  const handleAddLearners = () => {
    clearAlerts();
    const usersArray = users.split(/[\n,]+/).map(u => u.trim()).filter(Boolean);
    addLearnersToCohort(usersArray, {
      onSuccess: handleAlertMessages,
      onError: (error) => {
        addAlert({
          type: 'error',
          message: intl.formatMessage(messages.addLearnersErrorMessage)
        });
        console.error(error);
      }
    });
  };

  return (
    <div className="mx-4 my-3.5">
      <h3 className="text-primary-700">{intl.formatMessage(messages.addLearnersTitle)}</h3>
      <p className="x-small mb-2.5">{intl.formatMessage(messages.addLearnersSubtitle)}</p>
      <p className="mb-2 text-primary-500">{intl.formatMessage(messages.addLearnersInstructions)}</p>
      <FormControl
        as="textarea"
        className="mb-2"
        rows={4}
        placeholder={intl.formatMessage(messages.learnersExample)}
        onChange={(e) => setUsers(e.target.value)}
      />
      <p className="x-small mb-2.5">{intl.formatMessage(messages.addLearnersFootnote)}</p>
      <Button variant="primary" className="mt-2" onClick={handleAddLearners}>+ {intl.formatMessage(messages.addLearnersLabel)}</Button>
    </div>
  );
};

export default ManageLearners;
