import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { DataTable, IconButton, OverlayTrigger, Popover } from '@openedx/paragon';
import { MoreVert } from '@openedx/paragon/icons';
import UsernameFilter from '@src/components/UsernameFilter';
import { useAttempts } from '@src/specialExams/data/apiHook';
import messages from '@src/specialExams/messages';
import { Attempt, AttemptAction } from '@src/specialExams/types';
import { DataTableFetchDataProps, TableCellValue } from '@src/types';

export const ATTEMPTS_PAGE_SIZE = 25;

interface AttemptsListProps {
  onResume: (attempt: Attempt) => void;
  onReset: (attempt: Attempt) => void;
}

const AttemptsList = ({ onResume, onReset }: AttemptsListProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams();
  const [filters, setFilters] = useState({ page: 0, emailOrUsername: '', ordering: '' });
  const { data = { results: [], count: 0, numPages: 0 }, isLoading = false } = useAttempts(courseId, {
    ...filters,
    pageSize: ATTEMPTS_PAGE_SIZE
  });

  const ActionCustomCell = ({ row: { original } }: TableCellValue<Attempt>) => {
    const [showPopover, setShowPopover] = useState(false);

    const handleAction = (action: AttemptAction) => {
      setShowPopover(false);
      if (action === 'resume') {
        onResume(original);
      } else {
        onReset(original);
      }
    };

    const popoverContent = (
      <Popover
        id={`popover-${original.user.username}-${original.examName}`}
        className="border-0 shadow-sm"
      >
        <Popover.Content className="p-0 border-0">
          <div className="dropdown-menu show position-static border shadow-sm">
            <button
              type="button"
              className="dropdown-item"
              onClick={() => handleAction('reset')}
            >
              {intl.formatMessage(messages.reset)}
            </button>
            {!original.readyToResume && original.status === 'error' && (
              <button
                type="button"
                className="dropdown-item"
                onClick={() => handleAction('resume')}
              >
                {intl.formatMessage(messages.resume)}
              </button>
            )}
          </div>
        </Popover.Content>
      </Popover>
    );
    return (
      <>
        <OverlayTrigger
          trigger="click"
          placement="bottom-end"
          overlay={popoverContent}
          rootClose
          show={showPopover}
          onToggle={setShowPopover}
        >
          <IconButton
            alt={intl.formatMessage(messages.actions)}
            className="lead"
            iconAs={MoreVert}
          />
        </OverlayTrigger>
      </>
    );
  };

  const columns = useMemo(() => [
    { accessor: 'user.username', Header: intl.formatMessage(messages.username), Filter: UsernameFilter, },
    { accessor: 'examName', Header: intl.formatMessage(messages.examName), disableFilters: true, },
    { accessor: 'allowedTimeLimitMins', Header: intl.formatMessage(messages.timeLimit), disableFilters: true, },
    {
      accessor: 'examType',
      Cell: ({ row }: TableCellValue<Attempt>) => <span className="text-capitalize">{row.original.examType}</span>,
      disableFilters: true,
      Header: intl.formatMessage(messages.type),
    },
    {
      accessor: 'startTime',
      Cell: ({ row }: TableCellValue<Attempt>) => (
        <span>{ row.original.startTime ? `${intl.formatDate(new Date(row.original.startTime), {
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
      Header: intl.formatMessage(messages.startedAt),
    },
    {
      accessor: 'endTime',
      Cell: ({ row }: TableCellValue<Attempt>) => (
        <span>{row.original.endTime ? `${intl.formatDate(new Date(row.original.endTime), {
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
      Header: intl.formatMessage(messages.completedAt),
    },
    {
      accessor: 'status',
      Cell: ({ row }: TableCellValue<Attempt>) => <span className="text-capitalize">{row.original.status}</span>,
      disableFilters: true,
      Header: intl.formatMessage(messages.status),
    },
    {
      accessor: 'readyToResume',
      Cell: ({ row }: TableCellValue<Attempt>) => (
        <span className="text-capitalize">{row.original.readyToResume ? intl.formatMessage(messages.true) : ''}</span>
      ),
      disableFilters: true,
      Header: intl.formatMessage(messages.readyForResume),
    }
  ], [intl]);

  const additionalColumns = [{
    id: 'actions',
    Header: '',
    Cell: ActionCustomCell,
  }];

  const handleFetchData = (data: DataTableFetchDataProps) => {
    const emailOrUsernameFilter = data.filters?.find((f) => f.id === 'user.username');
    const newEmailOrUsername = emailOrUsernameFilter ? emailOrUsernameFilter.value : '';
    const newOrdering = data.sortBy?.[0] ? `${data.sortBy[0].desc ? '-' : ''}${data.sortBy[0].id}` : '';
    const filtersChanged = newEmailOrUsername !== filters.emailOrUsername || newOrdering !== filters.ordering;
    if (filtersChanged) {
      setFilters((prevFilters) => ({ ...prevFilters, emailOrUsername: newEmailOrUsername, ordering: newOrdering, page: 0 }));
      return;
    }
    if (data.pageIndex !== filters.page) {
      setFilters((prevFilters) => ({ ...prevFilters, page: data.pageIndex }));
    }
  };

  return (
    <DataTable
      additionalColumns={additionalColumns}
      className="mt-3"
      columns={columns}
      data={data.results}
      state={{
        pageIndex: filters.page,
        pageSize: ATTEMPTS_PAGE_SIZE,
        filters: [
          { id: 'emailOrUsername', value: filters.emailOrUsername }
        ],
        sortBy: [
          { id: filters.ordering.replace(/^-/, ''), desc: filters.ordering.startsWith('-') }
        ]
      }}
      fetchData={handleFetchData}
      isFilterable
      isLoading={isLoading}
      isPaginated
      isSortable
      itemCount={data.count}
      manualFilters
      manualPagination
      manualSortBy
      pageSize={ATTEMPTS_PAGE_SIZE}
      pageCount={data.numPages}
      FilterStatusComponent={() => null}
    >
      <DataTable.TableControlBar className="bg-light-200 py-3 px-4" />
      <DataTable.Table />
      <DataTable.EmptyTable content={intl.formatMessage(messages.noAttempts)} />
      <DataTable.TableFooter />
    </DataTable>
  );
};

export default AttemptsList;
