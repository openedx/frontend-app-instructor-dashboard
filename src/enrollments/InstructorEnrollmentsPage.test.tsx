import { screen } from '@testing-library/react';
import InstructorEnrollmentsPage from './InstructorEnrollmentsPage';
import { renderWithIntl } from '@src/testUtils';
import { COURSE_PERMISSIONS } from '@src/permissions';
import { mockCoursePermissions } from '@src/permissions/testUtils';
import { EnrollmentsAccess } from '@src/enrollments/types';

jest.mock('@src/permissions/useCoursePermissions');

const mockEnrollmentsPage = jest.fn();
jest.mock('@src/enrollments/EnrollmentsPage', () => ({
  __esModule: true,
  default: (props: { access: EnrollmentsAccess }) => {
    mockEnrollmentsPage(props);
    return <div>Enrollments Page Component</div>;
  },
}));

const {
  VIEW_COURSE_INFO, VIEW_COHORTS, VIEW_ENROLLMENTS, ENROLL_LEARNERS, UNENROLL_LEARNERS, MANAGE_COURSE_TEAM,
} = COURSE_PERMISSIONS;

describe('InstructorEnrollmentsPage', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('shows a skeleton while permissions load', () => {
    mockCoursePermissions({}, { isLoading: true });
    const { container } = renderWithIntl(<InstructorEnrollmentsPage />);
    expect(container.querySelector('.react-loading-skeleton.lead')).toBeInTheDocument();
    expect(screen.queryByText('Enrollments Page Component')).not.toBeInTheDocument();
  });

  it('shows the forbidden alert when the user holds none of the tab permissions', () => {
    mockCoursePermissions({ [VIEW_COURSE_INFO]: true, [VIEW_COHORTS]: true, [VIEW_ENROLLMENTS]: false });
    renderWithIntl(<InstructorEnrollmentsPage />);
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.queryByText('Enrollments Page Component')).not.toBeInTheDocument();
  });

  it('fails closed and shows the forbidden alert when the permission check fails', () => {
    mockCoursePermissions({ [VIEW_ENROLLMENTS]: false }, { error: new Error('validate failed') });
    renderWithIntl(<InstructorEnrollmentsPage />);
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });

  it.each([
    VIEW_ENROLLMENTS, ENROLL_LEARNERS, UNENROLL_LEARNERS, MANAGE_COURSE_TEAM,
  ])('renders the page when the user holds only %s', (permission) => {
    mockCoursePermissions({ [permission]: true });
    renderWithIntl(<InstructorEnrollmentsPage />);
    expect(screen.getByText('Enrollments Page Component')).toBeInTheDocument();
  });

  it('maps each permission to the matching access flag', () => {
    mockCoursePermissions({ [VIEW_ENROLLMENTS]: true, [UNENROLL_LEARNERS]: true });
    renderWithIntl(<InstructorEnrollmentsPage />);
    expect(mockEnrollmentsPage).toHaveBeenLastCalledWith({
      access: {
        canViewEnrollments: true,
        canEnroll: false,
        canUnenroll: true,
        canManageBetaTesters: false,
      },
    });
  });

  it('treats manage_course_team as the beta tester permission', () => {
    mockCoursePermissions({ [MANAGE_COURSE_TEAM]: true });
    renderWithIntl(<InstructorEnrollmentsPage />);
    expect(mockEnrollmentsPage).toHaveBeenLastCalledWith({
      access: {
        canViewEnrollments: false,
        canEnroll: false,
        canUnenroll: false,
        canManageBetaTesters: true,
      },
    });
  });
});
