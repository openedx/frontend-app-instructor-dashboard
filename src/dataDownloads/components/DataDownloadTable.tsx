import { useIntl } from '@openedx/frontend-base';
import { DataTable } from '@openedx/paragon';
import { useCallback, useMemo } from 'react';
import messages from '@src/dataDownloads/messages';
import { DownloadLinkCell } from './DownloadLinkCell';
import { DownloadReportData } from '@src/dataDownloads/types';
import { ReportNameCell } from './ReportNameCell';

interface DataDownloadTableProps {
  data: DownloadReportData[];
  isLoading: boolean;
  onDownloadClick: (downloadLink: string, reportName: string) => void;
}

const DEFAULT_PAGE_SIZE = 10;

const DataDownloadTable = ({ data, isLoading, onDownloadClick }: DataDownloadTableProps) => {
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

  const DownloadCustomCell = useCallback(({ row }: { row: any }) => {
    return <DownloadLinkCell row={row} onDownloadClick={onDownloadClick} />;
  }, [onDownloadClick]);

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
          Cell: DownloadCustomCell,
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
