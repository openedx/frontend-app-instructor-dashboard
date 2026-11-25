import { screen } from '@testing-library/react';
import messages from '@src/courseTeam/messages';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { resolveRouteByRole } from '@openedx/frontend-base';
import { renderWithAlertAndIntl } from '@src/testUtils';
import CourseTeamPage from '@src/courseTeam/CourseTeamPage';
import { COURSE_PERMISSIONS } from '@src/permissions';
import { mockCoursePermissions } from '@src/permissions/testUtils';
import accessErrorMessages from '@src/providers/messages';
import permissionMessages from '@src/permissions/messages';

jest.mock('@src/permissions/useCoursePermissions');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(() => ({ courseId: 'course-v1:test-course' })),
}));

jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  resolveRouteByRole: jest.fn(() => null),
}));

jest.mock('@src/courseTeam/data/apiHook', () => ({
  useAddTeamMember: () => ({ mutate: jest.fn() }),
}));

jest.mock('@src/data/apiHook', () => ({
  useCourseInfo: jest.fn(() => ({
    data: {
      adminConsoleUrl: 'http://example.com/admin-console',
    },
  })),
}));

// Mock the child components but allow passing through props
jest.mock('./components/MembersContent', () => {
  return function MembersContent({ onEdit }: { onEdit?: (user: any) => void }) {
    return (
      <div>
        Members Content
        {onEdit && (
          <button onClick={() => onEdit({ username: 'testuser', fullName: 'Test User', email: 'test@example.com', roles: [] })}>
            Edit User
          </button>
        )}
      </div>
    );
  };
});

jest.mock('./components/RolesContent', () => {
  return function RolesContent() {
    return <div>Roles Content</div>;
  };
});

jest.mock('./components/AddTeamMemberModal', () => {
  return function AddTeamMemberModal({ isOpen }: { isOpen?: boolean }) {
    return isOpen ? <div>Add Team Member Modal</div> : null;
  };
});

jest.mock('./components/EditTeamMemberModal', () => {
  return function EditTeamMemberModal({ isOpen, user }: { isOpen?: boolean; user?: any }) {
    return isOpen && user ? <div>Edit Team Member Modal for {user.username}</div> : null;
  };
});

describe('CourseTeamPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCoursePermissions({
      [COURSE_PERMISSIONS.VIEW_COURSE_TEAM]: true,
      [COURSE_PERMISSIONS.MANAGE_COURSE_TEAM]: true,
    });
  });

  it.each([false, true])('withholds team content without view permission, even with manage=%s', canManage => {
    mockCoursePermissions({
      [COURSE_PERMISSIONS.VIEW_COURSE_TEAM]: false,
      [COURSE_PERMISSIONS.MANAGE_COURSE_TEAM]: canManage,
    });
    renderWithAlertAndIntl(<CourseTeamPage />);

    expect(screen.queryByText('Members Content')).not.toBeInTheDocument();
    expect(screen.queryByText('Roles Content')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: messages.addTeamMember.defaultMessage })).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent(accessErrorMessages.forbiddenErrorHeading.defaultMessage);
    expect(screen.queryByText(permissionMessages.viewOnlyAlert.defaultMessage)).not.toBeInTheDocument();
  });

  it('withholds protected content and the view-only explanation while permissions load', () => {
    mockCoursePermissions({}, { isLoading: true });
    const { container } = renderWithAlertAndIntl(<CourseTeamPage />);

    expect(container.querySelector('.react-loading-skeleton.lead')).toBeInTheDocument();
    expect(screen.queryByText('Members Content')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: messages.addTeamMember.defaultMessage })).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows the forbidden fallback when permission validation fails', () => {
    mockCoursePermissions({}, { error: new Error('validate failed') });
    renderWithAlertAndIntl(<CourseTeamPage />);

    expect(screen.getByRole('alert')).toHaveTextContent(accessErrorMessages.forbiddenErrorHeading.defaultMessage);
    expect(screen.queryByText('Members Content')).not.toBeInTheDocument();
  });

  it.each([
    [messages.addTeamMember.defaultMessage, 'Add Team Member Modal'],
    [/edit user/i, 'Edit Team Member Modal for testuser'],
  ])('closes an open %s form after management is revoked, without reopening it on restoration', async (button, modal) => {
    const { rerender } = renderWithAlertAndIntl(<CourseTeamPage />);
    await userEvent.setup().click(screen.getByRole('button', { name: button }));
    expect(screen.getByText(modal)).toBeInTheDocument();

    mockCoursePermissions({ [COURSE_PERMISSIONS.VIEW_COURSE_TEAM]: true });
    rerender(<CourseTeamPage />);
    expect(screen.queryByText(modal)).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();

    mockCoursePermissions({
      [COURSE_PERMISSIONS.VIEW_COURSE_TEAM]: true,
      [COURSE_PERMISSIONS.MANAGE_COURSE_TEAM]: true,
    });
    rerender(<CourseTeamPage />);
    expect(screen.queryByText(modal)).not.toBeInTheDocument();
  });

  it('offers consultation without editing controls to a view-only user', async () => {
    mockCoursePermissions({ [COURSE_PERMISSIONS.VIEW_COURSE_TEAM]: true });
    renderWithAlertAndIntl(<CourseTeamPage />);

    expect(screen.getByText('Members Content')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: messages.addTeamMember.defaultMessage })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /edit user/i })).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent(
      permissionMessages.viewOnlyAlert.defaultMessage,
    );
    const title = screen.getByRole('heading', { name: messages.courseTeamTitle.defaultMessage });
    const alert = screen.getByRole('alert');
    const tabs = screen.getByRole('tablist');
    expect(title.compareDocumentPosition(alert) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(alert.compareDocumentPosition(tabs) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByRole('link', { name: messages.viewStudioRoles.defaultMessage })).toHaveAttribute('href', 'http://example.com/admin-console');

    await userEvent.setup().click(screen.getByRole('tab', { name: messages.rolesTab.defaultMessage }));
    expect(screen.getByText('Roles Content')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent(permissionMessages.viewOnlyAlert.defaultMessage);
  });

  it('renders the course team title', () => {
    renderWithAlertAndIntl(<CourseTeamPage />);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('renders the add team member button', () => {
    renderWithAlertAndIntl(<CourseTeamPage />);
    expect(screen.getByRole('button', { name: messages.addTeamMember.defaultMessage })).toBeInTheDocument();
  });

  it('renders both tabs', () => {
    renderWithAlertAndIntl(<CourseTeamPage />);
    expect(screen.getByRole('tab', { name: messages.membersTab.defaultMessage })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: messages.rolesTab.defaultMessage })).toBeInTheDocument();
  });

  it('renders MembersContent by default', () => {
    renderWithAlertAndIntl(<CourseTeamPage />);
    expect(screen.getByText('Members Content')).toBeInTheDocument();
  });

  it('has correct CSS classes on title', () => {
    renderWithAlertAndIntl(<CourseTeamPage />);
    const title = screen.getByRole('heading', { level: 3 });
    expect(title).toHaveClass('text-primary-700', 'mb-0');
  });

  it('shows the AddTeamMemberModal when add button is clicked', async () => {
    renderWithAlertAndIntl(<CourseTeamPage />);
    const button = screen.getByRole('button', { name: messages.addTeamMember.defaultMessage });
    const user = userEvent.setup();
    await user.click(button);
    expect(screen.getByText('Add Team Member Modal')).toBeInTheDocument();
  });

  it('renders RolesContent when Roles tab is selected', async () => {
    renderWithAlertAndIntl(<CourseTeamPage />);
    const rolesTab = screen.getByRole('tab', { name: messages.rolesTab.defaultMessage });
    const user = userEvent.setup();
    await user.click(rolesTab);
    expect(screen.getByText('Roles Content')).toBeInTheDocument();
  });

  it('opens EditTeamMemberModal when handleEdit is called', async () => {
    renderWithAlertAndIntl(<CourseTeamPage />);

    // Initially, EditTeamMemberModal should not be visible
    expect(screen.queryByText(/Edit Team Member Modal for/)).not.toBeInTheDocument();

    // Click the edit button which triggers handleEdit
    const editButton = screen.getByRole('button', { name: /Edit User/i });
    const user = userEvent.setup();
    await user.click(editButton);

    // Now EditTeamMemberModal should be visible
    expect(screen.getByText('Edit Team Member Modal for testuser')).toBeInTheDocument();
  });

  it('does not render EditTeamMemberModal initially', () => {
    renderWithAlertAndIntl(<CourseTeamPage />);
    expect(screen.queryByText(/Edit Team Member Modal for/)).not.toBeInTheDocument();
  });

  it('initializes with correct state values', () => {
    renderWithAlertAndIntl(<CourseTeamPage />);

    // Verify initial states by checking that EditTeamMemberModal is not rendered
    expect(screen.queryByText(/Edit Team Member Modal for/)).not.toBeInTheDocument();

    // Verify the component renders without crashing and shows expected initial content
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.addTeamMember.defaultMessage })).toBeInTheDocument();
  });

  it('passes onEdit prop to MembersContent', () => {
    renderWithAlertAndIntl(<CourseTeamPage />);
    // The mock MembersContent component renders an edit button that uses onEdit
    expect(screen.getByRole('button', { name: /Edit User/i })).toBeInTheDocument();
  });

  it('sets selected user when handleEdit is called', async () => {
    renderWithAlertAndIntl(<CourseTeamPage />);

    const editButton = screen.getByRole('button', { name: /Edit User/i });
    const user = userEvent.setup();
    await user.click(editButton);

    // Verify the modal shows with the correct user
    expect(screen.getByText('Edit Team Member Modal for testuser')).toBeInTheDocument();
  });

  it('renders both AddTeamMemberModal and EditTeamMemberModal when both are open', async () => {
    renderWithAlertAndIntl(<CourseTeamPage />);

    // Open AddTeamMemberModal
    const addButton = screen.getByRole('button', { name: messages.addTeamMember.defaultMessage });
    const user = userEvent.setup();
    await user.click(addButton);
    expect(screen.getByText('Add Team Member Modal')).toBeInTheDocument();

    // Open EditTeamMemberModal
    const editButton = screen.getByRole('button', { name: /Edit User/i });
    await user.click(editButton);
    expect(screen.getByText('Edit Team Member Modal for testuser')).toBeInTheDocument();

    // Both should be visible
    expect(screen.getByText('Add Team Member Modal')).toBeInTheDocument();
    expect(screen.getByText('Edit Team Member Modal for testuser')).toBeInTheDocument();
  });

  it('manages edit modal state correctly through complete cycle', async () => {
    renderWithAlertAndIntl(<CourseTeamPage />);
    const user = userEvent.setup();

    // Initial state - modal not visible
    expect(screen.queryByText(/Edit Team Member Modal for/)).not.toBeInTheDocument();

    // Open modal by triggering edit
    const editButton = screen.getByRole('button', { name: /Edit User/i });
    await user.click(editButton);

    // Modal should be visible
    expect(screen.getByText('Edit Team Member Modal for testuser')).toBeInTheDocument();
  });

  it('renders view studio roles button with correct URL', () => {
    renderWithAlertAndIntl(<CourseTeamPage />);
    const viewRolesButton = screen.getByRole('link', { name: messages.viewStudioRoles.defaultMessage });
    expect(viewRolesButton).toBeInTheDocument();
    expect(viewRolesButton).toHaveAttribute('href', 'http://example.com/admin-console');
  });

  it('renders an SPA link when the site provides an admin console route', () => {
    (resolveRouteByRole as jest.Mock).mockReturnValueOnce({ url: '/admin-console/authz', isInternal: true });
    renderWithAlertAndIntl(<MemoryRouter><CourseTeamPage /></MemoryRouter>);
    const viewRolesButton = screen.getByRole('link', { name: messages.viewStudioRoles.defaultMessage });
    expect(viewRolesButton).toHaveAttribute('href', '/admin-console/authz');
  });

  it('renders a plain anchor when the admin console route is external', () => {
    (resolveRouteByRole as jest.Mock).mockReturnValueOnce({ url: 'https://other.example.com/admin-console/authz', isInternal: false });
    renderWithAlertAndIntl(<CourseTeamPage />);
    const viewRolesButton = screen.getByRole('link', { name: messages.viewStudioRoles.defaultMessage });
    expect(viewRolesButton).toHaveAttribute('href', 'https://other.example.com/admin-console/authz');
  });
});
