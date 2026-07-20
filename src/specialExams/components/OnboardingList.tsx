import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { DataTable } from '@openedx/paragon';
import UsernameFilter from '@src/components/UsernameFilter';
import { useOnboardingStatuses } from '@src/specialExams/data/apiHook';
import messages from '@src/specialExams/messages';
import { OnboardingStatus } from '@src/specialExams/types';
import { DataTableFetchDataProps, TableCellValue } from '@src/types';

export const ONBOARDING_PAGE_SIZE = 25;

const OnboardingList = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const [filters, setFilters] = useState({ page: 0, emailOrUsername: '' });
  const { data = { results: [], count: 0, numPages: 0 }, isLoading = false } = useOnboardingStatuses(courseId, filters);

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
      Cell: ({ row }: TableCellValue<OnboardingStatus>) => (
        <span className="text-capitalize">{(row.original.status || '').replace(/_/g, ' ')}</span>
      ),
      disableFilters: true,
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
  ], [intl]);

  const handleFetchData = (tableData: DataTableFetchDataProps) => {
    const usernameFilter = tableData.filters?.find((f) => f.id === 'username');
    const newEmailOrUsername = usernameFilter ? usernameFilter.value : '';
    if (newEmailOrUsername !== filters.emailOrUsername) {
      setFilters((prevFilters) => ({ ...prevFilters, emailOrUsername: newEmailOrUsername, page: 0 }));
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
          { id: 'emailOrUsername', value: filters.emailOrUsername }
        ],
      }}
      fetchData={handleFetchData}
      isFilterable
      isLoading={isLoading}
      isPaginated
      itemCount={data.count}
      manualFilters
      manualPagination
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
