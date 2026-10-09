import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { DataTable, Dropdown, Form, Icon } from '@openedx/paragon';
import { FilterList } from '@openedx/paragon/icons';
import UsernameFilter from '@src/components/UsernameFilter';
import { ONBOARDING_ATTEMPT_STATUSES, ONBOARDING_PROFILE_API_STATUSES, onboardingStatusLabel } from '@src/specialExams/constants';
import { useOnboardingStatuses } from '@src/specialExams/data/apiHook';
import messages from '@src/specialExams/messages';
import { OnboardingParams, OnboardingStatus } from '@src/specialExams/types';
import { DataTableFetchDataProps, TableCellValue } from '@src/types';

export const ONBOARDING_PAGE_SIZE = 25;
const NO_STATUSES = [] as const;

interface StatusFilterProps {
  column: {
    filterValue?: string[];
    setFilter: (value: string[]) => void;
    statusOptions: readonly (keyof typeof onboardingStatusLabel)[];
  };
}

const StatusFilter = ({ column: { filterValue = [], setFilter, statusOptions } }: StatusFilterProps) => {
  const intl = useIntl();

  // Build a new array rather than mutating filterValue, which is the component's state.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFilter(filterValue.includes(value) ? filterValue.filter((s) => s !== value) : [...filterValue, value]);
  };

  return (
    <Dropdown>
      <Dropdown.Toggle
        id="onboarding-status-filter"
        variant={filterValue.length ? 'primary' : 'outline-primary'}
        disabled={!statusOptions.length}
      >
        <Icon src={FilterList} className="mr-2" />
        {intl.formatMessage(messages.onboardingStatus)}
        {filterValue.length > 0 && ` (${filterValue.length})`}
      </Dropdown.Toggle>
      <Dropdown.Menu className="px-3 py-2">
        <Form.CheckboxSet
          name="status"
          aria-label={intl.formatMessage(messages.onboardingStatus)}
          value={filterValue}
          onChange={handleChange}
        >
          {statusOptions.map((status) => (
            <Form.Checkbox key={status} value={status}>
              {intl.formatMessage(onboardingStatusLabel[status])}
            </Form.Checkbox>
          ))}
        </Form.CheckboxSet>
      </Dropdown.Menu>
    </Dropdown>
  );
};

const OnboardingList = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const [filters, setFilters] = useState<OnboardingParams>({ page: 0, emailOrUsername: '', statuses: [] });
  const {
    data = { results: [], count: 0, numPages: 0 }, isLoading = false, isPlaceholderData = false,
  } = useOnboardingStatuses(courseId, filters);

  // The status options depend on useOnboardingProfileApi, which is only known once the
  // first response arrives, so the filter stays disabled until then.
  const statusOptions = data.useOnboardingProfileApi === undefined ? NO_STATUSES
    : data.useOnboardingProfileApi ? ONBOARDING_PROFILE_API_STATUSES : ONBOARDING_ATTEMPT_STATUSES;

  const columns = useMemo(() => [
    { accessor: 'username', Header: intl.formatMessage(messages.username), Filter: UsernameFilter, },
    {
      accessor: 'enrollmentMode',
      Cell: ({ row }: TableCellValue<OnboardingStatus>) => (
        <span className="text-capitalize">{row.original.enrollmentMode || ''}</span>
      ),
      disableFilters: true,
      Header: intl.formatMessage(messages.enrollmentMode),
    },
    {
      accessor: 'status',
      Cell: ({ row }: TableCellValue<OnboardingStatus>) => {
        const { status } = row.original;
        const label = status && onboardingStatusLabel[status as keyof typeof onboardingStatusLabel];
        return (
          label ? <span>{intl.formatMessage(label)}</span>
            : <span className="text-capitalize">{(status || '').replace(/_/g, ' ')}</span>
        );
      },
      Filter: StatusFilter,
      statusOptions,
      Header: intl.formatMessage(messages.onboardingStatus),
    },
    {
      accessor: 'modified',
      Cell: ({ row }: TableCellValue<OnboardingStatus>) => (
        <span>{row.original.modified ? `${intl.formatDate(new Date(row.original.modified), {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'UTC',
        })} UTC` : ''}
        </span>
      ),
      disableFilters: true,
      Header: intl.formatMessage(messages.lastUpdated),
    },
  ], [intl, statusOptions]);

  const handleFetchData = (tableData: DataTableFetchDataProps) => {
    const usernameFilter = tableData.filters?.find((f) => f.id === 'username');
    const newEmailOrUsername = usernameFilter ? usernameFilter.value : '';
    const statusFilter = tableData.filters?.find((f) => f.id === 'status');
    const newStatuses = (statusFilter?.value || []) as unknown as string[];
    if (newEmailOrUsername !== filters.emailOrUsername || newStatuses.join() !== filters.statuses.join()) {
      setFilters({ emailOrUsername: newEmailOrUsername, statuses: newStatuses, page: 0 });
      return;
    }
    if (tableData.pageIndex !== filters.page) {
      setFilters((prevFilters) => ({ ...prevFilters, page: tableData.pageIndex }));
    }
  };

  return (
    <DataTable
      className="mt-3"
      columns={columns}
      data={data.results}
      state={{
        pageIndex: filters.page,
        pageSize: ONBOARDING_PAGE_SIZE,
        filters: [
          { id: 'username', value: filters.emailOrUsername },
          { id: 'status', value: filters.statuses },
        ],
      }}
      fetchData={handleFetchData}
      isFilterable
      isLoading={isLoading || isPlaceholderData}
      isPaginated
      itemCount={data.count}
      manualFilters
      manualPagination
      numBreakoutFilters={2}
      pageSize={ONBOARDING_PAGE_SIZE}
      pageCount={data.numPages}
      FilterStatusComponent={() => null}
    >
      <DataTable.TableControlBar className="bg-light-200 py-3 px-4" />
      <DataTable.Table />
      <DataTable.EmptyTable content={intl.formatMessage(messages.noOnboardingStatuses)} />
      <DataTable.TableFooter />
    </DataTable>
  );
};

export default OnboardingList;
