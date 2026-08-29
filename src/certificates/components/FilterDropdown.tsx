import { Dropdown } from '@openedx/paragon';
import { FilterList } from '@openedx/paragon/icons';
import { useIntl } from '@openedx/frontend-base';
import { CertificateFilter } from '@src/certificates/types';
import messages from '@src/certificates/messages';

interface FilterDropdownProps {
  value: CertificateFilter;
  onChange: (value: CertificateFilter) => void;
  className?: string;
}

const FILTER_OPTIONS = [
  {
    value: CertificateFilter.ALL_LEARNERS,
    messageKey: 'filterAllLearners',
  },
  {
    value: CertificateFilter.RECEIVED,
    messageKey: 'filterReceived',
  },
  {
    value: CertificateFilter.NOT_RECEIVED,
    messageKey: 'filterNotReceived',
  },
  {
    value: CertificateFilter.AUDIT_PASSING,
    messageKey: 'filterAuditPassing',
  },
  {
    value: CertificateFilter.AUDIT_NOT_PASSING,
    messageKey: 'filterAuditNotPassing',
  },
  {
    value: CertificateFilter.ERROR_STATE,
    messageKey: 'filterErrorState',
  },
  {
    value: CertificateFilter.GRANTED_EXCEPTIONS,
    messageKey: 'filterGrantedExceptions',
  },
  {
    value: CertificateFilter.INVALIDATED,
    messageKey: 'filterInvalidated',
  },
] as const;

const FilterDropdown = ({ value, onChange, className }: FilterDropdownProps) => {
  const intl = useIntl();

  const selectedOption = FILTER_OPTIONS.find((option) => option.value === value);
  const selectedLabel = selectedOption
    ? intl.formatMessage(messages[selectedOption.messageKey])
    : intl.formatMessage(messages.filterAllLearners);

  return (
    <Dropdown className={`certificates-filter-dropdown ${className || ''}`}>
      <Dropdown.Toggle
        id="filter-dropdown"
        variant="outline-primary"
        className="d-flex align-items-center justify-content-between w-100"
      >
        <span className="d-flex align-items-center">
          <FilterList className="mr-2" />
          {selectedLabel}
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {FILTER_OPTIONS.map((option) => (
          <Dropdown.Item
            key={option.value}
            active={option.value === value}
            onClick={() => onChange(option.value)}
            className="filter-dropdown-item"
          >
            {intl.formatMessage(messages[option.messageKey])}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default FilterDropdown;
