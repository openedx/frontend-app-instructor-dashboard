import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { ActionRow, Button, Form, FormControl, FormLabel, ModalDialog, OverlayTrigger, Tooltip } from '@openedx/paragon';
import { useAddTeamMember, useRemoveTeamMember, useRoles } from '@src/courseTeam/data/apiHook';
import messages from '@src/courseTeam/messages';
import { CourseTeamMember, Role } from '@src/courseTeam/types';
import { useAlert } from '@src/providers/AlertProvider';
import { TEAM_MEMBER_ACTION } from '../constants';
import { useCourseInfo } from '@src/data/apiHook';

interface EditTeamMemberModalProps {
  isOpen: boolean;
  user: CourseTeamMember;
  onClose: () => void;
}

const EditTeamMemberModal = ({ isOpen, user, onClose }: EditTeamMemberModalProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const [selectedRole, setSelectedRole] = useState('');
  const [keepRoles, setKeepRoles] = useState<string[]>([]);
  const { mutate: addTeamMember, isPending: isAdding } = useAddTeamMember(courseId);
  const { mutate: removeTeamMember, isPending: isRemoving } = useRemoveTeamMember(courseId);
  const { showModal } = useAlert();

  const { data: { results } = { results: [] } } = useRoles(courseId, true);

  const { data } = useCourseInfo(courseId);
  const { username: currentUser } = data || {};

  useEffect(() => {
    if (isOpen) {
      setKeepRoles(user.roles.map(role => role.role));
      setSelectedRole('');
    }
  }, [isOpen, user]);

  const filteredRoles = results?.filter(role => !user.roles.some(userRole => userRole.role === role.role)) || [];

  const roles = [{ role: '', displayName: intl.formatMessage(messages.rolePlaceholder) }, ...filteredRoles];

  const handleToggleRole = (roleName: string) => {
    if (keepRoles.includes(roleName)) {
      setKeepRoles(keepRoles.filter(role => role !== roleName));
    } else {
      setKeepRoles([...keepRoles, roleName]);
    }
  };

  const handleSave = () => {
    const rolesToRemove = user.roles.filter(role => !keepRoles.includes(role.role)).map(role => role.role);
    const hasRolesToAdd = selectedRole;
    const hasRolesToRemove = rolesToRemove.length > 0;

    // Sequential approach: remove roles first, then add new role
    if (hasRolesToRemove) {
      removeTeamMember({ identifier: user.username, roles: rolesToRemove }, {
        onSuccess: () => {
          // After successful removal, add new role if needed
          if (hasRolesToAdd) {
            addTeamMember({ identifiers: [user.username], role: selectedRole, action: TEAM_MEMBER_ACTION.ALLOW }, {
              onSuccess: () => {
                onClose();
              },
              onError: () => {
                showModal({
                  message: intl.formatMessage(messages.addRoleError),
                  variant: 'danger',
                  confirmText: intl.formatMessage(messages.closeButton),
                });
              }
            });
          } else {
            onClose();
          }
        },
        onError: () => {
          showModal({
            message: intl.formatMessage(messages.removeTeamMemberError, { username: user.username }),
            variant: 'danger',
            confirmText: intl.formatMessage(messages.closeButton),
          });
        }
      });
    } else if (hasRolesToAdd) {
      // Only add operation needed
      addTeamMember({ identifiers: [user.username], role: selectedRole, action: TEAM_MEMBER_ACTION.ALLOW }, {
        onSuccess: () => {
          onClose();
        },
        onError: () => {
          showModal({
            message: intl.formatMessage(messages.addRoleError),
            variant: 'danger',
            confirmText: intl.formatMessage(messages.closeButton),
          });
        }
      });
    }
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      title={intl.formatMessage(messages.editTeamTitle, { username: user.username })}
      onClose={onClose}
      isOverflowVisible={false}
    >
      <ModalDialog.Header className="border-light-700 border-bottom">
        <h3 className="text-primary-500">{intl.formatMessage(messages.editTeamTitle, { username: user.username })}</h3>
      </ModalDialog.Header>
      <ModalDialog.Body className="position-relative overflow-auto">
        <p>{intl.formatMessage(messages.editInstructions, { username: user.username })}</p>
        <Form.CheckboxSet onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleToggleRole(e.target.value)} value={keepRoles} name="keepRoles">
          {
            (user.roles || [])
              .map((role: Role) => {
                // Disable roles that user is not available to edit based on his current role
                // Also Admins cannot remove their own Admin role
                // Discussion Admins cannot remove their own Discussion Admins role, unless they have Admin role as well
                const isDiscussionAdminWithoutAdminRole = currentUser === user.username && role.role === 'Administrator' && !user.roles.some(r => r.role === 'instructor');
                const isOwnAdminRole = currentUser === user.username && role.role === 'instructor';
                const isEditAvailable = results?.some(availableRole => availableRole.role === role.role) && !isOwnAdminRole && !isDiscussionAdminWithoutAdminRole;
                return (
                  isEditAvailable ? (
                    <Form.Checkbox className="mt-2" key={role.role} value={role.role}>
                      {role.displayName}
                    </Form.Checkbox>
                  ) : (
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-${role.role}`} className="info-tooltip">{isOwnAdminRole || isDiscussionAdminWithoutAdminRole ? intl.formatMessage(messages.cannotRemoveOwnRole) : intl.formatMessage(messages.roleNotEditable)}</Tooltip>
                      }
                    >
                      <Form.Checkbox className="mt-2" key={role.role} value={role.role} disabled>
                        {role.displayName}
                      </Form.Checkbox>
                    </OverlayTrigger>
                  )
                );
              })
          }
        </Form.CheckboxSet>
        <FormLabel className="mt-4">{intl.formatMessage(messages.addRole)}</FormLabel>
        <FormControl
          as="select"
          disabled={roles.length === 1}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedRole(e.target.value)}
          value={selectedRole}
        >
          {
            roles.map((role) => (
              <option key={role.role} value={role.role}>
                {role.displayName}
              </option>
            ))
          }
        </FormControl>
      </ModalDialog.Body>
      <ModalDialog.Footer className="border-light-700 border-top">
        <ActionRow>
          <Button variant="tertiary" onClick={onClose}>{intl.formatMessage(messages.cancelButton)}</Button>
          <Button variant="primary" onClick={handleSave} disabled={isAdding || isRemoving || (keepRoles.length === user.roles.length && !selectedRole)}>
            {intl.formatMessage(messages.saveButton)}
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default EditTeamMemberModal;
