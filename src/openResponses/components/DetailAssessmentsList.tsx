import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { Button, DataTable } from '@openedx/paragon';
import messages from '../messages';
import { useDetailAssessmentsData } from '../data/apiHook';
import { ORARecord } from '../types';

const DETAILS_PAGE_SIZE = 25;

interface DataTableFetchDataProps {
  pageIndex: number;
}

const DetailAssessmentsList = () => {
  const intl = useIntl();
  const { courseId } = useParams();
  const [page, setPage] = useState(0);
  const { data = { count: 0, results: [], numPages: 1 }, isLoading } = useDetailAssessmentsData(courseId ?? '', {
    page,
    pageSize: DETAILS_PAGE_SIZE
  });

  const tableColumns = [
    { accessor: 'unitName', Header: intl.formatMessage(messages.unitName) },
    { accessor: 'displayName', Header: intl.formatMessage(messages.assessment) },
    { accessor: 'totalResponses', Header: intl.formatMessage(messages.totalResponses) },
    { accessor: 'training', Header: intl.formatMessage(messages.training) },
    { accessor: 'peer', Header: intl.formatMessage(messages.peer) },
    { accessor: 'self', Header: intl.formatMessage(messages.self) },
    { accessor: 'waiting', Header: intl.formatMessage(messages.waiting) },
    { accessor: 'staff', Header: intl.formatMessage(messages.staff) },
    { accessor: 'finalGradeReceived', Header: intl.formatMessage(messages.finalGradeReceived) },
  ];

  const additionalColumns = [
    {
      id: 'staffOraGradingUrl',
      Header: intl.formatMessage(messages.staffGrader),
      Cell: ({ row }: { row: { original: ORARecord } }) => row.original.staffOraGradingUrl && <Button variant="link" size="inline" href={row.original.staffOraGradingUrl}>{intl.formatMessage(messages.viewAndGradeResponses)}</Button>,
    }
  ];

  const handleFetchData = (data: DataTableFetchDataProps) => {
    setPage(data.pageIndex);
  };

  return (
    <div className="mt-4.5">
      <h3 className="text-primary-700 mb-3">{intl.formatMessage(messages.details)}</h3>
      <DataTable
        columns={tableColumns}
        additionalColumns={additionalColumns}
        data={data.results}
        fetchData={handleFetchData}
        initialState={{
          pageIndex: page,
          pageSize: DETAILS_PAGE_SIZE
        }}
        isLoading={isLoading}
        isPaginated
        itemCount={data.count}
        manualFilters
        manualPagination
        pageCount={data.numPages}
        pageSize={DETAILS_PAGE_SIZE}
      >
        <DataTable.Table />
        <DataTable.EmptyTable content={intl.formatMessage(messages.noAssessmentsFoundMessage)} />
        <DataTable.TableFooter />
      </DataTable>
    </div>
  );
};

export default DetailAssessmentsList;
