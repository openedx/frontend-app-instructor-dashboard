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
  Slot: ({ onEnrollLearners, onAddBetaTesters, hideBetaTesters }: { onEnrollLearners: () => void; onAddBetaTesters: () => void; hideBetaTesters?: boolean }) => (
    <>
      {!hideBetaTesters && <button type="button" onClick={onAddBetaTesters}>Add Beta Testers</button>}
      <button type="button" onClick={onEnrollLearners}>Enroll Learners</button>
    </>
  ),
}));

// Stub the action modals; their internals are covered by their own test files. Each stub exposes a
// close control so the page's onClose handlers are exercised.
jest.mock('./components/BulkLearnersModal', () => {
  const MockBulkLearnersModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    isOpen ? <div role="dialog"><button type="button" onClick={onClose}>close-enroll-learners</button></div> : null
  );
  return MockBulkLearnersModal;
});
jest.mock('./components/AddBetaTestersModal', () => {
  const MockAddBetaTestersModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    isOpen ? <div role="dialog"><button type="button" onClick={onClose}>close-add-beta-testers</button></div> : null
  );
  return MockAddBetaTestersModal;
});
jest.mock('./components/UpdateBetaTesterModal', () => {
  const MockUpdateBetaTesterModal = ({ isOpen, onClose, learner }: { isOpen: boolean; onClose: () => void; learner: { fullName: string } }) => (
    isOpen ? <div role="dialog"><span>update-beta-tester:{learner.fullName}</span><button type="button" onClick={onClose}>close-update-beta-tester</button></div> : null
  );
  return MockUpdateBetaTesterModal;
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
  return function MockEnrollmentsList({ onUnenroll, onBetaTesterChange, hideBetaTesters }: { onUnenroll: (learner: EnrolledLearner) => void; onBetaTesterChange: (learner: EnrolledLearner) => void; hideBetaTesters?: boolean }) {
    const learner: EnrolledLearner = {
      fullName: 'Tester',
      email: 'test@example.com',
      username: '',
      mode: '',
      isBetaTester: false,
    };
    return (
      <div role="table" data-hide-beta-testers={String(!!hideBetaTesters)}>
        <button onClick={() => onUnenroll(learner)}>
          Unenroll Test Learner
        </button>
        <button onClick={() => onBetaTesterChange(learner)}>
          Change Beta Tester
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

  it('renders the check enrollment status action and the enrollment action buttons', () => {
    renderWithAlertAndIntl(<EnrollmentsPage />);
    expect(screen.getByRole('button', { name: messages.checkEnrollmentStatus.defaultMessage })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.addBetaTesters.defaultMessage })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.enrollLearners.defaultMessage })).toBeInTheDocument();
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

    await user.click(screen.getByRole('button', { name: messages.enrollLearners.defaultMessage }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByText('close-enroll-learners'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens and closes the Add Beta Testers modal via the slot handler', async () => {
    renderWithAlertAndIntl(<EnrollmentsPage />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: messages.addBetaTesters.defaultMessage }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByText('close-add-beta-testers'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('modals are closed by default', () => {
    renderWithAlertAndIntl(<EnrollmentsPage />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  describe('when hideBetaTesters is true', () => {
    it('does not render the Add Beta Testers button', () => {
      renderWithAlertAndIntl(<EnrollmentsPage hideBetaTesters />);

      expect(screen.queryByRole('button', { name: messages.addBetaTesters.defaultMessage })).not.toBeInTheDocument();
      // The Enroll Learners button is still rendered
      expect(screen.getByRole('button', { name: messages.enrollLearners.defaultMessage })).toBeInTheDocument();
    });

    it('forwards hideBetaTesters to the EnrollmentsList', () => {
      renderWithAlertAndIntl(<EnrollmentsPage hideBetaTesters />);

      expect(screen.getByRole('table')).toHaveAttribute('data-hide-beta-testers', 'true');
    });

    it('does not forward hideBetaTesters by default', () => {
      renderWithAlertAndIntl(<EnrollmentsPage />);

      expect(screen.getByRole('table')).toHaveAttribute('data-hide-beta-testers', 'false');
    });
  });

  describe('when hideEnrollmentStatus is true', () => {
    it('does not render the check enrollment status menu item', async () => {
      renderWithAlertAndIntl(<EnrollmentsPage hideEnrollmentStatus />);
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: messages.checkEnrollmentStatus.defaultMessage }));

      // The dropdown toggle still exists (used for Unenroll Learners), but the menu item is hidden.
      expect(screen.queryByRole('button', { name: messages.checkEnrollmentStatus.defaultMessage, hidden: false })).toBeInTheDocument();
      expect(screen.getByText(messages.unenrollLearners.defaultMessage)).toBeInTheDocument();
      expect(screen.queryByText(messages.checkEnrollmentStatus.defaultMessage)).not.toBeInTheDocument();
    });
  });

  describe('unenroll learners dropdown item', () => {
    it('opens the BulkLearnersModal when selected from the menu', async () => {
      renderWithAlertAndIntl(<EnrollmentsPage />);
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: messages.checkEnrollmentStatus.defaultMessage }));
      await user.click(screen.getByText(messages.unenrollLearners.defaultMessage));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('beta tester change flow', () => {
    it('opens the UpdateBetaTesterModal with the selected learner', async () => {
      renderWithAlertAndIntl(<EnrollmentsPage />);
      const user = userEvent.setup();

      await user.click(screen.getByText('Change Beta Tester'));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('update-beta-tester:Tester')).toBeInTheDocument();
    });

    it('closes the UpdateBetaTesterModal and clears the selected learner', async () => {
      renderWithAlertAndIntl(<EnrollmentsPage />);
      const user = userEvent.setup();

      await user.click(screen.getByText('Change Beta Tester'));
      await user.click(screen.getByText('close-update-beta-tester'));

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
