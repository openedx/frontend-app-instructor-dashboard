import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import messages from './messages';
import DateExtensionsList from './components/DateExtensionsList';
import ResetExtensionsModal from './components/ResetExtensionsModal';
import { LearnerDateExtension } from './types';
import { useAddDateExtensionMutation, useResetDateExtensionMutation } from './data/apiHook';
import { useAlert } from '@src/providers/AlertProvider';
import AddExtensionModal from './components/AddExtensionModal';
import { APIError } from '@src/types';
import { Skeleton } from '@openedx/paragon';
import { COURSE_PERMISSIONS, PermissionAlert, PermissionGate, useCoursePermission, usePermissionDeniedHandler } from '@src/permissions';
import AccessErrorAlert from '@src/providers/AccessErrorAlert';

const DateExtensionsContent = () => {
  const intl = useIntl();
  const { allowed: canManageExtensions } = useCoursePermission(COURSE_PERMISSIONS.MANAGE_LEARNER_EXTENSIONS);
  const onPermissionDenied = usePermissionDeniedHandler();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { mutate: resetMutation } = useResetDateExtensionMutation();
  const { mutate: addExtensionMutation } = useAddDateExtensionMutation();
  const [selectedUser, setSelectedUser] = useState<LearnerDateExtension | null>(null);
  const isResetModalOpen = selectedUser !== null;
  const { showToast, showModal, removeAlert, clearAlerts } = useAlert();
  const [isAddExtensionModalOpen, setIsAddExtensionModalOpen] = useState(false);

  const handleResetExtensions = (user: LearnerDateExtension) => {
    clearAlerts();
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleErrorOnReset = (error: APIError | Error) => {
    if (onPermissionDenied(error)) {
      handleCloseModal();
      setIsAddExtensionModalOpen(false);
      return;
    }
    showModal({
      confirmText: intl.formatMessage(messages.close),
      message: 'response' in error ? error.response.data.error : error.message,
      variant: 'danger',
      onConfirm: (id) => removeAlert(id)
    });
  };

  const handleSuccessOnReset = (response: string) => {
    showToast(response);
    handleCloseModal();
  };

  const handleConfirmReset = async () => {
    if (selectedUser && courseId) {
      resetMutation({
        courseId,
        params: {
          student: selectedUser.username,
          url: selectedUser.unitLocation,
        }
      }, {
        onError: handleErrorOnReset,
        onSuccess: handleSuccessOnReset
      });
    } else {
      showModal({
        confirmText: intl.formatMessage(messages.close),
        message: intl.formatMessage(messages.missingUserOrCourseIdError),
        variant: 'danger',
        onConfirm: (id) => removeAlert(id)
      });
    }
  };

  const handleAddExtension = ({ emailOrUsername, blockId, dueDatetime, reason }) => {
    addExtensionMutation({ courseId, extensionData: {
      emailOrUsername,
      blockId,
      dueDatetime,
      reason
    } }, {
      onError: handleErrorOnReset,
      onSuccess: (response) => {
        setIsAddExtensionModalOpen(false);
        showToast(response.message);
      }
    });
  };

  return (
    <>
      <h3 className="mb-4.5 text-primary-700">{intl.formatMessage(messages.dateExtensionsTitle)}</h3>
      {!canManageExtensions && <PermissionAlert />}
      <DateExtensionsList
        onClickAdd={canManageExtensions ? () => setIsAddExtensionModalOpen(true) : undefined}
        onResetExtensions={canManageExtensions ? handleResetExtensions : undefined}
      />
      <PermissionGate permission={COURSE_PERMISSIONS.MANAGE_LEARNER_EXTENSIONS}>
        <AddExtensionModal
          isOpen={isAddExtensionModalOpen}
          title={intl.formatMessage(messages.addIndividualDueDateExtension)}
          onClose={() => setIsAddExtensionModalOpen(false)}
          onSubmit={handleAddExtension}
        />
        <ResetExtensionsModal
          isOpen={isResetModalOpen}
          message={intl.formatMessage(messages.resetConfirmationMessage)}
          title={intl.formatMessage(messages.resetConfirmationHeader, { username: selectedUser?.username })}
          onCancelReset={handleCloseModal}
          onClose={handleCloseModal}
          onConfirmReset={handleConfirmReset}
        />
      </PermissionGate>
    </>
  );
};

// The backend controls courseInfo.tabs; this gate protects direct URL access.
const DateExtensionsPage = () => (
  <PermissionGate
    permission={COURSE_PERMISSIONS.VIEW_LEARNER_EXTENSIONS}
    loading={<Skeleton className="lead" />}
    fallback={<AccessErrorAlert errorType="forbidden" />}
  >
    <DateExtensionsContent />
  </PermissionGate>
);

export default DateExtensionsPage;
