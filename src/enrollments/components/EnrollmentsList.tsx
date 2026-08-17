import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { ActionRow, Button, DataTable, FormControl, Icon, IconButton, OverlayTrigger, Popover } from '@openedx/paragon';
import { FilterList, MoreVert, Search } from '@openedx/paragon/icons';
import messages from '@src/enrollments/messages';
import { useEnrollments } from '@src/enrollments/data/apiHook';
import { EnrolledLearner } from '@src/enrollments/types';
import { useDebouncedFilter } from '@src/hooks/useDebouncedFilter';
import { DataTableFetchDataProps, TableCellValue } from '@src/types';

const ENROLLMENTS_PAGE_SIZE = 25;

const betaTesterOptions = [
  { value: '', label: messages.allEnrollees },
  { value: 'true', label: messages.betaTesters },
  { value: 'false', label: messages.nonBetaTesters },
];

interface EnrollmentsListProps {
  hideBetaTesters: boolean,
  onUnenroll: (learner: EnrolledLearner) => void,
  onBetaTesterChange: (learner: EnrolledLearner) => void,
}

const UsernameFilter = ({ column: { filterValue, setFilter } }: { column: { filterValue: string, setFilter: (value: string) => void } }) => {
  const intl = useIntl();
  const { inputValue, handleChange } = useDebouncedFilter({
    filterValue,
    setFilter,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e.target.value);
  };

  return (
    <FormControl
      className="mb-0"
      onChange={handleInputChange}
      placeholder={intl.formatMessage(messages.searchPlaceholder)}
      trailingElement={<Icon src={Search} />}
      value={inputValue}
    />
  );
};

const BetaTesterFilter = ({ column: { filterValue, setFilter } }: { column: { filterValue: string, setFilter: (value: string) => void } }) => {
  const intl = useIntl();

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  return (
    <FormControl
      as="select"
      className="mb-0"
      name="isBetaTester"
      size="md"
      value={filterValue}
      onChange={handleSelectChange}
      leadingElement={<Icon src={FilterList} />}
    >
      {
        betaTesterOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {intl.formatMessage(option.label)}
          </option>
        ))
      }
    </FormControl>
  );
};

const EnrollmentsList = ({ hideBetaTesters, onUnenroll, onBetaTesterChange }: EnrollmentsListProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams();
  const [filters, setFilters] = useState({ page: 0, username: '', isBetaTester: '' });
  const { data = { count: 0, results: [], numPages: 0 }, isLoading } = useEnrollments(courseId, {
    page: filters.page,
    pageSize: ENROLLMENTS_PAGE_SIZE,
    emailOrUsername: filters.username,
    isBetaTester: filters.isBetaTester,
  });

  const handleFetchData = (data: DataTableFetchDataProps) => {
    const usernameFilter = data.filters?.find((f) => f.id === 'username');
    const newEmailOrUsername = usernameFilter ? usernameFilter.value : '';
    const betaTesterFilter = data.filters?.find((f) => f.id === 'isBetaTester');
    const newIsBetaTester = betaTesterFilter ? betaTesterFilter.value : '';
    const filtersChanged = (newEmailOrUsername !== filters.username) || (newIsBetaTester !== filters.isBetaTester);

    if (filtersChanged) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        username: newEmailOrUsername,
        isBetaTester: newIsBetaTester,
        page: 0,
      }));
      return;
    }

    if (data.pageIndex !== filters.page) {
      setFilters((prevFilters) => ({ ...prevFilters, page: data.pageIndex }));
    }
  };

  const tableColumns = [
    { accessor: 'username', Header: intl.formatMessage(messages.username), Filter: UsernameFilter },
    { accessor: 'fullName', Header: intl.formatMessage(messages.fullName), disableFilters: true },
    { accessor: 'email', Header: intl.formatMessage(messages.email), disableFilters: true },
    {
      accessor: 'mode',
      Header: intl.formatMessage(messages.track),
      Cell: ({ value }: { value: string }) => (
        <span className="text-capitalize">{value || 'N/A'}</span>
      ),
      disableFilters: true,
    },
    ...(hideBetaTesters ? [] : [
      {
        accessor: 'isBetaTester',
        Header: intl.formatMessage(messages.betaTester),
        Cell: ({ value }: { value: string }) => (value ? intl.formatMessage(messages.trueLabel) : ''),
        Filter: BetaTesterFilter,
      },
    ]),
  ];

  const ActionCustomCell = useCallback(({ row: { original } }: TableCellValue<EnrolledLearner>) => {
    const popoverContent = (
      <Popover
        id={`popover-${original.username}`}
        className="border-0 shadow-sm"
      >
        <Popover.Content className="p-0 border-0">
          <div className="dropdown-menu show position-static border shadow-sm">
            <button
              type="button"
              className="dropdown-item"
              onClick={() => onBetaTesterChange(original)}
            >
              {original.isBetaTester
                ? intl.formatMessage(messages.revokeBetaTester)
                : intl.formatMessage(messages.grantBetaTester)}
            </button>
          </div>
        </Popover.Content>
      </Popover>
    );

    return (
      <ActionRow className="justify-content-start">
        <Button className="pl-0" onClick={() => onUnenroll(original)} variant="link">
          {intl.formatMessage(messages.unenrollButton)}
        </Button>
        {!hideBetaTesters && (
          <OverlayTrigger
            trigger="click"
            placement="bottom-end"
            overlay={popoverContent}
            rootClose
          >
            <IconButton
              alt={intl.formatMessage(messages.changeBetaTesterStatus)}
              className="lead"
              iconAs={MoreVert}
            />
          </OverlayTrigger>
        )}
      </ActionRow>
    );
  }, [intl, onBetaTesterChange, onUnenroll, hideBetaTesters]);

  return (
    <DataTable
      className="mt-3"
      columns={tableColumns}
      additionalColumns={[
        {
          id: 'actions',
          Header: intl.formatMessage(messages.actions),
          Cell: ActionCustomCell,
        }
      ]}
      data={data.results}
      fetchData={handleFetchData}
      state={{
        pageIndex: filters.page,
        pageSize: ENROLLMENTS_PAGE_SIZE,
        filters: [
          { id: 'username', value: filters.username },
          ...(hideBetaTesters ? [] : [{ id: 'isBetaTester', value: filters.isBetaTester }]),
        ]
      }}
      isFilterable
      isLoading={isLoading}
      isPaginated
      itemCount={data.count}
      manualFilters
      manualPagination
      numBreakoutFilters={hideBetaTesters ? 1 : 2}
      pageSize={ENROLLMENTS_PAGE_SIZE}
      pageCount={data.numPages}
      FilterStatusComponent={() => null}
    >
      <DataTable.TableControlBar className="px-3 pt-3 pb-2" />
      <DataTable.Table />
      <DataTable.EmptyTable content={intl.formatMessage(messages.noEnrollments)} />
      <DataTable.TableFooter />
    </DataTable>
  );
};

export default EnrollmentsList;
