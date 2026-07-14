import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EnrollmentsPage from './EnrollmentsPage';
import { EnrolledLearner } from '@src/enrollments/types';
import messages from '@src/enrollments/messages';
import { useEnrollmentByUserId, useEnrollments, useUpdateBetaTesters, useUpdateEnrollments } from '@src/enrollments/data/apiHook';
import { renderWithAlertAndIntl } from '@src/testUtils';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'test-course-id' }),
}));

// The enrollment action buttons live in a slot (default widget covered by EnrollmentActionsSlot.test.tsx).
// Stub the slot to render buttons wired to the handlers the page passes in, so the page's modal
// open/close wiring is exercised here.
jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  Slot: ({ onEnrollLearners, onAddBetaTesters }: { onEnrollLearners: () => void, onAddBetaTesters: () => void }) => (
    <div data-testid="enrollment-actions-slot">
      <button type="button" onClick={onAddBetaTesters}>slot-add-beta-testers</button>
      <button type="button" onClick={onEnrollLearners}>slot-enroll-learners</button>
    </div>
  ),
}));

// Stub the action modals; their internals are covered by their own test files. Each stub exposes a
// close control so the page's onClose handlers are exercised.
jest.mock('./components/EnrollLearnersModal', () => {
  const MockEnrollLearnersModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
    isOpen ? <div role="dialog"><button type="button" onClick={onClose}>close-enroll-learners</button></div> : null
  );
  return MockEnrollLearnersModal;
});
jest.mock('./components/AddBetaTestersModal', () => {
  const MockAddBetaTestersModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
    isOpen ? <div role="dialog"><button type="button" onClick={onClose}>close-add-beta-testers</button></div> : null
  );
  return MockAddBetaTestersModal;
});

jest.mock('./data/apiHook', () => ({
  useEnrollments: jest.fn(),
  useEnrollmentByUserId: jest.fn(),
  useUpdateEnrollments: jest.fn(),
  useUpdateBetaTesters: jest.fn(),
}));

jest.mock('@src/data/apiHook', () => ({
  useCourseInfo: () => ({ data: { permissions: { admin: true, instructor: true, dataResearcher: false } } }),
}));

jest.mock('./components/EnrollmentsList', () => {
  return function MockEnrollmentsList({ onUnenroll }: { onUnenroll: (learner: EnrolledLearner) => void }) {
    return (
      <div role="table">
        <button onClick={() => onUnenroll({
          fullName: 'Tester',
          email: 'test@example.com',
          username: '',
          mode: '',
          isBetaTester: false
        })}
        >
          Unenroll Test Learner
        </button>
      </div>
    );
  };
});

describe('EnrollmentsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useEnrollments as jest.Mock).mockReturnValue({
      data: { count: 1, numPages: 1, results: [{ username: 'testuser', fullName: 'Test User', email: 'test@example.com', mode: 'audit', isBetaTester: false }] },
      isLoading: false,
    });
    (useEnrollmentByUserId as jest.Mock).mockReturnValue({
      data: { enrollmentStatus: 'enrolled' },
      refetch: jest.fn(),
    });
    (useUpdateEnrollments as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isLoading: false,
      error: null,
    });
    (useUpdateBetaTesters as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isLoading: false,
      error: null,
    });
  });

  it('renders the page title', () => {
    renderWithAlertAndIntl(<EnrollmentsPage />);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('renders the check enrollment status action and the enrollment actions slot', () => {
    renderWithAlertAndIntl(<EnrollmentsPage />);
    expect(screen.getByRole('button', { name: messages.checkEnrollmentStatus.defaultMessage })).toBeInTheDocument();
    expect(screen.getByTestId('enrollment-actions-slot')).toBeInTheDocument();
  });

  it('renders EnrollmentsList component', () => {
    renderWithAlertAndIntl(<EnrollmentsPage />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('opens enrollment status modal when more button is clicked', async () => {
    renderWithAlertAndIntl(<EnrollmentsPage />);

    const moreButton = screen.getByRole('button', { name: messages.checkEnrollmentStatus.defaultMessage });
    const user = userEvent.setup();
    await user.click(moreButton);

    // Verify popup menu is opened
    const checkEnrollmentStatusOption = screen.getByText(messages.checkEnrollmentStatus.defaultMessage);
    expect(checkEnrollmentStatusOption).toBeInTheDocument();
    await user.click(checkEnrollmentStatusOption);

    // Verify dialog is opened and popup is closed
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(checkEnrollmentStatusOption).not.toHaveClass('show');
  });

  it('closes enrollment status modal', async () => {
    renderWithAlertAndIntl(<EnrollmentsPage />);

    // Open the popup menu first
    const moreButton = screen.getByRole('button', { name: messages.checkEnrollmentStatus.defaultMessage });
    const user = userEvent.setup();
    await user.click(moreButton);

    // Click on the "Check Enrollment Status" option to open the dialog
    const checkEnrollmentStatusOption = screen.getByText(messages.checkEnrollmentStatus.defaultMessage);
    await user.click(checkEnrollmentStatusOption);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Close the dialog
    const closeButton = screen.getByText('Close');
    await user.click(closeButton);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens unenroll modal when unenroll is triggered', async () => {
    renderWithAlertAndIntl(<EnrollmentsPage />);

    const unenrollButton = screen.getByText('Unenroll Test Learner');
    const user = userEvent.setup();
    await user.click(unenrollButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/Tester/)).toBeInTheDocument();
  });

  it('closes unenroll modal and clears selected learner', async () => {
    renderWithAlertAndIntl(<EnrollmentsPage />);

    const unenrollButton = screen.getByText('Unenroll Test Learner');
    const user = userEvent.setup();
    await user.click(unenrollButton);

    const closeUnenrollButton = screen.getByText('Cancel');
    await user.click(closeUnenrollButton);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens and closes the Enroll Learners modal via the slot handler', async () => {
    renderWithAlertAndIntl(<EnrollmentsPage />);
    const user = userEvent.setup();

    await user.click(screen.getByText('slot-enroll-learners'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByText('close-enroll-learners'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens and closes the Add Beta Testers modal via the slot handler', async () => {
    renderWithAlertAndIntl(<EnrollmentsPage />);
    const user = userEvent.setup();

    await user.click(screen.getByText('slot-add-beta-testers'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByText('close-add-beta-testers'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('modals are closed by default', () => {
    renderWithAlertAndIntl(<EnrollmentsPage />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
