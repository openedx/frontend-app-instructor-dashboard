import { ActionRow, Button, ModalDialog } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import { CertificateFilter } from '@src/certificates/types';
import messages from '@src/certificates/messages';

interface RegenerateCertificatesModalProps {
  isOpen: boolean,
  onClose: () => void,
  onConfirm: () => void,
  isSubmitting: boolean,
  filter: CertificateFilter,
  learnerCount: number,
}

const RegenerateCertificatesModal = ({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  filter,
  learnerCount,
}: RegenerateCertificatesModalProps) => {
  const intl = useIntl();

  // Determine title and message based on filter
  const getModalContent = () => {
    switch (filter) {
      case CertificateFilter.RECEIVED:
        return {
          title: intl.formatMessage(messages.regenerateModalTitleReceived),
          message: intl.formatMessage(messages.regenerateModalMessageReceived, { number: learnerCount }),
        };
      case CertificateFilter.NOT_RECEIVED:
        return {
          title: intl.formatMessage(messages.regenerateModalTitleNotReceived),
          message: intl.formatMessage(messages.regenerateModalMessageNotReceived, { number: learnerCount }),
        };
      case CertificateFilter.AUDIT_PASSING:
        return {
          title: intl.formatMessage(messages.regenerateModalTitleAuditPassing),
          message: intl.formatMessage(messages.regenerateModalMessageAuditPassing, { number: learnerCount }),
        };
      case CertificateFilter.AUDIT_NOT_PASSING:
        return {
          title: intl.formatMessage(messages.regenerateModalTitleAuditNotPassing),
          message: intl.formatMessage(messages.regenerateModalMessageAuditNotPassing, { number: learnerCount }),
        };
      case CertificateFilter.ERROR_STATE:
        return {
          title: intl.formatMessage(messages.regenerateModalTitleErrorState),
          message: intl.formatMessage(messages.regenerateModalMessageErrorState, { number: learnerCount }),
        };
      default:
        return {
          title: intl.formatMessage(messages.regenerateModalTitleDefault),
          message: intl.formatMessage(messages.regenerateModalMessageDefault, { number: learnerCount }),
        };
    }
  };

  const { title, message } = getModalContent();

  return (
    <ModalDialog
      title={title}
      onClose={onClose}
      isOpen={isOpen}
      size="md"
      hasCloseButton={false}
      isOverflowVisible={false}
    >
      <div className="mx-4 mt-4 mb-2.5">
        <p>{message}</p>
      </div>
      <ModalDialog.Footer>
        <ActionRow>
          <Button variant="tertiary" onClick={onClose} disabled={isSubmitting}>
            {intl.formatMessage(messages.cancel)}
          </Button>
          <Button variant="primary" onClick={onConfirm} disabled={isSubmitting}>
            {intl.formatMessage(messages.regenerate)}
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default RegenerateCertificatesModal;
