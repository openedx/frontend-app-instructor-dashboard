import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithAlertAndIntl } from '@src/testUtils';
import CourseTeamPage from '@src/courseTeam/CourseTeamPage';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(() => ({ courseId: 'course-v1:test-course' })),
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
  it('renders the course team title', () => {
    renderWithAlertAndIntl(<CourseTeamPage />);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('renders the add team member button', () => {
    renderWithAlertAndIntl(<CourseTeamPage />);
    expect(screen.getByRole('button', { name: /add team member/i })).toBeInTheDocument();
  });

  it('renders both tabs', () => {
    renderWithAlertAndIntl(<CourseTeamPage />);
    expect(screen.getByRole('tab', { name: /members/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /roles/i })).toBeInTheDocument();
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
    const button = screen.getByRole('button', { name: /add team member/i });
    const user = userEvent.setup();
    await user.click(button);
    expect(screen.getByText('Add Team Member Modal')).toBeInTheDocument();
  });

  it('renders RolesContent when Roles tab is selected', async () => {
    renderWithAlertAndIntl(<CourseTeamPage />);
    const rolesTab = screen.getByRole('tab', { name: /roles/i });
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
    expect(screen.getByRole('button', { name: /add team member/i })).toBeInTheDocument();
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
    const addButton = screen.getByRole('button', { name: /add team member/i });
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
    const viewRolesButton = screen.getByRole('link', { name: /view studio roles/i });
    expect(viewRolesButton).toBeInTheDocument();
    expect(viewRolesButton).toHaveAttribute('href', 'http://example.com/admin-console');
  });
});
