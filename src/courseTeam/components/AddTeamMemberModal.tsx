import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { ActionRow, Button, Form, ModalDialog } from '@openedx/paragon';
import { useAddTeamMember, useRoles } from '@src/courseTeam/data/apiHook';
import messages from '@src/courseTeam/messages';
import { useCourseInfo } from '@src/data/apiHook';
import { useDebouncedFilter } from '@src/hooks/useDebouncedFilter';
import { useAlert } from '@src/providers/AlertProvider';
import { TEAM_MEMBER_ACTION } from '../constants';

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTeamMemberModal = ({
  isOpen,
  onClose,
}: AddTeamMemberModalProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { data: { displayName } = { displayName: '' } } = useCourseInfo(courseId);
  const { data: { results } = { results: [] } } = useRoles(courseId);
  const [users, setUsers] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const { inputValue, handleChange } = useDebouncedFilter({
    filterValue: users,
    setFilter: setUsers,
  });
  const { mutate: addTeamMember } = useAddTeamMember(courseId);
  const { addAlert, showModal } = useAlert();

  const roles = [{ role: '', displayName: intl.formatMessage(messages.rolePlaceholder) }, ...(results || [])];

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChange(e.target.value);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value);
  };

  const handleSave = () => {
    const identifiers = inputValue.split(',').map(user => user.trim()).filter(user => user);
    addTeamMember({ identifiers, role: selectedRole, action: TEAM_MEMBER_ACTION.ALLOW }, {
      onSuccess: (data) => {
        const failedUsernames = data.results?.filter(user => user.userDoesNotExist).map(user => user.identifier) || [];
        if (failedUsernames.length > 0) {
          addAlert({
            type: 'danger',
            message: intl.formatMessage(messages.failedToAddTeamMembers),
            extraContent: (
              failedUsernames.map((learner: string) => (
                <p key={learner} className="mb-0">• {intl.formatMessage(messages.unknownLearner, { learner })}</p>
              ))
            )
          });
        }
        setUsers('');
        setSelectedRole('');
        onClose();
      },
      onError: () => {
        showModal({
          message: intl.formatMessage(messages.addTeamMemberError),
          variant: 'danger',
          confirmText: intl.formatMessage(messages.closeButton),
        });
      }
    });
  };

  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title={intl.formatMessage(messages.addNewTeamMember)} isOverflowVisible={false} size="lg">
      <ModalDialog.Header className="border-light-700 border-bottom">
        <h3 className="text-primary-500">{intl.formatMessage(messages.addNewTeamMember)}</h3>
      </ModalDialog.Header>
      <ModalDialog.Body className="position-relative overflow-auto">
        <p>{intl.formatMessage(messages.addNewTeamMemberDescription, { courseName: displayName })}</p>
        <Form.Group>
          <Form.Label>{intl.formatMessage(messages.addUsersLabel)}</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder={intl.formatMessage(messages.usersPlaceholder)} value={inputValue} onChange={handleInputChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>{intl.formatMessage(messages.roleLabel)}</Form.Label>
          <Form.Control as="select" defaultValue="" disabled={roles.length === 1} onChange={handleSelectChange}>
            {
              roles.map((role) => (
                <option key={role.role} value={role.role}>
                  {role.displayName}
                </option>
              ))
            }
          </Form.Control>
        </Form.Group>
      </ModalDialog.Body>
      <ModalDialog.Footer className="border-light-700 border-top">
        <ActionRow>
          <Button variant="tertiary" onClick={onClose}>{intl.formatMessage(messages.cancelButton)}</Button>
          <Button variant="primary" onClick={handleSave} disabled={!selectedRole || !inputValue}>{intl.formatMessage(messages.saveButton)}</Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default AddTeamMemberModal;
