import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { FormControl, Icon } from '@openedx/paragon';
import { FilterList } from '@openedx/paragon/icons';
import { useRoles } from '@src/courseTeam/data/apiHook';
import messages from '@src/courseTeam/messages';
import { Role } from '@src/courseTeam/types';

const RoleFilter = ({ column: { filterValue, setFilter } }: { column: { filterValue: string; setFilter: (value: string) => void } }) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { data } = useRoles(courseId);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  const roles = useMemo(() => {
    return [{ value: '', label: intl.formatMessage(messages.allRoles) }, ...(data?.results || []).map((role: Role) => ({ value: role.role, label: role.displayName }))];
  }, [data, intl]);

  return (
    <FormControl
      as="select"
      className="mb-0"
      disabled={!data}
      name="role"
      size="md"
      value={filterValue}
      onChange={handleSelectChange}
      leadingElement={<Icon src={FilterList} />}
    >
      {roles.map(role => (
        <option key={role.value} value={role.value}>
          {role.label}
        </option>
      ))}
    </FormControl>
  );
};

export default RoleFilter;
