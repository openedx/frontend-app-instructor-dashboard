import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithAlertAndIntl } from '@src/testUtils';
import AddTeamMemberModal from '@src/courseTeam/components/AddTeamMemberModal';
import { useAddTeamMember, useRoles } from '@src/courseTeam/data/apiHook';
import messages from '@src/courseTeam/messages';
import { useDebouncedFilter } from '@src/hooks/useDebouncedFilter';
import { useAlert } from '@src/providers/AlertProvider';
import { TEAM_MEMBER_ACTION } from '../constants';

// Mocks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'course-v1:test+id' }),
}));

jest.mock('@src/data/apiHook', () => ({
  useCourseInfo: () => ({ data: { displayName: 'Test Course' } }),
}));

jest.mock('../data/apiHook', () => ({
  useRoles: jest.fn(),
  useAddTeamMember: jest.fn(),
}));

jest.mock('@src/hooks/useDebouncedFilter', () => ({
  useDebouncedFilter: jest.fn(),
}));

jest.mock('@src/providers/AlertProvider', () => ({
  ...jest.requireActual('@src/providers/AlertProvider'),
  useAlert: jest.fn(),
}));

describe('AddTeamMemberModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
  };
  const mutateMock = jest.fn();
  const showModalMock = jest.fn();
  const addAlertMock = jest.fn();
  const handleChangeMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRoles as jest.Mock).mockReturnValue({ data: { results: [{ role: 'admin', displayName: 'Admin' }] } });
    (useAddTeamMember as jest.Mock).mockReturnValue({ mutate: mutateMock });
    (useAlert as jest.Mock).mockReturnValue({ showModal: showModalMock, addAlert: addAlertMock });
    (useDebouncedFilter as jest.Mock).mockReturnValue({
      inputValue: '',
      handleChange: handleChangeMock
    });
  });

  it('renders modal with correct title and description', () => {
    renderWithAlertAndIntl(<AddTeamMemberModal {...defaultProps} />);
    expect(screen.getByText(messages.addNewTeamMember.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.addNewTeamMemberDescription.defaultMessage.replace('{courseName}', 'Test Course'))).toBeInTheDocument();
  });

  it('renders users textarea and role select', () => {
    renderWithAlertAndIntl(<AddTeamMemberModal {...defaultProps} />);
    expect(screen.getByLabelText(messages.addUsersLabel.defaultMessage)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(messages.usersPlaceholder.defaultMessage)).toBeInTheDocument();
    expect(screen.getByLabelText(messages.roleLabel.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.rolePlaceholder.defaultMessage)).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', async () => {
    renderWithAlertAndIntl(<AddTeamMemberModal {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByText(messages.cancelButton.defaultMessage));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('does not render modal when isOpen is false', () => {
    renderWithAlertAndIntl(<AddTeamMemberModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText(messages.addNewTeamMember.defaultMessage)).not.toBeInTheDocument();
  });

  it('disables role select when only placeholder role exists', () => {
    (useRoles as jest.Mock).mockReturnValue({ data: { results: [] } });
    renderWithAlertAndIntl(<AddTeamMemberModal {...defaultProps} />);
    expect(screen.getByLabelText(messages.roleLabel.defaultMessage)).toBeInTheDocument();
    expect(screen.getByRole('option', { name: messages.rolePlaceholder.defaultMessage })).toBeDisabled();
  });

  it('calls mutate with correct data when Save button is clicked', async () => {
    (useDebouncedFilter as jest.Mock).mockReturnValue({
      inputValue: 'user1, user2',
      handleChange: handleChangeMock
    });

    renderWithAlertAndIntl(<AddTeamMemberModal {...defaultProps} />);

    const user = userEvent.setup();
    await user.selectOptions(screen.getByLabelText(messages.roleLabel.defaultMessage), 'admin');
    await user.click(screen.getByText(messages.saveButton.defaultMessage));

    expect(mutateMock).toHaveBeenCalledWith(
      { identifiers: ['user1', 'user2'], role: 'admin', action: TEAM_MEMBER_ACTION.ALLOW },
      expect.any(Object)
    );
  });

  it('calls useDebouncedFilter handleChange when textarea value changes', async () => {
    renderWithAlertAndIntl(<AddTeamMemberModal {...defaultProps} />);
    const user = userEvent.setup();

    const textarea = screen.getByPlaceholderText(messages.usersPlaceholder.defaultMessage);
    await user.type(textarea, 'new user');

    expect(handleChangeMock).toHaveBeenCalled();
  });

  it('disables Save button when no role is selected', () => {
    (useDebouncedFilter as jest.Mock).mockReturnValue({
      inputValue: 'user1',
      handleChange: handleChangeMock
    });

    renderWithAlertAndIntl(<AddTeamMemberModal {...defaultProps} />);

    const saveButton = screen.getByText(messages.saveButton.defaultMessage);
    expect(saveButton).toBeDisabled();
  });

  it('disables Save button when no users are entered', () => {
    renderWithAlertAndIntl(<AddTeamMemberModal {...defaultProps} />);

    const saveButton = screen.getByText(messages.saveButton.defaultMessage);
    expect(saveButton).toBeDisabled();
  });

  it('enables Save button when both role and users are provided', async () => {
    (useDebouncedFilter as jest.Mock).mockReturnValue({
      inputValue: 'user1',
      handleChange: handleChangeMock
    });

    renderWithAlertAndIntl(<AddTeamMemberModal {...defaultProps} />);
    const user = userEvent.setup();

    await user.selectOptions(screen.getByLabelText(messages.roleLabel.defaultMessage), 'admin');

    const saveButton = screen.getByText(messages.saveButton.defaultMessage);
    expect(saveButton).toBeEnabled();
  });

  it('resets form and closes modal on successful save', async () => {
    (useDebouncedFilter as jest.Mock).mockReturnValue({
      inputValue: 'user1',
      handleChange: handleChangeMock
    });

    renderWithAlertAndIntl(<AddTeamMemberModal {...defaultProps} />);
    const user = userEvent.setup();

    await user.selectOptions(screen.getByLabelText(messages.roleLabel.defaultMessage), 'admin');
    await user.click(screen.getByText(messages.saveButton.defaultMessage));

    // Get the onSuccess callback from the mutate call
    const mutateCall = mutateMock.mock.calls[0];
    const options = mutateCall[1];

    // Trigger onSuccess
    options.onSuccess({ results: [] });

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('alerts separately for missing, inactive, and errored identifiers', async () => {
    (useDebouncedFilter as jest.Mock).mockReturnValue({
      inputValue: 'valid, missing, inactive, broken',
      handleChange: handleChangeMock
    });

    renderWithAlertAndIntl(<AddTeamMemberModal {...defaultProps} />);
    const user = userEvent.setup();

    await user.selectOptions(screen.getByLabelText(messages.roleLabel.defaultMessage), 'admin');
    await user.click(screen.getByText(messages.saveButton.defaultMessage));

    const options = mutateMock.mock.calls[0][1];
    options.onSuccess({
      results: [
        { identifier: 'valid', error: false, userDoesNotExist: false, isActive: true },
        { identifier: 'missing', error: true, userDoesNotExist: true, isActive: null },
        { identifier: 'inactive', error: true, userDoesNotExist: false, isActive: false },
        { identifier: 'broken', error: true, userDoesNotExist: false, isActive: true },
      ]
    });

    expect(addAlertMock).toHaveBeenCalledWith({
      type: 'danger',
      message: messages.failedToAddTeamMembers.defaultMessage,
      extraContent: expect.any(Array),
    });
    expect(addAlertMock).toHaveBeenCalledWith({
      type: 'danger',
      message: messages.inactiveTeamMembers.defaultMessage,
      extraContent: expect.any(Array),
    });
    expect(addAlertMock).toHaveBeenCalledWith({
      type: 'danger',
      message: messages.erroredTeamMembers.defaultMessage,
      extraContent: expect.any(Array),
    });
    expect(addAlertMock).toHaveBeenCalledTimes(3);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('does not alert when every identifier succeeds', async () => {
    (useDebouncedFilter as jest.Mock).mockReturnValue({
      inputValue: 'user1',
      handleChange: handleChangeMock
    });

    renderWithAlertAndIntl(<AddTeamMemberModal {...defaultProps} />);
    const user = userEvent.setup();

    await user.selectOptions(screen.getByLabelText(messages.roleLabel.defaultMessage), 'admin');
    await user.click(screen.getByText(messages.saveButton.defaultMessage));

    const options = mutateMock.mock.calls[0][1];
    options.onSuccess({
      results: [{ identifier: 'user1', error: false, userDoesNotExist: false, isActive: true }]
    });

    expect(addAlertMock).not.toHaveBeenCalled();
  });

  it('shows error modal on save failure', async () => {
    (useDebouncedFilter as jest.Mock).mockReturnValue({
      inputValue: 'user1',
      handleChange: handleChangeMock
    });

    renderWithAlertAndIntl(<AddTeamMemberModal {...defaultProps} />);
    const user = userEvent.setup();

    await user.selectOptions(screen.getByLabelText(messages.roleLabel.defaultMessage), 'admin');
    await user.click(screen.getByText(messages.saveButton.defaultMessage));

    // Get the onError callback from the mutate call
    const mutateCall = mutateMock.mock.calls[0];
    const options = mutateCall[1];

    // Trigger onError
    options.onError();

    expect(showModalMock).toHaveBeenCalledWith({
      message: messages.addTeamMemberError.defaultMessage,
      variant: 'danger',
      confirmText: messages.closeButton.defaultMessage,
    });
  });

  it('processes user identifiers correctly by trimming and filtering empty values', async () => {
    (useDebouncedFilter as jest.Mock).mockReturnValue({
      inputValue: ' user1 ,  user2  , , user3 ',
      handleChange: handleChangeMock
    });

    renderWithAlertAndIntl(<AddTeamMemberModal {...defaultProps} />);
    const user = userEvent.setup();

    await user.selectOptions(screen.getByLabelText(messages.roleLabel.defaultMessage), 'admin');
    await user.click(screen.getByText(messages.saveButton.defaultMessage));

    expect(mutateMock).toHaveBeenCalledWith(
      { identifiers: ['user1', 'user2', 'user3'], role: 'admin', action: TEAM_MEMBER_ACTION.ALLOW },
      expect.any(Object)
    );
  });

  it('handles empty user list after filtering', async () => {
    (useDebouncedFilter as jest.Mock).mockReturnValue({
      inputValue: ' , , ',
      handleChange: handleChangeMock
    });

    renderWithAlertAndIntl(<AddTeamMemberModal {...defaultProps} />);
    const user = userEvent.setup();

    await user.selectOptions(screen.getByLabelText(messages.roleLabel.defaultMessage), 'admin');
    await user.click(screen.getByText(messages.saveButton.defaultMessage));

    expect(mutateMock).toHaveBeenCalledWith(
      { identifiers: [], role: 'admin', action: TEAM_MEMBER_ACTION.ALLOW },
      expect.any(Object)
    );
  });

  it('renders role placeholder as first option', () => {
    renderWithAlertAndIntl(<AddTeamMemberModal {...defaultProps} />);

    const select = screen.getByLabelText(messages.roleLabel.defaultMessage);
    const options = select.querySelectorAll('option');

    expect(options[0]).toHaveValue('');
    expect(options[0]).toHaveTextContent(messages.rolePlaceholder.defaultMessage);
  });

  it('updates selected role when role select changes', async () => {
    (useDebouncedFilter as jest.Mock).mockReturnValue({
      inputValue: 'user1',
      handleChange: handleChangeMock
    });

    renderWithAlertAndIntl(<AddTeamMemberModal {...defaultProps} />);
    const user = userEvent.setup();

    const roleSelect = screen.getByLabelText(messages.roleLabel.defaultMessage);
    await user.selectOptions(roleSelect, 'admin');

    // Verify the Save button becomes enabled after role selection
    const saveButton = screen.getByText(messages.saveButton.defaultMessage);
    expect(saveButton).toBeEnabled();
  });
});
