import { useIntl } from '@openedx/frontend-base';
import { Collapsible, DataTable, Icon, Skeleton } from '@openedx/paragon';
import { useMemo } from 'react';
import messages from './messages';
import { ExpandLess, ExpandMore } from '@openedx/paragon/icons';
import { usePendingTasks } from '@src/data/apiHook';
import { useParams } from 'react-router';
import { ObjectCell } from './ObjectCell';
import { PendingTask, TableCellValue } from '@src/types';

interface PendingTasksProps {
  isPolling?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

const PendingTasks = ({ isPolling = false, isOpen = false, onToggle }: PendingTasksProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams();
  const { data: tasks, isLoading } = usePendingTasks(courseId, { enablePolling: isPolling });

  const tableColumns = useMemo(() => [
    { accessor: 'taskType', Header: intl.formatMessage(messages.taskTypeColumnName) },
    { accessor: 'taskInput', Header: intl.formatMessage(messages.taskInputColumnName), Cell: ({ row }: TableCellValue<PendingTask>) => <ObjectCell value={row.original.taskInput} /> },
    { accessor: 'taskId', Header: intl.formatMessage(messages.taskIdColumnName) },
    { accessor: 'requester', Header: intl.formatMessage(messages.requesterColumnName) },
    { accessor: 'taskState', Header: intl.formatMessage(messages.taskStateColumnName) },
    { accessor: 'created', Header: intl.formatMessage(messages.createdColumnName) },
    { accessor: 'taskOutput', Header: intl.formatMessage(messages.taskOutputColumnName), Cell: ({ row }: TableCellValue<PendingTask>) => <ObjectCell value={row.original.taskOutput} /> },
    { accessor: 'durationSec', Header: intl.formatMessage(messages.durationColumnName) },
    { accessor: 'status', Header: intl.formatMessage(messages.statusColumnName) },
    { accessor: 'taskMessage', Header: intl.formatMessage(messages.taskMessageColumnName) },
  ], [intl]);

  const renderContent = () => {
    if (isLoading) {
      return <Skeleton count={3} />;
    }

    if (!tasks || tasks?.length === 0) {
      return <div className="my-3">{intl.formatMessage(messages.noTasksMessage)}</div>;
    }

    return (
      <DataTable
        columns={tableColumns}
        data={tasks}
        RowStatusComponent={() => null}
      />
    );
  };

  const collapsibleProps = onToggle ? { open: isOpen, onToggle } : {};

  return (
    <Collapsible.Advanced
      className="mt-4 pt-4 border-top"
      styling="basic"
      {...collapsibleProps}
    >
      <Collapsible.Trigger
        className="collapsible-trigger d-flex border-0 align-items-center text-decoration-none"
      >
        <div className="d-flex">
          <h3 className="text-primary-700">{intl.formatMessage(messages.pendingTasksTitle)}</h3>
        </div>

        <Collapsible.Visible whenClosed>
          <div className="pl-2 d-flex">
            <Icon className="text-primary-500" src={ExpandMore} />
          </div>
        </Collapsible.Visible>
        <Collapsible.Visible whenOpen>
          <div className="pl-2 d-flex">
            <Icon className="text-primary-500" src={ExpandLess} />
          </div>
        </Collapsible.Visible>
      </Collapsible.Trigger>
      <Collapsible.Body>
        {renderContent() }
      </Collapsible.Body>
    </Collapsible.Advanced>
  );
};

export { PendingTasks };
