import { Button, SearchField, OverlayTrigger, Tooltip } from '@openedx/paragon';
import { SpinnerIcon } from '@openedx/paragon/icons';
import { useIntl } from '@openedx/frontend-base';
import FilterDropdown from '@src/certificates/components/FilterDropdown';
import { CertificateFilter } from '@src/certificates/types';
import messages from '@src/certificates/messages';
import '../CertificatesPage.scss';

interface CertificatesToolbarProps {
  search: string,
  onSearchChange: (value: string) => void,
  filter: CertificateFilter,
  onFilterChange: (value: CertificateFilter) => void,
  onRegenerateCertificates: () => void,
}

const CertificatesToolbar = ({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  onRegenerateCertificates,
}: CertificatesToolbarProps) => {
  const intl = useIntl();

  // Determine button state based on filter
  const isButtonDisabled = filter === CertificateFilter.ALL_LEARNERS || filter === CertificateFilter.INVALIDATED;

  // Determine button text based on filter
  let buttonText: string;
  if (filter === CertificateFilter.GRANTED_EXCEPTIONS) {
    buttonText = intl.formatMessage(messages.generateCertificatesButton);
  } else {
    buttonText = intl.formatMessage(messages.regenerateCertificatesButton);
  }

  // Determine tooltip text based on filter
  let tooltipText: string | null = null;
  if (filter === CertificateFilter.ALL_LEARNERS) {
    tooltipText = intl.formatMessage(messages.regenerateTooltipAllLearners);
  } else if (filter === CertificateFilter.INVALIDATED) {
    tooltipText = intl.formatMessage(messages.regenerateTooltipInvalidated);
  }

  const button = (
    <Button
      variant="outline-primary"
      iconBefore={SpinnerIcon}
      onClick={onRegenerateCertificates}
      className="text-nowrap flex-shrink-0"
      disabled={isButtonDisabled}
    >
      {buttonText}
    </Button>
  );

  return (
    <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 mx-4 mt-3 gap-3">
      <div className="d-flex align-items-center gap-3 flex-shrink-1 certificates-toolbar-wrapper">
        <SearchField
          onSubmit={onSearchChange}
          onChange={onSearchChange}
          placeholder={intl.formatMessage(messages.searchPlaceholder)}
          value={search}
          className="flex-shrink-1 certificates-search-field"
        />
        <FilterDropdown
          value={filter}
          onChange={onFilterChange}
          className="flex-shrink-0"
        />
      </div>
      {tooltipText && isButtonDisabled ? (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="regenerate-tooltip">{tooltipText}</Tooltip>}
        >
          <span className="d-inline-block">
            {button}
          </span>
        </OverlayTrigger>
      ) : (
        button
      )}
    </div>
  );
};

export default CertificatesToolbar;
