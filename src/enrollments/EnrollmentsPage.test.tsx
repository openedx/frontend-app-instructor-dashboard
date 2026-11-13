import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EnrollmentsPage from './EnrollmentsPage';
import { EnrolledLearner } from '@src/enrollments/types';
import messages from '@src/enrollments/messages';
import { useEnrollmentByUserId, useEnrollments, useUpdateBetaTesters, useUpdateEnrollments } from '@src/enrollments/data/apiHook';
import { renderWithAlertAndIntl } from '@src/testUtils';
import { EnrollmentsAccess } from '@src/enrollments/types';
import { FULL_ENROLLMENTS_ACCESS } from '@src/enrollments/constants';
import { ccxCoachConfig } from '@src/dashboardConfig/configs';
import { useCoursePermissions } from '@src/permissions/useCoursePermissions';

// The CCX Coach dashboard is not governed by AuthZ: the page must not read permissions there.
jest.mock('@src/permissions/useCoursePermissions');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'test-course-id' }),
}));

// The enrollment action buttons live in a slot (default widget covered by EnrollmentActionsSlot.test.tsx).
// Stub the slot to render buttons wired to the handlers the page passes in, so the page's modal
// open/close wiring is exercised here.
jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  Slot: ({
    onEnrollLearners, onAddBetaTesters, hideBetaTesters, hideEnrollLearners,
  }: {
    onEnrollLearners: () => void; onAddBetaTesters: () => void; hideBetaTesters?: boolean; hideEnrollLearners?: boolean;
  }) => (
    <>
      {!hideBetaTesters && <button type="button" onClick={onAddBetaTesters}>Add Beta Testers</button>}
      {!hideEnrollLearners && <button type="button" onClick={onEnrollLearners}>Enroll Learners</button>}
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
  return function MockEnrollmentsList({
    onUnenroll, onBetaTesterChange, hideBetaTesters, canUnenroll = true, canManageBetaTesters = true,
  }: {
    onUnenroll: (learner: EnrolledLearner) => void;
    onBetaTesterChange: (learner: EnrolledLearner) => void;
    hideBetaTesters?: boolean;
    canUnenroll?: boolean;
    canManageBetaTesters?: boolean;
  }) {
    const learner: EnrolledLearner = {
      fullName: 'Tester',
      email: 'test@example.com',
      username: '',
      mode: '',
      isBetaTester: false,
    };
    return (
      <div
        role="table"
        data-hide-beta-testers={String(!!hideBetaTesters)}
        data-can-unenroll={String(canUnenroll)}
        data-can-manage-beta-testers={String(canManageBetaTesters)}
      >
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
    expect(screen.getByRole('button', { name: messages.moreActions.defaultMessage })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.addBetaTesters.defaultMessage })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.enrollLearners.defaultMessage })).toBeInTheDocument();
  });

  it('renders EnrollmentsList component', () => {
    renderWithAlertAndIntl(<EnrollmentsPage />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('opens enrollment status modal when more button is clicked', async () => {
    renderWithAlertAndIntl(<EnrollmentsPage />);

    const moreButton = screen.getByRole('button', { name: messages.moreActions.defaultMessage });
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
    const moreButton = screen.getByRole('button', { name: messages.moreActions.defaultMessage });
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

      await user.click(screen.getByRole('button', { name: messages.moreActions.defaultMessage }));

      // The dropdown toggle still exists (used for Unenroll Learners), but the menu item is hidden.
      expect(screen.queryByRole('button', { name: messages.moreActions.defaultMessage, hidden: false })).toBeInTheDocument();
      expect(screen.getByText(messages.unenrollLearners.defaultMessage)).toBeInTheDocument();
      expect(screen.queryByText(messages.checkEnrollmentStatus.defaultMessage)).not.toBeInTheDocument();
    });
  });

  describe('unenroll learners dropdown item', () => {
    it('opens the BulkLearnersModal when selected from the menu', async () => {
      renderWithAlertAndIntl(<EnrollmentsPage />);
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: messages.moreActions.defaultMessage }));
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
  describe('granular access', () => {
    const accessWith = (overrides: Partial<EnrollmentsAccess>): EnrollmentsAccess => ({
      canViewEnrollments: true,
      canEnroll: false,
      canUnenroll: false,
      canManageBetaTesters: false,
      ...overrides,
    });
    const openHeaderMenu = async () => {
      await userEvent.setup().click(screen.getByRole('button', { name: messages.moreActions.defaultMessage }));
    };
    const enrollButton = () => screen.queryByRole('button', { name: messages.enrollLearners.defaultMessage });
    const betaButton = () => screen.queryByRole('button', { name: messages.addBetaTesters.defaultMessage });

    it('shows everything and no alert by default (CCX Coach dashboard)', async () => {
      renderWithAlertAndIntl(<EnrollmentsPage access={FULL_ENROLLMENTS_ACCESS} />);
      await openHeaderMenu();
      expect(enrollButton()).toBeInTheDocument();
      expect(betaButton()).toBeInTheDocument();
      expect(screen.getByText(messages.unenrollLearners.defaultMessage)).toBeInTheDocument();
      expect(screen.queryByText(/access|cannot unenroll/i)).not.toBeInTheDocument();
    });

    describe('with view_enrollments only', () => {
      beforeEach(() => {
        renderWithAlertAndIntl(<EnrollmentsPage access={accessWith({})} />);
      });

      it('hides the enroll and beta tester buttons', () => {
        expect(enrollButton()).not.toBeInTheDocument();
        expect(betaButton()).not.toBeInTheDocument();
      });

      it('keeps check enrollment status and hides bulk unenroll in the header menu', async () => {
        await openHeaderMenu();
        expect(screen.getByText(messages.checkEnrollmentStatus.defaultMessage)).toBeInTheDocument();
        expect(screen.queryByText(messages.unenrollLearners.defaultMessage)).not.toBeInTheDocument();
      });

      it('shows the view-only alert and the list without row actions', () => {
        expect(screen.getByText(messages.viewOnlyAccessAlert.defaultMessage)).toBeInTheDocument();
        const table = screen.getByRole('table');
        expect(table).toHaveAttribute('data-can-unenroll', 'false');
        expect(table).toHaveAttribute('data-can-manage-beta-testers', 'false');
      });
    });

    describe('with enroll_learners only', () => {
      beforeEach(() => {
        renderWithAlertAndIntl(<EnrollmentsPage access={accessWith({ canEnroll: true })} />);
      });

      it('shows Enroll Learners, hides Add Beta Testers and bulk unenroll', async () => {
        expect(enrollButton()).toBeInTheDocument();
        expect(betaButton()).not.toBeInTheDocument();
        await openHeaderMenu();
        expect(screen.queryByText(messages.unenrollLearners.defaultMessage)).not.toBeInTheDocument();
      });

      it('shows the enroll-only alert', () => {
        expect(screen.getByText(messages.enrollOnlyAccessAlert.defaultMessage)).toBeInTheDocument();
        expect(screen.queryByText(messages.viewOnlyAccessAlert.defaultMessage)).not.toBeInTheDocument();
      });
    });

    it('still shows the enroll-only alert when the user also manages beta testers', () => {
      renderWithAlertAndIntl(<EnrollmentsPage access={accessWith({ canEnroll: true, canManageBetaTesters: true })} />);
      expect(screen.getByText(messages.enrollOnlyAccessAlert.defaultMessage)).toBeInTheDocument();
    });

    describe('with unenroll_learners only', () => {
      beforeEach(() => {
        renderWithAlertAndIntl(<EnrollmentsPage access={accessWith({ canUnenroll: true })} />);
      });

      it('hides the enroll and beta tester buttons but keeps bulk unenroll', async () => {
        expect(enrollButton()).not.toBeInTheDocument();
        expect(betaButton()).not.toBeInTheDocument();
        await openHeaderMenu();
        expect(screen.getByText(messages.unenrollLearners.defaultMessage)).toBeInTheDocument();
      });

      it('shows the unenroll-only alert and lets the list show the Unenroll action', () => {
        expect(screen.getByText(messages.unenrollOnlyAccessAlert.defaultMessage)).toBeInTheDocument();
        expect(screen.getByRole('table')).toHaveAttribute('data-can-unenroll', 'true');
      });

      it('opens the bulk unenroll modal from the header menu', async () => {
        await openHeaderMenu();
        await userEvent.setup().click(screen.getByText(messages.unenrollLearners.defaultMessage));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    describe('with manage_course_team only', () => {
      it('shows Add Beta Testers, hides Enroll Learners and shows no alert', () => {
        renderWithAlertAndIntl(<EnrollmentsPage access={accessWith({ canManageBetaTesters: true })} />);
        expect(betaButton()).toBeInTheDocument();
        expect(enrollButton()).not.toBeInTheDocument();
        expect(screen.queryByText(messages.viewOnlyAccessAlert.defaultMessage)).not.toBeInTheDocument();
        expect(screen.getByRole('table')).toHaveAttribute('data-can-manage-beta-testers', 'true');
      });

      it('opens the beta tester modal from the row action', async () => {
        renderWithAlertAndIntl(<EnrollmentsPage access={accessWith({ canManageBetaTesters: true })} />);
        await userEvent.setup().click(screen.getByText('Change Beta Tester'));
        expect(screen.getByText('update-beta-tester:Tester')).toBeInTheDocument();
      });
    });

    describe('with enroll and unenroll but not manage_course_team', () => {
      it('shows both learner actions, hides beta tester actions and shows no alert', async () => {
        renderWithAlertAndIntl(<EnrollmentsPage access={accessWith({ canEnroll: true, canUnenroll: true })} />);
        expect(enrollButton()).toBeInTheDocument();
        expect(betaButton()).not.toBeInTheDocument();
        await openHeaderMenu();
        expect(screen.getByText(messages.unenrollLearners.defaultMessage)).toBeInTheDocument();
        expect(screen.queryByText(/cannot unenroll|unenroll-only|view-only/i)).not.toBeInTheDocument();
      });
    });

    describe('without view_enrollments', () => {
      beforeEach(() => {
        renderWithAlertAndIntl(
          <EnrollmentsPage access={accessWith({ canViewEnrollments: false, canEnroll: true })} />,
        );
      });

      it('hides the header menu, since check enrollment status needs view_enrollments', () => {
        expect(screen.queryByRole('button', { name: messages.moreActions.defaultMessage })).not.toBeInTheDocument();
      });

      it('does not render the enrollments list and shows the forbidden alert instead', () => {
        expect(screen.queryByRole('table')).not.toBeInTheDocument();
        expect(screen.getByText('Access Denied')).toBeInTheDocument();
      });

      it('still shows the actions the user holds', () => {
        expect(enrollButton()).toBeInTheDocument();
      });
    });

    it('keeps only bulk unenroll in the header menu for unenroll without view_enrollments', async () => {
      renderWithAlertAndIntl(
        <EnrollmentsPage access={accessWith({ canViewEnrollments: false, canUnenroll: true })} />,
      );
      await openHeaderMenu();
      expect(screen.getByText(messages.unenrollLearners.defaultMessage)).toBeInTheDocument();
      expect(screen.queryByText(messages.checkEnrollmentStatus.defaultMessage)).not.toBeInTheDocument();
    });

    it('does not mount the beta tester modal for a user who cannot manage beta testers', async () => {
      // The row action is wired by the list, which hides it; this guards the page-level mount.
      renderWithAlertAndIntl(<EnrollmentsPage access={accessWith({ canUnenroll: true })} />);
      await userEvent.setup().click(screen.getByText('Change Beta Tester'));
      expect(screen.queryByText('update-beta-tester:Tester')).not.toBeInTheDocument();
    });

    it('does not mount the unenroll modal for a user who cannot unenroll', async () => {
      renderWithAlertAndIntl(<EnrollmentsPage access={accessWith({ canEnroll: true })} />);
      await userEvent.setup().click(screen.getByText('Unenroll Test Learner'));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
  // The CCX Coach dashboard renders this page without the `access` prop. These tests render the
  // element exactly as `ccxCoachConfig` declares it, so a change to its props is caught too.
  describe('CCX Coach dashboard', () => {
    const ccxEnrollmentsTab = ccxCoachConfig.defaultTabs.find(tab => tab.tabId === 'enrollments')!.content;

    it('does not read AuthZ permissions', () => {
      renderWithAlertAndIntl(ccxEnrollmentsTab);
      expect(useCoursePermissions).not.toHaveBeenCalled();
    });

    it('shows the Enroll Learners button and no Add Beta Testers button', () => {
      renderWithAlertAndIntl(ccxEnrollmentsTab);
      expect(screen.getByRole('button', { name: messages.enrollLearners.defaultMessage })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: messages.addBetaTesters.defaultMessage })).not.toBeInTheDocument();
    });

    it('keeps only Unenroll Learners in the header menu, without Check Enrollment Status', async () => {
      renderWithAlertAndIntl(ccxEnrollmentsTab);
      await userEvent.setup().click(screen.getByRole('button', { name: messages.moreActions.defaultMessage }));
      expect(screen.getByText(messages.unenrollLearners.defaultMessage)).toBeInTheDocument();
      expect(screen.queryByText(messages.checkEnrollmentStatus.defaultMessage)).not.toBeInTheDocument();
    });

    it('shows no access alert', () => {
      renderWithAlertAndIntl(ccxEnrollmentsTab);
      expect(screen.queryByText(messages.viewOnlyAccessAlert.defaultMessage)).not.toBeInTheDocument();
      expect(screen.queryByText(messages.enrollOnlyAccessAlert.defaultMessage)).not.toBeInTheDocument();
      expect(screen.queryByText(messages.unenrollOnlyAccessAlert.defaultMessage)).not.toBeInTheDocument();
      expect(screen.queryByText('Access Denied')).not.toBeInTheDocument();
    });

    it('renders the list with the beta tester column hidden and unenroll allowed', () => {
      renderWithAlertAndIntl(ccxEnrollmentsTab);
      const table = screen.getByRole('table');
      expect(table).toHaveAttribute('data-hide-beta-testers', 'true');
      expect(table).toHaveAttribute('data-can-unenroll', 'true');
    });

    it('opens the enroll and bulk unenroll modals', async () => {
      renderWithAlertAndIntl(ccxEnrollmentsTab);
      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: messages.enrollLearners.defaultMessage }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      await user.click(screen.getByText('close-enroll-learners'));
      await user.click(screen.getByRole('button', { name: messages.moreActions.defaultMessage }));
      await user.click(screen.getByText(messages.unenrollLearners.defaultMessage));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('opens the unenroll modal from a row', async () => {
      renderWithAlertAndIntl(ccxEnrollmentsTab);
      await userEvent.setup().click(screen.getByText('Unenroll Test Learner'));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });
});
