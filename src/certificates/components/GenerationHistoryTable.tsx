import { useMemo } from 'react';
import { DataTable } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import type { CertificateGenerationHistory } from '@src/certificates/types';
import messages from '@src/certificates/messages';

interface GenerationHistoryTableProps {
  data: CertificateGenerationHistory[];
  isLoading: boolean;
  itemCount: number;
  pageCount: number;
  currentPage: number;
  onPageChange: (pageIndex: number) => void;
}

const GenerationHistoryTable = ({
  data,
  isLoading,
  itemCount,
  pageCount,
  currentPage,
  onPageChange,
}: GenerationHistoryTableProps) => {
  const intl = useIntl();

  const columns = useMemo(
    () => [
      {
        Header: intl.formatMessage(messages.columnTaskName),
        accessor: 'taskName',
      },
      {
        Header: intl.formatMessage(messages.columnDate),
        accessor: 'date',
      },
      {
        Header: intl.formatMessage(messages.columnDetails),
        accessor: 'details',
      },
    ],
    [intl],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      isPaginated
      itemCount={itemCount}
      pageCount={pageCount}
      manualPagination
      fetchData={({ pageIndex }: { pageIndex: number }) => onPageChange(pageIndex)}
      initialState={{ pageIndex: currentPage, pageSize: 25 }}
    >
      <DataTable.Table />
      <DataTable.EmptyTable content={intl.formatMessage(messages.noTasksMessage)} />
      {itemCount > 0 && (
        <DataTable.TableFooter>
          <DataTable.RowStatus />
          <DataTable.TablePagination />
        </DataTable.TableFooter>
      )}
    </DataTable>
  );
};

export default GenerationHistoryTable;
