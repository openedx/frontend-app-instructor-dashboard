import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { Button, DataTable } from '@openedx/paragon';
import messages from '../messages';
import { LearnerDateExtension } from '../types';
import { useDateExtensions } from '../data/apiHook';
import SelectGradedSubsection from './SelectGradedSubsection';
import { useDebouncedFilter } from '../../hooks/useDebouncedFilter';
import { DataTableFetchDataProps } from '@src/types';
import UsernameFilter from '@src/components/UsernameFilter';

const DATE_EXTENSIONS_PAGE_SIZE = 25;

export interface DateExtensionListProps {
  onResetExtensions?: (user: LearnerDateExtension) => void;
  onClickAdd?: () => void;
}

const GradedSubsectionFilter = ({ column: { filterValue, setFilter } }: { column: { filterValue: string; setFilter: (value: string) => void } }) => {
  const intl = useIntl();
  const { inputValue, handleChange } = useDebouncedFilter({
    filterValue,
    setFilter,
  });

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange(e.target.value);
  };

  return (
    <SelectGradedSubsection
      placeholder={intl.formatMessage(messages.allGradedSubsections)}
      onChange={handleSelectChange}
      value={inputValue}
    />
  );
};

const DateExtensionsList = ({
  onResetExtensions = () => {},
  onClickAdd = () => {},
}: DateExtensionListProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const [filters, setFilters] = useState<{ page: number; emailOrUsername: string; blockId: string }>({
    page: 0,
    emailOrUsername: '',
    blockId: '',
  });

  const { data = { count: 0, results: [], numPages: 0 }, isLoading } = useDateExtensions(courseId ?? '', {
    blockId: filters.blockId,
    emailOrUsername: filters.emailOrUsername,
    page: filters.page,
    pageSize: DATE_EXTENSIONS_PAGE_SIZE,
  });

  const tableColumns = [
    { accessor: 'username',
      Header: intl.formatMessage(messages.username),
      Filter: UsernameFilter,
    },
    { accessor: 'fullName', Header: intl.formatMessage(messages.fullname), disableFilters: true, },
    { accessor: 'email', Header: intl.formatMessage(messages.email), disableFilters: true, },
    { accessor: 'unitTitle',
      Header: intl.formatMessage(messages.gradedSubsection),
      Filter: GradedSubsectionFilter,
    },
    {
      accessor: 'extendedDueDate',
      Header: intl.formatMessage(messages.extendedDueDate),
      Cell: ({ value }: { value: string }) => (
        `${intl.formatDate(value, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })} UTC`
      ),
      disableFilters: true,
    },
  ];

  const additionalColumns = [{
    id: 'reset',
    Header: intl.formatMessage(messages.reset),
    Cell: ({ row }: { row: { original: LearnerDateExtension } }) => (
      <Button
        variant="link"
        size="inline"
        onClick={() => onResetExtensions(row.original)}
      >
        {intl.formatMessage(messages.resetExtensions)}
      </Button>
    )
  }];

  const handleFetchData = (data: DataTableFetchDataProps) => {
    const emailOrUsernameFilter = data.filters.find((filter) => filter.id === 'username');
    const newEmailOrUsername = emailOrUsernameFilter ? emailOrUsernameFilter.value : '';
    const blockIdFilter = data.filters.find((filter) => filter.id === 'unitTitle');
    const newBlockId = blockIdFilter ? blockIdFilter.value : '';

    const filterChanged = newEmailOrUsername !== filters.emailOrUsername || newBlockId !== filters.blockId;
    const pageChanged = data.pageIndex !== filters.page;

    // If filters changed, reset to page 0
    if (filterChanged) {
      setFilters({ page: 0, emailOrUsername: newEmailOrUsername, blockId: newBlockId });
    } else if (pageChanged) {
      // If only page changed (filters didn't change), update page
      setFilters({ page: data.pageIndex, emailOrUsername: newEmailOrUsername, blockId: newBlockId });
    }
  };

  return (
    <DataTable
      columns={tableColumns}
      additionalColumns={additionalColumns}
      data={data.results}
      fetchData={handleFetchData}
      state={{
        pageIndex: filters.page,
        pageSize: DATE_EXTENSIONS_PAGE_SIZE,
        filters: [
          {
            id: 'username',
            value: filters.emailOrUsername,
          },
          {
            id: 'unitTitle',
            value: filters.blockId,
          }
        ]
      }}
      isFilterable
      numBreakoutFilters={2}
      isLoading={isLoading}
      isPaginated
      itemCount={data.count}
      manualFilters
      manualPagination
      pageSize={DATE_EXTENSIONS_PAGE_SIZE}
      pageCount={data.numPages}
      FilterStatusComponent={DataTable.RowStatus}
    >
      <div className="d-flex justify-content-between align-items-start pt-1 mx-3 mb-3">
        <DataTable.TableControlBar />
        <Button className="mt-2.5" onClick={onClickAdd}>+ {intl.formatMessage(messages.addIndividualExtension)}</Button>
      </div>
      <DataTable.Table />
      <DataTable.EmptyTable content={intl.formatMessage(messages.noDateExtensions)} />
      <DataTable.TableFooter />
    </DataTable>
  );
};

export default DateExtensionsList;
