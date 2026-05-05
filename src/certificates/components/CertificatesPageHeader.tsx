import { Button, Dropdown, IconButton, Stack } from '@openedx/paragon';
import { Add, Cancel, MoreVert } from '@openedx/paragon/icons';
import { useIntl } from '@openedx/frontend-base';
import messages from '@src/certificates/messages';

interface CertificatesPageHeaderProps {
  onGrantExceptions: () => void,
  onInvalidateCertificate: () => void,
  onStudentGeneratedCertificates?: () => void,
}

const CertificatesPageHeader = ({
  onGrantExceptions,
  onInvalidateCertificate,
  onStudentGeneratedCertificates,
}: CertificatesPageHeaderProps) => {
  const intl = useIntl();

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
      <h3 className="text-primary-700 mb-0">{intl.formatMessage(messages.pageTitle)}</h3>
      <Stack direction="horizontal" gap={2} className="flex-wrap">
        <Dropdown>
          <Dropdown.Toggle
            as={IconButton}
            src={MoreVert}
            alt={intl.formatMessage(messages.moreActionsButton)}
            id="certificates-more-menu"
          />
          <Dropdown.Menu>
            {onStudentGeneratedCertificates && (
              <Dropdown.Item onClick={onStudentGeneratedCertificates}>
                {intl.formatMessage(messages.studentGeneratedCertificatesMenuItem)}
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
        <Button
          variant="outline-primary"
          iconBefore={Cancel}
          onClick={onInvalidateCertificate}
          className="text-nowrap"
        >
          {intl.formatMessage(messages.invalidateCertificateButton)}
        </Button>
        <Button
          variant="primary"
          iconBefore={Add}
          onClick={onGrantExceptions}
          className="text-nowrap"
        >
          {intl.formatMessage(messages.grantExceptionsButton)}
        </Button>
      </Stack>
    </div>
  );
};

export default CertificatesPageHeader;
