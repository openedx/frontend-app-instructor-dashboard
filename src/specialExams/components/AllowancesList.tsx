import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { Button, DataTable, IconButton, OverlayTrigger, Popover } from '@openedx/paragon';
import { MoreVert, Plus } from '@openedx/paragon/icons';
import UsernameFilter from '@src/components/UsernameFilter';
import { ALLOWANCES_PAGE_SIZE, allowanceTypesOptions } from '@src/specialExams/constants';
import { useAllowances } from '@src/specialExams/data/apiHook';
import messages from '@src/specialExams/messages';
import { Allowance } from '@src/specialExams/types';
import { DataTableFetchDataProps, TableCellValue } from '@src/types';

interface AllowanceList {
  onClickAdd: () => void;
  onEdit: (allowance: Allowance) => void;
  onDelete: (allowance: Allowance) => void;
}

const AllowancesList = ({ onClickAdd, onEdit, onDelete }: AllowanceList) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const [filters, setFilters] = useState({ page: 0, emailOrUsername: '', ordering: '' });
  const { data = { results: [], count: 0, numPages: 1 }, isLoading = false } = useAllowances(courseId, {
    pageSize: ALLOWANCES_PAGE_SIZE,
    ...filters,
  });

  const ActionCustomCell = ({ row: { original } }: TableCellValue<Allowance>) => {
    const popoverContent = (
      <Popover
        id={`popover-${original.user.username}-${original.proctoredExam.examName}`}
        className="border-0 shadow-sm"
      >
        <Popover.Content className="p-0 border-0">
          <div className="dropdown-menu show position-static border shadow-sm">
            <button
              type="button"
              className="dropdown-item"
              onClick={() => onEdit(original)}
            >
              {intl.formatMessage(messages.edit)}
            </button>
            <button
              type="button"
              className="dropdown-item"
              onClick={() => onDelete(original)}
            >
              {intl.formatMessage(messages.delete)}
            </button>
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

  const columns = [
    { accessor: 'user.username', Header: intl.formatMessage(messages.username), Filter: UsernameFilter, },
    { accessor: 'user.email', Header: intl.formatMessage(messages.email), disableFilters: true, },
    { accessor: 'proctoredExam.examName', Header: intl.formatMessage(messages.examName), disableFilters: true, },
    { accessor: 'key', Header: intl.formatMessage(messages.allowanceType), disableFilters: true,
      Cell: ({ value }: { value: string }) => {
        const allowanceType = allowanceTypesOptions.find(option => option.value === value);
        return allowanceType ? intl.formatMessage(allowanceType.label) : '';
      }
    },
    { accessor: 'value', Header: intl.formatMessage(messages.allowanceValue), disableFilters: true, },
  ];

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
        pageSize: ALLOWANCES_PAGE_SIZE,
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
      pageSize={ALLOWANCES_PAGE_SIZE}
      pageCount={data.numPages}
      FilterStatusComponent={() => null}
    >
      <div className="bg-light-200 d-flex justify-content-between align-items-center p-3">
        <DataTable.TableControlBar className="p-0" />
        <Button iconBefore={Plus} variant="primary" onClick={onClickAdd}>
          {intl.formatMessage(messages.addAllowance)}
        </Button>
      </div>
      <DataTable.Table />
      <DataTable.EmptyTable content={intl.formatMessage(messages.noAllowances)} />
      <DataTable.TableFooter />
    </DataTable>
  );
};

export default AllowancesList;
