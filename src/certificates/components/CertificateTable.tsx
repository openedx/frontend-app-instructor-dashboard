import { useMemo } from 'react';
import { DataTable, IconButton, OverlayTrigger, Popover, TableFooter } from '@openedx/paragon';
import { MoreVert } from '@openedx/paragon/icons';
import { useIntl } from '@openedx/frontend-base';
import type { CertificateData, CertificateFilter } from '@src/certificates/types';
import { CertificateFilter as FilterEnum } from '@src/certificates/types';
import { CERTIFICATES_TABLE_PAGE_SIZE } from '@src/certificates/constants';
import messages from '@src/certificates/messages';

interface CertificateTableProps {
  data: CertificateData[];
  isLoading: boolean;
  itemCount: number;
  pageCount: number;
  currentPage: number;
  filter: CertificateFilter;
  onPageChange: (pageIndex: number) => void;
  onRemoveException: (username: string, email: string) => void;
  onRemoveInvalidation: (username: string, email: string) => void;
}

interface ColumnType {
  Header: string;
  accessor?: string;
  id?: string;
  Cell?: ({ row, value }: { row?: { original: CertificateData }; value?: string }) => JSX.Element | null;
}

const CertificateTable = ({
  data,
  isLoading,
  itemCount,
  filter,
  onRemoveException,
  onRemoveInvalidation,
}: CertificateTableProps) => {
  const intl = useIntl();

  const baseColumns = useMemo(
    () => [
      {
        Header: intl.formatMessage(messages.columnUsername),
        accessor: 'username',
      },
      {
        Header: intl.formatMessage(messages.columnEmail),
        accessor: 'email',
      },
      {
        Header: intl.formatMessage(messages.columnEnrollmentTrack),
        accessor: 'enrollmentTrack',
      },
      {
        Header: intl.formatMessage(messages.columnCertificateStatus),
        accessor: 'certificateStatus',
      },
      {
        Header: intl.formatMessage(messages.columnSpecialCase),
        accessor: 'specialCase',
      },
    ],
    [intl],
  );

  const conditionalColumns = useMemo(() => {
    const columns: ColumnType[] = [];

    if (filter === FilterEnum.ALL_LEARNERS || filter === FilterEnum.GRANTED_EXCEPTIONS) {
      columns.push(
        {
          Header: intl.formatMessage(messages.columnExceptionGranted),
          accessor: 'exceptionGranted',
        },
        {
          Header: intl.formatMessage(messages.columnExceptionNotes),
          accessor: 'exceptionNotes',
        },
      );
    }

    if (filter === FilterEnum.ALL_LEARNERS || filter === FilterEnum.INVALIDATED) {
      columns.push(
        {
          Header: intl.formatMessage(messages.columnInvalidatedBy),
          accessor: 'invalidatedBy',
        },
        {
          Header: intl.formatMessage(messages.columnInvalidationDate),
          accessor: 'invalidationDate',
          Cell: ({ value }: { value?: string }) => {
            if (!value) return null;
            return (
              <>
                {intl.formatDate(new Date(value), {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </>
            );
          },
        },
        {
          Header: intl.formatMessage(messages.columnInvalidationNote),
          accessor: 'invalidationNote',
        },
      );
    }

    return columns;
  }, [filter, intl]);

  const additionalColumns = useMemo(() => {
    if (filter !== FilterEnum.GRANTED_EXCEPTIONS && filter !== FilterEnum.INVALIDATED) {
      return [];
    }

    return [
      {
        id: 'action',
        Header: intl.formatMessage(messages.columnActions),
        Cell: ({ row }: { row: { original: CertificateData } }) => {
          const popoverContent = (
            <Popover
              id={`popover-${row.original.username}`}
              className="border-0 shadow-sm"
            >
              <Popover.Content className="p-0 border-0">
                <div className="dropdown-menu show position-static border shadow-sm">
                  {filter === FilterEnum.GRANTED_EXCEPTIONS && (
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => onRemoveException(row.original.username, row.original.email)}
                    >
                      {intl.formatMessage(messages.removeExceptionAction)}
                    </button>
                  )}
                  {filter === FilterEnum.INVALIDATED && (
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => onRemoveInvalidation(row.original.username, row.original.email)}
                    >
                      {intl.formatMessage(messages.removeInvalidationAction)}
                    </button>
                  )}
                </div>
              </Popover.Content>
            </Popover>
          );

          return (
            <OverlayTrigger
              trigger="click"
              placement="bottom-end"
              overlay={popoverContent}
              rootClose
            >
              <IconButton
                alt={intl.formatMessage(messages.columnActions)}
                iconAs={MoreVert}
              />
            </OverlayTrigger>
          );
        },
      },
    ];
  }, [filter, intl, onRemoveException, onRemoveInvalidation]);

  const allColumns = useMemo(
    () => [...baseColumns, ...conditionalColumns, ...additionalColumns],
    [baseColumns, conditionalColumns, additionalColumns],
  );

  return (
    <DataTable
      columns={allColumns}
      data={data}
      isLoading={isLoading}
      isPaginated
      itemCount={itemCount}
      initialState={{ pageIndex: 0, pageSize: CERTIFICATES_TABLE_PAGE_SIZE }}
    >
      <DataTable.Table />
      <DataTable.EmptyTable content={intl.formatMessage(messages.noDataMessage)} />
      <TableFooter />
    </DataTable>
  );
};

export default CertificateTable;
