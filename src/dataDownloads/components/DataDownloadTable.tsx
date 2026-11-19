import { useIntl } from '@openedx/frontend-base';
import { DataTable } from '@openedx/paragon';
import { useMemo } from 'react';
import messages from '@src/dataDownloads/messages';
import { DownloadLinkCell } from './DownloadLinkCell';
import { DownloadReportData } from '@src/dataDownloads/types';
import { ReportNameCell } from './ReportNameCell';

interface DataDownloadTableProps {
  data: DownloadReportData[];
  isLoading: boolean;
}

const DEFAULT_PAGE_SIZE = 10;

const DataDownloadTable = ({ data, isLoading }: DataDownloadTableProps) => {
  const intl = useIntl();
  const pageCount = Math.ceil(data.length / DEFAULT_PAGE_SIZE);

  const tableColumns = useMemo(() => [
    {
      accessor: 'dateGenerated',
      Header: intl.formatMessage(messages.dateGeneratedColumnName),
    },
    {
      accessor: 'reportType',
      Header: intl.formatMessage(messages.reportTypeColumnName),
    },
  ], [intl]);

  return (
    <DataTable
      columns={tableColumns}
      data={data}
      isLoading={isLoading}
      isSortable
      isPaginated
      itemCount={data.length}
      pageCount={pageCount}
      initialState={{
        pageSize: DEFAULT_PAGE_SIZE,
        pageIndex: 0,
      }}
      additionalColumns={[
        {
          id: 'reportName',
          Header: intl.formatMessage(messages.reportNameColumnName),
          Cell: ReportNameCell,
        },
        {
          id: 'downloadLink',
          Header: '',
          Cell: DownloadLinkCell,
        }
      ]}
      RowStatusComponent={() => null}
    >
      <DataTable.Table />
      <DataTable.EmptyTable content={intl.formatMessage(messages.noReportsFoundMessage)} />
      {pageCount > 1 && (
        <DataTable.TableFooter>
          <DataTable.RowStatus />
          <DataTable.TablePagination />
          <DataTable.TablePaginationMinimal />
        </DataTable.TableFooter>
      )}
    </DataTable>
  );
};

export { DataDownloadTable };
