import { useState } from 'react';
import { useIntl } from '@openedx/frontend-base';
import { Button, Tab, Tabs, useToggle } from '@openedx/paragon';
import { Plus, TrendingUp } from '@openedx/paragon/icons';
import AddTeamMemberModal from '@src/courseTeam/components/AddTeamMemberModal';
import EditTeamMemberModal from '@src/courseTeam/components/EditTeamMemberModal';
import MembersContent from '@src/courseTeam/components/MembersContent';
import RolesContent from '@src/courseTeam/components/RolesContent';
import messages from '@src/courseTeam/messages';
import { AlertOutlet } from '@src/providers/AlertProvider';
import { CourseTeamMember } from '@src/courseTeam/types';
import { Link, useParams } from 'react-router-dom';
import { useCourseInfo } from '@src/data/apiHook';
import { resolveRouteByRole } from '@src/utils/routeByRole';

const adminConsoleRole = 'org.openedx.frontend.role.adminConsole';

const CourseTeamPage = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams();
  const [isOpenAddModal, openAddModal, closeAddModal] = useToggle(false);
  const [isOpenEditModal, openEditModal, closeEditModal] = useToggle(false);
  const [selectedUser, setSelectedUser] = useState<CourseTeamMember | null>(null);
  const { data } = useCourseInfo(courseId);
  const { adminConsoleUrl = '' } = data || {};

  // Prefer the admin console route if the running site provides one, so
  // navigation stays within the SPA; otherwise fall back to a full page load
  // of the URL the LMS reports. The LMS URL still gates the button either way,
  // since it is only reported to users with access.
  const adminConsoleRoute = resolveRouteByRole(adminConsoleRole);

  const handleEdit = (user: CourseTeamMember) => {
    setSelectedUser(user);
    openEditModal();
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-primary-700 mb-0">{intl.formatMessage(messages.courseTeamTitle)}</h3>
        <div>
          {adminConsoleUrl && (adminConsoleRoute?.isInternal ? (
            <Button iconBefore={TrendingUp} variant="outline-primary" className="mr-3" as={Link} to={adminConsoleRoute.url}>{intl.formatMessage(messages.viewStudioRoles)}</Button>
          ) : (
            <Button iconBefore={TrendingUp} variant="outline-primary" className="mr-3" as="a" href={adminConsoleRoute?.url ?? adminConsoleUrl}>{intl.formatMessage(messages.viewStudioRoles)}</Button>
          ))}
          <Button iconBefore={Plus} variant="primary" onClick={openAddModal}>{intl.formatMessage(messages.addTeamMember)}</Button>
        </div>
      </div>
      <AlertOutlet />
      <Tabs>
        <Tab eventKey="members" title={intl.formatMessage(messages.membersTab)}>
          <MembersContent onEdit={handleEdit} />
        </Tab>
        <Tab eventKey="roles" title={intl.formatMessage(messages.rolesTab)}>
          <RolesContent />
        </Tab>
      </Tabs>
      {isOpenAddModal && <AddTeamMemberModal isOpen={isOpenAddModal} onClose={closeAddModal} />}
      {isOpenEditModal && selectedUser && <EditTeamMemberModal isOpen={isOpenEditModal} user={selectedUser} onClose={closeEditModal} />}
    </>
  );
};

export default CourseTeamPage;
