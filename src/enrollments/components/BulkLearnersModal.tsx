import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useIntl } from '@openedx/frontend-base';
import { Button, FormControl, ModalDialog, Form } from '@openedx/paragon';
import { useUpdateEnrollments } from '@src/enrollments/data/apiHook';
import messages from '@src/enrollments/messages';
import { useAlert } from '@src/providers/AlertProvider';
import { LearnersAction } from '@src/enrollments/types';
import { BULK_LEARNERS_ACTION } from '../constants';

export interface BulkLearnersModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: LearnersAction;
}

const unenrollInfo = {
  title: messages.unenrollLearners,
  message: messages.unenrollLearnersMessage,
  buttonLabel: messages.unenrollLearners,
  errorMessage: messages.erroredUnenrollLearners,
};

const enrollInfo = {
  title: messages.enrollLearners,
  message: messages.addLearnerInstructions,
  buttonLabel: messages.saveButton,
  errorMessage: messages.erroredEnrollLearners,
};

const BulkLearnersModal = ({
  isOpen,
  onClose,
  action
}: BulkLearnersModalProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const [emails, setEmails] = useState('');
  const [autoEnroll, setAutoEnroll] = useState(action === BULK_LEARNERS_ACTION.ENROLL);
  const [emailStudents, setEmailStudents] = useState(true);
  const { mutate: enrollLearners } = useUpdateEnrollments(courseId);
  const { showModal, addAlert } = useAlert();
  const info = useMemo(
    () => (action === BULK_LEARNERS_ACTION.UNENROLL ? unenrollInfo : enrollInfo),
    [action],
  );

  const renderLearners = (learners: string[], format: (learner: string) => string) => (
    learners.map((learner: string) => (
      <p key={learner} className="mb-0">• {format(learner)}</p>
    ))
  );

  const handleSave = () => {
    const identifier = emails.split(/[\n,]+/).map(email => email.trim()).filter(Boolean);
    enrollLearners({ identifier, action, autoEnroll, emailStudents }, {
      onSuccess: (data) => {
        const results = data.results || [];
        const failedUsernames = results.filter(user => user.invalidIdentifier).map(user => user.identifier);
        const erroredUsernames = results.filter(user => !user.invalidIdentifier && user.error).map(user => user.identifier);
        // Identifiers that do not belong to a registered user yet are recorded as an invitation
        // instead of an enrollment, so they never show up in the enrollments list.
        const pendingLearners = results.filter(user => (
          !user.invalidIdentifier && !user.error && !user.after?.enrollment && user.after?.allowed
        ));
        const pendingAutoEnroll = pendingLearners.filter(user => user.after?.autoEnroll).map(user => user.identifier);
        const pendingAllowed = pendingLearners.filter(user => !user.after?.autoEnroll).map(user => user.identifier);

        const successEnroll = results.filter(user => (
          !user.invalidIdentifier && !user.error && !user.before?.enrollment && user.after?.enrollment && action === BULK_LEARNERS_ACTION.ENROLL
        )).map(user => user.identifier);

        const successUnenroll = results.filter(user => (
          !user.invalidIdentifier && !user.error && user.before?.enrollment && !user.after?.enrollment && !user.after?.allowed && action === BULK_LEARNERS_ACTION.UNENROLL
        )).map(user => user.identifier);

        const notUnenrolledAndNotEnrolled = results.filter(user => (
          !user.invalidIdentifier && !user.error && !user.before?.enrollment && !user.after?.enrollment && !user.after?.allowed
        )).map(user => user.identifier);

        if (failedUsernames.length > 0) {
          addAlert({
            type: 'danger',
            message: intl.formatMessage(messages.failedEnrollLearners),
            extraContent: renderLearners(
              failedUsernames,
              (learner: string) => intl.formatMessage(messages.unknownLearner, { learner })
            )
          });
        }
        if (erroredUsernames.length > 0) {
          addAlert({
            type: 'danger',
            message: intl.formatMessage(info.errorMessage),
            extraContent: renderLearners(erroredUsernames, (learner: string) => learner)
          });
        }
        if (successEnroll.length > 0) {
          addAlert({
            type: 'success',
            message: intl.formatMessage(
              emailStudents ? messages.enrolledLearnersWithEmail : messages.enrolledLearners
            ),
            extraContent: renderLearners(successEnroll, (learner: string) => learner)
          });
        }
        if (pendingAutoEnroll.length > 0) {
          addAlert({
            type: 'info',
            message: intl.formatMessage(
              emailStudents ? messages.pendingAutoEnrollLearnersWithEmail : messages.pendingAutoEnrollLearners
            ),
            extraContent: renderLearners(
              pendingAutoEnroll,
              (learner: string) => intl.formatMessage(messages.pendingLearner, { learner })
            )
          });
        }
        if (pendingAllowed.length > 0) {
          addAlert({
            type: 'info',
            message: intl.formatMessage(
              emailStudents ? messages.pendingAllowedLearnersWithEmail : messages.pendingAllowedLearners
            ),
            extraContent: renderLearners(
              pendingAllowed,
              (learner: string) => intl.formatMessage(messages.pendingLearner, { learner })
            )
          });
        }
        if (successUnenroll.length > 0) {
          addAlert({
            type: 'success',
            message: intl.formatMessage(
              emailStudents ? messages.notEnrolledLearnersWithEmail : messages.notEnrolledLearners
            ),
            extraContent: renderLearners(successUnenroll, (learner: string) => learner)
          });
        }
        if (notUnenrolledAndNotEnrolled.length > 0) {
          addAlert({
            type: 'danger',
            message: intl.formatMessage(messages.notUnenrolledAndNotEnrolled),
            extraContent: renderLearners(notUnenrolledAndNotEnrolled, (learner: string) => learner)
          });
        }
        setEmails('');
        setAutoEnroll(true);
        setEmailStudents(true);
        onClose();
      },
      onError: (error) => {
        const notFound = isAxiosError(error) && error.response?.status === 404;
        const errorMessage = notFound
          ? intl.formatMessage(messages.enrollLearnerNotFoundError)
          : intl.formatMessage(messages.enrollLearnerError);
        showModal({
          message: errorMessage,
          variant: 'danger',
          confirmText: intl.formatMessage(messages.closeButton),
        });
      }
    });
  };

  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} isOverflowVisible={false} title={intl.formatMessage(info.title)}>
      <ModalDialog.Header className="border-light-700 border-bottom">
        <h3 className="text-primary-500">{intl.formatMessage(info.title)}</h3>
      </ModalDialog.Header>
      <div className="position-relative overflow-auto">
        <ModalDialog.Body className="py-4">
          <p className="text-gray-700 x-small mb-2">{intl.formatMessage(info.message)}</p>
          <FormControl
            name="identifier"
            as="textarea"
            rows={4}
            placeholder={intl.formatMessage(messages.userIdentifierPlaceholder)}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEmails(e.target.value)}
          />
          <div className="d-flex mt-3 text-primary-500">
            {action === BULK_LEARNERS_ACTION.ENROLL && (
              <Form.Checkbox
                controlClassName="border-primary-500"
                checked={autoEnroll}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAutoEnroll(e.target.checked)}
              >{intl.formatMessage(messages.autoEnrollCheckbox)}
              </Form.Checkbox>
            )}
            <Form.Checkbox
              controlClassName="border-primary-500"
              className="ml-4"
              checked={emailStudents}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailStudents(e.target.checked)}
            >{intl.formatMessage(messages.notifyUsersCheckbox)}
            </Form.Checkbox>
          </div>
        </ModalDialog.Body>
      </div>
      <ModalDialog.Footer className="border-light-700 border-top">
        <Button variant="tertiary" onClick={onClose}>
          {intl.formatMessage(messages.cancelButton)}
        </Button>
        <Button className="ml-2" variant="primary" onClick={handleSave} disabled={emails.trim().length === 0}>
          {intl.formatMessage(info.buttonLabel)}
        </Button>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default BulkLearnersModal;
