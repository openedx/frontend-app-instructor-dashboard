import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { Button, DataTable } from '@openedx/paragon';
import UsernameFilter from '@src/components/UsernameFilter';
import RoleFilter from '@src/courseTeam/components/RoleFilter';
import { useTeamMembers } from '@src/courseTeam/data/apiHook';
import messages from '@src/courseTeam/messages';
import { CourseTeamMember, Role } from '@src/courseTeam/types';
import { DataTableFetchDataProps } from '@src/types';

const TEAM_MEMBERS_PAGE_SIZE = 25;

interface MembersContentProps {
  onEdit: (user: CourseTeamMember) => void;
}

const MembersContent = ({ onEdit }: MembersContentProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const [filters, setFilters] = useState({ page: 0, emailOrUsername: '', role: '' });
  const { data: { results: teamMembers = [], numPages = 1, count = 0 } = {}, isLoading = false } = useTeamMembers(courseId, { ...filters, pageSize: TEAM_MEMBERS_PAGE_SIZE });

  const tableColumns = useMemo(() => [
    { accessor: 'username', Header: intl.formatMessage(messages.username), Filter: UsernameFilter },
    { accessor: 'email', Header: intl.formatMessage(messages.email), disableFilters: true },
    { accessor: 'roles', Header: intl.formatMessage(messages.role), Cell: ({ cell: { value } }: { cell: { value: Role[] } }) => value.map(role => role.displayName).join(', '), Filter: RoleFilter },
  ], [intl]);

  const additionalColumns = useMemo(() => [{
    id: 'actions',
    Header: intl.formatMessage(messages.actions),
    Cell: ({ row }: { row: { original: any } }) => (
      <Button variant="link" size="inline" onClick={() => onEdit(row.original)}>
        {intl.formatMessage(messages.edit)}
      </Button>
    )
  }], [intl, onEdit]);

  const handleFetchData = (data: DataTableFetchDataProps) => {
    const usernameFilter = data.filters?.find((f) => f.id === 'username');
    const newEmailOrUsername = usernameFilter ? usernameFilter.value : '';
    const rolesFilter = data.filters?.find((f) => f.id === 'roles');
    const newRole = rolesFilter ? rolesFilter.value : '';
    const filtersChanged = (newEmailOrUsername !== filters.emailOrUsername) || (newRole !== filters.role);

    if (filtersChanged) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        emailOrUsername: newEmailOrUsername,
        role: newRole,
        page: 0,
      }));
      return;
    }

    if (data.pageIndex !== filters.page) {
      setFilters((prevFilters) => ({ ...prevFilters, page: data.pageIndex }));
    }
  };

  const tableState = useMemo(() => ({
    pageIndex: filters.page,
    pageSize: TEAM_MEMBERS_PAGE_SIZE,
  }), [filters.page]);

  return (
    <DataTable
      additionalColumns={additionalColumns}
      columns={tableColumns}
      data={teamMembers}
      fetchData={handleFetchData}
      state={tableState}
      isFilterable
      isLoading={isLoading}
      isPaginated
      itemCount={count}
      manualFilters
      manualPagination
      numBreakoutFilters={2}
      pageSize={TEAM_MEMBERS_PAGE_SIZE}
      pageCount={numPages}
      RowStatusComponent={() => null}
    >
      <DataTable.TableControlBar />
      <DataTable.Table />
      <DataTable.EmptyTable content={intl.formatMessage(messages.noTeamMembers)} />
      <DataTable.TableFooter />
    </DataTable>
  );
};

export default MembersContent;
